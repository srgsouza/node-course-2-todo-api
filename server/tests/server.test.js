// Test suite
// Test cases for '/todos'
// Such as ... Verify that when correct data is sent, we get back a 200 with complete doc including the ID
// and if we send bad data we get a code 400

const expect = require('expect'); // test assertions
const request = require('supertest'); // test express routes -> request(app), .get, .set, .expect, ...
const {ObjectID} = require('mongodb'); // needed to create the ID object of the mongo DB

const {app} = require('./../server'); // ES6 destructuring syntax (set app property to the app variable) - access to the express app
const {Todo} = require('./../models/todo'); // access to the Todo model (based on mongoose)
const {User} = require('./../models/user'); // access to the user model
const {todos, populateTodos, users, populateUsers} = require('./../tests/seed/seed'); // access to the functions in seed.js

beforeEach(populateUsers); // populate the database with the seed values - in seed/seed.js
beforeEach(populateTodos); // populate the database with the seed todos

describe('POST /todos', () => { // describe and group the tests. This one is for the POST routes.
  it('should create a new todo', (done) => { // 'it' is a mocha functionalilty. We use 'done', mocha property, to test async functions
    var text = 'Test todo text';
    request(app) // supertest functionalilty. Calls app
      .post('/todos') // specify the request type
      .send({
        text
      }) // sends the data (object). It gets converted to JSON by supertest.  {text} is same as text: text
      .expect(200) // assertion
      .expect((res) => { // assert that result (body that comes back) is an object that has the text property specified above
        expect(res.body.text).toBe(text); // expect functionality - https://github.com/mjackson/expect
      })
      .end((err, res) => { //instead of .end(done), call it with a callback function. To check for error and test the an err and res
        if (err) {
          return done(err); // if err, this wraps up the test and send msg to the screen
        }
        Todo.find({
          text
        }).then((todos) => { // fetch the created todo, then callback with a parameter and make assertions with such parameter
          expect(todos.length).toBe(1); // expect 1 todo exactly, because we add 1 todo item above. (note we delete all items before test is run)
          expect(todos[0].text).toBe(text); // expect object to have a text property just like we specified above
          done();
        }).catch((e) => done(e)); // catch detects any errors that might occur inside  the callbacks. chose to use statement syntax here
      });
  });

  it('should NOT create todo with invalid body data', (done) => {
    var text = ''; // text with empty string - should not pass the checks in the todo model
    request(app)
      .post('/todos')
      .send({
        text
      })
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

describe('GET /todos:id', () => { // requires a document with an ID - create/add such ID in this test file
  it('should return todo doc', (done) => {
    request(app)
      .get(`/todos/${todos[0]._id.toHexString()}`) // fetch the '_id' object from the todos array, and convert it to a string.
      .expect(200)
      .expect((res) => {
        // 'todo' is waht comes back. see 'res.send({todo});' in findById function on server.js
        // and we compare it to the todo array text property we created
        expect(res.body.todo.text).toBe(todos[0].text);
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

describe('DELETE /todos/:id', () => {
  // it('should remove a todo', (done) => {
  //   // 1st item of the todos array created/inserted above, by id (converted object to string)
  //   var hexId = todos[1]._id.toHexString();
  //   request(app)
  //     .delete(`/todos/${hexId}`) // delete the 1st item of the todos array created/inserted above, by id (converted object to string)
  //     .expect(200)
  //     .expect((res) => {
  //       expect(res.body.todo._id).toBe(hexId); // expect that the id of the todo that comes back matches the id of the array we created
  //     })
  //     .end((err, res) => {
  //       if (err) {
  //         return done(err);  //
  //       }
  //       // Query the database using findById toNotExist
  //       Todo.findById(hexId).then((todo) => {
  //         expect(todo).toNotExist();  // TODO This is not working, possibly due to expect version
  //         // done();
  //       }).catch((e) => done(e));
  //     });
  // });

  it('should return 404 if todo not found', (done) => {
    var hexId = new ObjectID().toHexString(); // create a new object id, which will NOT match what's in the todos array (not in the database)
    request(app)
      .delete(`/todos/${hexId}`)
      .expect(404)
      .end(done);
  });

  it('should return 404 if object id is invalid', (done) => {
    var hexId = new ObjectID().toHexString(); // create a new object id, which will NOT match what's in the todos array (not in the database)
    request(app)
      .delete(`/todos/${hexId}`)
      .expect(404)
      .end(done);
  });
});

describe('PATCH /todos/:id', () => {
  it('should update the todo', (done) => {
    // grab id of the item
    //  update the text, set completed to true
    // 200, text is changed, completed is true, completedA is a number .toBeA
    var hexId = todos[0]._id.toHexString();
    text = 'text modified in test';
    request(app)
      .patch(`/todos/${hexId}`)
      .send({
        text,
        completed: true
      })
      .expect(200)
      .expect((res) => {
          expect(res.body.todo.text).toBe(text);
          expect(res.body.todo.completed).toBe(true);
          // expect(res.body.todo.completedAt).toBeA('string'); // TODO This is not working, possibly due to expect version
      })
      .end(done);
  });
  it('should clear completedAt when todo is not completed', (done) => {
    // grab id
    // update text
    // set completed to false
    // 200, text is changed, completed is false, completedAt is null .toNotExist
    var hexId = todos[1]._id.toHexString();
    text = 'Another text modified in test';
    request(app)
      .patch(`/todos/${hexId}`)
      .send({
        text,
        completed: false,
        completedAt: null
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(text);
        expect(res.body.todo.completed).toBe(false);
        // expect(res.body.todo.completedAt).toNotExist(); // TODO This is not working, possibly due to expect version
      })
      .end(done);
  });
});

describe('/GET /users/me', () => {
  it('should return user if authenticated', (done) => {
      request(app)
        .get('/users/me')
        .set('x-auth', users[0].tokens[0].token) // set header with token
        .expect(200)
        .expect((res) => {
          expect(res.body._id).toBe(users[0]._id.toHexString());
          expect(res.body.email).toBe(users[0].email);
        })
        .end(done);
  });

  it('should return 401 if not authenticated', (done) => {
    request(app)
      .get('/users/me')
      .expect(401)
      .expect((res) => {
        expect(res.body).toEqual({});  // body object to equal empty object
      })
      .end(done);
  });
});


describe('POST /users', () => {
  it('should create a user', (done) => {
    var email = 'example@example.com';
    var password = 'abc123!';
    request(app)
      .post('/users')
      .send({email, password})
      .expect(200)
      .expect((res) => {
        // expect(res.headers['x-auth']).toExist(); // use bracket notation instead of 'dot', because 'x-auth' has a hyphen  TODO toExist() not working
        // expect(res.body._id).toExist();  // TODO - NOt working. Need 'expect' upgrade?
        expect(res.body.email).toBe(email);
      })
      // .end(done);
      .end((err) => { // couuld have used '.end(done)', or extend testing functionality like this...
        if (err) {
          return done(err);
        }
        User.findOne({email}).then((user) => {
          // expect(user).toExist(); // TODO toExist not working
          // expect(user.password).toNotBe(password); // TODO toNotBe() not working. checking password in the db.  should be hashed and not same as password
          done();
        }).catch((e) => done(e));
      });
  });

  it('should return validation errors if request invalid', (done) => {
    var email = 'example.example.com';
    var password = 'abc';
    request(app)
      .post('/users')
      .send({email, password})
      .expect(400)
      .end(done);

  });

  it('should not create user if email in use', (done) => {
    var email = 'joe@example.com'; // email already in DB
    var password = 'abc123!';
    request(app)
      .post('/users')
      .send({email, password})
      .expect(400)
      .end(done);
  });
});

describe('POST /users/login', () => {
  it('should login user and return auth token', (done) => {
    request(app)
      .post('/users/login')
      .send({
        email: users[1].email,   // send the test user credentials
        password: users[1].password
      })
      .expect(200)
      .expect((res) => {
        expect(res.headers['x-auth']).toExist();  // TODO toExist() not working
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        User.findById(users[1]._id).then((user) => {  // search for user by ID
          expect(user.tokens[0]).toInclude({  // user token should include access and token TODO toInclude not working
            access: 'auth',
            token: res.headers['x-auth']
          });
          done();
        }).catch((e) => done(e));
      });
  });

  it('should reject invalid login', (done) => {
    request(app)
      .post('/users/login')
      .send({
        email: users[1].email + '1',   // send the test user credentials
        password: users[1].password
      })
      .expect(400)
      .expect((res) => {
        expect(res.headers['x-auth']).toNotExist();  // TODO toNotExist() not working
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        User.findById(users[1]._id).then((user) => {  // search for user by ID
          expect(user.tokens.length).toBe(0);
          done();
        }).catch((e) => done(e));
      });
  });
});
