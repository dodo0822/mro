var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var validator = require('validator');
var bcrypt = require('bcrypt');
var moment = require('moment');
var jwt = require('jwt-simple');

mongoose.connect('mongodb://localhost/mro');

var db = require('./database');
var app = express();
var auth = require('./auth');

app.use(bodyParser.json());
app.use(express.static(__dirname + '/build'));

require('./routes')(app);

app.use(function(req, res) {
	res.sendFile(__dirname + '/build/index.html');
});

app.listen(9090, function(err) {
	console.log('listening');
});