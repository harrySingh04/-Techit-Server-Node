var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose')
var passport = require('./passport');

var indexRouter = require('./routes/index');
var loginRouter = require('./routes/login');
var usersRouter = require('./routes/users');
var unitsRouter = require('./routes/units');
var ticketsRouter = require('./routes/tickets');

var app = express();

function errorHandler(err, req, res, next) {
  if (err) {
    res.status(500).send({
      message: err
    })
  }
}


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(passport.initialize());
app.use('/', indexRouter);
app.use('/api/login', loginRouter);
app.use('/api/', passport.authenticate('jwt', {
  session: false,
  failWithError: false
}));
app.use('/api/users', usersRouter);
app.use('/api/units', unitsRouter);
app.use('/api/tickets', ticketsRouter)
app.use(errorHandler)

mongoose.connect(process.env.DBURL);

module.exports = app;
