// get an instance of mongoose and mongoose.Schema
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

mongoose.set('useCreateIndex', true);

const tripSchema = new Schema({
    name: {type: String, required: true},
    startDate: {type: String, required: true},
    endDate: {type: String, required: true},
    creator: {type: String, required: true},
    participants: [String],
    payments: [{username: {type: String}, amount: {type: String}}]
});

tripSchema.plugin(uniqueValidator);

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('Trip', tripSchema);