"use strict";

const expect  = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

var {app}     = require('../server');
var {Todo}    = require('../models/todo');

const todos = [{
    _id: new ObjectID(),
    text: 'First todo test'
}, {
    _id: new ObjectID(),
    text: 'Second todo test',
    completed: true,
    completedAt: 333
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
    it('should get todo by id', (done) => {
        var id = todos[1]._id.toHexString();
        request(app)
            .get(`/todos/${id}`) // toHexString() converts to String
            .expect(200)
            .expect((response) => {
                expect(response.body.todo._id).toBe(id);
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

describe('PATCH /todos/:id', () => {
    it('should update a todo with completed', (done) => {
        var id = todos[0]._id.toHexString();
        var text = 'Text updated for todo 1';

        request(app)
            .patch(`/todos/${id}`)
            .send({
                text,
                completed: true
            })
            .expect(200)
            .expect((response) => {
                expect(response.body.todo.text).toBe(text);
                expect(response.body.todo.completed).toBeTruthy();
                expect(response.body.todo.completedAt).toBeA('number');
            })
            .end(done);
    });

    it('should clear completedAt when todo is not completed', (done) => {
        var id = todos[1]._id.toHexString();
        var text = 'Text updated for todo 2';

        request(app)
            .patch(`/todos/${id}`)
            .send({
                text,
                completed: false
            })
            .expect(200)
            .expect((response) => {
                expect(response.body.todo.text).toBe(text);
                expect(response.body.todo.completed).toBeFalsy();
                expect(response.body.todo.completedAt).toNotExist();
            })
            .end(done);

    });
});

describe('DELETE /todos/:id', () => {
    it('should delete a todo by id', (done) => {
        var id = todos[0]._id.toHexString();
        request(app)
            .delete(`/todos/${id}`)
            .expect(200)
            .expect((response) => {
                expect(response.body.todo._id).toBe(id);
            })
            .end((err, response) => {
                if (err) {
                    return done(err);
                }

                Todo.findById(id).then((todo) => {
                    expect(todo).toNotExist();
                    done();
                }).catch((err) => done(err));
            });
    });

    it('should return 404 for not found id', (done) => {
        var id = new ObjectID();

        request(app)
            .delete(`/todos/${id}`)
            .expect(404)
            .expect(`ID ${id} not found`)
            .end(done);
    });

    it('should return 404 for invalid', (done) => {
        var id = '123abc';

        request(app)
            .delete(`/todos/${id}`)
            .expect(404)
            .expect(`ID ${id} is not valid`)
            .end(done);
    });
});





