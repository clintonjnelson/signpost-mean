'use strict';
/* Manages creation of new google signs with Oauth2.0
    If new user, will create user first & then sign
    If existing user, will create the sign for that user
*/

var findOrMakeSign     = require('../sign_creation_handler.js').findOrMakeSign;
var getGoogleInfo      = require('../api_data_requests/google_api_data.js');
var GoogleStrategy     = require('passport-google-oauth'      ).OAuth2Strategy;
var GoogleSign         = require('../../models/GoogleSign.js' );
var loginSignupHandler = require('../login_signup_handler.js' );


module.exports = function(passport) {
  passport.use(new GoogleStrategy({
    clientID:     process.env.GOOGLE_ID,
    clientSecret: process.env.GOOGLE_SECRET,
    callbackURL:  process.env.GOOGLE_CALLBACK_URL || 'http://127.0.0.1:3000/auth/google/callback',
    passReqToCallback: true,
  },
  handleGoogleResponse  // see below
  ));
};


// google sends data into this callback
function handleGoogleResponse(req, accessToken, refreshToken, profile, done) {
  console.log("REQ.USER IN FACEBOOK STRATEGY AFTER OAUTH API RESPONSE IS: ", req.user);


  var userSignInfo = {
    accessToken: accessToken,
    google: {
      getApiInfo: getGoogleInfo,
      SignModel:  GoogleSign,
      mongo: {
        authType:         'google',
        authTypeId:       'googleId',
        accessToken:      'googleAccessToken',
        authIdPath:       'auth.google.googleId',
        accessTokenPath:  'auth.google.googleAccessToken',
      },
      apiFields: {          // where each piece of data is kept in API response
        apiId:        'id',
        apiEmail:     'email',
        apiUsername:  'displayName',
      },
      profileId:       profile.id,
      reqdProfileData: profile,
    },
    signType: 'google',
    user:     req.user,
  };

  !!req.user ?
    // User logged in => add sign
    findOrMakeSign(req, userSignInfo, done) :
    // User NOT logged in => login/signup, add sign
    loginSignupHandler(req, userSignInfo, done);
}













