'use strict';

var oauth2Template = require('./oauth2_template.js');

module.exports = function(app, passport) {
  var instagramApiData = {
    passportType: 'instagram',
    scope: null,
  };

  return oauth2Template(app, passport, instagramApiData);
};
