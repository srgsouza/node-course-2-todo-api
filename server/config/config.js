// Setting the node environment variables. Allows for different environments such as testing and development
// On heroku and most node hosting companies, the NODE_ENV defaults to "production"
var env = process.env.NODE_ENV || 'development';  // Set it to 'development' if env is not set by the system
console.log('Environment is: ', env);

// only load the environment variables if we are on the dev or test environment
if (env === 'development' || env === 'test') {
  // config.json has the local environment variables. It should NOT be included in the repository (git)
  // When we 'require' a json file, it automatically parses it into a javascript object
  var config = require('./config.json');
  var envConfig = config[env]; // store just the config variables (dev OR test). Using bracket notation to get the variable property
  Object.keys(envConfig).forEach((key) => { // 'Object.keys' takes an object, it gets all the keys and returns as an array
  // loop through the array and set the key (ie. PORT, MONGODB_URI) ...
   process.env[key] = envConfig[key]; // ... to the process.env[key] variable (ie. process.env.PORT = 3000) 
  });

}


// Used the code bellow initially, but it's a BAD idea to have config variables as part of the repository (github)
// Items such as secrets and third party API keys should NOT be part of the repository



// // Setting the node environment variables. Allows for different environments such as testing and development
// // On heroku and most node hosting companies, the NODE_ENV defaults to "production"
// var env = process.env.NODE_ENV || 'development';  // Set it to 'development' if env is not set by the system
// console.log('Environment is: ', env);
// // on package.json, ensure that the test script sets the NODE_ENV variable
// // on package.json in the scripts section -> "test": "export NODE_ENV=test || SET \"NODE_ENV=test\" && mocha server/**/*.test.js",
// if (env === 'development') {
//   process.env.PORT = 3000;
//   process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoApp';
// } else if (env === 'test') {
//   process.env.PORT = 3000;
//   process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoAppTest';
// }
