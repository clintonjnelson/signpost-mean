'use strict';

var request = require('./api_request.js');

module.exports = function getGithubInfo(accessToken, ghProfile, callback) {

   // Already have needed data from Profile, so just send to callback
   if(!ghProfile || !ghProfile._json) {
      console.log('Error: No profile info received.');
      return callback('No github profile info available.', null);
   }

   // Send data for saving
   return callback(null, ghProfile._json);
};


/*
------------------------------ Sample of GITHUB Data ---------------------------
{ provider: 'github',
id: 0000001,
displayName: 'Clint Nelson',
username: 'clintonjnelson',
profileUrl: 'https://github.com/clintonjnelson',
emails: [ { value: '' } ],
_raw: '{"login":"clintonjnelson","id":0000001,"avatar_url":"https://avatars.githubusercontent.com/u/5673158?v=3","gravatar_id":"","url":"https…
_json:
 { login: 'clintonjnelson',
   id: 0000001,
   avatar_url: 'https://avatars.githubusercontent.com/u/0000001?v=3',
   gravatar_id: '',
   url: 'https://api.github.com/users/clintonjnelson',
   html_url: 'https://github.com/clintonjnelson',
   followers_url: 'https://api.github.com/users/clintonjnelson/followers',
   following_url: 'https://api.github.com/users/clintonjnelson/following{/other_user}',
   gists_url: 'https://api.github.com/users/clintonjnelson/gists{/gist_id}',
   starred_url: 'https://api.github.com/users/clintonjnelson/starred{/owner}{/repo}',
   subscriptions_url: 'https://api.github.com/users/clintonjnelson/subscriptions',
   organizations_url: 'https://api.github.com/users/clintonjnelson/orgs',
   repos_url: 'https://api.github.com/users/clintonjnelson/repos',
   events_url: 'https://api.github.com/users/clintonjnelson/events{/privacy}',
   received_events_url: 'https://api.github.com/users/clintonjnelson/received_events',
   type: 'User',
   site_admin: false,
   name: 'Clint Nelson',
   company: '',
   blog: '',
   location: 'Seattle, WA',
   email: '',
   hireable: true,
   bio: null,
   public_repos: 35,
   public_gists: 2,
   followers: 8,
   following: 8,
   created_at: '2013-10-12T20:54:09Z',
   updated_at: '2015-07-14T01:09:06Z' }
 }

*/
