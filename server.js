
/**
 * Module dependencies.
 */

var express = require('express'),
	fs = require('fs'),
	Bird = require('bird')({
		oauth_token : 'TTpJ7j4gNqpkusHXG8CA',
		oauth_token_secret : '4nhHO5JCK05zNtZbdxghJqzhRegWeVjYkYz57UxIpE',
		callback: 'http://localhost:3000/callback'
	});

// shorthand server
var app = express.createServer();

// Configuration
app.configure(function(){
	app.set('views', __dirname + '/views');
	app.set('view engine', 'jade');
	app.use(express.bodyParser());
	app.use(express.cookieParser());
	app.use(express.session({secret: "just-the-letter-a"}));
	app.use(express.methodOverride());
	app.use(app.router);
	app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
	app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
	app.use(express.errorHandler());
});


// Applications
require('./apps/photo-booth/routes')(app);
require('./apps/authentication/routes')(app);

var port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log("Listening on " + port);
});

console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
