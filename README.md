# About 
Simple and fast router for Connect

# Installation

    npm install connect-route

# Usage

```js
var
    connectRoute = require('connect-route'),
    connect = require('connect'),
    app = connect();

app.use(connectRoute(function (router) {
    router.get('/', function (req, res, next) {
        res.end('index');
    });

    router.get('/home', function (req, res, next) {
        res.end('home');
    });

    router.get('/home/:id', function (req, res, next) {
        res.end('home ' + req.params.id);
    });

    // this will match any path length >= 2 (example: /home/arg1, /home/arg1/arg2, /home/arg1/arg2/...)
    router.get('/home/**', function (req, res, next) {
        res.end('home ' + req.params['**'].join('/'));
    });
    
    router.post('/home', function (req, res, next) {
        res.end('POST to home');
    });
}));

app.listen(3000);
```
