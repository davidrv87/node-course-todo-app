"use strict";

// Object destructuring ES6
// var user = {name: 'David', age: 30};
// var {name} = user;

// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

// var obj = new ObjectID();
// console.log(obj);

var dbName = 'TodoApp';

// On MongoDB 3.0.0+ the second argument of the callback is the client
MongoClient.connect(`mongodb://localhost:27017/${dbName}`, (err, client) => {
    if (err) {
        return console.log('Unable to connect to the MongoDB server');
    }

    // Mongo 3.0.0+: get the db from the client
    var db = client.db(dbName);

    console.log('Connected to MongoDB server');

    // 'Todos' is the name of the connection. If it does not exist, it is created
    db.collection('Todos').insertOne({
        text: 'Something to do',
        completed: false
    }, (err, result) => {
        if (err) {
            return console.log('Unable to insert To-Do', err);
        }

        console.log(JSON.stringify(result.ops, undefined, 2));
    });

    db.collection('Users').insertOne({
        name: 'David Rubio',
        age: 30,
        location: 'Auckland'
    }, (err, result) => {
        if (err) return console.log('Unable to insert User', err);

        console.log(JSON.stringify(result.ops, undefined, 2));

        // In the _id, timestamp is encoded
        console.log(result.ops[0]._id.getTimestamp());
    });

    client.close();
});