"use strict";

const {mongoose} = require('../server/db/mongoose');
const {Todo}     = require('../server/models/todo');
const {User}     = require('../server/models/user');
const {ObjectID} = require('mongodb');

// Todo.remove({}).then((result) => {
//     console.log(result);
// });

// Todo.findOneAndRemove({
//     _id: '5a5bf30d338d2ec9deff25e8'
// }).then((doc) => {
//     console.log('Todo', doc);
// });

Todo.findByIdAndRemove('5a5bf4e94758feca49f6eacc').then((doc) => {
    console.log('Todo', doc);
});