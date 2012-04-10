
/**
 * Module dependencies.
 */

var express = require('express'),
	routes = require('./routes');
	fs = require('fs'),
	Bird = require('bird')({
		oauth_token : 'TTpJ7j4gNqpkusHXG8CA',
		oauth_token_secret : '4nhHO5JCK05zNtZbdxghJqzhRegWeVjYkYz57UxIpE',
		callback: 'http://morning-samurai-5827.herokuapp.com/callback'
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

// Routes
app.get('/', function(req, res) {
	if (req.session.signedIn) {
		res.redirect('/studio');
	} else {
		res.send('<a href="/login">login</a>');
	}
});

app.get('/login', function(req, res) {
	Bird.login(req, function(err, oauth_token, oauth_token_secret, results){
		if (err) {
			//handle the error here if twitter returns an error
			res.send(err);
		} else {
			//set 
			req.session.oauth_token = oauth_token;
			req.session.oauth_token_secret = oauth_token_secret;
			res.redirect("https://twitter.com/oauth/authorize?oauth_token="+req.session.oauth_token);
		}
	});
});

app.get('/callback', function(req,res) {
	Bird.auth_callback(req, function(err, access_token, access_token_secret, data){
		if (err) {
			//handle the error here if twitter returns an error
			res.send(err);
		} else {
			req.session.screen_name = data.screen_name;
			req.session.access_token = access_token;
			req.session.access_token_secret = access_token_secret;
			req.session.signedIn = 1;

			res.redirect('/');
		}
	});
});


app.get('/studio', function(req, res) {
	res.render('index', {
		title: 'getUserMedia'
	});
});

app.post('/snap', function(req, res) {
	var imageData = '';

	req.on('data', function(chunk) {
		imageData += chunk;
	});

	req.on('end', function() {
		imageData = imageData.replace(/^data:image\/png;base64,/,"");


		// var buffer = '', //new Buffer(imageData, 'base64'),
		// 	filename = nameFile();
	

		var options = {
			'status': 'Testing, Crrnt Stts is good',
			'media[]': imageData
		};

		// fs.writeFile(filename, buffer, function(err) {
		// 	if (err) {
		// 		console.log('error saving');
		// 	}
		// 	else {
		// 		console.log('It saved!');
				
				Bird.tweet(req, options, function(err, data, response) {

					if (err) {
						res.send(err);
					} else {
						res.send(data);
					}
				});
					//res.send(filename);
		// 	}
		// });


	});
});

function nameFile() {
	var path = './public/snaps/',
		timestamp = Math.round(new Date().getTime() / 1000);

	return path + 'image_' + timestamp + '.png';
}

var port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log("Listening on " + port);
});

console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
