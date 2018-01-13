"use strict";

const express    = require('express');
const bodyParser = require('body-parser');

var {mongoose}   = require('./db/mongoose');
var {Todo}       = require('./models/todo');
var {User}       = require('./models/user');

var app = express();

// Config the middleware
app.use(bodyParser.json());

app.post('/todos', (req, res) => {
    var todo = new Todo({
        text: req.body.text
    });

    todo.save().then((doc) => {
        console.log('Saved todo');
        res.send(doc);
    }, (err) => {
        console.log('Unable to save todo');
        res.status(400).send(err);
    });
});

app.listen(3000, () => {
    console.log('Started on port 3000');
});

module.exports = {app};