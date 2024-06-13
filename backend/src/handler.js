const admin = require('./firebase');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mysql = require('mysql');
const path = require('path');
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
        const query = "INSERT INTO users (name, email, password, profile_pic_url) VALUES (?, ?, ?, ?)";
        await new Promise((resolve, reject) => {
            connection.query(query, [name, email, hashedPassword, ''], (err, rows, field) => {
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
const datasetBucket = storage.bucket('artnaon_dataset');
const profilePictureBucket = storage.bucket('artnaon_profile_picture');

// Upload painting to Google Cloud Storage and store metadata in MySQL
const uploadPainting = async (request, h) => {
    try {
        const { email, genre, description } = request.payload;
        const file = request.payload.painting;

        // Check if the user exists
        const userQuery = 'SELECT id FROM users WHERE email = ?';
        const user = await new Promise((resolve, reject) => {
            connection.query(userQuery, [email], (err, rows) => {
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
        await connection.query(query, [user.id, publicUrl, genre, description]);
        
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

// Fetch user details and paintings
const getUser = async (request, h) => {
    try {
        // Check if the user exists
        const { email } = request.payload;
        const userQuery = 'SELECT * FROM users WHERE email = ?';
        const user = await new Promise((resolve, reject) => {
            connection.query(userQuery, [email], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows[0]);
                }
            });
        });

        if (!user) {
            return h.response({
                status: 'fail',
                message: 'User not found!',
            }).code(400);
        }

        // Fetch the user's paintings
        const artQuery = 'SELECT image_url FROM paintings WHERE user_id = ? ORDER BY upload_timestamp DESC';
        const paintings = await new Promise((resolve, reject) => {
            connection.query(artQuery, [user.id], (err, rows) => {
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
            result: {
                name: user.name,
                email: user.email,
                picture: user.profile_pic_url,
                result: publicLinks
            }
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

        // Sort files by creation time in descending order
        files.sort((a, b) => b.metadata.timeCreated.localeCompare(a.metadata.timeCreated));

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

// Upload Profile Picture
const editProfile = async (request, h) => {
    try {
        const { email, name, newPassword } = request.payload;
        const file = request.payload.profilePicture;

        // Email is required
        if (!email) {
            return h.response({
                status: 'fail',
                message: 'Email is required',
            }).code(400);
        }

        // Check if the user exists
        const userQuery = 'SELECT * FROM users WHERE email = ?';
        const user = await new Promise((resolve, reject) => {
            connection.query(userQuery, [email], (err, rows) => {
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

        // When name is provided
        if (name) {
            await new Promise((resolve, reject) => {
                const updateQuery = "UPDATE users SET name = ? WHERE email = ?";
                connection.query(updateQuery, [name, email], (err, result) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result);
                    }
                });
            });
        }

        // When password is provided
        let passwordStatus = 'Nothing is changed';
        if (newPassword) {
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
            passwordStatus = 'Password updated successfully';
        }

        // When profile picture is provided
        let publicUrl = user.profile_pic_url;
        if (file && file.hapi && file.hapi.filename) {
            // Extract the file extension
            const extension = path.extname(file.hapi.filename);

            // Generate a unique blob name
            const blobName = `${user.name}${extension}`;
            const blob = profilePictureBucket.file(blobName);
            const blobStream = blob.createWriteStream({
                resumable: false,
                gzip: true
            }); 

            await new Promise((resolve, reject) => {
                blobStream.on('finish', resolve);
                blobStream.on('error', reject);
                blobStream.end(file._data);
            });
            
            publicUrl = `https://storage.googleapis.com/${profilePictureBucket.name}/${blobName}`;
            const query = 'UPDATE users SET profile_pic_url = ? WHERE id = ?';

            // Store the profile picture URL in MySQL
            await connection.query(query, [publicUrl, user.id]);
        } else {
            publicUrl = 'Nothing is changed';
        }
        
        return h.response({
            status: 'success',
            message: 'User profile updated successfully',
            result: {
                name: user.name + ' --> ' + name,
                password: passwordStatus,
                picture: publicUrl,
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
        const artQuery = "SELECT * FROM paintings WHERE image_url = ?";
        const paintings = await new Promise((resolve, reject) => {
            connection.query(artQuery, [imageUrl], (err, rows, field) => {
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

        const userQuery = "SELECT name, profile_pic_url FROM users WHERE id = ?";
        const user = await new Promise((resolve, reject) => {
            connection.query(userQuery, [paintings.user_id], (err, rows, field) => {
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
                picture: user.profile_pic_url,
                name: user.name,
                genre: paintings.genre,
                description: paintings.description,
                createdAt: paintings.upload_timestamp
            }
        }).code(200);
    } catch (err) {
        return h.response({
            status: 'fail',
            message: err.message,
        }).code(500);
    }
};

const genreList = async (request, h) => {
    try {
        return h.response({
            status: 'success',
            message: 'Genre list fetched successfully',
            result: [
                'Abstract', 
                'Expressionism',
                'Neoclassicism', 
                'Primitivism', 
                'Realism',
                'Romanticism',
                'Symbolism'
            ]
        }).code(200);
    } catch (err) {
        return h.response({
            status: 'fail',
            message: err.message,
        }).code(500);
    }
};

const likePaintings = async (request, h) => {
    try {
        const { email, imageUrl } = request.payload;

        // Check if user and painting exist
        const userQuery = 'SELECT * FROM users WHERE email = ?';
        const paintingQuery = 'SELECT * FROM paintings WHERE image_url = ?';

        const user = await new Promise((resolve, reject) => {
            connection.query(userQuery, [email], (err, rows, field) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows[0]);
                }
            });
        });
        
        const painting = await new Promise((resolve, reject) => {
            connection.query(paintingQuery, [imageUrl], (err, rows, field) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows[0]);
                }
            });
        });

        if (!user) {
            return h.response({
                status: 'fail',
                message: 'User not found',
            }).code(404);
        }

        if (!painting) {
            return h.response({
                status: 'fail',
                message: 'Painting not found',
            }).code(404);
        }

        // Check if the user has already liked the painting
        const likeCheckQuery = 'SELECT * FROM user_likes WHERE user_id = ? AND painting_id = ?';
        const existingLike = await new Promise((resolve, reject) => {
            connection.query(likeCheckQuery, [user.id, painting.id], (err, rows, field) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows[0]);
                }
            });
        });

        if (existingLike) {
            return h.response({
                status: 'fail',
                message: 'Painting already liked',
            }).code(400);
        }

        // Insert the like into the user_likes table
        const insertLikeQuery = 'INSERT INTO user_likes (user_id, painting_id) VALUES (?, ?)';
        await connection.query(insertLikeQuery, [user.id, painting.id]);

        return h.response({
            status: 'success',
            message: 'Painting liked successfully',
        }).code(200);
    } catch (err) {
        return h.response({
            status: 'fail',
            message: err.message,
        }).code(500);
    }
};

const getLikedPaintings = async (request, h) => {
    try {
        const { email } = request.payload;

        // Check if the user exists
        const userQuery = 'SELECT * FROM users WHERE email = ?';
        const user = await new Promise((resolve, reject) => {
            connection.query(userQuery, [email], (err, rows, field) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows[0]);
                }
            });
        });

        if (!user) {
            return h.response({
                status: 'fail',
                message: 'User not found',
            }).code(404);
        }

        // Retrieve the liked paintings
        const likedPaintingsQuery = `
            SELECT image_url FROM paintings
            JOIN user_likes ON paintings.id = user_likes.painting_id
            WHERE user_likes.user_id = ?
        `;
        const likedPaintings = await new Promise((resolve, reject) => {
            connection.query(likedPaintingsQuery, [user.id], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });

        if (!likedPaintings || likedPaintings.length === 0) {
            return h.response({
                status: 'fail',
                message: 'No liked paintings found',
            }).code(404);
        }

        // Construct the public URLs for the liked paintings
        const publicLinks = likedPaintings.flatMap(painting => painting.image_url);

        return h.response({
            status: 'success',
            message: 'Liked paintings retrieved successfully',
            result: publicLinks
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
    deletePainting,
    homePage,
    getUser,
    genreHandler,
    getPaintings,
    editProfile,
    genreList,
    likePaintings,
    getLikedPaintings
};
