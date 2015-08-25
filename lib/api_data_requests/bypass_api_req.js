'use strict';

/*
  This module bypasses the need for additional API data
  Profile is adequate, and returns profile data through for sign creation use
*/


module.exports = function getGithubInfo(accessToken, profile, callback) {

   // Already have needed data from Profile, so just send to callback
   if(!profile || !profile._json) {
      console.log('Error: No profile info received.');
      return callback('No profile info available.', null);
   }

   // Send data for saving
   return callback(null, profile._json);
};
