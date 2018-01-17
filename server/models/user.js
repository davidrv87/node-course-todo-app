"use strict";

const mongoose  = require('mongoose');
const validator = require('validator');
const jwt       = require('jsonwebtoken');
const _         = require('lodash');
const bcrypt    = require('bcryptjs');

// Define the User Schema
var UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        minlength: 1,
        trim: true,
        unique: true,
        validate: {
            validator: (value) => { // the whole funcition can be changed to 'validator.isEmail'
                return validator.isEmail(value);
            },
            message: '{VALUE} is not a valid email'
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }]
}, {
    usePushEach: true // Workaround for https://github.com/Automattic/mongoose/issues/5574
});

// Override toJSON method to send back the appropriate info to the user (email and id)
UserSchema.methods.toJSON = function() {
    var user = this;
    var userObject = user.toObject(); // Create a regular object

    return _.pick(userObject, ['_id', 'email']);
};

// Define the instance methods which have access to the individual documents
// We use regular function as arrow function do NOT bind the 'this' keyword, and we need it because
// the this keyword stores the individual documents
UserSchema.methods.generateAuthToken = function() {
    var user = this;
    var access = 'auth';

    var token = jwt.sign({
        _id: user._id.toHexString(),
        access
    }, 'abc123').toString();

    user.tokens.push({access, token});

    return user.save().then(() => {
        return token;
    });
};

// This method will remove a token to logout a user
UserSchema.methods.removeToken = function(token) {
    var user = this;

    return user.update({
        $pull: {
            tokens: {token}
        }
    });
};

// Model method as opposed to instance methods as the ones above
UserSchema.statics.findByToken = function(token) {
    var User = this; // Note that we use the model (User) instead of the instance (user)
    var decoded;

    try {
        decoded = jwt.verify(token, 'abc123');
    } catch (e) {
        // We return a Promise that rejects so the success path in .then() will never fire
        return Promise.reject('Authentication required'); // The argument will be the 'err' in the .catch((err))
    }

    return User.findOne({
        '_id': decoded._id,
        'tokens.token': token,
        'tokens.access': 'auth'
    });
};

// Method to find a user using email and password
UserSchema.statics.findByCredentials = function(email, password) {
    var User = this;

    return User.findOne({email}).then((user) => {
        if (!user) {
            return Promise.reject('User not found');
        }

        // bcrypt works with callback, but we want to return a Promise
        return new Promise((resolve, reject) => {
            bcrypt.compare(password, user.password, (err, res) => {
                if (res) {
                    resolve(user);
                } else {
                    reject('Email or password do not match');
                }

            });
        });
    });
};

// Attach a middleware to hash the password before saving the new user to the database
UserSchema.pre('save', function (next) {
    var user = this;

    // We want to hash the password if it was modified
    if (user.isModified('password')) {
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(user.password, salt, (err, hash) => {
                user.password = hash;
                next();
            });
        });
    } else {
        next();
    }
});

// Define the User model
var User = mongoose.model('User', UserSchema);

module.exports = {
    User
};