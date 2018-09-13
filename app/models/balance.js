// get an instance of mongoose and mongoose.Schema
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

mongoose.set('useCreateIndex', true);

const balanceSchema = new Schema({
    trip_id: {type: String, required: true},
    amount: {type: String, required: true},
    username: {type: String, unique: true}
});

balanceSchema.plugin(uniqueValidator);

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('Balance', balanceSchema);
