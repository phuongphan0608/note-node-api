const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

//***************Using schema so that methods can be added************
// schema takes an object
var UserSchema = new mongoose.Schema({
    email: {
      type: String,
      required: [true, 'User phone number required'],
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

// override .toJSON to return only data we want to expose to public
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
  var token = jwt.sign({_id: user._id.toHexString, access},'abc123').toString();

  // Output
  // manipulate data
  user.tokens.push({access,token});

  //save data and return token to the method generateAuthToken
  return user.save().then((value) => {
    return token;
  })

}

// create a User Model using UserSchema
var User = mongoose.model('User', UserSchema);


module.exports = {User};
