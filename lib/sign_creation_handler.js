'use strict';

var request     = require('superagent'        );
var signBuilder = require('./sign_builder.js' );
var User        = require('..//models/User.js');
var multiSigns  = {
  wordpress: {
    multi: true,
  }
};

// Export Sign Creation Functions
module.exports = {
  findOrMakeSign: findOrMakeSign,
  createSign:     createSign,
};

function checkMultiSign(type) {
  return (multiSigns[type] && multiSigns[type]['multi']) ? true : false;
}


function findOrMakeSign(req, userSignInfo, done) {
  var accessToken = userSignInfo.accessToken;
  var signType    = userSignInfo.signType;
  var thisSign    = userSignInfo[signType];  // note: var not string
  var user        = userSignInfo.user;
  var apiFields   = thisSign.apiFields;
  var mongo       = thisSign.mongo;
  var SignModel   = thisSign.SignModel;      // passed model directly
  var isMultiSign = checkMultiSign(mongo.authType);
  console.log("IN SIGN CREATION HANDLER FOR SIGN CREATION. USER IS: ", user);

  // Update user auth info
  user['auth'][mongo.authType][mongo.authTypeId]  = thisSign.profileId
  user['auth'][mongo.authType][mongo.accessToken] = accessToken;  // TODO: verify saving this way OK for ID Array
  user.save();

  // Standard or MultiSign approach?
  isMultiSign ?
    findOrMakeMultiSign() :
    findOrMakeStdSign();


  function findOrMakeMultiSign() {
    thisSign.getApiInfo(accessToken, thisSign.reqdProfileData, apiDataArrayCallback);

    function apiDataArrayCallback(err, apiArray) {
      apiArray.forEach(function(apiDataElem, ind, orig) {
        var query = { siteIdentifier: apiDataElem.siteIdentifier };

        // See if sign already exists.
        SignModel.findOne(query, function(err, sign) {
          if(err) { return console.log("DB error with sign number " + ind + " Error: ", err); }
          var userIdStr      = (user && user._id   ) ? String(user._id)    : 'noUserId' ;
          var signOwnerIdStr = (sign && sign.userId) ? String(sign.userId) : 'noOwnerId';

          // No sign? create one
          if(!sign || !sign.profileId) {
            createSign(signType, apiDataElem, user, function(){});  // empty func is a blank 'done' func
          }

          // Sign but not match userId? Update userId.
          else if ( signOwnerIdStr !== userIdStr ) {
            changeSignOwner(sign, user, done);
          }
        });
      });

      // all saved. Done.
      return done(null, user);
    }
  }


  function findOrMakeStdSign() {
    // Query by user profileId
    var signQuery = {profileId: thisSign.profileId};

    // Find existing sign? (avoid duplciate)
    SignModel.findOne( signQuery, function(err, sign) {
      if (err) {
        console.log('Database error finding ' + thisSign.authType +  ' sign: ', err);
        return done(err, null);
      }
      var userIdStr      = (user && user._id   ) ? String(user._id)    : 'noUserId' ;
      var signOwnerIdStr = (sign && sign.userId) ? String(sign.userId) : 'noOwnerId';

      // No sign? make one. (Auto-sign path)
      if(!sign || !sign.profileId) {
        thisSign.getApiInfo(accessToken, thisSign.reqdProfileData, function(err, apiData) {
          if(err) { return done('error accessing oauth api'); }

          return createSign(signType, apiData, user, done);
        });
      }

      // sign found. User & sign owner match => DONE.
      else if( userIdStr === signOwnerIdStr ) {
        return done(null, user);  // sign exists & matches => do nothing. DONE.
      }

      // User and sign owner NOT match => remove old user oauth, link sign to current user => DONE.
      else if( userIdStr !== signOwnerIdStr ) {
        changeSignOwner(sign, user, done);
      }
    });
  }


  function changeSignOwner(sign, newOwner, done) {
    var authType   = mongo.authType;
    var authTypeId = mongo.authTypeId;
    var accToken   = mongo.accessToken;
    var clearOauthVals = {  // remove oauth from old user
      auth: {
        authType: {
          authTypeId:  null,
          accessToken: null
        }
      }
    };

    // Update old owner. Update sign.
    User.findByIdAndUpdate(sign.userId, clearOauthVals, function(err, oldUser) {
      if(err) {
        console.log('Error clearing oauth from old user: ', err);
        return done('database error clearing old user oauth');
      }

      // Older user cleared of Oauth => link sign to current user.
      sign.userId = user._id;
      sign.save(function(err, sign) {
        if(err) {return done('Error updating sign to user userId');}

        return done(null, user);
      });
    });
  }
}


// Build & save sign with user info
function createSign(signType, apiData, user, done) {
  var newSign    = signBuilder[signType](apiData);  // build new sign w/data
  newSign.userId = user._id;                        // set userId reference

  newSign.save(function(err, sign) {
    if(err) { console.log('Error saving ' + signType  + ' sign: ', err); }

    return done(null, user);  // saved. pass user & continue
  });
}

