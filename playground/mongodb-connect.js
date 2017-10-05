// Connects to a mongodb database and insert data

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

  // // inserts data to a collection. Create the collection if not yet present
  // db.collection('Todos').insertOne({
  //   text: 'Something to do',
  //   completed: false
  // }, (err, result) => {
  //   if (err) {
  //     return console.log('Unable to insert todo', err);
  //   }
  //
  //   console.log(JSON.stringify(result.ops, undefined, 2));  //ops attribute stores all of the docs that we insert
  // });

  // // Insert new doc into Users collection (name, age, location)
  // db.collection('Users').insertOne({
  //   name: 'mara',
  //   age: 28,
  //   location: 'albuquerque'
  // }, (err, result) => {
  //   if (err) {
  //     return console.log('Unable to create user', err);
  //   }
  //   // console.log(JSON.stringify(result.ops, undefined, 2));
  //   console.log(result.ops[0]._id.getTimeStamp()); // '_id' has built in values, such as timestamp
  // });

  db.close();
 });
