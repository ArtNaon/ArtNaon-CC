const admin = require('./firebase');
const bcrypt = require('bcrypt');
const FormData = require('form-data');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const mysql = require('mysql');
const nodemailer = require('nodemailer');
const Path = require('path');
const { Storage } = require('@google-cloud/storage');
const uuid = require('uuid');
require('dotenv').config();

// Set the path to the service account key file
process.env.GOOGLE_APPLICATION_CREDENTIALS = "./src/gcp-service-account.json";

// Connect to MySQL database
const connection = mysql.createConnection({
    host: '127.0.0.1',
    port: '3306',
    user: 'zalfyputra',
    database: 'artnaon_db',
    password: 'zalfy123'
});

// Register with Firebase and Store to MySQL
const registerUser = async (request, h) => {
    try {
        // Check if email and password are provided
        const { name, email, password } = request.payload;
        if (!email || !password) {
            const response = h.response({
                status: 'fail',
                message: 'Please enter email and password',
                });
                response.code(400);
                return response;
        }
        // Check if email already exists
        const checkEmail = 'SELECT * FROM users WHERE email = ?';
        const existingUser = await new Promise((resolve, reject) => {
            connection.query(checkEmail, [email], (err, rows, field) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows[0]);
                }
            });
        });

        if (existingUser) {
            const response = h.response({
                status: 'fail',
                message: 'Email already exists',
            });
            response.code(400);
            return response;
        }

        // Register to Firebase
        const hashedPassword = await bcrypt.hash(password, 10);
        admin.auth().createUser({
            email,
            password: hashedPassword
        });

        // Query to MySQL without Password
        const query = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
        await new Promise((resolve, reject) => {
            connection.query(query, [name, email, hashedPassword], (err, rows, field) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        }); 
    
        const response = h.response({
            status: 'success',
            message: 'User created successfully',
            result: {
                name: name,
                email: email
            },
        });
        response.code(200);
        return response;
    } catch (err) {
        const response = h.response({
            status: 'fail',
            message: err.message,
        });
        response.code(500);
        return response;
    }
};

// Login with Firebase
const loginUser = async (request, h) => {
    try {
        const { email, password } = request.payload;
        const query = "SELECT * FROM users WHERE email = ?";
        const user = await new Promise((resolve, reject) => {
            connection.query(query, [email], (err, rows, field) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows[0]);
                }
            });
        });
        
        if (!user){
            const response = h.response({
                status: 'fail',
                message: 'Account invalid',
            });
            response.code(400);
            return response;
        }
        
        const isPassValid = await bcrypt.compare(password, user.password);
        
        if (!isPassValid){
            const response = h.response({
                status: 'fail',
                message: 'Account invalid',
            });
            response.code(400);
            return response;
        }
        
        const token = jwt.sign({ userId: user.id }, 'bangkit', { expiresIn: '1h' });

        const response = h.response({
            status: 'success',
            message: 'Login successful',
            result: {
                name: user.name,
                email: user.email,
                token: token
            },
        });
        response.code(200);
        return response;
    } catch (err) {
        const response = h.response({
            status: 'fail',
            message: err.message,
        });
        response.code(500);
        return response;
    }
};

// Reset Password
const resetPassword = async (request, h) => {
    try {
        const { email, newPassword } = request.payload;
        
        // Check if the email exists in the database
        const user = await new Promise((resolve, reject) => {
            const query = "SELECT * FROM users WHERE email = ?";
            connection.query(query, [email], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows[0]);
                }
            });
        });
        
        if (!user) {
            const response = h.response({
                status: 'fail',
                message: 'User not found',
            });
            response.code(404);
            return response;
        }
        
        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        
        // Update the user's password in the database
        await new Promise((resolve, reject) => {
            const updateQuery = "UPDATE users SET password = ? WHERE email = ?";
            connection.query(updateQuery, [hashedPassword, email], (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });

        const response = h.response({
            status: 'success',
            message: 'Password reset successfully',
        });
        response.code(200);
        return response;
    } catch (err) {
        const response = h.response({
            status: 'fail',
            message: err.message,
        });
        response.code(500);
        return response;
    }
};

// Initialize Google Cloud Storage client
const storage = new Storage();
const userBucket = storage.bucket('user-paintings');
const datasetBucket = storage.bucket('artnaon-dataset');

