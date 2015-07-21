'use strict';
// Routes for OAUTH2 Login
// TODO: Break out each Oauth into separate modules to require in

var bodyparser     = require('body-parser'      );
var loadSendCookie = require('../lib/routes_middleware/load_send_cookie.js');
var User           = require('../models/User.js');


module.exports = function(app, passport) {
  app.use(bodyparser.json());

  // Facebook
  app.get('/auth/facebook',
    passport.authenticate('facebook',
      { session: false,
        scope:   ['public_profile', 'email']
      }
    )
  );

  // Facebook Redirect
  app.get('/auth/facebook/callback',
    passport.authenticate('facebook',
      { session:         false,
        failureRedirect: '/#/login'
      }
    ),
    loadSendCookie  // Middleware to load eat cookie & send upon success
  );
};






