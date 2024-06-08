const { 
    registerUser,
    loginUser,
    resetPassword,
    uploadPainting,
    userPaintings,
    deletePainting,
    homePage
} = require('./handler');

const routes = [
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
        handler: userPaintings,
      },
      {
        method: 'POST',
        path: '/delete',
        handler: deletePainting,
      },
      {
        method: 'GET',
        path: '/home',
        handler: homePage,
      },
];

module.exports = routes;
