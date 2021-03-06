'use strict';

var eat  = require('eat'                 );
var User = require('../../models/User.js');

module.exports = function(secret) {
  // Middleware-format; Insert secret.
  return function eatAuth(req, res, next) {
    var cookie        = req.headers.cookie; // error catch
    var cookieTokens  = parseEatCookie(cookie);

    var eatoken = req.headers.eat || req.body.eat || req.params.eat || cookieTokens.eat;
    if (!eatoken) {  // token provided?
      console.log('No eat provided.');
      return res.status(401).json({ error: 'please sign in to do that' });
    }
    eatoken = decodeURIComponent(eatoken);

    eat.decode(eatoken, secret, function(err, decoded) {  // token exists, try decoding
      if (err) {
        console.log('Eat was not valid format. Error: ', err);
        return res.status(401).json({ reset: true, error: 'please sign in to do that' });
      }

      User.findOne(decoded, function(err, user) {  // decodes, so find user
        if (err || !user || (Object.keys(user).length === 0) ) {  // error or no user obj
          console.log('No user matches eat. If Error: ', err, ' If user: ', user);
          return res.status(401).json({ reset: true, error: 'please sign in to do that' });
        }

        req.user = user;  // user exists - attach for use
        next();           // next middleware
      });
    });
  };


  function parseEatCookie(cookie) {
    var tokensArr = cookie.split('; ');
    var cookieTokens = {};

    for(var i=0, subArr, k, v; i<tokensArr.length; i++) {
      subArr = tokensArr[i].split('=');
      k      = subArr[0];
      v      = subArr[1];
      cookieTokens[k] = v;
    }
    return cookieTokens;
  }
};
