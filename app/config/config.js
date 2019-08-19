var path = require('path');
module.exports = {
    accessEncKey: 'asjhdf345gsakj$kamskgfhjasg&kjdnsfrkjdsbhfada85sdgfs723dfgfds',
    secret: 'secretkey',
    salt: 2,
    env: (process.env.NODE_ENV == 'production') ? "production" : "development",
    baseUrl: (process.env.NODE_ENV == 'production') ? "http://" : "http://localhost:5091/",
    tokenExpiryTime: '24 hours',
    statusCode: {
        'success': 200,
        'error': 201,
        'emailOtp': 202,
        'authErr': 203,
        'accessErr': 204,
        'emailOtpError': 205
    }
};