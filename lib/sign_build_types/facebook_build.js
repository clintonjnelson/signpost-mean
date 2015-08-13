'use strict';

var FacebookSign  = require('../../models/FacebookSign.js');
var loadBaseAttrs = require('./load_base_sign_attrs.js'   );

module.exports = function(signBuilder) {

  function buildFacebookSign(fbData) {
    // base attrs:   customBgColor, description, knownAs, linkUrl, published, userId
    // custom attrs: bgColor, email, facebookId, picUrl, icon, signType
    // NOTE: most not needed OR covered by defaults

    var signProps = {
      // ----------------- BASE -----------------------
      // description:    fbData.description,                // optional for updates?
      knownAs:        (fbData.name || fbData.knownAs),      // TODO: VERIFY || is NOT BACKWARDS!
      linkUrl:        (fbData.link || fbData.linkUrl),      // TODO: VERIFY || is NOT BACKWARDS!
      // ----------------- CUSTOM ---------------------
      email:          fbData.email,
      id:             fbData.id,
      picUrl:         fbData.picture.data.url,
    };


    // load schema data into new facebook sign
    var newFacebookSign = new FacebookSign(signProps);


    return newFacebookSign;
  }

  signBuilder.facebook = buildFacebookSign;
};

/*
--------------------------- Sample of Facebook Data --------------------------
{ email: 'superemail@example.com',
  name: 'superman',
  link: 'https://www.facebook.com/app_scoped_user_id/101043543728905432/',
  picture:
   { data:
      { height: 720,
        is_silhouette: false,
        url: 'https://fbcdn-profile-a.akamaihd.net/hprofile-ak-xpf1/t31.0-1/p720x720/10986984_10104169375250478_43798324798_o.jpg',
        width: 720 } },
  id: '42798042378092347089' }
*/
