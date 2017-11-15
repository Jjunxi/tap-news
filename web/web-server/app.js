var express = require('express');
var path = require('path');

var index = require('./routes/index');
var news = require('./routes/news');

var app = express();

// connect mongodb
// var config = require('./config/config.json');
// require('./models/main.js').connect(config.mongoDbUri);
require('./models/main.js')

// view engine setup
app.set('view engine', 'jade');
app.set('views', path.join(__dirname, '../web-client/build/'));

app.use('/static', express.static(path.join(__dirname, '../web-client/build/static/')));

// TODO: remove this after development is done.
app.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});

app.use('/', index);
app.use('/news', news);

// catch 404 and forward to error handler
app.use(function(req, res) {
  var err = new Error('Not Found');
  err.status = 404;
  res.send('404 Not Found')
});

module.exports = app;
