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
	// res.render('index', {
	// 	title: 'getUserMedia'
	// });
});

app.get('/tweet', function(req, res) {
	var options = {
		status: 'Testing Crrnt Stts!',
		media: 'h'
	};

	Bird.tweet(req, options, function(err, data, response) {
		if (err) {
			res.send(err);
		}
		else {
			res.send(data);
		}
	});
});

app.post('/snap', function(req, res) {
	var imageData = '';

	req.on('data', function(chunk) {
		imageData += chunk;
	});

	req.on('end', function() {
		imageData = imageData.replace(/^data:image\/png;base64,/,"");

		var options = {
				status: 'Testing Crrnt Stts with pic!',
				media: imageData
			};


		var buffer = new Buffer(imageData, 'base64'),
			filename = nameFile();

		options.filename = filename;

		fs.writeFile(filename, buffer, function(err) {
			if (err) {
				console.log('error saving');
			}
			else {
				console.log('It saved!');

				Bird.tweet(req, options, function(err, data, response) {
					if (err) {
						res.send(err);
					} else {
						//res.send(data);
					}
					});
					// res.send(filename);
			}
		});
	});
});

app.get('/tweet_media', function() {
	var image = './public/snaps/phx-tag-soup.jpg',
		options = {
			status: 'Testing Crrnt Stts with pic!',
			media: image
		};

	console.log(image, options);
});


function nameFile() {
	var path = './public/snaps/',
		timestamp = new Date().toJSON();

	return path + 'image_' + timestamp + '.png';
}