const { 
    registerUser,
    loginUser,
    uploadPainting,
    deletePainting,
    homePage,
    getUser,
    genreHandler,
    getPaintings,
    editProfile,
    genreList,
    likePaintings,
    getLikedPaintings,
    detectPaintings
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
        path: '/editProfile',
        options: {
          payload: {
            output: 'stream',
            parse: true,
            multipart: true,
            maxBytes: 10 * 1024 * 1024, // 10MB file limit
          },
        },
        handler: editProfile,
      },
      {
        method: 'GET',
        path: '/genreList',
        handler: genreList,
      },
      {
        method: 'GET',
        path: '/editProfile',
        handler: editProfile,
      },
      {
        method: 'POST',
        path: '/likePaintings',
        handler: likePaintings,
      },
      {
        method: 'POST',
        path: '/getLikedPaintings',
        handler: getLikedPaintings,
      },
      {
        method: 'POST',
        path: '/detectPaintings',
        handler: detectPaintings,
      }

];

module.exports = routes;
