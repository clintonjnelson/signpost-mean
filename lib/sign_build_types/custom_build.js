'use strict';

var CustomSign    = require('../../models/CustomSign.js');
var loadBaseAttrs = require('./load_base_sign_attrs.js' );

module.exports = function(signBuilder) {

  function buildCustom(signData) {
    var signProps = {
      bgColor:       signData.bgColor,
      customIcon:    signData.customIcon,
      icon:          signData.icon,
      signName:      signData.signName,
      signType:      signData.signType,
    };

    // load data into base attrs; modifies current new sign
    loadBaseAttrs(signProps, signData);

    // load data into custom attrs
    var newCustomSign = new CustomSign(signProps);


    console.log("DONE ADDING BASE DATA SIGN. IT LOOKS LIKE: ", newCustomSign);
    return newCustomSign;
  }

  signBuilder.custom = buildCustom;  // load function into signBuilder
};
