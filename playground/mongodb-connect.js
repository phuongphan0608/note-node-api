// This is mongo client
// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

var obj = new ObjectID();
console.log(obj);
//ES6 Object desctructuring
// var user = {name: 'Phuong', age:37};
// var {name} = user;
// console.log(name);


MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client)=>{
  if(err){
    return console.log('Unable to connect to MondoDB server');
  }
  console.log('Connected to MongoDB server');
  const db = client.db('TodoApp');
  // db.collection('Todos').insertOne({
  //   text: 'Something to do',
  //   completed: false
  // },(err, result)=>{
  //   if(err){
  //     return console.log('Unable to insert to do',err);
  //   }
  //   console.log(JSON.stringify(result.ops, undefined,2));
  // });

  // db.collection('Users').insertOne({
  //   name: 'Phuong Phan',
  //   age: 36,
  //   location: 'HCMC'
  // },(err,result) =>{
  //   if(err){
  //     return console.log('Unable to insert to Users ', err);
  //   }
  //   console.log(JSON.stringify(result.ops, undefined, 2));
  //   console.log(result.ops[0]._id.getTimestamp());
  // });
  client.close();
});
