'use strict';

var getTwitterInfo  = require('../api_data_requests/twitter_api_data.js');
var signBuilder     = require('../sign_builder.js'          );
var TwitterStrategy = require('passport-twitter'            ).Strategy;
var TwitterSign     = require('../../models/TwitterSign.js' );
var User            = require('../sign_builder.js'          );

module.exports = function(passport) {
  passport.use(new TwitterStrategy({
    consumerKey:    process.env.TWITTER_KEY,
    consumerSecret: process.env.TWITTER_SECRET,
    callbackUrl:    process.env.TWITTER_CALLBACK_URL || 'http://localhost:3000/login/twitter/callback',
    passReqToCallback: true,
  },
    handleTwitterResponse
  }));
};

function handleTwitterResponse(req, accessToken, refreshSecret, profile, done) {
  User.findOne({ 'auth.twitter.twitterId': profile.id }, function(err, user) {
    if(err) { return done('database error finding user'); }
    if(!user || !user.auth.twitter.twitterId) {

      // No user found? make one.
      getTwitterInfo(accessToken, function(err, twData) {
        if(err) {
          return res.status(500).json(error: true, msg: 'error accessing twitter');
        }

        // Data for saving to db
        var userInfo = { 'auth.twitter.twitterId':          twData.id,
                         'auth.twitter.twitterAccessToken': accessToken,
                         email:                             twData.link,
                         username:                          twData.name };

        // Find/create user
        User.create(userInfo, function(err, user) {
          if(err) { return done('Error saving user: ');}
          if(!user || !user.auth.facebook.facebookId) {
            console.log('Couldn not create user: ', user);
            return done('Could not create user.')
          }

          // New user => new sign => done
          return createTwSign(twData, user, done);
        });
      });
    }

    else {  // User found => update access token, find/make sign

    // Update access token
    user.auth.twitterAccessToken = accessToken;
    user.save();

    // Find or make sign
    TwitterSign.findOne( { twitterId: user.auth.twitter.twitterId }, function(err, twSign) {
      if(err) {
        console.log('Database error finding twitter sign: ', err);
        return done(err, null);
      }

      // No sign? make one.
      if(!twSign || !twSign.twitterId) {
        getTwitterInfo(accessToken, function(err, twData) {
          if(err) {return res.status(500).json({error: true, msg: 'error accessing twitter'}); }

          return createTwSign(twData, user, done);
        });
      }

      // Sign found => DONE.
      return done(null, user);
    });
    }
  });

  function createTwSign(twData, user, data) {
    var newTwSign    = signBuilder.twitter(twData);  // build new sign with data
    newTwSign.userId = user._id;

    newTwSign.save(function(err, sign) {
      if(err) { console.log('Error saving twitter sign: ', err); }

      return done(null, user);  // saved. pass user. DONE.
    })
  }
}
