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
        apiEmail: 'email',   // undefined (no email provided)
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



  // User.findOne({ 'auth.twitter.twitterId': profile.id }, function(err, user) {
  //   if(err) { return done('database error finding user'); }
  //   if(!user || !user.auth.twitter.twitterId) {
  //     console.log("TWITTER PROFILE IS: ", profile);
  //     // No user found? make one.
  //     getTwitterInfo(accessToken, profile, function(err, twData) {
  //       if(err) {
  //         return done('error accessing twitter');
  //       }

  //       // Data for saving to db
  //       var userInfo = { 'auth.twitter.twitterId':          twData.id,
  //                        'auth.twitter.twitterAccessToken': accessToken,
  //                        email:                             null,
  //                        username:                          twData.name };

  //       // Find/create user
  //       User.create(userInfo, function(err, user) {
  //         if(err) { return done('Error saving user: ');}
  //         if(!user || !user.auth.twitter.twitterId) {
  //           console.log('Couldn not create user: ', user);
  //           return done('Could not create user.');
  //         }

  //         // New user => new sign => done
  //         return createTwSign(twData, user, done);
  //       });
  //     });
  //   }

  //   else {  // User found => update access token, find/make sign

  //   // Update access token
  //   user.auth.twitter.twitterAccessToken = accessToken;
  //   user.save();

  //   // Find or make sign
  //   TwitterSign.findOne( { twitterId: user.auth.twitter.twitterId }, function(err, twSign) {
  //     if(err) {
  //       console.log('Database error finding twitter sign: ', err);
  //       return done(err, null);
  //     }

  //     // No sign? make one.
  //     if(!twSign || !twSign.twitterId) {
  //       getTwitterInfo(accessToken, profile, function(err, twData) {
  //         if(err) {return done('error accessing twitter'); }

  //         return createTwSign(twData, user, done);
  //       });
  //     }

  //     // Sign found => DONE.
  //     return done(null, user);
  //   });
  //   }
  // });

  // function createTwSign(twData, user, data) {
  //   var newTwSign    = signBuilder.twitter(twData);  // build new sign with data
  //   newTwSign.userId = user._id;

  //   newTwSign.save(function(err, sign) {
  //     if(err) { console.log('Error saving twitter sign: ', err); }

  //     return done(null, user);  // saved. pass user. DONE.
  //   });
  // }
}
