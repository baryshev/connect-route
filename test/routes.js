'use strict';

const expect = require('chai').expect,
      route = require('../index');

describe('Router', function () {
  // this.route - has to be initialized by calling route()
  // this.serve - simulates a server call with the specificed URL
  // this.req   - allows inspecting the request object
  // this.next  - allows checking, if next() has been called
  before(function () {
    this.serve = function (method, url) {
      var req = {
            method: method,
            url: url
          },
          next = function () {
            next.called = true;
          };
      this.req = req;
      next.called = false;
      this.next = next;
      this.route(req, {}, next);
    };
  });

  describe('when matching the method', function () {
    it('matches all usual methods', function () {
      [
        'GET', 'POST', 'PUT', 'HEAD', 'PATCH', 'DELETE', 'CONNECT',
        'OPTIONS', 'TRACE', 'COPY', 'LOCK', 'MKCOL', 'MOVE', 'PROPFIND',
        'PROPPATCH', 'UNLOCK', 'REPORT', 'MKACTIVITY', 'CHECKOUT', 'MERGE'
      ].forEach(function (method) {
        this.route = route(function (router) {
          var route = router[method.toLowerCase()];
          expect(route).to.be.a('function');
          route.call(router, '/', function (req, res, next) {});
        });
        this.serve(method, '/');
        expect(this.next.called).to.equal(false);
      }, this);
    });

    it('does not match an invalid method', function () {
      this.route = route(function (router) {
        router.get('/', function (req, res, next) {});
      });
      this.serve('TEST', '/');
      expect(this.next.called).to.equal(true);
    });

    it('matches an upper-case method', function () {
      this.route = route(function (router) {
        router.get('/', function (req, res, next) {});
      });
      this.serve('GET', '/');
      expect(this.next.called).to.equal(false);
    });

    it('does not match a lower-case method', function () {
      this.route = route(function (router) {
        router.get('/', function (req, res, next) {});
      });
      this.serve('get', '/');
      expect(this.next.called).to.equal(true);
    });
  });

  describe('when matching the path', function () {
    it('matches the root path (/) only', function () {
      this.route = route(function (router) {
        router.get('/', function (req, res, next) {});
      });
      this.serve('GET', '/');
      expect(this.next.called).to.equal(false);
    });

    it('matches using case-sensitive string comparisons', function () {
      this.route = route(function (router) {
        router.get('/test', function (req, res, next) {});
      });
      this.serve('GET', '/TEST');
      expect(this.next.called).to.equal(true);
    });

    it('matches a path with a single part (/test) only', function () {
      this.route = route(function (router) {
        router.get('/test', function (req, res, next) {});
      });
      this.serve('GET', '/test');
      expect(this.next.called).to.equal(false);
    });

    it('matches a path with two parts (/test1/test2) only', function () {
      this.route = route(function (router) {
        router.get('/test1/test2', function (req, res, next) {});
      });
      this.serve('GET', '/test1/test2');
      expect(this.next.called).to.equal(false);
    });

    it('does not match an extra part at the beginning of the path (/test)', function () {
      this.route = route(function (router) {
        router.get('/test', function (req, res, next) {});
      });
      this.serve('GET', '/start/test');
      expect(this.next.called).to.equal(true);
    });

    it('does not match an extra part at the end of the path (/test)', function () {
      this.route = route(function (router) {
        router.get('/test', function (req, res, next) {});
      });
      this.serve('GET', '/test/end');
      expect(this.next.called).to.equal(true);
    });

    it('does not match a missing part at the end of the path (/test1/test2)', function () {
      this.route = route(function (router) {
        router.get('/test1/test2', function (req, res, next) {});
      });
      this.serve('GET', '/test1');
      expect(this.next.called).to.equal(true);
    });

    it('does not match a missing part at the beginning of the path (/test1/test2)', function () {
      this.route = route(function (router) {
        router.get('/test1/test2', function (req, res, next) {});
      });
      this.serve('GET', '/test2');
      expect(this.next.called).to.equal(true);
    });

    it('matches a parametrized part at the path beginning (/:id)', function () {
      this.route = route(function (router) {
        router.get('/:id', function (req, res, next) {});
      });
      this.serve('GET', '/test');
      expect(this.next.called).to.equal(false);
      expect(this.req.params.id).to.equal('test');
    });

    it('matches a parametrized part at the path end (/start/:id)', function () {
      this.route = route(function (router) {
        router.get('/start/:id', function (req, res, next) {});
      });
      this.serve('GET', '/start/test');
      expect(this.next.called).to.equal(false);
      expect(this.req.params.id).to.equal('test');
    });

    it('matches a parametrized part in the middle of the path (/start/:id/end)', function () {
      this.route = route(function (router) {
        router.get('/start/:id/end', function (req, res, next) {});
      });
      this.serve('GET', '/start/test/end');
      expect(this.next.called).to.equal(false);
      expect(this.req.params.id).to.equal('test');
    });

    it('matches two parametrized parts of the path (/:id/:type)', function () {
      this.route = route(function (router) {
        router.get('/:id/:type', function (req, res, next) {});
      });
      this.serve('GET', '/test1/test2');
      expect(this.next.called).to.equal(false);
      expect(this.req.params.id).to.equal('test1');
      expect(this.req.params.type).to.equal('test2');
    });
  });
});
