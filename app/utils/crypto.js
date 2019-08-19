let jwt = require('jsonwebtoken');
let crypto = require('crypto');
let config = require('./../config/config');
let async = require('async');
let fs = require('fs');
let utils = require('./common');
let freeAuthPath = [
    '/user/checklogin',
    '/users/registerUser',
    '/users/login'
  ];

module.exports = {

    ensureAuthorized: function (req, res, next) {
        if (freeAuthPath.indexOf(req.path) !== -1) {
            return next();
        }
        var bearerToken;
        var bearerHeader = req.headers["authorization"];
        if (typeof bearerHeader !== 'undefined') {
            if (bearerHeader.split(' ')[0] == 'bearer') {
                bearerToken = bearerHeader.replace('bearer ', '');
                req.token = bearerToken;

                jwt.verify(bearerToken, config.accessEncKey, function (err, decoded) {
                    if (err) {
                        return res.send({
                            code: 401,
                            message: 'Invalid Token!'
                        });
                    } else {
                        req.user = decoded;
                        next();
                    }
                });
            } else {
                return res.send({
                    code: 401,
                    message: 'Invalid Token!'
                });
            }
        } else {
            return res.send({
                code: 401,
                message: 'Token not found!'
            });
        }
    },

    ensureAccess: function (req, res, next) {
        next();
    },

    generatePassword: function (myPlaintextPassword, callback) {
        var salt = crypto.randomBytes(64).toString('base64');
        var passwordHash = myPlaintextPassword + salt;
        var cipher = crypto.createCipher(algorithm, config.accessEncKey)
        var crypted = cipher.update(passwordHash, 'utf8', 'hex')
        var cryptedPassword = crypted + cipher.final('hex');
        callback(null, salt, cryptedPassword);
    },

    comparePassword: function (pData, password, solt, callback) {
        var decipher = crypto.createDecipher(algorithm, config.accessEncKey);
        var dec = decipher.update(pData, 'hex', 'utf8');
        dec += decipher.final('utf8');
        var pass = dec.replace(solt, '');
        //console.log(password,pass,solt)
        if (pass == password) {
            return callback(true);
        } else {
            return callback(false);
        }
    }
};