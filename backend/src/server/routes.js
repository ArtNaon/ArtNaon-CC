const { 
    registerHandler, 
    loginHandler, 
    forgotPassword
} = require('./handler');

const routes = [
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
];

module.exports = routes;