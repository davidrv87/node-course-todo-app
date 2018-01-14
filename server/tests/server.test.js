"use strict";

const expect  = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

var {app}     = require('../server');
var {Todo}    = require('../models/todo');

var id = '5a59ce6c9af15409929c2266';
const todos = [{
    _id: new ObjectID(id),
    text: 'First todo test'
}, {
    _id: new ObjectID(),
    text: 'Second todo test'
}];

describe('POST /todos', () => {


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
                // console.log(response.body.todos);
                expect(response.body.todos.length).toBe(2);
                // expect(response.body.todos).toInclude({text: 'First todo test'});
                // expect(response.body.todos).toInclude({text: 'Second todo test'});
            })
            .end(done);
    });
});

describe('GET /todos/:id', () => {

    it('should get todo by id (Option 1)', (done) => {
        request(app)
            .get(`/todos/${id}`)
            .expect(200)
            .expect((response) => {
                expect(response.body.todo).toInclude({_id: id});
                expect(response.body.todo._id).toBe(id);
                expect(response.body.todo.text).toBe(todos[0].text);
            })
            .end(done);
    });

    it('should get todo by id (Option 2)', (done) => {
        request(app)
            .get(`/todos/${todos[1]._id.toHexString()}`) // toHexString() converts to String
            .expect(200)
            .expect((response) => {
                expect(response.body.todo._id).toBe(todos[1]._id.toHexString());
                expect(response.body.todo.text).toBe(todos[1].text);
            })
            .end(done);
    });

    it('should not accept invalid ID', (done) => {
        var invalidID = '12345';
        request(app)
            .get(`/todos/${invalidID}`)
            .expect(404)
            .expect(`ID ${invalidID} is not valid`)
            .end(done);
    });

    it('should inform todo is not found', (done) => {
        var notFoundID = new ObjectID().toHexString();
        request(app)
            .get(`/todos/${notFoundID}`)
            .expect(404)
            .expect('Todo not found')
            .end(done);
    });
});