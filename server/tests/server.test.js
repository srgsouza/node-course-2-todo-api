// Test suite
// Test cases for '/todos'
// Such as ... Verify that when correct data is sent, we get back a 200 with complete doc including the ID
// and if we send bad data we get a code 400

const expect = require('expect'); // test assertions
const request = require('supertest'); // test express routes
const {ObjectID} = require('mongodb'); // needed to create the ID object of the mongo DB

const {app} = require('./../server'); // ES6 destructuring syntax (set app property to the app variable) - access to the express app
const {Todo} = require('./../models/todo'); // access to the Todo model (based on mongoose)

// dummy array of objects
const todos = [{
  _id: new ObjectID(),
  text:'First test todo'
}, {
  _id: new ObjectID(),
  text:'Second test todo'
}];

beforeEach((done) => { // before each time the test is run...
  Todo.remove({}).then(() => { // remove all items from the db
    // done();
    return Todo.insertMany(todos);  // insert objects from the previously created todos array. return the response to allow chain callbacks
  }).then(() => done());  // expression syntax - not sure how to explain this
});

describe('POST /todos', () => { // describe and group the tests. This one is for the POST routes.
  it('should create a new todo', (done) => { // 'it' is a mocha functionalilty. We use 'done', mocha property, to test async functions
    var text = 'Test todo text';
    request(app) // supertest functionalilty. Calls app
      .post('/todos') // specify the request type
      .send({text}) // sends the data (object). It gets converted to JSON by supertest.  {text} is same as text: text
      .expect(200) // assertion
      .expect((res) => { // assert that result (body that comes back) is an object that has the text property specified above
        expect(res.body.text).toBe(text); // expect functionality - https://github.com/mjackson/expect
      })
      .end((err, res) => { //instead of .end(done), call it with a callback function. To check for error and test the an err and res
        if (err) {
          return done(err); // if err, this wraps up the test and send msg to the screen
        }
        Todo.find({text}).then((todos) => { // fetch the created todo, then callback with a parameter and make assertions with such parameter
          expect(todos.length).toBe(1); // expect 1 todo exactly, because we add 1 todo item above. (note we delete all items before test is run)
          expect(todos[0].text).toBe(text); // expect object to have a text property just like we specified above
          done();
        }).catch((e) => done(e)); // catch detects any errors that might occur inside  the callbacks. chose to use statement syntax here
      });
  });

  it('should NOT create todo with invalid body data', (done) => {
    var text = '';  // text with empty string - should not pass the checks in the todo model
    request(app)
      .post('/todos')
      .send({text})
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        Todo.find().then((todos) => {
          expect(todos.length).toBe(2);
          done();
        }).catch((e) => {
          done(e);
        });
      });

  });
});

describe('GET /todos', () => { // describe and group the tests. This one is for the POST routes.
  it('should fetch all todos', (done) => {
    request(app)
      .get('/todos')
      .expect(200)
      .expect((res) => {
        expect(res.body.todos.length).toBe(2);
      })
      .end(done);
  });
});

describe('GET /todos:id', () => {  // requires a document with an ID - create/add such ID in this test file
  it('should return todo doc', (done) => {
    request(app)
      .get(`/todos/${todos[0]._id.toHexString()}`) // fetch the '_id' object from the todos array, and convert it to a string.
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(todos[0].text);  // 'todo' is waht comes back. see 'res.send({todo});' in findById function on server.js
      })
      .end(done);
  });

  it('should return a 404 if todo not found', (done) => {
    var hexID = new ObjectID().toHexString(); // create a new object id, which will NOT match what's in the todos array (not in the database)
    request(app)
      .get(`/todos/${hexID}`)
      .expect(404)
      .end(done);
  });

  it('should return a 404 for non-objects ids (format/type not valid)', (done) => {
    request(app)
      .get('/todos/123')
      .expect(404)
      .end(done);
  });
});
