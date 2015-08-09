'use strict';

var createSign     = require('./sign_creation_handler.js').createSign;
var findOrMakeSign = require('./sign_creation_handler.js').findOrMakeSign;
var User           = require('../models/User.js');


module.exports = function loginSignupHandler(req, userSignInfo, done) {
  var accessToken = userSignInfo.accessToken;
  var signType    = userSignInfo.signType;
  var thisSign    = userSignInfo[signType];  // note: var not string
  var apiFields   = thisSign.apiFields;
  var mongo       = thisSign.mongo;
  var SignModel   = thisSign.SignModel;


  var mongoUserQuery = {}
  mongoUserQuery[mongo.authIdPath] = thisSign.profileId

  User.findOne(mongoUserQuery, function(err, user) {
    if (err) { return done('database error finding user', err); }
    if (!user || !user['auth'][mongo.authType][mongo.authTypeId] ) {

      // No user? make one.
      thisSign.getApiInfo(accessToken, thisSign.reqdProfileData, function(err, apiData) {
        if(err) {
          return done('error accessing API for login');
        }

        // Data for saving to DB
        var userInfo = {};
        userInfo[mongo.authIdPath     ] = apiData[apiFields.apiId      ];
        userInfo[mongo.accessTokenPath] = accessToken;
        userInfo['email'              ] = apiData[apiFields.apiEmail   ];
        userInfo['username'           ] = apiData[apiFields.apiUsername];

        // Find/create User
        User.create(userInfo, function(err, user) {
            if (err) { return done('error saving user'); }
            if (!user || !user.auth[mongo.authType][mongo.authTypeId]) {
              console.log('Could not create user: ', user);
              return done('could not create user');
            }

            // New user => new sign => DONE.
            return createSign(signType, apiData, user, done);
        });
      });
    }

    else {  // User found => update access token, find/make sign.
      userSignInfo.user = user;
      console.log("USER WAS FOUND. USER IN LOGIN_SIGNUP_HANDLER IS: ", user);
      findOrMakeSign(req, userSignInfo, done);
    }
  });
};


