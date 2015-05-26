'use strict';

var BasicStrategy = require('passport-http'    ).BasicStrategy;
var User          = require('../models/User.js');

module.exports = function(passport) {
  passport.use('basic', new BasicStrategy({}, function(email, password, done) {
    User.findOne({'email': email}, function(err, user) {
      if (err     ) { return done('database error'); }
      if (!user   ) { return done('user not found'); }
      user.checkPassword(password, function(err, result) {
        if(!result) { return done('wrong password'); }

        return done(null, user);  // return user if no auth errors
      });
    });
  }));
};
