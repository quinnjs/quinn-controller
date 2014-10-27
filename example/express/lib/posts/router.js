'use strict';

var action =
  require('../../../../express')('posts', require('./controller'));

var app = require('express').Router();

app.get('/', action('index'));
app.get('/posts/:postId', action('show'));

module.exports = app;
