'use strict';

var oauth2Template = require('./oauth2_template.js');

module.exports = function(app, passport) {
  var facebookApiData = {
    passportType: 'facebook',
    scope: ['public_profile', 'email'],
  };

  return oauth2Template(app, passport, facebookApiData);
}
