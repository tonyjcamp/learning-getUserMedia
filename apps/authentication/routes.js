var fs    = require('fs'),
	util  = require('util'),
	oauth = require('oauth');

var routes = function(app) {
	var consumerKey              = 'TTpJ7j4gNqpkusHXG8CA',
		consumerSecret           = '4nhHO5JCK05zNtZbdxghJqzhRegWeVjYkYz57UxIpE',
		twitterAccessToken       = '346918539-89f9hZmuGA8a6XHjvswPG9txH7ydvy6AqpLqUreX',
		twitterAccessTokenSecret = 'eqOPkm1o51qh69VWLCLCv714oJClPccHvDQUBkQnmo',
		_callback                = 'http://localhost:3000/sessions/callback';

	var consumer = new oauth.OAuth(
		"https://twitter.com/oauth/request_token",
		"https://twitter.com/oauth/access_token",
		consumerKey,
		consumerSecret,
		"1.0", _callback, "HMAC-SHA1"
	);

	app.get('/login', function(req, res) {
		consumer.getOAuthRequestToken(function(error, oauthToken, oauthTokenSecret, data) {
			if (error) {
				res.send("Error getting oAuth request token: " + sys.inspect(error), 500);
			} else {
				req.session.oauthRequestToken = oauthToken;
				req.session.oauthRequestTokenSecret = oauthTokenSecret;
				console.log('Redirecting to authorize');
				res.redirect("https://twitter.com/oauth/authorize?oauth_token="  + req.session.oauthRequestToken);
			}
		});
		// res.render(__dirname + '/views/login', {
		// 	title: 'Login'
		// });
	});

	app.get('/sessions/callback', function(req, res) {
		consumer.getOAuthAccessToken(req.session.oauthRequestToken, req.session.oauthRequestTokenSecret, req.query.oauth_verifier, function(error, oauthAccessToken, oauthAccessTokenSecret, results) {
			if (error) {
				res.send("Error getting OAuth access token : " + util.inspect(error) + "["+oauthAccessToken+"]"+ "["+oauthAccessTokenSecret+"]"+ "["+sys.inspect(results)+"]", 500);
			} else {
				req.session.oauthAccessToken = oauthAccessToken;
				req.session.oauthAccessTokenSecret = oauthAccessTokenSecret;

				var image = __dirname + '/user.jpeg';
				var imageData = fs.readFileSync(image, 'utf8').toString();
				var options = {
						status: 'Testing Crrnt Stts with pic!',
						media: imageData
					};

				console.log(options);
				// options = JSON.stringify(options);
				consumer.post(
					"https://upload.twitter.com/1/statuses/update_with_media.json",
					req.session.oauthAccessToken,
					req.session.oauthAccessTokenSecret,
					options,
					"multipart/form-data",
					function (error, data, response) {
						if (error) {
							res.send("Error: " + util.inspect(error), 500);
						} else {
							// data = JSON.parse(data);
							// req.session.twitterScreenName = data["screen_name"];
							res.send('You are signed in: ' + util.inspect(data));
						}
					}
				);
				// Right here is where we would write out some nice user stuff
			}
		});
	});

	app.post('/session', function(req, res) {
		console.log('In Session');
	});

	app.get('/img', function(req, res) {
		var image = __dirname + '/user.jpeg',
					options = {
						status: 'Testing Crrnt Stts with pic!',
						media: image
					};

				fs.readFile(image, 'utf8', function(err,data) {
					if (err) {
						throw err;
					};
					console.log('zing');
					console.log(data);
				});

	});

};

module.exports = routes;