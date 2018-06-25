const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp',(err, client)=>{
  if(err){
    return console.log('Unable to connect to MongoDB server');
  }
  console.log('Connected to MongoDB server');

  const db = client.db('TodoApp');

// Query data: return documents
//  db.collection('Todos').find({
//    _id: new ObjectID('5b2a36fe99d532285498c3b6')
//  }).toArray().then((docs) =>{
//    console.log('Todos');
//    console.log(JSON.stringify(docs, undefined,2));
// }, (err) =>{
//      console.log('Unable to fetch data', err);
//    });

// Query data: retun no of documents
// db.collection('Todos').find().count().then((count) =>{
//   console.log('Todos');
//   console.log(count);
// }, (err) =>{
//     console.log('Unable to fetch data', err);
//   });

  // Query data: return User = Phuong Phan
   db.collection('Users').find({
     name: 'Andrew'
     // age: 6
   }).toArray().then((docs) =>{
     console.log('Todos');
     console.log(docs);
     // console.log(JSON.stringify(docs, undefined,2));
  }, (err) =>{
       console.log('Unable to fetch data', err);
     });


 // return a cursor
 // console.log( db.collection('Todos').find());
  // client.close();
});
