'use strict';
var bodyparser     = require('body-parser'         );
var eatAuth        = require('../../lib/routes_middleware/eat_auth.js')(process.env.AUTH_SECRET);
var loadEatUser    = require('../../lib/routes_middleware/load_eat_user.js')(process.env.AUTH_SECRET);
var loadSendCookie = require('../../lib/routes_middleware/load_send_cookie.js');
var User           = require('../../models/User.js');


module.exports = function(app, passport) {
  app.use(bodyparser.json());


  //---------------------------------- LOGIN -----------------------------------
  // Redirect to facebook for auth
  app.get('/login/facebook',
    passport.authenticate('facebook',
      { session: false,
        scope:   ['public_profile', 'email']
      }
    )
  );

  // Facebook redirects to here after auth
  app.get('/auth/facebook/callback',
    loadEatUser,                      // check for eat token, load if valid. For: AUTO-SIGN
    passport.authenticate('facebook', // try to: hit api, find/make user, find/make sign
      { session:         false,
        failureRedirect: '/#/signs'   // TODO: Error handle (client: guest(noEat), user(Eat))
      }
    ),
    loadSendCookie  // Middleware to load eat cookie & send. For: SIGNUP/LOGIN
  );


  //-------------------------------- AUTO SIGN ---------------------------------
  app.get('/auto/facebook',
    eatAuth,                                // verify & load user in req
    passport.authenticate('facebook',
      { session: false,
        scope:   ['public_profile', 'email']
      }
    )
  );
};
