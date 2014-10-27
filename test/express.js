/*global before, after, describe, it */
'use strict';

var http = require('http');

var assert = require('assertive');
var express = require('express');
var Bluebird = require('bluebird');
var concat = require('concat-stream');
var respond = require('quinn-respond');

var controller = require('../express');

describe('quinn-controller/express', function() {
  var action, server, baseUrl;

  function load(urlPath) {
    var url = baseUrl + urlPath;
    return new Bluebird(function(resolve, reject) {
      var req = http.get(url, function(res) {
        res.setEncoding('utf8');
        res.pipe(concat(function(body) {
          res.body = body;
          resolve(res);
        }));
      });
      req.on('error', reject);
    });
  }

  before(function(done) {
    var app = express();
    action = controller('test', {
      index: function() { return 'idx'; },
      echo: function(req, params) { return respond.json(params); },
      fancy: function() {
        return respond.json({ x: 52 }).status(409);
      }
    });

    app.get('/', action('index'));
    app.get('/fancy', action('fancy'));
    app.get('/echo/:id', action('echo', {
      params: function(req, params) {
        return { query: req.query.q, echoId: params.id, xtra: 'opt' };
      }
    }));

    server = http.createServer(app);
    server.listen(0, function() {
      baseUrl = 'http://127.0.0.1:' + this.address().port;
      done();
    });
  });

  after(function(done) {
    if (server && server._handle) { server.close(done); }
    else { done(); }
  });

  it('returns "idx" for index', function(done) {
    load('/')
      .then(function(res) {
        assert.equal(200, res.statusCode);
        assert.equal('idx', res.body);
      })
      .nodeify(done);
  });

  it('injects actionName/controllerName params', function(done) {
    load('/echo/1997?q=rap')
      .then(function(res) {
        var result = JSON.parse(res.body);
        assert.equal('test', result.controllerName);
        assert.equal('echo', result.actionName);
        assert.equal('rap', result.query);
        assert.equal('opt', result.xtra);
        assert.equal('1997', result.echoId);
      })
      .nodeify(done);
  });

  it('throws on unknown action', function() {
    var err = assert.throws(action.bind(null, 'missing'));
    assert.equal('Not a valid action: test.missing', err.message);
  });
});
