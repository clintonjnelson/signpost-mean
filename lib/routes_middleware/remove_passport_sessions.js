'use strict';
/*
  Passport forces setting of req.user variable. Breaks stuff.
  Keep passport from doing this by middleware check/filter.
  Only matters for Oauth Login.
*/

module.exports = function(req, res, next) {
  // If user is not an object, remove it.
  if(typeof req.user !== 'object') { req.user = null; }
  next();
}
