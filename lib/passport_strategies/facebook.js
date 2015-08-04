'use strict';

var FacebookStrategy = require('passport-facebook').Strategy;
var FacebookSign     = require('../../models/FacebookSign.js');
var User             = require('../../models/User.js'        );

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
  console.log('PROFILE OBJECT IS: ', profile);

  //------------------------ MODULATIZE THIS AWAY ----------------
  var request = require('superagent');
  function getFacebookInfo(accessToken, callback) {
    var url = 'https://graph.facebook.com/me/';
    request
      .get(url)
      .query({ access_token: accessToken })
      .query({ fields: 'email,name,link,picture.width(720)' })
      .end(function(err, res) {
        if (err) {
          console.log('Error accessing Facebook data');
          callback(err, null);
        };

        // if successful
        callback(null, res);
      });
  }


  getFacebookInfo(accessToken, function(err, fbRes) {
    if(err) { return res.status(500).json({error: true, msg: 'error accessing facebook login'}); }
    var fbData = JSON.parse(fbRes.text);
    console.log("RES IS: ", fbData);

    // Data for saving to DB
    var userInfo = { 'auth.facebook.facebookId':          fbData.id,
                     'auth.facebook.facebookAccessToken': accessToken,
                     email:                               fbData.link,
                     username:                            fbData.name,
                   };

    // find/create User & update access token
    User.findOneAndUpdate(
      { 'auth.facebook.facebookId': profile.id },   // query
      userInfo,                                     // data to save
      { upsert: true, new: true },                  // options
      userCallback                                  // insert callback function
    );

    // called once user is found/created
    function userCallback(err, user) {
      if (err) { return done('error saving user'); }
      if (!user || !user.auth.facebook.facebookId) {
        console.log('User returned in FB Strategy is: ', user);
        return done('could not create user');
      }

      // user found, look for existing fbSign or create one
      FacebookSign.findOne( {facebookId: user.auth.facebook.facebookId}, function(err, fbSign) {
        if (err) {
          console.log('Database error: ', err);
          return done(err, null);
        }

        console.log("FBSIGN RETURNED IS: ", fbSign);  // VERIFY & REMOVE THIS
        if (!fbSign) {
          var facebookSign = new FacebookSign({
            userId:         user._id,
            email:          fbData.email,
            knownAs:        fbData.name,
            linkUrl:        fbData.link,
            facebookId:     fbData.id,
            facebookPicUrl: fbData.picture.data.url,
            published:      false
          });

          facebookSign.save(function(err, sign) {
            if (err) { return console.log('Error saving facebook sign: ', err); }

            return done(null, user);  // saved, so pass user & continue
          });
        } else {
          console.log("About to sent to next...");
          done(null, user);
        }
      });
    }
  });




}
