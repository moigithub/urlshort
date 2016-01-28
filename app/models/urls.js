'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Url = new Schema({
	code: {type: String, unique: true},
	target: String,
	invalid: Boolean
});

module.exports = mongoose.model('url', Url);
