'use strict';
// This loads both the custom & base attrs for new signs into a new Model instance
// Multi-Sign Type

var WordpressSign  = require('../../models/WordpressSign.js');

module.exports = function(signBuilder) {

  function buildWordpressSign(wpData) {
    // base attrs:   customBgColor, description, knownAs, linkUrl, published, userId
    // custom attrs: bgColor, profileId, siteIdentifier, picUrl, icon, signType

    var signProps = {
        // ----------------- BASE -----------------------
        // description:    wpData.description,
        knownAs:        wpData.knownAs,
        linkUrl:        wpData.linkUrl,
        // ----------------- CUSTOM ---------------------
        profileId:      wpData._json.ID,
        siteIdentifier: wpData.siteIdentifier,
        picUrl:         wpData.picUrl,
      };

    // load schema data into new wordpress sign
    var newWordpressSign = new WordpressSign(signProps);
    return newWordpressSign;
  }

  signBuilder.wordpress = buildWordpressSign;
};



//---------------------- Sample of Data in Wordpress Data Obj-------------------
/*
{
  // MULTISIGN: THIS UNIQUE DATA IS ADDED & PASSED WITH ORIGINAL DATA FOR EACH SIGN
  knownAs: 'testsitecj',
  picUrl: 'https://1.gravatar.com/avatar/4571f75b2226b1f6b8cd5fa8e4ecf?s=96&d=identicon',
  siteIdentifier: 98113143,
  linkUrl: 'https://testsitecj.wordpress.com' } ]


  // THIS IS THE ORIGINAL API DATA
  provider: 'Wordpress',
  id: undefined,
  displayName: 'clintonjnelson',
  _raw: '{"ID":58451710,"display_name":"clintonjnelson","username":"clintonjnelson","email":"clintonjnelson@live.com","primary_blog":61259707,"language":"en","token_site_id":61259707,"t…
  _json:
   { ID: 58451710,
     display_name: 'clintonjnelson',
     username: 'clintonjnelson',
     email: 'clintonjnelson@live.com',
     primary_blog: 61259707,
     language: 'en',
     token_site_id: 61259707,
     token_scope: [ '' ],
     avatar_URL: 'https://1.gravatar.com/avatar/4571f75b2226b1f6b8cd5fa8e4b42ecf?s=96&d=identicon&r=G',
     profile_URL: 'http://en.gravatar.com/clintonjnelson',
     verified: true,
     email_verified: true,
     date: '2013-11-28T02:01:11+00:00',
     site_count: 1,
     visible_site_count: 1,
     has_unseen_notes: false,
     newest_note_type: '',
     phone_account: false,
     meta: { links: [Object] },
     is_valid_google_apps_country: true } }
*/
