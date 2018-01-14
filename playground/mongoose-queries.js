"use strict";

const {mongoose} = require('../server/db/mongoose');
const {Todo}     = require('../server/models/todo');
const {User}     = require('../server/models/user');
const {ObjectID} = require('mongodb');

// var id = '5a59ce6c9af15409929c226611';

// if (!ObjectID.isValid(id)) {
//     console.log(`ID ${id} is not valid`);
// }

// If nothing is found, return an empty array []
// Todo.find({
//     _id: id
// }).then((todos) => {
//     if (todos.length === 0) {
//         return console.log('ID not found');
//     }
//     console.log('Todos', todos);
// });

// // If nothing is found, returns null
// Todo.findOne({
//     _id: id
// }).then((todo) => {
//     if (!todo) {
//         return console.log('ID not found');
//     }
//     console.log('Todo', todo);
// });

// If nothing is found, returns null
// Todo.findById(id).then((todo) => {
//     if (!todo) {
//         return console.log('ID not found');
//     }
//     console.log('Todo by ID', todo);
// }).catch((err) => console.log(err));

var userID = '5a5845a2093369131def7053';

User.findById(userID).then((users) => {
    if (!users) {
        return console.log(`ID ${userID} not found`);
    }

    console.log('User by ID', users);
}, (err) => {
    console.log(`Invalid User ID ${userID}`);
});