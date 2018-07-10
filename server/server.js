const express = require('express');
const bodyParser = require('body-parser');
const hbs = require('hbs');
const {ObjectID} = require('mongodb');
const _ = require('lodash');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const config = require('./config/config');
var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} =require('./models/user');
var {authenticate} =require('./middleware/authenticate');

var app = express();
app.set('view engine','hbs');
// console.log(process.env);
const port = process.env.PORT ;

//Parse incoming request bodies in a middleware before your handlers, available under the req.body property
app.use(bodyParser.json());

app.post('/todos',(req,res) => {
  // console.log(req.body);
  var aTodo = new Todo({
      text: req.body.text
  });

  aTodo.save().then((todo) => {
      res.send(todo)
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
      return res.status(404).send('Object not found');
    }
    res.status(200).send(JSON.stringify({todo}, undefined,2));
  }).catch((e) => {
   res.status(400).send();
 });
});

app.delete('/todos/:id',(req, res) => {
  // get the id
  var id = req.params.id;

  // validate id
  if(!ObjectID.isValid(id)){
    return res.status(404).send('ObjectID invalid');
  }

  // remove Todo by id
  Todo.findByIdAndRemove(id).then((todo) => {
    if(!todo){
      return res.status(404).send('todo not found');
    }
    res.status(200).send(todo);
  }).catch((err) => {
    res.status(400).send();
  })
});

app.patch('/todos/:id',(req,res) => {

  var id = req.params.id;
  //Define what to be updated
  var body = _.pick(req.body, ['text', 'completed']);

  // validate
  if(!ObjectID.isValid(id)){
    return res.status(404).send();
  }

  if (_.isBoolean(body.completed) && body.completed){
    body.completedAt = new Date().getTime();
  }else{
    body.completed = false;
    body.completedAt = null;
  }

  // update
  Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((todo) => {
    if(!todo){
      return res.status(404).send();
    }
    res.send({todo});
  }).catch((e) => {
    res.status(400).send(e);
  })

})

app.post('/users',(req,res) => {
  var body = _.pick(req.body, ['email', 'password']);

  var user = new User(body);

  user.save().then(() => {
    return user.generateAuthToken();
  }).then((token) => {
    res.header('x-auth', token).send(user);
  }).catch((e) => {
    res.status(400).send(e);
  })
});

app.post('/users/login', (req, res) => {
  // a user;

  var body = _.pick(req.body, ['email','password']);

  User.findByCredentials(body.email,body.password).then((user) => {
    // console.log(user);
    return user.generateAuthToken().then((token) => {
      res.header('x-auth', token).send(user);
    });
  }).catch((e) => {
    res.status(400).send(e);
  })
});

app.get('/users/me', authenticate, (req,res) => {
    res.send(req.user);
});

app.delete('/users/me/token', authenticate, (req,res) => {
  req.user.removeToken(req.token).then(() => {
    res.status(200).send()
  },() => {
    res.status(400).send();
  });
});

app.listen(port, () => {
  console.log(`Started on port ${port}`);
});

module.exports = {app};
