'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var secret_salt = 'secret_password_sotial_network';

exports.createToken = function(user) {
    var payload = {
        sub: user._id,
        name: user.name,
        surname: user.surname,
        nick: user.nick,
        email: user.email,
        role: user.role,
        image: user.image,
        password: user.password,
        iat: moment().unix(),
        exp: moment().add(30, 'days').unix()
    };

    return jwt.encode(payload, secret_salt);
}