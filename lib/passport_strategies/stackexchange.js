'use strict';
/* Manages creation of new stackexchange signs with Oauth2.0
    If new user, will create user first & then sign
    If existing user, will create the sign for that user
*/

var StackexchangeStrategy   = require('passport-stackexchange'           ).Strategy;
var StackexchangeSign       = require('../../models/StackexchangeSign.js');
var findOrMakeSign          = require('../sign_creation_handler.js'      ).findOrMakeSign;
var getStackexchangeInfo    = require('../api_data_requests/stackexchange_api_data.js');
var loginSignupHandler      = require('../login_signup_handler.js'       );


module.exports = function(passport) {
  passport.use(new StackexchangeStrategy({
    key:          process.env.STACKEXCHANGE_KEY,
    clientID:     process.env.STACKEXCHANGE_ID,
    clientSecret: process.env.STACKEXCHANGE_SECRET,
    callbackURL:  process.env.STACKEXCHANGE_CALLBACK_URL || 'http://127.0.0.1:3000/auth/stackexchange/callback',
    passReqToCallback: true,
  },
  handleStackexchangeResponse   // see below
  ));
};

function handleStackexchangeResponse(req, accessToken, refreshToken, profile, done) {
  console.log("REQ.USER IN STACKEXCHANGE STRATEGY AFTER OAUTH API RESPONSE IS: ", req.user);
  console.log("STACKEXCHANGE RESPONSE PROFILE IS: ", profile);

  var userSignInfo = {
    accessToken: accessToken,
    stackexchange: {
      getApiInfo: getStackexchangeInfo,
      SignModel:  StackexchangeSign,
      mongo: {
        authType:        'stackexchange',
        authTypeId:      'stackexchangeId',
        accessToken:     'stackexchangeAccessToken',
        authIdPath:      'auth.stackexchange.stackexchangeId',
        accessTokenPath: 'auth.stackexchange.stackexchangeAccessToken',
      },
      apiFields: {            // fields from api parse file
        apiId:       'account_id',
        apiEmail:    'email',
        apiUsername: 'display_name'
      },
      profileId:       profile.account_id,
      reqdProfileData: profile,         // all data is in profile.user obj
    },
    signType: 'stackexchange',
    user:     req.user,
  };

  !!req.user ?
    // User logged in => add sign
    findOrMakeSign(req, userSignInfo, done) :
    // User NOT logged in => login/signup, add sign
    loginSignupHandler(req, userSignInfo, done);
}












