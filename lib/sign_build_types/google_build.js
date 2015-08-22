'use strict';

var GoogleSign = require('../../models/GoogleSign.js');

module.exports = function(signBuilder) {

  function buildGoogleSign(gglData) {
    // base attrs:   customBgColor, description, knownAs, linkUrl, published, userId
    // custom attrs: bgColor, circledByCount, profileId, picUrl, icon, signType

    var signProps = {
      // ----------------- BASE -----------------------
      // description:    gglData.description,                // optional for updates?
      knownAs:        (gglData.displayName  || gglData.knownAs),      // TODO: VERIFY || is NOT BACKWARDS!
      linkUrl:        (gglData._json.url    || gglData.linkUrl),      // TODO: VERIFY || is NOT BACKWARDS!
      // ----------------- CUSTOM ---------------------
      circledByCount: gglData._json.circledByCount,
      profileId:      gglData.id,
      picUrl:         gglData._json.image.url,
    };

    var newGoogleSign = new GoogleSign(signProps);

    return newGoogleSign;
  }

  signBuilder.google = buildGoogleSign;
};
