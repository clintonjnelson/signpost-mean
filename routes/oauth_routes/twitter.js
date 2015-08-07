'use strict';

var bodyparser     = require('bodyparser'          );
var loadSendCookie = require('../../lib/routes_middleware/load_send_cookie.js');
var User           = require('../../models/User.js');


module.exports = function(app, passport) {
  app.use(bodyparser.json());

  // Redirect to twitter for auth
  app.get('/login/twitter',
    passport.authenticate('twitter',
      { session: false,
      }
    )
  );

  // Twitter redirects to here after auth
  app.get('/login/twitter/callback',
    passport.authenticate('twitter',
      { session: false,
        failureRedirect: '/#/login'   // only redirect for failure
      }
    ),
    loadSendCookie    // Middleware to load Eat cookie & send upon success
  );
}

