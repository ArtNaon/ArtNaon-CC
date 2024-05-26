const { uploadHandler, downloadHandler } = require('./handler');

const routes = [
    {
        method: 'POST',
        path: '/upload',
        handler: uploadHandler,
        options: {
            payload: {
                output: 'stream',
                parse: true,
                multipart: true
            }
        }
    },
    {
        method: 'POST',
        path: '/download',
        handler: downloadHandler
    }
];

module.exports = routes;