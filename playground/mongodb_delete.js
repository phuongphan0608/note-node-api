const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp',(err, client)=>{
  if(err){
    return console.log('Unable to connect to MongoDB server');
  }
  console.log('Connected to MongoDB server');

  const db = client.db('TodoApp');

  // DeleteMany
  // db.collection('Todos').deleteMany({text: 'Eat lunch'}).then((result) => {
  //   console.log(result);
  // })



  //DeleteOne
  // db.collection('Todos').deleteOne({text: 'Eat dinner'}).then((result) => {
  //   console.log(result);
  // });

  // findOneAndDelete
  // db.collection('Todos').findOneAndDelete({text: 'Eat lunch'}).then((result) => {
  //   console.log(result);
  // });

  // delte duplicate users
  // db.collection('Users').deleteMany({name: 'Phuong Phan'});

  db.collection('Users').findOneAndDelete({_id: new ObjectID('5b2b0370fddf90295ef84011')}).then((result) => {
    console.log(result);
  });
  // client.close();
});
