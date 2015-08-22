'use strict';

var SignSchema = require('./SignSchema.js');
var Sign       = require('./Sign.js'      );

// New schema from base
var googleSignSchema = new SignSchema();

// BaseSchema: customBgColor, description, knownAs, linkUrl, published, userId
googleSignSchema.add({
  bgColor:         { type: String, default: '#dd4b39'          },
  followersCount:  { type: String                              },
  icon:            { type: String, default: 'google-plus-box'  },
  profileId:       { type: String, required: true              },
  picUrl:          { type: String                              },
  signType:        { type: String, default: 'google'           },
});

// Validations


// Export as Discriminator
module.exports = Sign.discriminator('GoogleSign', googleSignSchema);
