"use strict";

const expect  = require('expect');
const request = require('supertest');

var {app}     = require('../server');
var {Todo}    = require('../models/todo');

describe('POST /todos', () => {

    const todos = [{
        text: 'First todo test'
    }, {
        text: 'Second todo test'
    }];

    beforeEach((done) => {
        // Empty the collection before each test and put some dummy data
        Todo.remove({})
            .then(() => {
                return Todo.insertMany(todos);
            })
            .then(() => done());
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
                Todo.find({text}).then((todos) => {
                    expect(todos.length).toBe(1);
                    expect(todos[0].text).toBe(text);
                    done();
                }).catch((e) => done(e)); // Needed because we expect a promise
            });
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
                    expect(todos.length).toBe(2);
                    done();
                }).catch((e) => done(e));
            });
    });
});

describe('GET /todos', () => {
    it('should get all todos', (done) => {
        request(app)
            .get('/todos')
            .expect(200)
            .expect((response) => {
                console.log(response.body.todos);
                expect(response.body.todos.length).toBe(2);
                // expect(response.body.todos).toInclude({text: 'First todo test'});
                // expect(response.body.todos).toInclude({text: 'Second todo test'});
            })
            .end(done);
    });
});