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
    done(null, '1');
  });

  // Redirect to twitter for auth
  app.get('/login/twitter',
    passport.authenticate('twitter',
      {
        // session: false,            // oauth 1.0a requires session
      }
    )
  );

  // Twitter redirects to here after auth
  app.get('/login/twitter/callback',
    passport.authenticate('twitter',  // try to: hit api, find/make user, find/make sign
      { // session: false,            // oauth 1.0a requires session
        failureRedirect: '/#/login'   // only redirect for failure
      }
    ),
    loadSendCookie    // Middleware to load Eat cookie & send upon success
  );
};

