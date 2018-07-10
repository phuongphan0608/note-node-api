const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');
//***************Using schema so that methods can be added************
// schema takes an object
var UserSchema = new mongoose.Schema({
    email: {
      type: String,
      required: [true, 'User email required'],
      trim: true,
      minlength:1,
      unique: true,
      validate:{
        validator: (v) => {
          return validator.isEmail(v)
        },
        message: '{VALUE} is not a valid email!'
      }
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    tokens: [{
      access: {
        type: String,
        required: true
      },
      token: {
        type: String,
        required: true
      }
    }]
});

// override .toJSON to return only User object we want to expose to public
UserSchema.methods.toJSON = function () {
  var user = this;
  var userObject = user.toObject();
  return _.pick(userObject, ['_id', 'email']);
}

// Define methods for UserSchema
UserSchema.methods.generateAuthToken = function () {
  // Input
  var user = this;
  var access = 'auth';
  var token = jwt.sign({_id: user._id.toHexString(), access},'abc123').toString();

  // Output
  // manipulate data
  // user.tokens.remove();
  user.tokens = [];
  user.tokens.push({access,token});

  //save data and return token to the method generateAuthToken
  return user.save().then(() => {
    return token;
  })
};

UserSchema.statics.findByCredentials = function (email,password) {
  var User = this;

  return User.findOne({email}).then((user) => {
    if(!user){
      return Promise.reject();
    }
    return new Promise((resolve, reject) => {
      bcrypt.compare(password, user.password, (err,res) => {
        if(res){
          resolve(user);
        }else {
            reject();
        }
      });

      });
    });
  };

UserSchema.methods.removeToken = function (token) {
  var user = this;
  return user.update({
    $pull: {
      tokens:{
        token
      }
    }
  });
};
UserSchema.statics.findByToken = function (token) {
  var User = this;
  var decoded;

  try {
    decoded = jwt.verify(token, 'abc123');
  } catch (e) {
    return Promise.reject();
  }

  return User.findOne({
    '_id': decoded._id,
    'tokens.token': token,
    'tokens.access': 'auth'
  });

}

UserSchema.pre('save',function (next) {
  var user = this;
  // return User.findOne({email: user.email}).then((u) => {
  //   if(!u){
      if (user.isModified('password')) {
        bcrypt.genSalt(10,(err, salt) => {
          bcrypt.hash(user.password,salt, (err, hash) => {
            user.password = hash;
            next();
          })
        })
      }else {
        next();
      }
  //   }
  // })


})
// create a User Model using UserSchema
var User = mongoose.model('User', UserSchema);


module.exports = {User};
