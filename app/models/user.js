// get an instance of mongoose and mongoose.Schema
var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;

mongoose.set('useCreateIndex', true);

var userSchema = new Schema({
	email: { type: String, unique: true, required: true },
	username: { type: String, unique: true, required: true },
	password: { type: String, required: true }
});

userSchema.plugin(uniqueValidator);

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('User', userSchema);
