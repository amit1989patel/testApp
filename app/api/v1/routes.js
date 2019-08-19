'use strict';
module.exports = function (express) {
    var router = express.Router()
    require('./modules/user/user_routes')(router);
    return router;
}