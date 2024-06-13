const { 
    registerUser,
    loginUser,
    resetPassword,
    uploadPainting,
    deletePainting,
    homePage,
    getUser,
    genreHandler,
    getPaintings,
    profilePicture,
    genreList
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
      },
      {
        method: 'POST',
        path: '/profilePicture',
        options: {
          payload: {
            output: 'stream',
            parse: true,
            multipart: true,
            maxBytes: 10 * 1024 * 1024, // 10MB file limit
          },
        },
        handler: profilePicture,
      },
      {
        method: 'GET',
        path: '/genreList',
        handler: genreList,
      }
];

module.exports = routes;
