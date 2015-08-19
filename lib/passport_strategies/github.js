'use strict';
/* Manages creation of new facebook signs with Oauth2.0
    If new user, will create user first & then sign
    If existing user, will create the sign for that user
*/

var GithubStrategy     = require('passport-github'            ).Strategy;
var GithubSign         = require('../../models/GithubSign.js' );
var findOrMakeSign     = require('../sign_creation_handler.js').findOrMakeSign;
var getGithubInfo      = require('../api_data_requests/github_api_data.js');
var loginSignupHandler = require('../login_signup_handler.js' );


module.exports = function(passport) {
  passport.use(new GithubStrategy({
    clientID: process.env.GITHUB_ID,
    clientSecret: process.env.GITHUB_SECRET,
    callbackURL: process.env.GITHUB_CALLBACK_URL || 'http://127.0.0.1:3000/auth/github/callback',
    passReqToCallback: true,
  },
  handleGithubResponse  // see below
  ));
};

function handleGithubResponse(req, accessToken, refreshToken, profile, done) {

  var userSignInfo = {
    accessToken: accessToken,
    github: {
      getApiInfo: getGithubInfo,
      SignModel:  GithubSign,
      mongo: {
        authType:        'github',
        authTypeId:      'githubId',
        accessToken:     'githubAccessToken',
        authIdPath:      'auth.github.githubId',
        accessTokenPath: 'auth.github.githubAccessToken',
      },
      apiFields: {
        apiId:       'id',
        apiEmail:    'email',      // don't use????
        apiUsername: 'username',
      },
      profileId:       profile.id,
      reqdProfileData: profile,    // pass since has all needed
    },
    signType: 'github',
    user:     req.user,
  };

  !!req.user ?
    // User logged in => add sign.
    findOrMakeSign(req, userSignInfo, done) :
    // User NOT logged in => login/signup, add sign.
    loginSignupHandler(req, userSignInfo, done);
}
