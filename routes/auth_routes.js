'use strict';

var bodyparser = require('body-parser'       );
var eatAuth    = require('../lib/eat_auth.js')(process.env.AUTH_SECRET);
var User       = require('../models/User.js' );

module.exports = function(router, passport) {
  router.use(bodyparser.json());

  // Existing user login
  router.get('/login', passport.authenticate('basic', { session: false }), function(req, res) {
    req.user.generateToken(process.env.AUTH_SECRET, function(err, eat) {  // passport strat adds req.user
      if (err) {
        console.log('Error logging in user. Error: ', err);
        return res.status(500).json({ error: true });
      }
      res.json({eat: eat});
    });
  });

  // User signout
  router.get('/logout', eatAuth, function(req, res) {
    req.user.invalidateToken(function(err, result) {
      if (err) return res.status(500).json({ error: true });

      res.json({ success: true });
    });
  });
};
