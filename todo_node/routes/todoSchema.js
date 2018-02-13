const crypto = require('crypto'); // crypto module for node.js for e.g. creating hashes
const mongoose = require('./config');


//---------Use Schema and Module  ------------------//
const todoSchema = new mongoose.Schema({
    name: String,
    check: Boolean,
    info: String,
    beginningDateTime: String,
    endDateTime: String,
    userId: String
});


    const Todo = mongoose.model('todo', todoSchema);

    module.exports = Todo;