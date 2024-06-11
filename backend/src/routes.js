const { 
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
        method: 'POST',
        path: '/userPaintings',
        handler: getUserPaintings,
      },
      {
        method: 'POST',
        path: '/delete',
        handler: deletePainting,
      },
      {
        method: 'GET',
        path: '/homePage',
        handler: homePage,
      },
      {
        method: 'POST',
        path: '/user',
        handler: getUser,
      },
      {
        method: 'POST',
        path: '/genre',
        handler: genreHandler,
      },
      {
        method: 'POST',
        path: '/paintings',
        handler: getPaintings,
      }
];

module.exports = routes;
