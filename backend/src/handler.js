const admin = require('./firebase');
const bcrypt = require('bcrypt');
const FormData = require('form-data');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const mysql = require('mysql');
const Path = require('path');
const { Storage } = require('@google-cloud/storage');
const uuid = require('uuid');
require('dotenv').config();

// Firebase Auth handlers //

const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
}

const registerHandler = async (request, h) => {
    const { email, password } = request.payload;
    try {
      const hashedPassword = await hashPassword(password);
      const userRecord = await admin.auth().createUser({
        email,
        password: hashedPassword
      });
      return h.response({ message: 'User successfully created!', email: userRecord.email }).code(201);
    } catch (error) {
      return h.response({ message: error.message }).code(400);
    }
};

const loginHandler = async (request, h) => {
    const { email, password } = request.payload;
    try {
      const user = await admin.auth().getUserByEmail(email);
      return h.response({ message: 'Login success' }).code(200);
    } catch (error) {
      return h.response({ message: 'Login failed', error: error.message }).code(400);
    }
};

const forgotPassword = async (request, h) => {
    const { email } = request.payload;
    try {
        await admin.auth().generatePasswordResetLink(email);
        return h.response({ message: 'Password reset email sent' }).code(200);
    } catch (error) {
        return h.response({ message: 'Error sending password reset email', error }).code(400);
    }
};

// Cloud MySQL handlers //

process.env.GOOGLE_APPLICATION_CREDENTIALS = "./src/gcp-service-account.json";

const connection = mysql.createConnection({
    host: '127.0.0.1',
    port: '3306',
    user: 'zalfyputra',
    database: 'artnaon_db',
    password: 'zalfy123'
});

const registerUser = async (request, h) => {
  try {
      const { name, email, password } = request.payload;
      if (!email || !password) {
          const response = h.response({
              status: 'fail',
              message: 'Please enter email and password',
            });
            response.code(400);
            return response;
      }

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
  
      const hashedPassword = await bcrypt.hash(password, 10);
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
      
      const token = jwt.sign({ userId : user.id }, 'secret_key');
  
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

const storage = new Storage();
const bucket = storage.bucket('user-paintings');

const uploadPainting = async (request, h) => {
    const { userId } = request.payload;
    const file = request.payload.painting;

    const blobName = `${uuid.v4()}-${file.hapi.filename}`;
    const blob = bucket.file(blobName);
    const blobStream = blob.createWriteStream({
      resumable: false,
      gzip: true
    });

    try {
      await new Promise((resolve, reject) => {
        blobStream.on('finish', resolve);
        blobStream.on('error', reject);
        blobStream.end(file._data);
      });
      
      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blobName}`;
      const query = 'INSERT INTO paintings (user_id, image_url, upload_timestamp) VALUES (?, ?, NOW())';

      await connection.query(query, [userId, publicUrl]);

      return h.response({ message: 'Painting uploaded successfully', url: publicUrl }).code(201);
    } catch (err) {
      return h.response({ message: 'Error uploading painting or saving metadata', error: err.message }).code(500);
    }
};

const getPaintings = async (request, h) => {
    const { userId } = request.params;

    const connection = await mysql.createConnection();
    try {
      const [rows] = await connection.query('SELECT * FROM paintings WHERE user_id = ? ORDER BY upload_timestamp DESC', [userId]);
      return h.response(rows).code(200);
    } catch (err) {
      return h.response({ message: 'Error fetching paintings' }).code(500);
    } finally {
      connection.release();
    }
};

module.exports = {
  registerHandler,
  loginHandler,
  forgotPassword,
  registerUser,
  loginUser,
  uploadPainting,
  getPaintings
};
