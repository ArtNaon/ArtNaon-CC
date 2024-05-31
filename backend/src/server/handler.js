const admin = require('./firebase');
const bcrypt = require('bcrypt');

const registerHandler = async (request, h) => {
    const { email, password } = request.payload;
    try {
      const userRecord = await admin.auth().createUser({
        email,
        password,
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

module.exports = {
  registerHandler,
  loginHandler,
  forgotPassword,
};
