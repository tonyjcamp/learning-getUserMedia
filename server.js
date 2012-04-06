
/**
 * Module dependencies.
 */

var express = require('express'),
	routes = require('./routes');
	fs = require('fs');

// shorthand server
var app = express.createServer();

// Configuration
app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
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
  res.render('index', {
  	title: 'getUserMedia',
  	user: 'olu'
  });
});

app.get('/please', function(req, res) {
  res.render('please', { title: 'Please' });
});

app.post('/snap', function(req, res) {
	var imageData = '';

	req.on('data', function(chunk) {
		imageData += chunk;
	});

	req.on('end', function() {
		imageData = imageData.replace(/^data:image\/png;base64,/,"");
		
		var buffer = new Buffer(imageData, 'base64'),
			filename = nameFile();
		
		fs.writeFile(filename, buffer, function(err) {
			if (err) {
				console.log('error saving');
			}
			else {
				console.log('It saved!');
				res.send(filename);
			}
		});
	});
});


function nameFile() {
	var path = './public/snaps/',
		timestamp = new Date().toJSON();

	return path + 'image_' + timestamp + '.png';
}



var port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log("Listening on " + port);
});

console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
