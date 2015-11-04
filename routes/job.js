var auth = require('../auth');
var db = require('../database');
var fs = require('fs');
var multer = require('multer');
var rimraf = require('rimraf');

var upload = multer({ dest: 'uploads/' });

module.exports = function(app) {
	app.post('/api/job/submit', auth.check(), function(req, res) {
		var _id = req.user._id;
		var input = req.body.input;
		var output = req.body.output;
		if(input.indexOf('..') > -1 || output.indexOf('..') > -1) {
			res.send({ status: 'error', message: 'Invalid request.' });
			return;
		}
		var job = new db.Job({
			status: 'Accepted',
			submitTime: new Date(),
			finishTime: null,
			cluster: req.body.cluster,
			owner: _id
		});
		job.save(function(err, job) {
			if(err) {
				res.send({ status: 'error', message: 'Internal server error.' });
				console.log('E: cannot save job to db: ', err);
				return;
			}
			fs.mkdir('queue/' + job._id, function(err) {
				if(err) {
					res.send({ status: 'error', message: 'Internal server error.' });
					console.log('E: cannot make job dir: ', err);
					return;
				}
				var info = {
					owner: _id,
					input: input,
					output: output,
					cluster: req.body.cluster
				};
				fs.appendFile('queue/' + job._id + '/info.json', JSON.stringify(info), function(err) {
					if(err) {
						res.send({ status: 'error', message: 'Internal server error.' });
						console.log('E: cannot write job info: ', job._id, err);
						return;
					}
					fs.appendFile('queue/' + job._id + '/mapper.py', req.body.mapper, function(err) {
						if(err) {
							res.send({ status: 'error', message: 'Internal server error.' });
							console.log('E: cannot write job mapper: ', job._id, err);
							return;
						}
						fs.appendFile('queue/' + job._id + '/reducer.py', req.body.reducer, function(err) {
							if(err) {
								res.send({ status: 'error', message: 'Internal server error.' });
								console.log('E: cannot write job reducer: ', job._id, err);
								return;
							}
							res.send({ status: 'ok' });
						});
					});
				})
			});
		});
	});

	app.get('/api/job/list', auth.check(), function(req, res) {
		db.Job.find({ owner: req.user._id }, function(err, jobs) {
			if(err) {
				res.send({ status: 'error', message: 'Internal server error.' });
				console.log('E: cannot list job from db: ', err);
				return;
			}
			res.send({ status: 'ok', list: jobs });
		});
	});

	app.get('/api/job/remove', auth.check(), function(req, res) {
		if(!req.query._id) {
			res.send({ status: 'error', message: 'Invalid request.' });
			return;
		}
		db.Job.findOne({ _id: req.query._id }, function(err, job) {
			if(err) {
				res.send({ status: 'error', message: 'Internal server error.' });
				console.log('E: cannot find job: ', err);
				return;
			}
			if(!job) {
				res.send({ status: 'error', message: 'Job not found.' });
				return;
			}
			if(job.owner.toString() != req.user._id) {
				res.send({ status: 'error', message: 'Job not found.' });
				return;
			}
			if(job.status != 'Accepted') {
				res.send({ status: 'error', message: 'Job can\'t be removed after running.' });
				return;
			}
			rimraf('queue/' + job._id, function(err) {
				if(err) {
					res.send({ status: 'error', message: 'Internal server error.' });
					console.log('E: cannot remove job directory: ', err);
					return;
				}
				job.remove(function(err) {
					if(err) {
						res.send({ status: 'error', message: 'Internal server error.' });
						console.log('E: cannot remove job from db: ', err);
						return;
					}
					res.send({ status: 'ok' });
				});
			});
		})
	})

	app.get('/api/job/output', auth.check(), function(req, res) {
		if(!req.query._id) {
			res.send({ status: 'error', message: 'Invalid request.' });
			return;
		}
		db.Job.findOne({ _id: req.query._id }, function(err, job) {
			if(err) {
				res.send({ status: 'error', message: 'Internal server error.' });
				console.log('E: cannnot fetch job from db: ', err);
				return;
			}
			if(!job) {
				res.send({ status: 'error', message: 'Job not found.' });
				return;
			}
			if(job.owner.toString() != req.user._id) {
				res.send({ status: 'error', message: 'Job not found.' });
				return;
			}
			var ret = {
				stdout: '(None)',
				stderr: '(None)'
			};
			fs.readFile('queue/' + job._id + '/stdout.txt', function(err, stdout) {
				if(!err) ret.stdout = stdout.toString();
				fs.readFile('queue/' + job._id + '/stderr.txt', function(err, stderr) {
					if(!err) ret.stderr = stderr.toString();
					res.send({ status: 'ok', output: ret });
				});
			});
		});
	});
};