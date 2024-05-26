const { uploadHandler, downloadHandler } = require('./handler');

const routes = [
    {
        method: 'POST',
        path: '/upload',
        options: {
            payload: {
                output: 'stream',
                parse: true,
                multipart: true,
                allow: 'multipart/form-data'
            },
            handler: async (request, h) => {
                const { image } = request.payload;
                try {
                    const message = await uploadHandler.uploadFile(image);
                    return h.response({ message }).code(200);
                } catch (err) {
                    return h.response({ error: err.message }).code(500);
                }
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