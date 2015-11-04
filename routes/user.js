var bcrypt = require('bcrypt');
var jwt = require('jwt-simple');
var moment = require('moment');
var db = require('../database');
var auth = require('../auth');

module.exports = function(app) {
	app.post('/api/user/register', function(req, res) {
		if(!req.body.username || !req.body.password || !req.body.email) {
			res.send({ status: 'error', message: 'Invalid data.' });
			return;
		}
		if(!validator.isEmail(req.body.email)) {
			res.send({ status: 'error', message: 'Invalid email.' });
			return;
		}
		db.User.findOne({ username: req.body.username }, function(err, exUser) {
			if(err) {
				res.send({ status: 'error', message: 'Internal server error.' });
				console.log('E: error finding possible duplicated user', err);
				return;
			}
			if(exUser) {
				res.send({ status: 'error', message: 'User name exists.' });
				return;
			}
			bcrypt.hash(req.body.password, 8, function(err, hash) {
				if(err) {
					res.send({ status: 'error', message: 'Internal server error.' });
					console.log('E: cannot generate password hash', err);
					return;
				}
				var user = new db.User({
					username: req.body.username,
					password: hash,
					email: req.body.email
				});
				user.save(function(err) {
					if(err) {
						res.send({ status: 'error', message: 'Internal server error.' });
						console.log('E: cannot save user data', err);
						return;
					}
					res.send({ status: 'ok' });
				});
			});
		});
	});

	app.post('/api/user/login', function(req, res) {
		if(!req.body.username || !req.body.password) {
			res.send({ status: 'error', message: 'Invalid data.' });
			return;
		}
		db.User.findOne({ username: req.body.username }, function(err, user) {
			if(err) {
				res.send({ status: 'error', message: 'Internal server error.' });
				console.log('E: error finding user during login', err);
				return;
			}
			if(!user) {
				res.send({ status: 'error', message: 'Username or password is wrong.'});
				return;
			}
			bcrypt.compare(req.body.password, user.password, function(err, result) {
				if(err) {
					res.send({ status: 'error', message: 'Internal server error.' });
					console.log('E: error comparing password', err);
					return;
				}
				if(!result) {
					res.send({ status: 'error', message: 'Username or password is wrong.'});
					return;
				}
				var payload = {
					_id: user._id,
					expire: moment().add(1, 'd').format()
				};
				res.send({ status: 'ok', user: {
					_id: user._id,
					username: user.username,
					email: user.email
				}, token: jwt.encode(payload, db.jwtSecret) });
			});
		});
	});

	app.get('/api/user/profile', auth.check(), function(req, res) {
		res.send({ status: 'ok', user: {
			_id: req.user._id,
			username: req.user.username,
			email: req.user.email
		} });
	});
};