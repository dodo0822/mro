var user = require('./user');
var fm = require('./fm');
var job = require('./job');

module.exports = function(app) {
	user(app);
	fm(app);
	job(app);
};