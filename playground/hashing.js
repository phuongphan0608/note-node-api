const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

var password = '123abc!';

bcrypt.genSalt(10, (err,salt) => {
  bcrypt.hash(password,salt, (err, hash) => {
    // console.log(hash);
    return hash;
  })
});

bcrypt.compare(password,'$2a$10$U2OjxoUhFbffjT42YhLZ4uIKVuVPYQovsRrkWxp15/fjYpG264Q6C',(err,res) => {
  console.log(res);
});




//*********Demonstation jsonwebtoken**********************
// var data = {
//   id: 1
// }
//
// // Create a token
// var token = jwt.sign (data, '123abc');
// console.log(token);
//
// // Verify the token
// var decoded = jwt.verify(token, '123abc');
// console.log('decoded ', decoded);


//*********Demonstation Hashing**********************
// var message = 'I am user number 3';
// var hash = SHA256(message).toString();
// console.log('message', message);
// console.log('hash: ',hash);

// var data = {
//   id: 5
// };
//
// var token = {
//   data,
//   hash: SHA256(JSON.stringify(data) + 'somesecret').toString()
// };
//
// // Hacking, manipulate data and send back to server
// token.data.id = 6;
// token.hash = SHA256(JSON.stringify(token.data)).toString();
//
// var resultHash = SHA256(JSON.stringify(token.data) + 'somesecret').toString();
//
// if (resultHash === token.hash) {
//   console.log('Data was not changed');
// } else {
//   console.log('Data was changed. Do not trust!');
// }
//***************************************************
