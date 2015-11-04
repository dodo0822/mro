var exec = require('child_process').exec;
var fs = require('fs');
var WebHDFS = require('webhdfs');
var rimraf = require('rimraf');

var hdfs = WebHDFS.createClient({ user: 'dodo0822' });

var controllerPath = '/Users/dodo0822/Downloads/pypy-2.6.1-src/pypy/sandbox/pypy_interact.py';
var sandboxPath = '/Users/dodo0822/Downloads/pypy-2.6.1-src/pypy/goal/pypy-c';
var hadoopPath = '/Users/dodo0822/hadoop';

var db = require('../database');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/mro');

module.exports = function(job, done) {
	var id = job.data;
	console.log('I: processs, ', id);
	fs.stat('../queue/' + id, function(err, stat) {
		if(!stat) {
			// Job might be removed, ignore it.
			done();
			return;
		}
		db.Job.update({ _id: id }, { status: 'Running' }, { multi: false }, function(err, j) {
			if(err) {
				console.log('E: cannot update job status: ', err);
				done();
				return;
			}
			fs.readFile('../queue/' + id + '/info.json', function(err, data) {
				if(err) {
					console.log('E: cannot read job info: ', err);
					done();
					return;
				}
				var info = JSON.parse(data);
				var input = '/mro/' + info.owner + info.input;
				var output = '/mro/' + info.owner + info.output;
				var dir = __dirname + '/../queue/' + id + '/';
				if(info.cluster) {
					var command = hadoopPath + '/bin/hadoop jar ' + hadoopPath + '/share/hadoop/tools/lib/hadoop-streaming-2.7.1.jar ';
					command += '-file ' + dir + 'mapper.py ';
					command += '-file ' + dir + 'reducer.py ';
					command += '-mapper "' + controllerPath + ' ' + sandboxPath + ' /tmp/mapper.py" ';
					command += '-reducer "' + controllerPath + ' ' + sandboxPath + ' /tmp/reducer.py" ';
					command += '-input "' + input + '" ';
					command += '-output "' + output + '"';
					/*var command = hadoopPath + '/bin/hadoop jar ' + hadoopPath + '/share/hadoop/tools/lib/hadoop-streaming-2.7.1.jar ';
					command += '-file ' + dir + 'mapper.py ';
					command += '-file ' + dir + 'reducer.py ';
					command += '-mapper mapper.py ';
					command += '-reducer reducer.py ';
					command += '-input "' + input + '" ';
					command += '-output "' + output + '"';*/
					console.log('I: exec: ', command);
					exec(command, function(err, stdout, stderr) {
						fs.appendFile('../queue/' + id + '/stdout.txt', stdout.toString(), function(err) {
							if(err) console.log('E: cannot append stdout: ', err);
							fs.appendFile('../queue/' + id + '/stderr.txt', stderr.toString(), function(err) {
								if(err) console.log('E: cannot append stderr: ', err);
								db.Job.update({ _id: id }, { status: 'Finished', finishTime: new Date() }, { multi: false }, function(err) {
									if(err) {
										console.log('E: cannot update job status: ', err);
										done();
										return;
									}
									console.log('I: Done!');
									done();
								});
							});
						});
					});
				} else {
					var command = hadoopPath + '/bin/hadoop fs -get ';
					command += input + ' ';
					command += dir + 'input';
					exec(command, function(err, stdout, stderr) {
						var command = 'cat ' + dir + 'input/* | ';
						command += controllerPath + ' ' + sandboxPath + ' /tmp/mapper.py | sort | ';
						command += controllerPath + ' ' + sandboxPath + ' /tmp/reducer.py > ' + dir + 'output.txt';
						exec(command, {
							cwd: dir
						}, function(err, stdout, stderr) {
							if(err) {
								console.log('E: exec error: ', err);
								done();
								return;
							}
							var command = hadoopPath + '/bin/hadoop fs -put ';
							command += dir + 'output.txt ';
							command += output;
							exec(command, function(err, stdout, stderr) {
								if(err) {
									console.log('E: cannot put results: ', err);
									done();
									return;
								}
								db.Job.update({ _id: id }, { status: 'Finished', finishTime: new Date() }, { multi: false }, function(err) {
									rimraf(dir + 'input', function(err) {
										done();
									});
								});
							});
						});
					});
				}
			});
		});
	});
};