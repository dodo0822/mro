var fs = require('fs');
var Queue = require('bull');
var proc = require('./proc');

var queue = Queue('mapreduce', 6379, '127.0.0.1');

fs.watch('../queue', function(evt, filename) {
	console.log('New job: ', filename);
	queue.add(filename);
});

queue.process(function(job, done) {
	proc(job, done);
});