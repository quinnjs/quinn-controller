'use strict';

exports.index = function(req, params) {
  return 'Many posts!';
};

exports.show = function(req, params) {
  return 'Show post ' + params.postId;
};
