const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');

const todos = [{
  _id: new ObjectID(),
  text: 'First todo object'
},{
  _id: new ObjectID(),
  text: 'Second todo object'
}
];

// set up database, make sure database is empty

beforeEach((done) =>{
  Todo.remove({}).then(() => {

    return Todo.insertMany(todos);
  }).then(() => done());
});

// done keyword = to test async test.
// Test a success post Todo
describe('POST /todos', () => {
  it('should create a new todo', (done) => {
    var text = 'Text created';
    request(app)
    .post('/todos')
    .send({text})
    .expect(200) // validate post request return 200, and text
    .expect((res) => {
      expect(res.body.text).toBe(text);
    })
    .end((err, res) => {
      if (err)
      {
        return done(err);
      }
      Todo.find({text}).then((todos) => {
        expect(todos.length).toBe(1); // validate if mongodb store the text
        expect(todos[0].text).toBe(text);
        done();
      }).catch((e) => {
        done(e);
      })
    })
  });

  // it('should not create a  todo', (done) => {
  //   var text = '';
  //   request(app)
  //     .post('/todos')
  //     .send({text})
  //     .expect(400)
  //     .end((err,res) => {
  //       if (err) {
  //         return done(err);
  //       }
  //       Todo.find().then((todos) => {
  //         expect(todos.length).toBe(0);
  //         done();
  //       }).catch((e) => {
  //         done(e);
  //       })
  //     })
  //
  // });

});

describe('GET /todos', () => {
  it('should get all todos', (done) => {
    request(app)
      .get('/todos')
      .expect(200)
      .expect((res) => {
        expect(res.body.todos.length).toBe(2);
      })
      .end(done);
  });
});

describe('GET /todo/:id', ()=>{
  it('should return todo doc', (done) => {
    request(app)
      .get(`/todos/${todos[0]._id.toHexString()}`)
      .expect(200)
      .expect((res) => {
        var textObject = JSON.parse(res.text);
        expect(textObject.todo.text).toBe(todos[0].text)
      })
      .end(done)
  });

  it('should return 404 if todo not found', (done) => {
    var newID = new ObjectID();
    request(app)
    .get(`/todos/${newID}`)
    .expect(404)
    .end(done)
  });

  it('should return 404 for non-object id', (done) => {
    var invalidID = '123'
    request(app)
    .get(`/todos/${invalidID}`)
    .expect(404)
    .end(done)
  });

});
