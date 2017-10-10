// libray imports
var express = require('express');
var bodyParser = require('body-parser'); // Takes the string body and turns it into a JSON object.

// local imports
// ES6 destructuring syntax. Creating the local variable and setting property of the same name in the object
var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

var app = express();

// middleware. uses the json() method of the body-parser library.
// .json() method returns a function. This is the middleware which is given to express.
app.use(bodyParser.json());

// the client uses the post http method to create a resource (JSON object) and send it to the server
// the server will take the JSON's text property, create the new model (complete including ID) and send it back to the client
app.post('/todos', (req, res) => {
  // console.log(req.body); // testing. body has the json object, stored by bodyParser
  var todo = new Todo({
    text: req.body.text //gets the text property of the body
  });

  todo.save().then((doc) => {  // saves to the db.  then sends the created document, or an error
    res.send(doc);
  }, (e) => {
    res.status(400).send(e); // send status 400 (bad request) along with error msg
  });
});
app.listen(3000, () => {
  console.log('Started on port 3000');
}) ;
