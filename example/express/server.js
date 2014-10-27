'use strict';

var express = require('express');
var app = express();

app.use(require('./lib/posts/router'));

var http = require('http');
var server = http.createServer(app);

server.listen(process.env.PORT || 3000, function() {
  var url = 'http://127.0.0.1:' + this.address().port + '/';
  console.log('Started: %s', url);
});
