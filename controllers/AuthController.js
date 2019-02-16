const passport = require('passport');
const User = require('../models/User');
const userController = {};

userController.register = function(req, res) {
  res.render('register', { error: '' });
};
userController.doRegister = function(req, res) {
  User.register(new User({
      username: req.body.username,
      name: req.body.name
    }),
    req.body.password,
    function(err) {
      if(err) {
        return res.render('register', { error: 'Please fill all blank' });
      }

      passport.authenticate('local')(req, res, function() {
        res.redirect('/');
    });
  });
};
userController.login = function(req, res) {
  res.render('login');
};
userController.doLogin = function(req, res) {
  passport.authenticate('local')(req, res, function() {
    res.redirect('/');
  });
};
userController.logout = function(req, res) {
  req.logout();
  res.redirect('/');
};

module.exports = userController;
