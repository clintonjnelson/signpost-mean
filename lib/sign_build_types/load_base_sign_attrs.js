'use strict';
// Enables management of all defaults from one location


// Takes partially built sign => loads defaults to it from signData
module.exports = function(currSignBuild, signData) {

  // List of Base Attributes to Assign
  var baseAttrs = [ 'customBgColor',
                    'description',
                    'knownAs',
                    'linkUrl',
                    'published',
                    // userId set later
                  ];

  // Assign data to matching attr
  for(var i=0, attr; i<baseAttrs.length; i++) {
    attr = baseAttrs[i];
    currSignBuild[attr] = signData[attr];   // assign data values to signBuild
  }

  // modifies original currSignBuild, no return value
}
