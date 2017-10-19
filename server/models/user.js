const mongoose = require('mongoose');
const validator = require('validator'); // npm library that handles validation - ie email has proper format.
const jwt = require('jsonwebtoken');  // library to deal with encryption, tokens...
const _ = require('lodash'); // needed for the .pick() method (get only certain properties of an object)
const bcrypt = require('bcryptjs'); // used for the hashing of passwords

// This UserSchema variable stores the schema (properties) for the user - using this since we can't add methods to the User model directly
var UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 1,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    minlength: 1,
    trim: true,
    unique: true,
    validate: {
      // validator: (value) => {
      //   return validator.isEmail(value);
      // },
      validator: validator.isEmail,  // abobe validator block can be writen like this instead
      message: '{value} is not a valid email'
    }
  },
  password: {
    type: String,
    require: true,
    minlength: 6
  },
  tokens: [{  // tokens array - feature available in mongodb, not in SQL databases
    access: {
      type: String,
      required: true
    },
    token: {
      type: String,
      required: true
    }
  }]
});

// ** Instance method. UserSchema.methods is an object, and allow us to add any methods we like
// This instance method has access to the individual documents, which is needed to create a user-specific web token
// Not using the ES6 'array' function syntax, because it does not bind the 'this' keyword that stores the individual document
// UserSchema.methods.toJSON determines what is send back when a mongoose model is converted into a json value
UserSchema.methods.toJSON = function() {
  var user = this; // using lowercase 'user' for instance methods, which get called with the individual document  (see 'User' bellow for model methods)
  // toObject() takes the mongoose variable 'user' and converted to a regular object where only the properties available on the document exist
  // per mongoose documentation 'Each sub-document is converted to a plain object by calling its #toObject method.'
  var userObject = user.toObject();

  return _.pick(userObject, ['_id', 'email']); // leaves out the password and the token array, which should not be returned to the client
};

// ** Instance method. This will create a modified token and make it available for use in the server.js file
UserSchema.methods.generateAuthToken = function () {
  var user = this;
  var access = 'auth';
  // sign takes an object and a 'secret' value.
  // getting the user id property 'user._id' and pass the string, as opposed to passing the object, to jwt.sign.
  // Also pass the access and secret value.
  // convert it to a string and assign to the token variable
  var token = jwt.sign({_id: user._id.toHexString(), access}, 'abc123').toString();

  // Update the tokens array (defined in the schema). This completes the change in the User model (locally)
  user.tokens.push({access, token});

  // Now we save the user model to the database
  // user.save() returns a promise, where we can then pass the success callback function, returning the token variable defined above
  // The 'return user.save()...' allows for a .then() call inside the server.js file to chain on to the promise ('.then(token) => {}')
  // Usually when we return to chain in a promise, we return another promise...
  // In this case we're returning a value, instead of a promise.  This value will get passed as the success argument for the next .then() call
  return user.save().then(() => {
    return token; // returns the token (variable defined above)
  });
  // in the server.js file, we can tack another callback
};

// ** Model method (.statics)
// Here we define the findByToken method
UserSchema.statics.findByToken = function (token) {
  var User = this;  // using uppercase 'User' for model methods, which get call with the model as the 'this' binding (see lowercase 'user' for instance calls)
  var decoded;  // stores the decoded jwt values (see playground/hashing.js for example)
  // use try catch block..
  try {
    decoded = jwt.verify(token, 'abc123'); // verifying the token - pass the token and secret to jwt.verify()
  } catch (e) {
    // if error in verifying token, findByToken returns a promise that will reject, and the rest of the function does not execute
    // return new Promise((resolve, reject) => {
    //   reject();
    // });
    return Promise.reject(); // same as above 'return new Promise...' code
  }

  // if we find the token, search for the corresponding user
  return User.findOne({  // return so we can have chained calls (.then) in server.js
    // querying nested object properties
    _id: decoded._id,  // not sure how to explain this
    'tokens.token': token, // defined in UserSchema, set it to 'token' as in findByToken = function (token)
    'tokens.access': 'auth' // 'token.access' needs quotes because of the dot '.'  - why auth and not x-auth?
  });
};


// Define a mongoose middleware to hash passwords - 'pre' as in prior to saving the data
UserSchema.pre('save', function (next) { // next is necessary as an argurment, so that it can be called. Otherwise app will crash
  var user = this;
  // Ensure we don't hash a password that's already hashed (example: user is changing their email only)
  if (user.isModified('password')) { // only encrypts the password if it was just modified
    var password = user.password;  // get the newly modified password
    bcrypt.genSalt(10, (err, salt) => { // Generates the salt. First arg is the number of rounds
      bcrypt.hash(password, salt, (err, hash) => {   // hashes the password
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});


// create the User model
var User = mongoose.model('User', UserSchema);

module.exports = {User}; // ES6 syntax. Exporting User object
