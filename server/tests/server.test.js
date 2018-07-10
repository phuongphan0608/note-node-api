const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');
const _ = require('lodash');
const bcrypt = require('bcryptjs');
const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');
const {todos, populateTodos, users, populateUsers} = require('./seed/seed');


// set up database, make sure database is empty
// beforeEach((done) =>{
//   Todo.remove({}).then(() => {
//
//     return Todo.insertMany(todos);
//   }).then(() => done());
// });
beforeEach(populateUsers);
beforeEach(populateTodos);

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
        expect(res.body.todos.length).toBe(3);
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

  // it('should return 404 if todo not found', (done) => {
  //   var idNew = new ObjectID();
  //   request(app)
  //   .get(`/todos/${idNew}`)
  //   .expect(404)
  //   .end(done)
  // });

  it('should return 404 for non-object id', (done) => {
    var idInvalid = '123'
    request(app)
    .get(`/todos/${idInvalid}`)
    .expect(404)
    .end(done)
  });

});

describe('DELETE /todos/:id', () =>{
  it('should remove a todo', (done) => {
    var idExist = todos[1]._id.toHexString();
    // var message = 'todo not found';
    request(app)
      .delete(`/todos/${idExist}`)
      .expect(200)
      .expect((res) => {
        // var todoObject = JSON.parse(res.text);
        expect(res.body._id).toBe(idExist);
      })
      .end((err, res) => {
        if(err){
          return done(err);
        }
        // query database using findById toNotExist
        // expect null
        Todo.findById(idExist).then((todo) => {
          expect(todo).toBe(null)
          return done();
        }).catch((err) => done(err));
      })
  });

  it('should return 404 if todo not found', (done) => {
    var idNotExist = '6b33042cd2c9a34fd9279a78';
    var message = 'todo not found';
    request(app)
      .delete(`/todos/${idNotExist}`)
      .expect(404)
      .expect((res) => {
        expect(res.text).toBe(message)
      })
      .end(done)
  });

  it('should return 404 if object id is invalid', (done) => {
    var idInvalid = '123';
    var message = 'ObjectID invalid';
    request(app)
      .delete(`/todos/${idInvalid}`)
      .expect(404)
      .expect((res) => {
        expect().toBe()
      })
      .end(done)
  });
});

describe('PATCH /todos/:id', () => {
  it('should update the todo', (done) => {
    var hexId = todos[0]._id.toHexString();
    var text = 'This should be the new text';
    request(app)
      .patch(`/todos/${hexId}`)
      .send({
        completed:true,
        text
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(text)
        expect(res.body.todo.completed).toBe(true)
        expect(typeof res.body.todo.completedAt).toBe('number');
      })
      .end(done)
  });

  it('should clear completedAt when todo is not completed', (done) => {
    var hexId = todos[0]._id.toHexString();
    var completed = false;

    request(app)
      .patch(`/todos/${hexId}`)
      .send({
        completed//: false
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.completed).toBe(false)
        expect(res.body.todo.completedAt).toBe(null);
      })
      .end(done)
  });
});

// describe('POST /users', () => {
//   it('Should post an user', (done) => {
//     var aUser = users[1];
//     // var body = _.pick(aUser, ['email', 'password']);
//     request(app)
//     .post('/users')
//     .send(users[1])
//     .expect(200)
//     .end(done);
//   });
//
// })
// ;

describe('GET /users/me', () => {
  it('Should return user if authenticated', (done) => {
    request(app)
    .get('/users/me')
    .set('x-auth', users[0].tokens[0].token)
    .expect(200)
    .expect((res) => {
      expect(res.body._id).toBe(users[0]._id.toHexString());
      expect(res.body.email).toBe(users[0].email);
    })
    .end(done)
  });

  it('Should return 401 if not authenticated', (done) => {
    request(app)
    .get('/users/me')
    // .set ('x-auth', users[0].tokens[0].token)
    .expect(401)
    .expect((res) => {
      expect(res.body).toEqual({});
    })
    .end(done);
  });

});
describe('POST /users', () => {
  it('should create a user', (done) => {
    var email = 'example@example.com';
    var password = '123mnb';

    request(app)
      .post('/users')
      .send({email,password})
      .expect(200)
      .expect((res) => {
        // check the response
        expect(res.headers['x-auth']).toBeTruthy();
        expect(res.body.email).toBe(email);
        expect(res.body._id).toBeTruthy();
      })
      .end((err) => {
        // check the database
        if (err) {
          return done(err);
        }

        User.findOne({email}).then((user) => {
          expect(user).toBeTruthy();
          expect(user.password).not.toBe(password);
          done();
        });

      });
  });

  it('should return validation errors if request invalid', (done) => {
      var email = 'Andrew@gmail.com';
      var password = 'password';

      request(app)
        .post('/users')
        .set({email,password})
        .expect(400)
        .expect((res) => {
          expect(res.body._message).toBe('User validation failed');
          expect(res.body.message).toBe(`User validation failed: password: Path \`${password}\` is required., email: User email required`);
        })
        .end(done);
  });

  it('should not create user if email in use', (done) => {
    var email = 'phuongphan0608@gmail.com';
    var password = 'passwordnmb';

    request(app)
      .post('/users')
      .set({email,password})
      .expect(400)
      .expect((res) => {
        expect(res.body._message).toBe('User validation failed')
      })
      .end(done)
  });
});

describe('POST /users/login', () => {
  it('should login successfully', (done) => {
    var email = users[0].email;
    var password = 'userOnePass';

    request(app)
    .post('/users/login')
    .send({email, password})
    .expect(200)
    .expect((res) => {
      expect(res.body.email).toBe(email);
      // expect(res.body._id).toBe()
    })
    .end((err) => {
      if (err) {
        return done(err);
      }

      User.findOne({email}).then((user) => {
        var compare = bcrypt.compare(user.password,password);//.then((result) => {return result});
        expect(compare).toBe(true);
        done();
      })
    })

  });
});
