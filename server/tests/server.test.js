const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');


// set up database, make sure database is empty
beforeEach((done) =>{
  Todo.remove({}).then(() => done());
});


// done keyword = to test async test.
// Test a success post Todo
describe('POST /todos', () => {


  it('should create a new todo', (done) => {
    var text = 'Test todo text 1';
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
      Todo.find().then((todos) => {
        expect(todos.length).toBe(1); // validate if mongodb store the text
        expect(todos[0].text).toBe(text);
        done();
      }).catch((e) => {
        done(e);
      })
    })
  });

  it('should not creat a  todo', (done) => {
    var text = '';
    request(app)
      .post('/todos')
      .send({text})
      .expect(400)
      .end((err,res) => {
        if (err) {
          return done(err);
        }
        Todo.find().then((todos) => {
          expect(todos.length).toBe(0);
          done();
        }).catch((e) => {
          done(e);
        })
      })

  });
});
