
const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

var id = '59dba9b52ffe1ae58b4dfe6e';

// var id = '59dfe9fd582cfb5d4bd33537a'; // todo ID example
// if (!ObjectID.isValid(id)) {
//   console.log('ID not valid');
// }

// Todo.find({ // returns an array with all matching documents - See http://mongoosejs.com/docs/queries.html for details
//   _id: id  // mongoose doesn't require IDs to be passed as object. a string can be provided and mongoose will convert it to an object
// }).then((todos) => {
//   console.log('Todos', todos);
// });
//
// Todo.findOne({ // returns only one result, even if there are multiple matches - returns the document instead of an array
//   _id: id  // mongoose doesn't require IDs to be passed as object. a string can be provided and mongoose will convert it to an object
// }).then((todo) => {
//   console.log('Todo', todo);
// });
//
// Todo.findById(id).then((todo) => {  // finds by ID
//   if (!todo) {  // if ID format is valid, but not present in the DB
//     return console.log('ID not found');
//   }
//   console.log('Todo by ID', todo);
// }).catch((e) => console.log(e));  // gets here if ID is not valid


User.findById(id).then((user) => {
  if (!user) {
    return console.log('User not found');
  }
  console.log('User', user);
}).catch((e) => console.log(e));
