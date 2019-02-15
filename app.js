const express = require('express');
const index = require('./routes/index');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const DB_URL = 'mongodb://localhost:27017/codewars';
mongoose.connect(DB_URL);

const db = mongoose.connection;
db.once('open', function() {
  console.log('connected to database at ' + DB_URL);
});

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/', index);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
