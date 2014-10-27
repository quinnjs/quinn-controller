'use strict';

var Bluebird = require('bluebird');

function makeParamMapper(spec) {
  if (typeof spec === 'function') {
    return spec;
  } else if (spec) {
    return function() { return spec; };
  } else {
    return function(req, params) { return params; };
  }
}

function clone(obj) {
  var keys = Object.keys(obj), idx, l = keys.length, key;
  var out = {};
  for (idx = 0; idx < l; ++idx) {
    key = keys[idx];
    out[key] = obj[key];
  }
  return out;
}

function controller(controllerName, actions) {
  return function action(name, options) {
    options = options || {};

    var handler = actions[name];

    if (typeof handler !== 'function') {
      throw new Error(
        'Not a valid action: ' + controllerName + '.' + name);
    }

    var paramMapper = makeParamMapper(options.params);

    return function(req, params) {
      return Bluebird.try(paramMapper, [ req, params ])
        .then(clone)
        .then(function(mappedParams) {
          mappedParams.controllerName = controllerName;
          mappedParams.actionName = name;
          return handler(req, mappedParams);
        });
    };
  };
}

module.exports = controller;
