'use strict';

var FacebookStrategy = require('passport-facebook').Strategy;
var FacebookSign     = require('../../models/FacebookSign.js');
var User             = require('../../models/User.js'        );

module.exports = function(passport) {
  passport.use(new FacebookStrategy({
    clientID:     process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL:  process.env.FACEBOOK_CALLBACK_URL || 'http://localhost:3000/auth/facebook/callback'
  },
  handleFacebookResponse
  ));
};


function handleFacebookResponse(accessToken, refreshToken, profile, done) {
  console.log('PROFILE OBJECT IS: ', profile);
  // Data for saving to DB
  var userInfo = { 'auth.facebookId': profile.id,
                   'auth.facebookAccessToken: accessToken'}

  // find/create User & update access token
  User.findOneAndUpdate(
    { 'auth.facebookId': profile.id },  // query
    userInfo,                           // data to save
    { upsert: true, new: true },        // options
    userCallback                        // callback function
  );


  // called once user is found/created
  function userCallback(err, user) {
    if (err) { return done('error saving user'); }
    if (!user || !user.auth.facebookId) {
      console.log('User returned in FB Strategy is: ', user);
      return done('could not create user');
    }

    // user found, look for existing fbSign or create one
    FacebookSign.findOne( {facebookId: user.auth.facebookId}, function(err, fbSign) {
      if (err) { return console.log('Database error: ', err); }
      console.log("FBSIGN RETURNED IS: ", fbSign);  // VERIFY & REMOVE THIS

      if (!fbSign) {
        var facebookSign = new FacebookSign({
          userId:       user._id,
          facebookId:   profile.id,
          facebookName: profile.name,
          facebookUrl:  'TO BE ADDED IF IN PROFILE',
          published:    false
          // facebookSign.userId       = user._id;
          // facebookSign.facebookId   = profile.id;
          // facebookSign.facebookName = profile.name;
          // facebookSign.facebookUrl  = 'TO BE ADDED';
          // facebookSign.published    = false;
        });

        facebookSign.save(function(err, sign) {
          if (err) { return console.log('Error saving facebook sign: ', err); }

          return done(null, user);  // saved, so pass user & continue
        });
      }
    })
  }
}
