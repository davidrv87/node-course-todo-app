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

    // find() returns a cursor
    // toArray() returns a promise
    db.collection('Todos').find({completed: false}).toArray().then((docs) => {
        console.log('Todos');
        console.log(JSON.stringify(docs, undefined, 2));
    }, (err) => {
        console.log('Unable to fetch the todos', err);
    });

    db.collection('Todos').find({
        _id: new ObjectID('5a56d896da99b93b6e156123')
    }).toArray().then((docs) => {
        console.log('Todos');
        console.log(JSON.stringify(docs, undefined, 2));
    }, (err) => {
        console.log('Unable to fetch the todos', err);
    });

    db.collection('Todos').find().count().then((count) => {
        console.log(`There are ${count} Todos`);
    }, (err) => {
        console.log('Unable to fetch the todos', err);
    });

    db.collection('Users').find({name: 'David Rubio'}).toArray().then((docs) => {
        console.log('Users');
        console.log(JSON.stringify(docs, undefined, 2));
    }, (err) => {
        console.log('Unable to fetch the users', err);
    });

    //client.close();
});