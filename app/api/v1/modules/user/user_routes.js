'use strict';
module.exports = function (router) {
    let user = require('./controllers/user-ctrl');  
    router.get('/user/checklogin', user.checklogin);
    router.post('/users/registerUser', user.register);
    router.get('/users/getUsers', user.getUsers);
    router.post('/users/login', user.login);
    return router;
}