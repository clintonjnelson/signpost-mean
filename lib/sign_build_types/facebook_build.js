'use strict';

var FacebookSign  = require('../../models/FacebookSign.js');
var loadBaseAttrs = require('./load_base_sign_attrs.js'   );

module.exports = function(signBuilder) {

  function buildFacebook(signData) {
    cons

    // load data into facebook attrs
    var newFacebookSign = new FacebookSign({
      bgColor:        signData.bgColor,
      email:          signData.email,
      facebookId:     signData.facebookId,
      facebookPicUrl: signData.facebookPicUrl,
      icon:           signData.icon,
      signType:       signData.signType,
    });

    // load data into base attrs; modifies current new sign
    loadBaseAttrs(newFacebookSign, signData);


    return newFacebookSign;
  }

  signBuilder.facebook = buildFacebook;
};
