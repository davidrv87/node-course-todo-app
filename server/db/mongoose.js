"use strict";

var mongoose = require('mongoose');

// Config mongoose to use the default Promise system
mongoose.Promise = global.Promise;

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/TodoApp', {
    useMongoClient: true
});

module.exports = {
    mongoose
};