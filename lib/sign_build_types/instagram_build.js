'use strict';
// This loads both the custom & base attrs for new signs into a new Model instance

var InstagramSign  = require('../../models/InstagramSign.js');

module.exports = function(signBuilder) {

  function buildInstagramSign(igData) {  // igData comes from profile.user
    // base attrs:   customBgColor, description, knownAs, linkUrl, published, userId
    // custom attrs: bgColor, instagramId, picUrl, icon, signType
    // NOTE: most not needed OR covered by defaults

    var linkUrl = 'http://instagram.com/' + igData.username;

    var signProps = {
      // ----------------- BASE -----------------------
      // description:    ig.description,                        // optional for updates?
      knownAs:        (igData.username || igData.knownAs),      // TODO: VERIFY || is NOT BACKWARDS!
      linkUrl:        (linkUrl         || igData.linkUrl),      // TODO: VERIFY || is NOT BACKWARDS!
      // ----------------- CUSTOM ---------------------
      email:          igData.email,
      profileId:      igData.id,
      picUrl:         igData._json.data.profile_picture,
    };

    // load schema data into new instagram sign
    var newInstagramSign = new InstagramSign(signProps);

    return newInstagramSign;
  }

  signBuilder.instagram = buildInstagramSign;
};


//--------------------- Sample of Data in Instagram Profile --------------------
/*
{ provider: 'instagram',
  id: '2131966332',
  displayName: 'Clint Nelson',
  name: { familyName: undefined, givenName: undefined },
  username: 'clintonjnelson',
  _raw: '{"meta":{"code":200},"data":{"username":"clintonjnelson","bio":"","website":"","profile_picture":"https:\\/\\/instagramimages-a.akamaihd.net\\/profiles\\/anonymousUser.jpg","fu…
  _json:
   { meta: { code: 200 },
     data:
      { username: 'clintonjnelson',
        bio: '',
        website: '',
        profile_picture: 'https://instagramimages-a.akamaihd.net/profiles/anonymousUser.jpg',
        full_name: 'Clint Nelson',
        counts: [Object],
        id: '2131966332' } } }
*/
