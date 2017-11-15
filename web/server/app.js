var bodyParser = require('body-parser');
var express = require('express');
var path = require('path');
var cors = require('cors');
var passport = require('passport');
var index = require('./routes/index');
var news = require('./routes/news');
var auth = require('./routes/auth');

var app = express();

// connect mongodb
require('./models/main.js')

// view engine setup
app.set('view engine', 'jade');
app.set('views', path.join(__dirname, '../web-client/build/'));

app.use('/static', express.static(path.join(__dirname, '../web-client/build/static/')));
app.use(bodyParser.json());

// load passport strategies
app.use(passport.initialize());
var localSignupStrategy = require('./passport/signup_passport');
var localLoginStrategy = require('./passport/login_passport');
passport.use('local-signup', localSignupStrategy);
passport.use('local-login', localLoginStrategy);

// TODO: remove this after development is done.
// app.all('*', function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "X-Requested-With");
//   next();
// });
app.use(cors());

app.use('/', index);
app.use('/auth', auth);

// pass the authenticaion checker middleware
const authCheckMiddleware = require('./middleware/auth_checker');
app.use('/news', authCheckMiddleware);
app.use('/news', news);

// catch 404 and forward to error handler
app.use(function(req, res) {
  var err = new Error('Not Found');
  err.status = 404;
  res.send('404 Not Found')
});

module.exports = app;
