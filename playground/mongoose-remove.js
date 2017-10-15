
const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

// // Todo.remove({})  removes all documents
// Todo.remove({}).then((result) => {
//   console.log(result);
// });
//
// // removes one and returt it

// // Todo.findOneAndRemove()
// Todo.findOneAndRemove({_id:'59e210e7405e091f6a03bae2'}).then((todo) => {
//
// });
// remove by ID
Todo.findByIdAndRemove('59e210e7405e091f6a03bae2').then((todo) => {
  console.log(todo);
});
