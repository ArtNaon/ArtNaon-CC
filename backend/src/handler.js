const admin = require('./firebase');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mysql = require('mysql');
const { Storage } = require('@google-cloud/storage');
const uuid = require('uuid');

// Set the path to the service account key file
process.env.GOOGLE_APPLICATION_CREDENTIALS = "./src/gcp-service-account.json";

// Connect to MySQL database
const connection = mysql.createConnection({
    socketPath: '/cloudsql/artnaon:asia-southeast2:artnaon-sql',
    //host: '127.0.0.1',
    user: 'zalfyputra',
    database: 'artnaon_db',
    password: 'zalfy123'
});

// Register with Firebase and Store to MySQL
const registerUser = async (request, h) => {
    try {
        // Check if email and password are provided
        const { name, email, password } = request.payload;
        if (!name || !email || !password) {
            return h.response ({
                status: 'fail',
                message: 'Please enter name, email, and password'
            }).code(400);
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
            return h.response({
                status: 'fail',
                message: 'Email already exists',
            }).code(400);
        }

        // Register to Firebase
        const hashedPassword = await bcrypt.hash(password, 10);
        admin.auth().createUser({
            email,
            password: hashedPassword
        });

        // Query to MySQL
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
        return h.response({
            status: 'success',
            message: 'User created successfully',
            result: {
                name: name,
                email: email
            }
        }).code(200);
    } catch (err) {
        return h.response({
            status: 'fail',
            message: err.message,
        }).code(500);
    }
};

// Login with Firebase
const loginUser = async (request, h) => {
    try {
        // Check if email exists in the database
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
            return h.response({
                status: 'fail',
                message: 'user not found',
            }).code(400);
        }

        // Check if the password is valid
        const isPassValid = await bcrypt.compare(password, user.password);
        if (!isPassValid){
            const response = h.response({
                status: 'fail',
                message: 'Password incorrect',
            });
            response.code(400);
            return response;
        }
        
        // Generate JWT token and sign in with Firebase
        const token = jwt.sign({ userId: user.id }, 'bangkit', { expiresIn: '1h' });
        return h.response({
            status: 'success',
            message: 'Login successful',
            result: {
                name: user.name,
                email: user.email,
                token: token
            }
        }).code(200);
    } catch (err) {
        return h.response({
            status: 'fail',
            message: err.message,
        }).code(500);
    }
};

// Reset Password
const resetPassword = async (request, h) => {
    try {
        // Check if the email exists in the database
        const { email, newPassword } = request.payload;
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
        
        // Hash the newPassword and update the user's password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
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
        return h.response({
            status: 'success',
            message: 'Password reset successfully',
        }).code(200);
    } catch (err) {
        return h.response({
            status: 'fail',
            message: err.message,
        }).code(500);
    }
};

// Initialize Google Cloud Storage client
const storage = new Storage();
const userBucket = storage.bucket('painting-bucket');
const datasetBucket = storage.bucket('dataset-painting');

// Upload painting to Google Cloud Storage and store metadata in MySQL
const uploadPainting = async (request, h) => {
    try {
        const { userId, genre, description } = request.payload;
        const file = request.payload.painting;

        // Generate a unique blob name
        const blobName = `${uuid.v4()}-${file.hapi.filename}`;
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

        // Store the painting metadata in MySQL
        await connection.query(query, [userId, publicUrl, genre, description]);

        return h.response({
            status: 'success',
            message: 'Painting uploaded successfully',
            result: {
                genre: genre,
                description: description,
                Url: publicUrl
            }
        }).code(200);
    } catch (err) {
        return h.response({
            status: 'fail',
            message: err.message,
        }).code(500);
    }
};

// Fetch paintings uploaded from a specific user
const getUserPaintings = async (request, h) => {
    try {
        // Fetch paintings from MySQL
        const { userId } = request.payload;
        const artQuery = 'SELECT image_url FROM paintings WHERE user_id = ? ORDER BY upload_timestamp DESC';
        const paintings = await new Promise((resolve, reject) => {
            connection.query(artQuery, [userId], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });

        if (!paintings || paintings.length === 0) {
            return h.response({
                status: 'fail',
                message: 'Paintings not found!',
            }).code(400);
        }

        // Extract the image URLs
        const publicLinks = paintings.flatMap(painting => painting.image_url);
        return h.response({
            status: 'success',
            message: 'User paintings fetched successfully',
            result: publicLinks
        }).code(200);
    } catch (err) {
        console.error(err);
        return h.response({
            status: 'fail',
            message: err.message,
        }).code(500);
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

        return h.response({
            status: 'success',
            message: 'Painting deleted successfully'
        }).code(200);
    } catch (err) {
        return h.response({
            status: 'fail',
            message: err.message,
        }).code(500);
    }
};

// Fetch paintings to display on the home page
const homePage = async (request, h) => {
    try {
        // Fetch all paintings from the bucket
        const [files] = await userBucket.getFiles();

        // Extract URLs of paintings
        const paintingUrls = files.map(file => `https://storage.googleapis.com/${userBucket.name}/${file.name}`);

        return h.response({
            status: 'success',
            message: 'Home page fetched successfully',
            result: paintingUrls
        }).code(200);
    } catch (err) {
        return h.response({
            status: 'fail',
            message: err.message,
        }).code(500);
    }
};

// Fetch user details
const getUser = async (request, h) => {
    try {
        const { userId } = request.payload;

        // Query to get the user's details
        const query = "SELECT * FROM users WHERE id = ?";
        const user = await new Promise((resolve, reject) => {
            connection.query(query, [userId], (err, rows, field) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows[0]);
                }
            });
        });
        
        if (!user){
            return h.response({
                status: 'fail',
                message: 'User not found',
            }).code(400);
        }

        // Get the user's details
        return h.response({
            status: 'success',
            message: 'User fetched successfully',
            result: {
                name: user.name,
                email: user.email
            }
        }).code(200);
    } catch (err) {
        return h.response({
            status: 'fail',
            message: err.message,
        }).code(500);
    }
};

// Fetch paintings based on genre
const genreHandler = async (request, h) => {
    try {
        const { genre } = request.payload;
        const [files] = await datasetBucket.getFiles({ prefix: `${genre}/`, maxResults: 10 });
        const publicLinks = files.map(file => `https://storage.googleapis.com/${datasetBucket.name}/${file.name}`);
        return h.response({
            status: 'success',
            message: 'Genre selected successfully',
            data: publicLinks
        }).code(200);
    } catch (err) {
        return h.response({
            status: 'fail',
            message: err.message,
        }).code(500);
    }
};

// Fetch Paintings Details
const getPaintings = async (request, h) => {
    try {
        const { imageUrl } = request.payload;
        const query = "SELECT * FROM paintings WHERE image_url = ?";
        const paintings = await new Promise((resolve, reject) => {
            connection.query(query, [imageUrl], (err, rows, field) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows[0]);
                }
            });
        });
        
        if (!paintings){
            return h.response({
                status: 'fail',
                message: 'User not found',
            }).code(400);
        }

        return h.response({
            status: 'success',
            message: 'Painting details fetched successfully',
            result: {
                genre: paintings.genre,
                description: paintings.description
            }
        }).code(200);
    } catch (err) {
        return h.response({
            status: 'fail',
            message: err.message,
        }).code(500);
    }
};

module.exports = {
    registerUser,
    loginUser,
    resetPassword,
    uploadPainting,
    getUserPaintings,
    deletePainting,
    homePage,
    getUser,
    genreHandler,
    getPaintings
};
