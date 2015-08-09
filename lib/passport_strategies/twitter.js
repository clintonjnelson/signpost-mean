'use strict';
/* Manages creation of new twitter signs with Oauth1a
    If new user, will create user first & then sign
    If existing user, will create the sign for that user
*/

var findOrMakeSign     = require('../sign_creation_handler.js' ).findOrMakeSign;
var getTwitterInfo     = require('../api_data_requests/twitter_api_data.js');
var loginSignupHandler = require('../login_signup_handler.js'  );
var TwitterStrategy    = require('passport-twitter'            ).Strategy;
var TwitterSign        = require('../../models/TwitterSign.js' );



module.exports = function(passport) {
  passport.use(new TwitterStrategy({
    consumerKey:    process.env.TWITTER_KEY,
    consumerSecret: process.env.TWITTER_SECRET,
    callbackUrl:    process.env.TWITTER_CALLBACK_URL || 'http://127.0.0.1:3000/auth/twitter/callback',
    passReqToCallback: true,
  },
    handleTwitterResponse
  ));
};


// twitter sends data directly into this callback
function handleTwitterResponse(req, accessToken, refreshSecret, profile, done) {
  var userSignInfo = {
    accessToken: accessToken,
    twitter: {
      getApiInfo: getTwitterInfo,   // function
      SignModel: TwitterSign,       // model Constructor Function
      mongo: {
        authType: 'twitter',
        authTypeId: 'twitterId',
        accessToken: 'twitterAccessToken',
        authIdPath: 'auth.twitter.twitterId',
        accessTokenPath: 'auth.twitter.twitterAccessToken',
      },
      apiFields: {
        apiId: 'id',
        apiEmail: 'email',         // undefined (no email provided)
        apiUsername: 'name',
      },
      profileId: profile.id,
      reqdProfileData: profile,    // had all needed data (less than full request tho)
    },
    signType: 'twitter',
    user: req.user,
  };

  req.user ?
    // If user logged in => add sign.
    findOrMakeSign(req, userSignInfo, done) :
    // No user not logged in => login/signup, add sign.
    loginSignupHandler(req, userSignInfo, done);

}
