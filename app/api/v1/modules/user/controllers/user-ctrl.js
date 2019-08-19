let jwt = require('jsonwebtoken');
let Joi = require('joi');
const bcrypt = require('bcrypt');
let config = require('../../../../../config/config')
import Users from '../../../models/usersModel';
let crypto = __rootRequire('app/utils/crypto');

module.exports = {
    /**
     * Function is use to check login insure user is loged in to access the particular resource or not
     * @access private
     * @return json
     * Created by : Amit Kumar
     * Created Date
     */
    checklogin: (req, res, next) => {
        crypto
            .ensureAuthorized(req, res, function () {
                res.json({status: req.config.statusCode.success, user: req.user});
            });
    },
    /**
     * Function is use to register user base on the type of user
     * @access public
     * @return json
     * Created by : Amit Kumar     
     * Created Date
     */
    register: (req, res, next) => {
        if (req.body) {
            let crypt_password = bcrypt.hashSync(req.body.password, config.salt);
            var data = {
                name: req.body.name,
                email: req.body.email,
                password: crypt_password,
                createdAt: new Date(),
            };
            var schema = Joi
                .object()
                .keys({
                    name: Joi
                        .string()
                        .required(),
                    email: Joi
                        .string()
                        .required(),
                    createdAt: Joi.date(),
                    password: Joi.string(),
                });
            Joi.validate(data, schema, function (err, value) {
                if (err) {
                    res.json({code: 201, error: err, message: "Validation errors!"});
                } else {
                    Users
                        .where({email: req.body.email})
                        .fetch()
                        .then((user) => {
                            user = (user) ? user.toJSON():null;
                            if (user) {
                                res.json({code: 209, status: true, data: null, message: 'Email already exist in system.'});
                            } else {
                                Users
                                    .forge()
                                    .save(data)
                                    .then((users) => {
                                        users = (users)?users.toJSON():null;
                                        res.json({
                                            code: 200,
                                            status: true,
                                            data: users,
                                            message: 'new User created successfully!'
                                        });
                                    })
                                    .catch((error) => {
                                        res.json({code: 400, status: false, data: error, message: 'Error occured!'});
                                    })
                            }
                        })
                        .catch((error) => {
                            res.json({code: 400, status: false, data: error, message: 'Error occured!'});
                        })
                }
            });
        } else {
            res.json({code: 400, status: false, data: null, message: 'Missing Parameters!'});
        }
    },

    /**
     * Function is use to check login insure user is loged in to access the particular resource or not
     * @access public
     * @return json
     * Created by : Amit Kumar
     * Created Date
     */
    login: (req, res, next) => {
        if (req.body) {
            let plain_pwd = req.body.password;
            let data = {
                email: req.body.email,
                password: req.body.password
            };
            let schema = Joi
                .object()
                .keys({
                    email: Joi
                        .string()
                        .required(),
                    password: Joi
                        .string()
                        .required()

                });
            let expirationDuration = 60 * 60 * 8 * 1; // expiration duration 8 Hours
            Joi.validate(data, schema, function (err, value) {
                if (err) {
                    res.json({code: 201, error: err, message: "Validation errors!"});
                } else {
                    Users
                        .where({email: req.body.email.toLowerCase()})
                        .fetch()
                        .then((res_data) => {
                            res_data = (res_data)?res_data.toJSON():null;
                            if(res_data.status == "Active"){
                                let usr = res_data;
                                if (bcrypt.compareSync(plain_pwd, usr.password)) {
                                    let tokenData = {
                                        "id": usr.id,
                                        "name": usr.name,
                                        "email": usr.email,
                                    };
                                    let token = jwt.sign(tokenData, config.accessEncKey, {expiresIn: expirationDuration});
                                    let usrData = {
                                        'user': tokenData,
                                        'token': token,
                                    }
                                    if (token) {
                                        res.json({
                                            code: 200,
                                            status: true,
                                            data: usrData,
                                            message: 'login success!'
                                        });
                                    }
                                } else {
                                    res.json({code: 401, status: false, data: null, message: 'Invalid password!'});
                                }
                            }else{
                                res.json({code: 401, status: false, data: null, message: 'Account deactivated !!! Please Contact support '});
                            }
                        })
                        .catch((error) => {
                            console.log("=============>", error)
                            res.json({code: 400, status: false, data: error, message: 'login failed!'});
                        });
                }
            });

        }else {
            res.json({code: 400, status: false, data: null, message: 'Missing Parameters!'});
        }
    },

    //Get all Users from Users
    /**
     * Function is use to get all user is loged in to access the particular resource or not
     * @access public
     * @return json
     * Created by : Amit Kumar
     * Created Date
    */
    getUsers: (req, res, next) => {
        Users
            .fetchAll()
            .then((users) => {
                users = (users)?users.toJSON():null;
                res.json({
                    code: 200,
                    status: true,
                    data: users,
                    message: 'Users fetch successfully!'
                });
            })
            .catch((error) => {
                res.json({code: 400, status: false, data: error, message: 'Error occured!'});
            });
    },
    //Delete an Users with the Given ID
    /**
     * Function is use to delete user based on id
     * @access public
     * @return json
     * Created by : Amit Kumar
     * Created Date
    */
    deleteUser: (req, res, next) => {
        if (req.params.id) {
            Users
                .forge({id: req.params.id})
                .fetch({require: true})
                .then((user) => {
                    user
                        .destroy()
                        .then(() => {
                            res.json({code: 200, status: true, message: 'Successfully deleted User!'});
                        })
                })
                .catch((error) => {
                    res.json({code: 400, status: false, data: error, message: 'Error occured!'});
                })
        } else {
            res.json({code: 400, status: false, data: null, message: 'Missing Parameters!'});
        }
    }
}