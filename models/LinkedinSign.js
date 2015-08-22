'use strict';

var SignSchema = require('./SignSchema.js');
var Sign       = require('./Sign.js'      );

// New sign from base
var linkedinSignSchema = new SignSchema();

// BaseSchema: customBgColor, description, knownAs, linkUrl, published, userId
linkedinSignSchema.add({
  bgColor:         { type: String, default: '#4875B4'          },
  connections:     { type: String                              },
  icon:            { type: String, default: 'linkedin-box'     },
  location:        { type: String,                             },
  profileId:       { type: String, required: true              },
  picUrl:          { type: String                              },
  signType:        { type: String, default: 'linkedin'         },
});

// Valdiations


// Export as Discriminator
module.exports = Sign.discriminator('LinkedinSign', linkedinSignSchema);
