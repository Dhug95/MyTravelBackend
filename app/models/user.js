// get an instance of mongoose and mongoose.Schema
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

mongoose.set('useCreateIndex', true);

const userSchema = new Schema({
  email: {type: String, unique: true, required: true},
  username: {type: String, unique: true, required: true},
  password: String,
  facebook: Boolean
});

userSchema.plugin(uniqueValidator);

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('User', userSchema);
