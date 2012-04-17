
var routes = function(app) {
	app.get('/', function(req, res) {
		res.render('index', {
			title: 'Booth'
		});
	});
};

module.exports = routes;