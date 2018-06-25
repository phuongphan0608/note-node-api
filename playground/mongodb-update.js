const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp',(err, client)=>{
  if(err){
    return console.log('Unable to connect to MongoDB server');
  }
  console.log('Connected to MongoDB server');

  const db = client.db('TodoApp');

  db.collection('Users').findOneAndUpdate({
    _id: new ObjectID('5b2a3fcfdc334628ab83888b')
  }, {
      $set: {
        name: 'Phuong P1'
      },
      $inc: {
        age: +2
      }
  }, {
    returnOriginal: false
  }).then((result) => {
    console.log(result);
  });
  // client.close();
});
