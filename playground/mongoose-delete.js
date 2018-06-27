const {ObjectID} = require('mongodb');
const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

// Find a todo
var id = '5b32478b5224ee4cea7bee65';

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

// Todo.remove({
//   // _id: '5b32064ad1148847bfc68ecb'
//   // text: 'Second todo object'
// }).then((result) => {console.log(result)});

// Todo.findOneAndRemove({
//   _id: id
// }).then((result) => {
//   console.log(result);
// })

Todo.findByIdAndRemove({
  _id: id
}).then((todo) => {
  console.log(todo);
})
