'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var petSchema = mongoose.Schema({
	name: String,
	owner: String,
	weight: Number,
	type: String
});

module.exports = mongoose.model('Pet', petSchema);