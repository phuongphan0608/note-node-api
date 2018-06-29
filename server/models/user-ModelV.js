const mongoose = require('mongoose');
const validator = require('validator');
// {
//   email: 'phuongphan0608@gmail.com',
//   password: 'abcdgeag',
//   tokens: [{
//     access: 'auth',
//     token: 'Token strings'
//   }]
// }

var User = mongoose.model('User',{
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

module.exports = {User};
