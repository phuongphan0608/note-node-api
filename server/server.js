const express = require('express');
const bodyParser = require('body-parser');
const hsb = require('hbs');
const {ObjectID} = require('mongodb');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} =require('./models/user');

var app = express();
app.set('view engine','hbs');

const port = process.env.PORT || 3000;
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

app.get('/todos', (req,res) =>{
  Todo.find().then((todos) => {
    // var todos = res.send(JSON.stringify({todos}));
    res.send({todos});
    // res.render('todos.hbs',(text) => {
    //   console.log(res.body);
    // })

  }
  ,(e) => {
    res.status(400).send(e)
  });
});


app.get('/todos/:id',(req, res) => {
  // res.send(req.params);
  var id = req.params.id;

  // Valid id using isValid
  // 404 - send back empty send
  if (!ObjectID.isValid(id)) {
    return res.status(404).send('Object id is invalid');
  }

  Todo.findById(id).then((todo) => {

    if (!todo) {
      return res.status(404).send();
    }
    res.status(200).send(JSON.stringify({todo}, undefined,2));
  }).catch((e) => {
   res.status(400).send();
 });
});

app.listen(port, () => {
  console.log(`Started on port ${port}`);
});

module.exports = {app};
