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
        const query = "INSERT INTO users (name, email) VALUES (?, ?)";
        await new Promise((resolve, reject) => {
            connection.query(query, [name, email], (err, rows, field) => {
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
            name: name,
            email: email,
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
        
        const token = jwt.sign({ userId : user.id }, 'bangkit');
        const response = h.response({
            status: 'success',
            message: 'login successful',
            data: { token },
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
        const { email, displayName } = request.payload;

        // URL to redirect back to
        const actionCodeSettings = {
            android: {
                packageName: 'com.example.android',
                installApp: true,
                minimumVersion: '12' 
            },
        };
        // Configure the email transporter using nodemailer
        const transporter = nodemailer.createTransport({
            host: 'smtp.example.com',
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: 'your-email@example.com',
                pass: 'your-email-password'
            }
        });
        // Generate the password reset link
        const link = await admin.auth().generatePasswordResetLink(email, actionCodeSettings);
        // Define the mail options
        const mailOptions = {
            from: '"Your App Name" <your-email@gmail.com>',
            to: email,
            subject: 'Password Reset',
            html: `<p><b>Hello ${displayName}!</b></p>
                    <p>You requested to reset your password. Click the link below to reset it:</p>
                    <a href="${link}">Reset Password</a>
                    <p>If you didn't request a password reset, you can ignore this email.</p>`
        };
        // Send the email using Nodemailer
        await transporter.sendMail(mailOptions);

        const response = h.response({
            status: 'success',
            message: 'Password reset link sent',
            email: auth,
            name: displayName,
            link: link
        });
        response.code(201);
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

const storage = new Storage();
const bucket = storage.bucket('user-paintings');

const uploadPainting = async (request, h) => {
    try {
        const { userId, genre, description } = request.payload;
        const file = request.payload.painting;

        const blobName = `${uuid.v4()}-${file.hapi.filename}`;
        const blob = bucket.file(blobName);
        const blobStream = blob.createWriteStream({
            resumable: false,
            gzip: true
        }); 

        await new Promise((resolve, reject) => {
            blobStream.on('finish', resolve);
            blobStream.on('error', reject);
            blobStream.end(file._data);
        });
      
        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blobName}`;
        const query = 'INSERT INTO paintings (user_id, image_url, genre, description, upload_timestamp) VALUES (?, ?, ?, ?, NOW())';

        await connection.query(query, [userId, publicUrl, genre, description]);

        return h.response({ message: 'Painting uploaded successfully', url: publicUrl }).code(201);
    } catch (err) {
        return h.response({ message: 'Error uploading painting or saving metadata', error: err.message }).code(500);
    }
};

const getPaintings = async (request, h) => {
    try {
        const { userId } = request.params;
        const [rows] = await connection.query('SELECT image_url FROM paintings WHERE user_id = ? ORDER BY upload_timestamp DESC', [userId]);
        return h.response(rows.map(row => row.image_url)).code(200);
    } catch (err) {
        return h.response({ message: 'Error fetching paintings', error: err.message }).code(500);
    }
};

const deletePainting = async (request, h) => {
    try {
        const { imageUrl } = request.params;
        const result = await connection.query('SELECT id FROM paintings WHERE image_url = ?', [imageUrl]);
        if (result.rowCount === 0) {
            return h.response({ message: 'Painting not found' }).code(404);
        }
        const paintingId = result.rows[0].id;
        await connection.query('DELETE FROM posts WHERE id = ?', [paintingId]);
        return h.response({ message: 'Post deleted successfully' }).code(200);
    } catch (error) {
        return h.response({ message: 'Error deleting post', error: error.message }).code(500);
    }
};

module.exports = {
    registerUser,
    loginUser,
    resetPassword,
    uploadPainting,
    getPaintings,
    deletePainting
};
