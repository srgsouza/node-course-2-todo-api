var mongoose = require('mongoose');

// create a User model
// User, email, require, trim it, set min length to 1
var User = mongoose.model('User', {
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
  }

});

module.exports = {User}; // ES6 syntax. Exporting User object
