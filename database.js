var mongoose = require('mongoose');
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

module.exports.jwtSecret = ']5A68A.S~J97)8g3(1F1>s[Q9*6;}D';

module.exports.User = mongoose.model('User', userSchema);
module.exports.Job = mongoose.model('Job', jobSchema);