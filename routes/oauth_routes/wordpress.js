'use strict';

var oauth2Template = require('./oauth2_template.js');

module.exports = function(app, passport) {
  var wordpressApiData = {
    passportType: 'wordpress',
    scope: 'global',
  };

  return oauth2Template(app, passport, wordpressApiData);
};
