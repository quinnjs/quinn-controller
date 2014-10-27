'use strict';

var Bluebird = require('bluebird');
var respond = require('quinn-respond');

var controller = require('./');

function toExpress(handler) {
  return function(req, res, next) {
    Bluebird.try(handler, [ req, req.params ])
      .then(function(result) {
        if (result === undefined) {
          return next();
        }
        respond(result).pipe(res);
      })
      .catch(function(error) {
        next(error);
      });
  };
}

function expressController(controllerName, actions) {
  var _action = controller(controllerName, actions);

  return function action(name, options) {
    return toExpress(_action(name, options));
  };
}

module.exports = expressController;
