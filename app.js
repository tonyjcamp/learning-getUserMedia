
/**
 * Module dependencies.
 */

var express = require('express');

// shorthand server
var app = express.createServer();

// config public directory
app.use(express.static(__dirname + '/public'));

// Routes

app.get('/', function(request, response) {
  response.render('index');
});

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
