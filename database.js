var mongoose = require('mongoose');
var config = require('./config');
var Schema = mongoose.Schema;

var userSchema = new Schema({
	username: String,
	password: String,
	email: String
});

var jobSchema = new Schema({
	status: String,
	submitTime: Date,
	finishTime: Date,
	owner: Schema.Types.ObjectId,
	cluster: Boolean
});

module.exports.jwtSecret = config.jwtSecret;

module.exports.User = mongoose.model('User', userSchema);
module.exports.Job = mongoose.model('Job', jobSchema);