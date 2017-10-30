const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken'); // used to generate a token

const {Todo} = require('./../../models/todo');
const {User} = require('./../../models/user');

const userOneId = new ObjectID(); // used in the users array
const userTwoId = new ObjectID(); // same

// dummy array of objects. This is the user seed data we'll use to insert to the db.
const users = [{
  _id: userOneId,
  name: 'serg',
  email: 'srg@example.com',
  password: 'userOnePass',
  tokens: [{
    access: 'auth',
    token: jwt.sign({_id: userOneId, access: 'auth'}, process.env.JWT_SECRET).toString() // Generate a token - see models/user.js
  }]
}, {
  _id: userTwoId,
  name: 'joe',
  email: 'joe@example.com',
  password: 'userTwoPass',
  tokens: [{
    access: 'auth',
    token: jwt.sign({_id: userTwoId, access: 'auth'}, process.env.JWT_SECRET).toString() // Generate a token - see models/user.js
  }]
}];

// dummy array of objects. This is the todo seed data we'll use to insert to the db.
const todos = [{
  _id: new ObjectID(),
  text: 'First test todo',
  _creator: userOneId
}, {
  _id: new ObjectID(),
  text: 'Second test todo',
  completed: true,
  completedAt: 333,
  _creator: userTwoId
}];

const populateUsers = (done) => {
  User.remove({}).then(() => { // remove all items from the database
    var user1 = new User(users[0]).save(); // create an instance of user - the value returned from save() is assigned to 'user1'
    var user2 = new User(users[1]).save(); // save() will run the middleware (does the hashing) - whaa?? from 'UserSchema.pre('save', fun...' in user.js?
    // above we have two promises, want to wait for both to succeed
    return Promise.all([user1, user2]);  // .all is a promise utility method that an array of promises
  }).then(() => done());
};

const populateTodos = (done) => { // before each time the test is run...
  Todo.remove({}).then(() => { // remove all items from the db
    return Todo.insertMany(todos); // insert objects from the previously created todos array. return the response to allow chain callbacks
  }).then(() => done()); // expression syntax - not sure how to explain this
};



module.exports = {todos, populateTodos, users, populateUsers};
