var express = require('express');
var bodyParser = require('body-parser');


var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} =require('./models/user');

var app = express();

//post route,
//Parse incoming request bodies in a middleware before your handlers, available under the req.body property
app.use(bodyParser.json());

app.post('/todos',(req,res) => {
  // console.log(req.body);
  var Todo = new Todo({
      text: req.body.text
  });

  Todo.save().then((doc) => {
      res.send(doc)
    },(e) => {
  console.log('Unable to save todo',e);
});




});


app.listen(3000, () => {
  console.log('Started on port 3000');
});
