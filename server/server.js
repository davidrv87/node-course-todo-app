"use strict";

// Load the config
require('./config/config');

const express    = require('express');
const bodyParser = require('body-parser');
const _          = require('lodash');
const {ObjectID} = require('mongodb');

var {mongoose}   = require('./db/mongoose');
var {Todo}       = require('./models/todo');
var {User}       = require('./models/user');

var app          = express();
var port = process.env.PORT;

// Config the middleware
app.use(bodyParser.json());

app.post('/todos', (req, res) => {
    var todo = new Todo({
        text: req.body.text
    });

    todo.save().then((doc) => {
        res.send(doc);
    }, (err) => {
        res.status(400).send(err);
    });
});

app.get('/todos', (req, res) => {
    Todo.find().then((todos) => {
        res.send({todos}); // Send the object instead of an array (ES6 Syntax)
    }, (err) => {
        res.status(400).send(err);
    });
});

app.get('/todos/:id', (req, res) => {
    var id = req.params.id;

    if (!ObjectID.isValid(id)) {
        return res.status(404).send(`ID ${id} is not valid`);
    }

    Todo.findById(id).then((todo) => {
        if (!todo) {
            return res.status(404).send('Todo not found');
        }

        res.send({todo});
    }, (err) => {
        res.status(400).send(err);
    });
});

app.delete('/todos/:id', (req, res) => {
    var id = req.params.id;

    if (!ObjectID.isValid(id)) {
        return res.status(404).send(`ID ${id} is not valid`);
    }

    Todo.findByIdAndRemove(id).then((todo) => {
        if (!todo) {
            return res.status(404).send(`ID ${id} not found`);
        }

        res.send({todo});
    }).catch((err) => {
        res.status(400).send(`Todo ${id} could not be deleted`);
    });
});

app.patch('/todos/:id', (req, res) => {
    var id = req.params.id;
    // To prevent properties to be updated that they shouldn't (ie completeAt), pull only the properties
    // from the body that was sent. Use _.pick() for this purpose
    var body = _.pick(req.body, ['text', 'completed']);

    if (!ObjectID.isValid(id)) {
        return res.status(404).send(`ID ${id} is not valid`);
    }

    // Check if the user has set the task to completed
    if (_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime();
    } else {
        body.completed = false;
        body.completedAt = null;
    }

    Todo.findByIdAndUpdate(id, {
        $set: body
    }, {
        new: true // same as returnOriginal: false
    }).then((todo) => {
        if (!todo) {
            res.status(404).send(`ID ${id} not found`);
        }

        res.send({todo});
    }).catch((err) => {
        res.status(400).send();
    });
});

app.listen(port, () => {
    console.log(`Started on port ${port}`);
});

module.exports = {app};