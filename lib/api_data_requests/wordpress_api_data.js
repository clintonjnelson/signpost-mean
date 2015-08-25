'use strict';

var request = require('superagent');

/*
  accessToken used for API requests to get more data
  Profile exists as an alternate to API request when info is adequate
  Module returns callback with error or Array of data
*/
module.exports = function getWordpressInfo(accessToken, wpProfile, callback) {
  // profile.user has the key sign data
  if(!wpProfile || !wpProfile._json) {
    console.log('Error: No profile info received.');
    return callback('No wordpress profile info received.', null);
  }
  var newSignData;
  var apiArray = [];

  // Base data OK. Get rest of data.
  request
    .get('https://public-api.wordpress.com/rest/v1.1/me/sites')
    .set('Authorization', ('BEARER ' + accessToken))
    .end(apiCallback);


  function apiCallback(err, res) {
    if(err) {
      console.log('Error getting signs info from Wordpress. Error: ', err);
      return callback( ('Wordpress Error: ' + err), null);
    }
    var sites = (res.body && res.body.sites ? res.body.sites : null);
    console.log("WORDPRESS SITES RESPONSE IS: ", sites);

    // Iterate through each sign site & format apiData
    sites.forEach(function(elem, ind, orig) {
      // Load base profile data object
      newSignData = wpProfile;

      // Add specific sign data
      newSignData.knownAs         = elem.name;
      newSignData.picUrl          = (elem.icon && elem.logo.url) || wpProfile._json.avatar_URL;
      newSignData.siteIdentifier  = elem.ID;
      newSignData.linkUrl         = elem.URL;

      // Add chunk to API array
      apiArray.push(newSignData);
    });

    return callback(null, apiArray);
  }
};
