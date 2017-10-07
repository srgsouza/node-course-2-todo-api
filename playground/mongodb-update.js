// Connects to a mongodb database and fetches data

// var user = {name: 'andrew', age: 25 };
// var {name} = user;   //example of object destructure in ES6
// console.log(name);

// const MongoClient = require('mongodb').MongoClient;
// const {MongoClient} = require('mongodb'); //Object destructure in ES6. Creates const and assign a value. Same as code above.
const {MongoClient, ObjectID} = require('mongodb'); // can creates multiple constants/variables


// Mongo allows to connec to database 'TodoApp' even if it is not yet created
MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err) {
    return console.log('Unable to connect to MongoDB server');  //return stops the code if error is found
  }
  console.log('Connected to MongoDB server');

  // // findOneAndUpdate(filter, update, options, callback)   - returns a promise if no callback is passed
  // db.collection('Todos').findOneAndUpdate({
  //   _id: new ObjectID('59d835535110382b71faea36'),
  //   // for updade operators: https://docs.mongodb.com/manual/reference/operator/update/
  // }, {
  //   $set: {
  //     completed: true
  //   }
  // }, {
  //   returnOriginal: false
  // }).then((result) => {
  //   console.log(result);
  // });

  db.collection('Users').findOneAndUpdate({
    _id: new ObjectID('59d83414c9b3602b3acd197a'),
  }, {
    $set: {
      name: 'chelsea'
    },
    $inc: {
      age: 1
    }
  }, {
    returnOriginal: false
  }).then((result) => {
    console.log(result);
  });
  // db.close();
 });
