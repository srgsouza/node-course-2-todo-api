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

  // // find() returns a cursor (pointer) to the documents.
  // // toArray() is a cursor method that returns an array of the documents, it returns a promise. Thus we can add a .then() call
  // // db.collection('Todos').find({completed: false}).toArray().then((docs) => {  // example: here we fetch only the items not completed
  // // db.collection('Todos').find({_id: '59d6a7deceecd7f477daef3c'}).toArray().then((docs) => {  // this does not work, '_id' is not a string, but an object
  // db.collection('Todos').find({
  //   _id: new ObjectID('59d6a7deceecd7f477daef3c')  // must put the string inside the _id constructor function
  // }).toArray().then((docs) => {  // for other cursor methods: http://mongodb.github.io/node-mongodb-native/2.2/api/Cursor.html
  //   console.log('Todos');
  //   console.log(JSON.stringify(docs, undefined, 2));
  // }, (err) => {
  //   console.log('Unable to fetch todos', err);
  // });

  // // Using the count method
  // db.collection('Todos').find().count().then((count) => {  // for other cursor methods: http://mongodb.github.io/node-mongodb-native/2.2/api/Cursor.html
  //   console.log(`Todos count: ${count}`);
  // }, (err) => {
  //   console.log('Unable to fetch todos', err);
  // });

  // // fetching records for a specific user
  // db.collection('Users').find({name: 'mara'}).toArray().then((docs) => {
  //   console.log(`Todos for user Mara: ${docs}`, docs);
  // }, (err) => {
  //   console.log('Unable to fetch user', err);
  // });
  
  // db.close();
 });
