// Database connection

// Mongoose facilitates the interaction with Mongo DB
// It manages aspects such as timing/order of calls.
var mongoose = require('mongoose');

// Tell mongoose which promise library to use (mongoose supports callbacks by default, but we want to use promises)
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/TodoApp'); // connect to the db


module.exports = {mongoose};  // export the object to be used by other files. Syntax is used for object/property that have the same name
