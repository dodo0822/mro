var auth = require('../auth');
var multer = require('multer');
var WebHDFS = require('webhdfs');
var fs = require('fs');
var hdfs = WebHDFS.createClient({ user: 'dodo0822' });

var upload = multer({ dest: 'uploads/' });

module.exports = function(app) {
	app.get('/api/fm/list', auth.check(), function(req, res) {
		var _id = req.user._id;
		var path = req.query.path;
		if(path.indexOf('..') > -1) {
			res.send({ status: 'error', message: 'Invalid request. '});
			return;
		}
		hdfs.readdir('/mro/' + _id + '/' + path, function(err, result) {
			if(err) {
				res.send({ status: 'error', message: 'Internal server error.' });
				console.log('E: cannot read hdfs: ', err);
				return;
			}
			res.send({ status: 'ok', list: result });
		});
	});

	app.get('/api/fm/read', auth.check(), function(req, res) {
		var _id = req.user._id;
		var name = req.query.name;
		if(name.indexOf('..') > -1) {
			res.send({ status: 'error', message: 'Invalid request.' });
			return;
		}
		hdfs.readFile('/mro/' + _id + '/' + name, function(err, data) {
			if(err) {
				res.send({ status: 'error', message: 'Internal server error.' });
				console.log('E: cannot read hdfs: ', err);
				return;
			}
			res.send({ status: 'ok', content: data.toString() });
		});
	});

	app.get('/api/fm/mkdir', auth.check(), function(req, res) {
		var _id = req.user._id;
		var name = req.query.name;
		if(name.indexOf('..') > -1) {
			res.send({ status: 'error', message: 'Invalid request.' });
			return;
		}
		hdfs.mkdir('/mro/' + _id + '/' + name, function(err, data) {
			if(err) {
				res.send({ status: 'error', message: 'Internal server error.' });
				console.log('E: cannot mkdir hdfs: ', err);
				return;
			}
			res.send({ status: 'ok' });
		});
	});

	app.post('/api/fm/upload', upload.single('file'), auth.check(true), function(req, res) {
		var _id = req.user._id;
		var path = req.body.path;
		var name = req.file.originalname;
		if(path.indexOf('..') > -1) {
			res.send({ status: 'error', message: 'Invalid request.' });
			return;
		}
		var readStream = fs.createReadStream(req.file.path);
		var writeStream = hdfs.createWriteStream('/mro/' + _id + '/' + path + name);
		readStream.pipe(writeStream);
		writeStream.on('error', function(err) {
			fs.unlink(req.file.path, function(uerr) {
				res.send({ status: 'error', message: 'Internal server error.' });
				console.log('E: cannot upload to hdfs: ', err);
				return;
			});
		});
		writeStream.on('finish', function() {
			fs.unlink(req.file.path, function(uerr) {
				res.send({ status: 'ok' });
				return;
			});
		});
	});

	app.get('/api/fm/remove', auth.check(), function(req, res) {
		var _id = req.user._id;
		var path = req.query.path;
		if(path.indexOf('..') > -1) {
			res.send({ status: 'error', message: 'Invalid request.' });
			return;
		}
		hdfs.unlink('/mro/' + _id + '/' + path, true, function(err) {
			if(err) {
				res.send({ status: 'error', message: 'Internal server error.' });
				console.log('E: cannot remove file from hdfs: ', err);
				return;
			}
			res.send({ status: 'ok' });
		});
	});

	app.get('/api/fm/rename', auth.check(), function(req, res) {
		var _id = req.user._id;
		var origin = req.query.origin;
		var after = req.query.after;
		if(origin.indexOf('..') > -1 || after.indexOf('..') > -1) {
			res.send({ status: 'error', message: 'Invalid request.' });
			return;
		}
		hdfs.rename('/mro/' + _id + '/' + origin, '/mro/' + _id + '/' + after, function(err) {
			if(err) {
				res.send({ status: 'error', message: 'Internal server error.' });
				console.log('E: cannot rename hdfs file: ', err);
				return;
			}
			res.send({ status: 'ok' });
		});
	});
};