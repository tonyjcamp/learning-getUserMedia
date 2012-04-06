
/**
 * Module dependencies.
 */

var express = require('express'),
	fs = require('fs');

// shorthand server
var app = express.createServer();

// config public directory
app.use(express.static(__dirname + '/public'));

// Routes

app.get('/', function(req, res) {
  res.render('index');
});

app.post('/snap', function(req, res) {
	var imageData = '';

	req.on('data', function(chunk) {
		imageData += chunk;
	});

	req.on('end', function() {
		imageData = imageData.replace(/^data:image\/png;base64,/,"");
		
		var buffer = new Buffer(imageData, 'base64'),
			time = new Date().toJSON();
		
		fs.writeFile('./public/snaps/images_' + time + '.png', buffer, function(err) {
			if (err) console.log('error saving');
			else console.log('it saved');
		});

		res.send(imageData);
	});
});

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
