'use strict';

var Bluebird = require('bluebird');
var respond = require('quinn-respond');
var toExpress = require('quinn-express');

var controller = require('./');

function expressController(controllerName, actions) {
  var _action = controller(controllerName, actions);

  return function action(name, options) {
    return toExpress(_action(name, options));
  };
}

module.exports = expressController;
