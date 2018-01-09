var express = require('express');
var mysql = require('mysql');
var bp = require('body-parser');

var session = require('express-session');
var uuid = require('node-uuid');
var moment = require('moment');

var usersrv = require('./userserver');
var projectsrv = require('./projectserver');
var actsrv = require('./activityserver');
var trcksrv = require('./timetrackingserver');


var app = express();
var db = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: '',
	database: 'welldone'
});


app.use(express.static('public'));
app.use(bp.json());
app.use(bp.urlencoded({ extended: true }));

app.use(session({
	genid: function (req) {
		return uuid.v4(); //generate a v4 random ID
	},
	resave: false,
	saveUninitialized: false,
	secret: '3009'
}));

var sendResponse = function (res, suc, mes, data) {
	res.json({ success: suc, message: mes, data: data });
};

var toDate = function (dateString) {
	return moment.utc(dateString).toDate();
};

var auth = function (req, res, next) {
	if (req.session && req.session.userid) {
		return next();
	} else {
		res.redirect('login.html');
	}
};


app.get('/dashboard', auth, function (req, res) {

	res.sendFile(__dirname + '/dashboard.html');

});


//login & register & user-dashboard
usersrv.setup(app, db, session, toDate, sendResponse);

//projects
projectsrv.setup(app, db, session, toDate, sendResponse);

//activities
actsrv.setup(app, db, session, toDate, sendResponse);

//timetracking
trcksrv.setup(app, db, session, toDate, sendResponse);


app.listen(8081, function () {
	console.log('Example app listening on port 8081!');
});