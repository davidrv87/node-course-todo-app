"use strict";

const {ObjectID} = require('mongodb');
const jwt        = require('jsonwebtoken');

const {Todo}     = require('../../models/todo');
const {User}     = require('../../models/user');

const userOneID = new ObjectID();
const userTwoID = new ObjectID();
const users = [{
    _id: userOneID,
    email: 'david@example.com',
    password: 'user1pass',
    tokens: [{
        access: 'auth',
        token: jwt.sign({_id: userOneID, access: 'auth'}, 'abc123').toString()
    }]
}, {
    _id: userTwoID,
    email: 'mara@example.com',
    password: 'user2pass',
    tokens: [{
        access: 'auth',
        token: jwt.sign({_id: userTwoID, access: 'auth'}, 'abc123').toString()
    }]
}];

const todos = [{
    _id: new ObjectID(),
    text: 'First todo test',
    _creator: userOneID
}, {
    _id: new ObjectID(),
    text: 'Second todo test',
    completed: true,
    completedAt: 333,
    _creator: userTwoID
}];

const populateTodos = (done) => {
    // Empty the collection before each test and put some dummy data
    Todo.remove({}).then(() => {
        return Todo.insertMany(todos);
    }).then(() => done());
};

// We can't use 'insertMany' as above because the middleware to hash the password must run on 'save'
const populateUsers = (done) => {
    User.remove({}).then(() => {
        var userOne = new User(users[0]).save(); // returns a promise
        var userTwo = new User(users[1]).save();

        // We have to wait until all the promises resolve, so use Promise.all()
        return Promise.all([userOne, userTwo]);
    }).then(() => done());
};

module.exports = {
    todos,
    users,
    populateTodos,
    populateUsers
};