'use strict';

var bodyparser     = require('body-parser'         );
var loadSendCookie = require('../../lib/routes_middleware/load_send_cookie.js');
var User           = require('../../models/User.js');


module.exports = function(app, passport) {
  app.use(bodyparser.json());

  passport.serializeUser(function(user, done) {
    done(null, '1');
  });
  passport.deserializeUser(function(user, done) {
    done(null, user);
  });

  // Redirect to twitter for auth
  app.get('/login/twitter',
    passport.authenticate('twitter',
      {
      }
    )
  );

  // Twitter redirects to here after auth
  app.get('/login/twitter/callback',
    passport.authenticate('twitter',  // try to: hit api, find/make user, find/make sign
      {
        failureRedirect: '/#/login'   // only redirect for failure
      }
    ),
    loadSendCookie    // Middleware to load Eat cookie & send upon success
  );
};
