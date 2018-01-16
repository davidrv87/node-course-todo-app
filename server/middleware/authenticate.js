"use strict";

var {User} = require('../models/user');

module.exports.authenticate = (req, res, next) => {
    var token = req.header('x-auth');

    User.findByToken(token).then((user) => {
        if (!user) {
            return Promise.reject(); // Instead of using res.status(401).send()
        }

        // Instead of sending back the response, we modify the request so the route can use it
        req.user = user;
        req.token = token;
        next(); // We call next() for the callback of the route to be executed
    }).catch((err) => {
        res.status(401).send(err); // We don't send next() to prevent the callback from executing
    });
};
