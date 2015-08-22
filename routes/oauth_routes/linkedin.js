'use strict';

var oauth2Template = require('./oauth2_template.js');

module.exports = function(app, passport) {
  var linkedinApiData = {
    passportType: 'linkedin',
    scope: 'r_basicprofile',
  };

  return oauth2Template(app, passport, linkedinApiData);
};
