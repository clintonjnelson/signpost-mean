'use strict';
// This loads both the custom & base attrs for new signs into a new Model instance

var StackexchangeSign  = require('../../models/StackexchangeSign.js');

module.exports = function(signBuilder) {

  function buildStackexchangeSign(seData) {  // seData comes from profile.user
    // base attrs:   customBgColor, description, knownAs, linkUrl, published, userId
    // custom attrs: bgColor, stackexchangeId, picUrl, icon, signType
    // NOTE: most not needed OR covered by defaults

    var signProps = {
      // ----------------- BASE -----------------------
      // description:    ig.description,                        // optional for updates?
      knownAs:        (seData.display_name || seData.knownAs),      // TODO: VERIFY || is NOT BACKWARDS!
      linkUrl:        (seData.link         || seData.linkUrl),      // TODO: VERIFY || is NOT BACKWARDS!
      // ----------------- CUSTOM ---------------------
      email:          seData.email,
      location:       seData.location,
      badgeCounts:    seData.badge_counts,
      profileId:      seData.account_id,
      reputation:     seData.reputation,
      signIdentifier: seData.user_id,
      picUrl:         seData.profile_image,
    };

    // load schema data into new stackexchange sign
    var newStackexchangeSign = new StackexchangeSign(signProps);

    return newStackexchangeSign;
  }

  signBuilder.stackexchange = buildStackexchangeSign;
};

/*
------------------------ Sample of Stackexchange Profile -----------------------
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
