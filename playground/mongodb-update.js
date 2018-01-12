"use strict";

// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

var dbName = 'TodoApp';

// On MongoDB 3.0.0+ the second argument of the callback is the client
MongoClient.connect(`mongodb://localhost:27017/${dbName}`, (err, client) => {
    if (err) {
        return console.log('Unable to connect to the MongoDB server');
    }

    // Mongo 3.0.0+: get the db from the client
    var db = client.db(dbName);
    console.log('Connected to MongoDB server');

    // findOneAndUpdate
    db.collection('Todos').findOneAndUpdate({
        text: 'Eat lunch'
    }, {
        $set: {
            completed: true
        }
    }, {
        returnOriginal: false
    }).then((result) => {
        console.log('Todo(s) modified');
        console.log(JSON.stringify(result, undefined, 2));
    });

    db.collection('Users').findOneAndUpdate({
        _id: new ObjectID('5a56d537296c0636f3e42837')
    },
    {
        $set: {
            name: 'David Rubio Vidal'
        },
        $inc: {
            age: 1
        }
    }, {
        returnOriginal: false
    }).then((result) => {
        console.log('User(s) modified');
        console.log(JSON.stringify(result, undefined, 2));
    });

    //client.close();
});