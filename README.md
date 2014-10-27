# quinn: controller

An almost simple controller system for quinn.

## Usage

### With express

```js
var controller = require('quinn-controller/express');
var respond = require('quinn-respond');

var action = controller({
  show: function(req, params) {
    return respond.json({
      id: params.postId,
      title: 'Hello World!'
    });
  }
});

var express = require('express');
var app = express();

// `params` is `req.params` by default
app.get('/posts/:postId', action('show'));

// hard-code params
app.get('/about', action('show', {
  params: { postId: 49 }
}));

// transform params, e.g. when using query or body params
app.get('/', action('show', {
  params: function(req, params) {
    return { postId: req.query.id };
  }
}));

app.listen(process.env.PORT || 3000);
```
