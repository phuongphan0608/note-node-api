const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');

const {Todo} = require('./../../models/todo');
const {User} = require('./../../models/user');


const userOneId = new ObjectID();
const userSecondId = new ObjectID();
const users = [{
  _id: userOneId,
  email: 'phuongphan0608@gmail.com',
  password: 'userOnePass',
  tokens: [{
    access: 'auth',
    token: jwt.sign({_id: userOneId, access: 'auth'}, 'abc123').toString()
  }]
},{
  _id: userSecondId,
  email: 'andrew@gmail.com',
  password: 'userSecondPass'
}];


// Create test data
const todos = [{
  _id: new ObjectID(),
  text: 'First todo object'
},{
  _id: new ObjectID(),
  text: 'Second todo object'
},{
  _id: new ObjectID(),
  text: 'Third todo object'
}];

const populateTodos = (done) => {
  Todo.remove({}).then(() => {
    return Todo.insertMany(todos);
  }).then(() => done());
};

const populateUsers = (done) => {
  User.remove({}).then(() => {
    // return User.insertMany(users);
  var userOne = new User(users[0]).save();
   var userTwo = new User(users[1]).save();

   return Promise.all([userOne, userTwo]);
 }).then(() => done());

};


module.exports = {todos, populateTodos,users, populateUsers};
