'use strict';
/* Manages creation of new wordpress signs with Oauth2.0
    If new user, will create user first & then sign
    If existing user, will create the sign for that user
*/

var WordpressStrategy   = require('passport-wordpress'           ).Strategy;
var WordpressSign       = require('../../models/WordpressSign.js');
var findOrMakeSign      = require('../sign_creation_handler.js'  ).findOrMakeSign;
var getWordpressInfo    = require('../api_data_requests/wordpress_api_data.js');
var loginSignupHandler  = require('../login_signup_handler.js'   );


module.exports = function(passport) {
  passport.use(new WordpressStrategy({
    clientID:     process.env.WORDPRESS_ID,
    clientSecret: process.env.WORDPRESS_SECRET,
    callbackURL:  process.env.WORDPRESS_CALLBACK_URL || 'http://127.0.0.1:3000/auth/wordpress/callback',
    passReqToCallback: true,
  },
  handleWordpressResponse   // see below
  ));
};

function handleWordpressResponse(req, accessToken, refreshToken, profile, done) {
  console.log("REQ.USER IN WORDPRESS STRATEGY AFTER OAUTH API RESPONSE IS: ", req.user);
  console.log("WORDPRESS RESPONSE PROFILE IS: ", profile);

  var userSignInfo = {
    accessToken: accessToken,
    wordpress: {
      getApiInfo: getWordpressInfo,
      SignModel:  WordpressSign,
      mongo: {
        authType:        'wordpress',
        authTypeId:      'wordpressId',
        accessToken:     'wordpressAccessToken',
        authIdPath:      'auth.wordpress.wordpressId',
        accessTokenPath: 'auth.wordpress.wordpressAccessToken',
      },
      apiFields: {            // fields from api parse file
        apiId:       'id',
        apiEmail:    'email',
        apiUsername: 'username'
      },
      profileId:       profile._json.ID,
      reqdProfileData: profile,         // all data is in profile.user obj
    },
    signType: 'wordpress',
    user:     req.user,
  };

  !!req.user ?
    // User logged in => add sign
    findOrMakeSign(req, userSignInfo, done) :
    // User NOT logged in => login/signup, add sign
    loginSignupHandler(req, userSignInfo, done);
}












