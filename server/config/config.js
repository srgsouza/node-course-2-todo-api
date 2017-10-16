// Setting the node environment variables. Allows for diff environments such as testing and development
// On heroku and most node hosting companies, the NODE_ENV defaults to "production"
var env = process.env.NODE_ENV || 'development';  // Set it to 'development' if env is not set by the system
console.log('Environment is: ', env);
// on package.json, ensure that the test script sets the NODE_ENV variable
// on package.json in the scripts section -> "test": "export NODE_ENV=test || SET \"NODE_ENV=test\" && mocha server/**/*.test.js",
if (env === 'development') {
  process.env.PORT = 3000;
  process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoApp';
} else if (env === 'test') {
  process.env.PORT = 3000;
  process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoAppTest';
}
