const {ObjectID} = require('mongodb');
const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

// Find a todo
var id = '5b30b1a83f28443b4ba4e2fa';

if (!ObjectID.isValid(id)) {
  console.log('ID not valid');
}
// Todo.find({
//   _id: id
// }).then((todos) => {
//   console.log('Todos ', todos);
// });
//
// Todo.findOne({
//   _id: id
// }).then((todo) => {
//   console.log('Todo ', todo);
// });

Todo.findById(id).then((todo) => {
  if(!todo){
    return console.log('Id not found');;
  }
  console.log('Todo By id ', todo);
}).catch((e) => console.log(e));

// Find a user
var user_id = '5b2f1c207cabce3264574d3d';

if (!ObjectID.isValid(user_id)) {
  console.log('user_id not valid');
}

User.findById(user_id).then((user) =>
  {if (!user) {
    console.log('Unable to find user');
  }
  console.log('User : ', JSON.stringify(user, undefined,2));
}).catch((e) => console.log(e));
