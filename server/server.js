// libray imports
var express = require('express');
var bodyParser = require('body-parser'); // Takes the string body and turns it into a JSON object.
const {ObjectID} = require('mongodb');

// local imports
// ES6 destructuring syntax. Creating the local variable and setting property of the same name in the object
var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

var app = express();
const port = process.env.PORT || 3000;  // Needed if running on Heroku instead of local

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
  console.log(`Started up at port ${port}`);
}) ;

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
  var id = req.params.id;  // This gets the dynamic ':id' parameter from '/todos/:id'
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


module.exports = {app}; //adding this export to be used in the tests suite
