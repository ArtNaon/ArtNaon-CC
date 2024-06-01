const { 
    registerHandler, 
    loginHandler, 
    forgotPassword,
    registerUser,
    loginUser,
    uploadPainting,
    getPaintings
} = require('./handler');

const routes = [
    /*
    {
        method: 'POST',
        path: '/register',
        handler: registerHandler,
    },
    {
        method: 'POST',
        path: '/login',
        handler: loginHandler,
    },
    {
        method: 'POST',
        path: '/forgotPassword',
        handler: forgotPassword,
    }
    */
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