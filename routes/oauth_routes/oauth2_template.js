'use strict';
/*Template for Creating Oauth2 Api Routes

  Example of apiData object
    { passportType: 'facebook',
      scope: ['public_profile', 'email'],
    };
*/


var bodyparser     = require('body-parser'         );
var eatAuth        = require('../../lib/routes_middleware/eat_auth.js'     )(process.env.AUTH_SECRET);
var loadEatUser    = require('../../lib/routes_middleware/load_eat_user.js')(process.env.AUTH_SECRET);
var loadSendCookie = require('../../lib/routes_middleware/load_send_cookie.js');
var User           = require('../../models/User.js');


module.exports = function(app, passport, apiData) {
    app.use(bodyparser.json());


    //---------------------------------- LOGIN -----------------------------------
    // Redirect to API for auth
    app.get('/login/' + apiData.passportType,
      passport.authenticate(apiData.passportType,  // type of passport to use
        { session: false,
          scope:   apiData.scope,
        }
      )
    );

    // API redirects to here after auth
    app.get('/auth/' + apiData.passportType + '/callback',
      loadEatUser,                                // check for eat token, load if valid. For: AUTO-SIGN
      passport.authenticate(apiData.passportType, // try to: hit api, find/make user, find/make sign
        { session:         false,
          failureRedirect: '/#/',                 // TODO: Error handle (client: guest(noEat), user(Eat))
        }
      ),
      loadSendCookie                              // Middleware to load eat cookie & send. For: SIGNUP/LOGIN
    );


    //-------------------------------- AUTO SIGN ---------------------------------
    app.get('/auto/' + apiData.passportType,
      eatAuth,                                    // verify & load user in req
      passport.authenticate(apiData.passportType,
        { session: false,
          scope:   apiData.scope,
        }
      )
    );
};
