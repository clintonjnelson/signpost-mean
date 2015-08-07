'use strict';

var request = require('superagent');

module.exports = function makeApiRequest(accessToken, apiInfo, callback) {
  request
    .get(apiInfo.url)
    .query({ access_token: accessToken })
    .query(apiInfo.queryString)      // specific data fields requested
    .end(function(err, res) {
      if (err) {
        console.log('Error accessing Facebook data');
        callback(err, null);
      };

      // if successful
      var data = JSON.parse(res.text);
      callback(null, data);
    });
};

