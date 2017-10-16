// Database connection

// Mongoose facilitates the interaction with Mongo DB
// It manages aspects such as timing/order of calls.
var mongoose = require('mongoose');

// Tell mongoose which promise library to use (mongoose supports callbacks by default, but we want to use promises)
mongoose.Promise = global.Promise;
// connects to the mongodb database. MONGODB_URI holds the database uri. 
mongoose.connect(process.env.MONGODB_URI, {
  // keepAlive: true,
  // reconnectTries: Number.MAX_VALUE,
  useMongoClient: true
}); // connect to the db on remote server or in local db


module.exports = {mongoose};  // export the object to be used by other files. Syntax is used for object/property that have the same name
