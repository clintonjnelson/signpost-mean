'use strict';

var eat  = require('eat'                 );
var User = require('../../models/User.js');
/*
  This middleware checks for a cookie named 'eat'
  If found, it loads the corresponding user into the request at req.user
  Whether found or not, this middleware lets all requests pass through.
  THIS PREVENTS EAT TOKENS FROM BEING RE-ISSUED.
*/



module.exports = function(secret) {

  // Middleware-format; Insert secret.
  return function loadEatUser(req, res, next) {
    // check for eat cookie, if there
    var cookie  = req.headers && req.headers.cookie; // error catch
    var tokens  = parseEatCookie(cookie);
    var eatoken = tokens['eat'];

    if(eatoken) {

      eat.decode(eatoken, secret, function(err, decoded) {  // token exists, try decoding
        if (err) {
          console.log('Eat was not valid format. Error: ', err);
          return next();
        }

        User.findOne(decoded, function(err, user) {  // decodes, so find user
          if (err || !user || (Object.keys(user).length === 0) ) {  // error or no user obj
            console.log('No user matches eat. If Error: ', err, ' If user: ', user);
            return next();
          }

          req.user         = user;  // user exists - attach for use
          req.user.skipGen = true;  // skip re-gen of Eat in loadSendEat script
          next();                   // next middleware
        });
      });
    }

    else { return next(); }
  };



  function parseEatCookie(cookie) {
    var tokensArr = cookie.split('; ');
    var cookieTokens = {};

    for(var i=0, subArr, k, v; i<tokensArr.length; i++) {
      subArr = tokensArr[i].split('=');
      k      = subArr[0];
      v      = decodeURIComponent(subArr[1]);
      cookieTokens[k] = v;

    }
    return cookieTokens;
  }
};
