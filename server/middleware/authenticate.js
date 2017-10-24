
// authenticate middleware
// find the associated user and send it back (id and email)
// used by the calling routes as a middleware

// local imports
var {User} = require('./../models/user');

var authenticate = (req, res, next) => {
  var token = req.header('x-auth'); // Gets the token - req.header() gets the header

  User.findByToken(token).then((user) => { // Lookup the user using the provided token
    if (!user) {
      return Promise.reject(); // rejects and execute the .catch() bellow
    }
    // modify the request (req) object, so it can be used by the calling route.
    req.user = user; // set it to the user we just found
    req.token = token; // set it to the token we just got
    next();
  }).catch((e) => {
    res.status(401).send(); // status code says authentication is required
  });
};

module.exports = {authenticate};
