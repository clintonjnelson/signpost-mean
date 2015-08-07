'use strict';

var FacebookStrategy = require('passport-facebook'               ).Strategy;
var FacebookSign     = require('../../models/FacebookSign.js'             );
var getFacebookInfo  = require('../api_data_requests/facebook_api_data.js');
var signBuilder      = require('../sign_builder.js'                       );
var User             = require('../../models/User.js'                     );

module.exports = function(passport) {
  passport.use(new FacebookStrategy({
    clientID:     process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL:  process.env.FACEBOOK_CALLBACK_URL || 'http://localhost:3000/login/facebook/callback'
  },
  handleFacebookResponse
  ));
};


function handleFacebookResponse(accessToken, refreshToken, profile, done) {

  User.findOne({ 'auth.facebook.facebookId': profile.id }, function(err, user) {
    if (err) { return done('error saving user'); }
    if (!user || !user.auth.facebook.facebookId) {

      // no user? make one.
      getFacebookInfo(accessToken, function(err, fbData) {
        if(err) {
          return res.status(500).json({error: true, msg: 'error accessing facebook login'});
        }

        // Data for saving to DB
        var userInfo = { 'auth.facebook.facebookId':          fbData.id,
                         'auth.facebook.facebookAccessToken': accessToken,
                          email:                              fbData.link,
                          username:                           fbData.name };

        // find/create User & update access token
        User.create(userInfo, function(err, user) {
            if (err) { return done('error saving user'); }
            if (!user || !user.auth.facebook.facebookId) {
              console.log('Could not create user: ', user);
              return done('could not create user');
            }

            // new user => new sign => DONE.
            return createFbSign(fbData, user, done);
        });
      });
    }

    else {  // user found? find or make sign.
      FacebookSign.findOne( {facebookId: user.auth.facebook.facebookId}, function(err, fbSign) {
        if (err) {
          console.log('Database error: ', err);
          return done(err, null);
        }

        // no sign? make one.
        if(!fbSign || !fbSign.facebookId) {
          getFacebookInfo(accessToken, function(err, fbData) {
            if(err) {
              return res.status(500).json({error: true, msg: 'error accessing facebook login'});
            }

            return createFbSign(fbData, user, done);
          });
        }

        // sign found => DONE.
        return done(null, user);  // sign exists. pass user & continue.
      });
    }
  });


  function createFbSign(fbData, user, done) {
    var newFbSign    = signBuilder.facebook(fbData); // build new sign w/data
    newFbSign.userId = user._id,                     // set userId reference

    newFbSign.save(function(err, sign) {
      if (err) { console.log('Error saving facebook sign: ', err); }

      return done(null, user);  // saved. pass user & continue
    });
  }
}
