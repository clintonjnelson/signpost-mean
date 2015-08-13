'use strict';

var oauth2Template = require('./oauth2_template.js');

module.exports = function(app, passport) {
  var githubApiData = {
    passportType: 'github',
    scope: undefined,
  };

  return oauth2Template(app, passport, githubApiData);
};
