const { 
    registerHandler, 
    loginHandler, 
    forgotPassword,
    registerUser,
    loginUser,
    resetPassword,
    uploadPainting,
    getPaintings
} = require('./handler');

const routes = [
    {
        method: 'POST',
        path: '/firebaseRegister',
        handler: registerHandler,
    },
    {
        method: 'POST',
        path: '/firebaseLogin',
        handler: loginHandler,
    },
    {
        method: 'POST',
        path: '/firebasePassword',
        handler: forgotPassword,
    }, 
    {
        method: 'POST',
        path: '/register',
        handler: registerUser,
    },
    {
        method: 'POST',
        path: '/login',
        handler: loginUser,
    },
    {
        method: 'POST',
        path: '/reset',
        handler: resetPassword,
    },
    { 
        method: 'POST',
        path: '/upload',
        options: {
          payload: {
            output: 'stream',
            parse: true,
            multipart: true,
            maxBytes: 10 * 1024 * 1024, // 10MB file limit
          },
        },
        handler: uploadPainting,
      },
      {
        method: 'GET',
        path: '/paintings/{userId}',
        handler: getPaintings,
      },
];

module.exports = routes;
