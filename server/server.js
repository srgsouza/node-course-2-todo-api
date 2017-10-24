require('./config/config');

// libray imports
const express = require('express');
const bodyParser = require('body-parser'); // Takes the string body and turns it into a JSON object.
const {ObjectID} = require('mongodb');
const _ = require('lodash'); // utility functions

// local imports
// ES6 destructuring syntax. Creating the local variable and setting property of the same name in the object
var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');
var {authenticate} = require('./middleware/authenticate');

var app = express();
const port = process.env.PORT;  // Gets the port - Refer to config

// middleware. uses the json() method of the body-parser library.
// .json() method returns a function. This is the middleware which is given to express.
app.use(bodyParser.json());

// the client uses the post http method to create a resource (JSON object) and send it to the server
// the server will take the JSON's text property, create the new model (complete including ID) and send it back to the client
app.post('/todos', (req, res) => {
  // console.log(req.body); // testing. body has the json object, stored by bodyParser
  var todo = new Todo({  // Creates a new instance of the Todo object, defined in the model at todo.js
    text: req.body.text //gets the text property of the body
  });

  todo.save().then((doc) => {  // saves to the db.  then gets the created document, or an error
    res.send(doc);
  }, (e) => {
    res.status(400).send(e); // send status 400 (bad request) along with error msg
  });
});

// GET route for all todos
app.get('/todos', (req, res) => {
  Todo.find().then((todos) => {
    res.send({todos});  // Create an object and specify todos setting equal to the array.  Use this instead of directly passing back an array like res.send(todos), which allows for no flexibility
  }, (e) => {
        res.status(400).send(e);
  });
});

// GET route for IDs - /todos/123456
app.get('/todos/:id', (req, res) => { // use the format './route/:someName'  where someName is passed via the url
  var id = req.params.id;  // This gets the dynamic ':id' parameter from '/todos/id'
  // res.send(req.params);  // testing - gets a json response
  if (!ObjectID.isValid(id)) {  // Checks whether ID has a valid format NOT.  mongoose functionality
    return res.status(404).send(); //  send 404. 'return' stops functin execution.
  }

  Todo.findById(id).then((todo) => {  // Search a todo by ID
    if (!todo) {  // If todo not found in DB
      return res.status(404).send('Todo not found');
    }

    res.send({todo});  // Sends back the todo, as an object - using ES6 object definition syntax (same as 'res.send({todo: todo})')
  }).catch((e) => {
    res.status(400).send();
  });
});

// DELETE route
app.delete('/todos/:id', (req, res) => {
  var id = req.params.id;   // get the id
  if (!ObjectID.isValid(id)) { // validate the id, return 404 if not valid
    return res.status(404).send();   // return status and empty result
  }

  Todo.findByIdAndRemove(id).then((todo) => {  // remove todo by ID
    if (!todo) { // if todo not present, return 404
      return res.status(404).send();
    }

    res.status(200).send({todo});  // if todo found, send 200 and todo
  }).catch((e) => {
    res.status(400).send(); // catch all other errors
  });
});

// PATCH  (http patch method, used to update items)
app.patch('/todos/:id', (req, res) => {
  var id = req.params.id; // get the id
  // body stores the updates.
  // .pick is a lodash function that takes an object and a array of properties. (properties to be updated by the user)
  // this allows control of what the user can update in the app.
  var body = _.pick(req.body, ['text', 'completed']);
  if (!ObjectID.isValid(id)) { // validate the id
    return res.status(404).send();   // return status and empty result
  }

  // Check if todo is to be set to completed
  if (_.isBoolean(body.completed) && body.completed) { // is the 'completed' property a boolean, and is it true?
    body.completedAt = new Date().getTime();  // getTime() returns a javascript timestamp. (number of seconds since 00:00 jan 1st 1970)
  } else {
    body.completed = false;
    body.completedAt = null;
  }

  // ref: findByIdAndUpdate() is similar to what we use on findOneAndUpdate() on the playground/mongodb-update.js
  // update the database with 'body'.  {new: true} is an option that returns the object from the db
  Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((todo) => {
    if (!todo) { // if todo not found
      return res.status(404).send();
    }

    res.send({todo});  // sends back the updated todo
  }).catch((e) => {
    res.status(400).send();
  });
});

// POST /users -> Create a new user
app.post('/users', (req, res) => {
  var body = _.pick(req.body, ['name', 'email', 'password']); // .pick is a lodash function that takes an object and a array of properties.
  var user = new User(body); // creates an instance of the user
  user.save().then(() => {  // saves to the db.  then gets the created document, or an error
    return user.generateAuthToken(); // return because we know we're expecting a chain promise  (?? needs more understanding on my part)
  }).then((token) => {
    // send the token back as an http response header. res.header() takes two key-value pair arguments: name and value
    // for a custom header, use "x-" as the prefix. In this case we're using a jwt token scheme, thus we create a custom header for that value
    res.header('x-auth', token).send(user); // res.header() sets the header
  })
  .catch((e) => {
    res.status(400).send(e);
  });
});

// Private route. requires authentication
// calls the middleware 'authenticate'
app.get('/users/me', authenticate, (req, res) => {
  res.send(req.user);  //
});

// POST /users/login  -> allow existing users to login
app.post('/users/login', (req, res) => {
  var body = _.pick(req.body, ['email', 'password']); // get email and passwords from the request
  // var user = new User(body);  // create an instance of the user.
  User.findByCredentials(body.email, body.password).then((user) => { // Check if user exists in database
    return user.generateAuthToken().then((token) => { // generate a new token for the user
      res.header('x-auth', token).send(user); // res.header() sets the header
    });
    res.send(user);   // send user if successful
  }).catch((e) => {  // send 400 if user not found
    res.status(400).send();
  });

});

app.listen(port, () => {
  console.log(`Started up at port ${port}`);
});

module.exports = {app}; //adding this export to be used in the tests suite
