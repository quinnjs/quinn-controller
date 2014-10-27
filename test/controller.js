/*global before, describe, it */
'use strict';

var assert = require('assertive');

var controller = require('../');

describe('quinn-controller', function() {
  var action;

  before(function() {
    action = controller('test', {
      index: function() { return 'idx'; },
      echo: function(req, params) { return params; }
    });
  });

  it('returns "idx" for index', function(done) {
    action('index')(null, {})
      .then(function(result) {
        assert.equal('idx', result);
      })
      .nodeify(done);
  });

  it('injects actionName/controllerName params', function(done) {
    var originalParams = { xtra: 'opt' };
    action('echo')(null, originalParams)
      .then(function(result) {
        assert.equal(originalParams.xtra, result.xtra);
        assert.equal('test', result.controllerName);
        assert.equal('echo', result.actionName);

        // did not mutate original params
        assert.notEqual(originalParams, result);
        assert.equal(undefined, originalParams.actionName);
      })
      .nodeify(done);
  });

  it('throws on unknown action', function() {
    var err = assert.throws(action.bind(null, 'missing'));
    assert.equal('Not a valid action: test.missing', err.message);
  });
});
