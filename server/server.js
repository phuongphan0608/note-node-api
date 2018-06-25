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
  var aTodo = new Todo({
      text: req.body.text
  });

  aTodo.save().then((doc) => {
      res.send(doc)
    },(e) => {
      res.status(400).send(e);
  // console.log('Unable to save todo',e);
});
});


app.listen(3000, () => {
  console.log('Started on port 3000');
});

module.exports = {app};
