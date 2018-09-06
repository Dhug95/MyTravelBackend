// get an instance of mongoose and mongoose.Schema
var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;

mongoose.set('useCreateIndex', true);

var tripSchema = new Schema({
	name: { type: String, required: true },
	startDate: { type: String, required: true },
	endDate: { type: String, required: true },
	creator: { type: String, required: true },
	image: String,
	participants: [String]
});

tripSchema.plugin(uniqueValidator);

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('Trip', tripSchema);
