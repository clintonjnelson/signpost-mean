'use strict';

var signBuilder      = require('./sign_builder.js');


// Export Sign Creation Functions
module.exports = {
  findOrMakeSign = findOrMakeSign,
  createSign = createSign,
};


function findOrMakeSign(req, accessToken, userSignInfo, done) {
  var signType  = userSignInfo.signType;
  var thisSign  = userSignInfo[signType];  // note: var not string
  var mongo     = thisSign.mongo;
  var apiFields = thisSign.apiFields;
  var SignModel = thisSign.SignModel;      // passed model directly


  // Update access token
  user[mongo.accessTokenPath] = accessToken;
  user.save();

  var mongoSignQuery = {};
  mongoSignQuery[mongo.authTypeId] = user.auth[mongo.authType][mongo.authTypeId];

  // Find or make sign
  SignModel.findOne(mongoSignQuery, function(err, sign) {
    if (err) {
      console.log('Database error finding facebook sign: ', err);
      return done(err, null);
    }

    // No sign? make one. UNLIKELY to ever go here.
    if(!sign || !sign[mongo.authTypeId]) {
      thisSign.getApiInfo(accessToken, thisSign.reqdProfileData, function(err, apiData) {
        if(err) { return done('error accessing facebook login'); }

        return createSign(signType, apiData, user, done);
      });
    }

    // sign found => DONE.
    return done(null, user);  // sign exists. pass user & continue.
  });

}

function createSign(signType, apiData, user, done) {
  var newSign    = signBuilder[signType](apiData);  // build new sign w/data
  newSign.userId = user._id;                        // set userId reference

  newSign.save(function(err, sign) {
    if(err) { console.log('Error saving ' + signType  + ' sign: ', err); }

    return done(null, user);  // saved. pass user & continue
  });
}
