'use strict';
/* Manages creation of new instagram signs with Oauth2.0
    If new user, will create user first & then sign
    If existing user, will create the sign for that user
*/

var InstagramStrategy   = require('passport-instagram'           ).Strategy;
var InstagramSign       = require('../../models/InstagramSign.js');
var findOrMakeSign      = require('../sign_creation_handler.js'  ).findOrMakeSign;
var getInstagramInfo    = require('../api_data_requests/instagram_api_data.js');
var loginSignupHandler  = require('../login_signup_handler.js'   );

console.log("CLIENT ID IS: ", process.env.INSTAGRAM_ID);

module.exports = function(passport) {
  passport.use(new InstagramStrategy({
    clientID:     process.env.INSTAGRAM_ID,
    clientSecret: process.env.INSTAGRAM_SECRET,
    callbackURL:  process.env.INSTAGRAM_CALLBACK_URL || 'http://127.0.0.1:3000/auth/instagram/callback',
    passReqToCallback: true,
  },
  handleInstagramResponse   // see below
  ));
};

function handleInstagramResponse(req, accessToken, refreshToken, profile, done) {
  console.log("REQ.USER IN INSTAGRAM STRATEGY AFTER OAUTH API RESPONSE IS: ", req.user);
  console.log("INSTAGRAM RESPONSE PROFILE IS: ", profile);

  var userSignInfo = {
    accessToken: accessToken,
    instagram: {
      getApiInfo: getInstagramInfo,
      SignModel:  InstagramSign,
      mongo: {
        authType:        'instagram',
        authTypeId:      'instagramId',
        accessToken:     'instagramAccessToken',
        authIdPath:      'auth.instagram.instagramId',
        accessTokenPath: 'auth.instagram.instagramAccessToken',
      },
      apiFields: {            // fields from api parse file
        apiId:       'id',
        apiEmail:    'email',
        apiUsername: 'username'
      },
      profileId:       profile.id,
      reqdProfileData: profile,         // all data is in profile.user obj
    },
    signType: 'instagram',
    user:     req.user,
  };

  !!req.user ?
    // User logged in => add sign
    findOrMakeSign(req, userSignInfo, done) :
    // User NOT logged in => login/signup, add sign
    loginSignupHandler(req, userSignInfo, done);
}












