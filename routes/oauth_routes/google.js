'use strict';

var oauth2Template = require('./oauth2_template.js');

module.exports = function(app, passport) {
  var googleApiData = {
    passportType: 'google',
    scope: 'https://www.googleapis.com/auth/plus.login'
  };

  return oauth2Template(app, passport, googleApiData);
};
