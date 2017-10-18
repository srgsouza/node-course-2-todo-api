
const {SHA256} = require('crypto-js');  // gets the encryption property SHA256
const jwt = require('jsonwebtoken');

var data = {
  id: 10
};

// JWT sign returns a token. takes and object and a secret.
var token = jwt.sign(data, '123abc');
console.log(token);

var decoded = jwt.verify(token, '123abc');
console.log('decoded', decoded);



// Instead of writing code, like bellow, to authenticate, we use JWT!

// var message = 'I am user number 3';
// var hash = SHA256(message).toString(); // hashes a message and convert the object to a string
//
// console.log(`Message: ${message}`);
// console.log(`Hash: ${hash}`);
//
// var data = {
//   id: 4  // this would represend the user id inside the user.js collection/model.
// };
// var token = {  // this is send back to the user/client
//   data,
//   //passes a string and a 'somesecret'  to SHA256 to get it hashed. This 'somesecret' is the salt
//   hash: SHA256(JSON.stringify(data) + 'somesecret').toString()
// };
//
// // data manipulation
// token.data.id = 5;
// token.hash = SHA256(JSON.stringify(token.data)).toString();
//
//
// var resultHash = SHA256(JSON.stringify(token.data) + 'somesecret').toString();
// // verifying whether the data was manipulated
// if (resultHash === token.hash) {
//   console.log('Data was not changed. Good!');
// } else {
//   console.log('Data was changed. Do not trust!');
// }
