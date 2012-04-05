
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
	req.setEncoding('utf8');
	req.on('data', function(chunk) {
		// strip out "data:image/png;base64," from data stream
		console.log(chunk);
		console.log();
		var imageData = chunk.replace(/^data:image\/png;base64,/,"");
		console.log(imageData);
		console.log();
		var buffer = new Buffer(imageData, 'base64');
		console.log(buffer);
		fs.writeFile('images.png', buffer, function(err) {
			if (err) console.log('error saving');
			else console.log('it saved');
		});
	});

	req.on('end', function() {
		res.send('ok');
	});
});

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