// Upload painting to Google Cloud Storage and store metadata in MySQL
const uploadPainting = async (request, h) => {
    try {
        const { userId, genre, description } = request.payload;
        const file = request.payload.painting;

        // Query to get the user's name
        const userQuery = "SELECT * FROM users WHERE id = ?";
        const user = await new Promise((resolve, reject) => {
            connection.query(userQuery, [userId], (err, rows, field) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows[0]);
                }
            });
        });
        
        if (!user){
            const response = h.response({
                status: 'fail',
                message: 'Account invalid',
            });
            response.code(400);
            return response;
        }

        const blobName = `${user.name}/${uuid.v4()}-${file.hapi.filename}`;
        const blob = userBucket.file(blobName);
        const blobStream = blob.createWriteStream({
            resumable: false,
            gzip: true
        }); 

        await new Promise((resolve, reject) => {
            blobStream.on('finish', resolve);
            blobStream.on('error', reject);
            blobStream.end(file._data);
        });
      
        const publicUrl = `https://storage.googleapis.com/${userBucket.name}/${blobName}`;
        const query = 'INSERT INTO paintings (user_id, image_url, genre, description, upload_timestamp) VALUES (?, ?, ?, ?, NOW())';

        await connection.query(query, [userId, publicUrl, genre, description]);

        const response = h.response({
            status: 'success',
            message: 'Painting uploaded successfully',
            result: {
                genre: genre,
                description: description,
                Url: publicUrl
            }
        });
        response.code(200);
        return response;
    } catch (err) {
        const response = h.response({
            status: 'fail',
            message: err.message,
        });
        response.code(500);
        return response;
    }
};

// Fetch paintings uploaded from a specific user
const userPaintings = async (request, h) => {
    try {
        const { userId } = request.params;
        const user = await connection.query('SELECT * FROM users WHERE id = ?', [userId]);
        if (user.rowCount === 0) {
            return h.response({ message: 'User not found' }).code(404);
        }

        const [rows] = await connection.query('SELECT image_url FROM paintings WHERE user_id = ? ORDER BY upload_timestamp DESC', [userId]);
        const response = h.response({
            status: 'success',
            message: 'User paintings fetched successfully',
            data: rows.map(row => row.image_url)
        });
        response.code(200);
        return response;
    } catch (err) {
        console.error(err);
        const response = h.response({
            status: 'fail',
            message: err.message,
        });
        response.code(500);
        return response;
    }
};

// Delete painting from Google Cloud Storage and MySQL
const deletePainting = async (request, h) => {
    try {
        const { imageUrl } = request.payload;

        // Extracting the blob name from the image URL
        const blobName = imageUrl.replace(`https://storage.googleapis.com/${userBucket.name}/`, '');

        // Delete the file from the bucket
        await userBucket.file(blobName).delete();

        // Query to delete the painting record from the database based on the image URL
        const deleteQuery = 'DELETE FROM paintings WHERE image_url = ?';
        await connection.query(deleteQuery, [imageUrl]);

        const response = h.response({
            status: 'success',
            message: 'Painting deleted successfully'
        });
        response.code(200);
        return response;
    } catch (err) {
        const response = h.response({
            status: 'fail',
            message: err.message,
        });
        response.code(500);
        return response;
    }
};

// Fetch paintings to display on the home page
const homePage = async (request, h) => {
    try {
        // Fetch all paintings from the bucket
        const [files] = await userBucket.getFiles();

        // Extract URLs of paintings
        const paintingUrls = files.map(file => `https://storage.googleapis.com/${userBucket.name}/${file.name}`);

        // Construct response
        const response = h.response({
            status: 'success',
            message: 'Home page fetched successfully',
            paintings: paintingUrls
        });
        response.code(200);
        return response;
    } catch (err) {
        console.error(err);
        const response = h.response({
            status: 'fail',
            message: err.message,
        });
        response.code(500);
        return response;
    }
};

// Fetch a specific user from MySQL
const getUser = async (request, h) => {
    try {
        const { userId } = request.params;
        const userQuery = "SELECT * FROM users WHERE id = ?";
        const user = await new Promise((resolve, reject) => {
            connection.query(userQuery, [userId], (err, rows, field) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows[0]);
                }
            });
        });

        if (!user){
            const response = h.response({
                status: 'fail',
                message: 'Account invalid',
            });
            response.code(400);
            return response;
        }

        const response = h.response({
            status: 'success',
            message: 'User fethed successfully',
            result: {
                name: user.name,
                email: user.email
            }
        });
        response.code(200);
        return response;
    } catch (err) {
        console.error(err);
        const response = h.response({
            status: 'fail',
            message: err.message,
        });
        response.code(500);
        return response;
    }
};

module.exports = {
    registerUser,
    loginUser,
    resetPassword,
    uploadPainting,
    userPaintings,
    deletePainting,
    homePage,
    getUser
};
