
var mongoose = require('mongoose');

// create a Todo model for everything we want to store
var Todo = mongoose.model('Todo', {
  text: {
    type: String,
    required: true, // see validators at http://mongoosejs.com/docs/validation.html
    minlength: 1,
    trim: true, // remove leading and trailing white spaces
  },
  completed: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Number,
    default: null
  },
  _creator: {
    type: mongoose.Schema.Types.ObjectId,  //mongoose ObjectID type
    required: true
  }
});


module.exports = {Todo}; // ES6 syntax. Exporting Todo object
