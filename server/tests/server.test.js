"use strict";

const expect  = require('expect');
const request = require('supertest');

var {app}     = require('../server');
var {Todo}    = require('../models/todo');

describe('POST /todos', () => {
    beforeEach((done) => {
        // Empty the collection before each test
        Todo.remove({}).then(() => done());
    });

    it('should not create a todo with bad body data', (done) => {
        request(app)
            .post('/todos')
            .send({
                text: ''
            })
            .expect(400)
            .end((err, response) => {
                if (err) {
                    return done(err);
                }

                Todo.find().then((todos) => {
                    expect(todos.length).toBe(0);
                    done();
                }).catch((e) => done(e));
            });
    });

    it('should create a new todo', (done) => {
        var text = 'Todo text from test';

        request(app)
            .post('/todos')
            .send({text})
            .expect(200)
            .expect((response) => {
                expect(response.body.text).toBe(text);
            })
            .end((err, response) => {
                if (err) {
                    return done(err);
                }

                // This assumes database is empty
                Todo.find().then((todos) => {
                    expect(todos.length).toBe(1);
                    expect(todos[0].text).toBe(text);
                    done();
                }).catch((e) => done(e)); // Needed because we expect a promise
            });
    });
});