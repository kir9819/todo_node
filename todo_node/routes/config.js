const mongoose = require('mongoose'); // standard module for  MongoDB

const db_url = 'mongodb://localhost:27017';
const db_name = 'asbenta';
mongoose.Promise = Promise; // Ask Mongoose to use standard Promises
//mongoose.set('debug', true);  // Ask Mongoose to log DB request to console
mongoose.connect(`${db_url}/${db_name}`); // Connect to local database
mongoose.connection.on('error', console.error);


module.exports = mongoose;