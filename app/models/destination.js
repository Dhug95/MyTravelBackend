// get an instance of mongoose and mongoose.Schema
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

mongoose.set('useCreateIndex', true);

const destSchema = new Schema({
    name: {type: String, required: true, unique: true},
    country: {type: String, required: true},
    trip: {type: String, required: true}
});

destSchema.plugin(uniqueValidator);

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('Dest', destSchema);
