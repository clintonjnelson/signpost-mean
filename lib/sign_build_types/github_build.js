'use strict';

var GithubSign = require('../../models/GithubSign.js');

module.exports = function(signBuilder) {

  function buildGithubSign(ghData) {
    // base attrs:   customBgColor, description, knownAs, linkUrl, published, userId
    // custom attrs: bgColor, followers, githubId, picUrl, icon, signType
    // NOTE: most not needed OR covered by defaults

    var signProps = {
      // ----------------- BASE -----------------------
      // description:    ghData.description,                // optional for updates?
      knownAs:        (ghData.login    || ghData.knownAs),      // TODO: VERIFY || is NOT BACKWARDS!
      linkUrl:        (ghData.html_url || ghData.linkUrl),      // TODO: VERIFY || is NOT BACKWARDS!
      // ----------------- CUSTOM ---------------------
      followers:      ghData.followers,
      profileId:      ghData.id,
      picUrl:         ghData.avatar_url,
    };

    var newGithubSign = new GithubSign(signProps);

    return newGithubSign;
  }

  signBuilder.github = buildGithubSign;
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
