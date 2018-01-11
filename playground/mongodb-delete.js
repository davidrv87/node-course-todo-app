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

    // // deleteMany
    // db.collection('Todos').deleteMany({text: 'Something to do 1'}).then((result) => {
    //     console.log('Object deleted succesfully', result.result);
    // }, (err) => {
    //     console.log('Unable to delete the document', err);
    // });

    // // deleteOne
    // db.collection('Todos').deleteOne({text: 'Something to do 123'}).then((result) => {
    //     console.log('Object deleted successfully', result.result);
    // }, (err) => {
    //     console.log('Unable to delete the document', err);
    // });

    // // findOneAndDelete: get the data back of the document deleted (undo button)
    // db.collection('Todos').findOneAndDelete({completed: false}).then((result) => {
    //     console.log(result);
    // });

    db.collection('Users').findOneAndDelete({
        _id: new ObjectID('5a56e60618dabe4eba1f12b9')
    }).then((result) => {
        if (result.value === null) {
            return console.log('There was no user with that ID');
        }
        console.log(JSON.stringify(result.value, undefined, 2));
    }, (err) => {
        console.log('Unable to delete user', err);
    });

    //client.close();
});