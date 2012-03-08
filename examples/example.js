var
	connectRoute = require('../index');
	connect = require('connect'),
	server = connect();

server.use(connectRoute(function (router) {
	router.get('/', function (req, res, next) {
		res.end('index');
	});

	router.get('/home', function (req, res, next) {
		res.end('home');
	});

	router.get('/home/:id', function (req, res, next) {
		res.end('home ' + req.params.id);
	});
}));

server.listen(3000);