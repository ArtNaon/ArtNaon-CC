const { 
    registerUser,
    loginUser,
    resetPassword,
    uploadPainting,
    userPaintings,
    deletePainting,
    homePage,
    getUser
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
        path: '/homePage/{userId}',
        handler: homePage,
      },
      {
        method: 'GET',
        path: '/user',
        handler: getUser,
      },
];

module.exports = routes;
