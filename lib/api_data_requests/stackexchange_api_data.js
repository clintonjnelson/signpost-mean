'use strict';

// Bypass function with no _json in response body
module.exports = function getGithubInfo(accessToken, seProfile, callback) {

   // Already have needed data from Profile, so just send to callback
   if(!seProfile) {
      console.log('Error: No stackexchange profile info received.');
      return callback('No stackexchange profile info available.', null);
   }

   // Send data for saving
   return callback(null, seProfile);
};


/*
------------------------- Sample of Stackexchange Data -------------------------
{ badge_counts: { bronze: 10, silver: 3, gold: 0 },
  account_id: 4192634,
  is_employee: false,
  last_modified_date: 1440223317,
  last_access_date: 1440536461,
  reputation_change_year: 55,
  reputation_change_quarter: 0,
  reputation_change_month: 0,
  reputation_change_week: 0,
  reputation_change_day: 0,
  reputation: 315,
  creation_date: 1394249542,
  user_type: 'registered',
  user_id: 3395069,
  accept_rate: 100,
  location: 'Seattle, WA',
  website_url: '',
  link: 'http://stackoverflow.com/users/3395069/cjn',
  profile_image: 'https://www.gravatar.com/avatar/4571f75b2226b1f6b8cd5fa8e4b44ecf?s=128&d=identicon&r=PG',
  display_name: 'cjn',
  provider: 'stackexchange' }
*/
