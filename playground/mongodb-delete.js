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

  // // deleteMany
  // db.collection('Todos').deleteMany({text: 'Eat dinner'}).then((result) => {
  //   console.log(result);
  // });

  // // deleteOne
  // db.collection('Todos').deleteOne({text: 'Eat dinner'}).then((result) => {
  //   console.log(result);
  // });

  // // findOneAndDelete
  // db.collection('Todos').findOneAndDelete({completed: true}).then((result) => {
  //   console.log(result);
  // });


  // db.collection('Users').deleteMany({name: 'jesse'}).then((result) => {
  //   console.log(results);
  // });

  db.collection('Users').findOneAndDelete({
    _id: new ObjectID('59d69fd9e049231ae66c8cca')
  }).then((result) => {
    console.log(result);
  }, (err) => {
    console.log('unable to find/delete', err);
  });

  // db.close();
 });
