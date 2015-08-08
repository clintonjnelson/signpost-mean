'use strict';

var TwitterSign   = require('../../models/TwitterSign.js');
var loadBaseAttrs = require('./load_base_sign_attrs.js' );

module.exports = function(signBuilder) {

  function buildTwitter(twData) {
    // base attrs:   customBgColor, description, knownAs, linkUrl, published, userId
    // custom attrs: followersCount, friendsCount, profileBgColor, twitterPicUrl, twitterId

    var signProps = {
      // ----------------- BASE -----------------------
      // description:    fbData.description,                // optional for updates?
      knownAs:        (twData.knownAs || ('@'+twData.name) ),      // TODO: VERIFY || is NOT BACKWARDS!
      linkUrl:        (twData.linkUrl || ('https://twitter.com/' + twData.screen_name) ), // Update unless passing new
      // ----------------- CUSTOM ---------------------
      followersCount: twData.followers_count,
      friendsCount:   twData.friends_count,
      profileBgColor: twData.profile_background_color,
      twitterPicUrl:  twData.profile_image_url,
      twitterId:      twData.id,
    };

    // Load schema data into new twitter sign
    var newTwitterSign = new TwitterSign(signProps);


    return newTwitterSign;
  }

  signBuilder.twitter = buildTwitter;
};
