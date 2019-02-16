const express = require('express');
const index = require('./routes/index');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const DB_URL = 'mongodb://localhost:27017/codewars';
const User = require('./models/User');

mongoose.Promise = global.Promise;
mongoose.connect(DB_URL)
  .then(() => console.log('connection successful'))
  .catch(err => console.log(err));

app.use(require('express-session')({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use((new LocalStrategy(User.authenticate())));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/', index);

app.use(function(req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
