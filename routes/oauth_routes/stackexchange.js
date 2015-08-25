'use strict';

var oauth2Template = require('./oauth2_template.js');

module.exports = function(app, passport) {
  var stackexchangeApiData = {
    passportType: 'stackexchange',
    scope: null,
  };

  return oauth2Template(app, passport, stackexchangeApiData);
};
