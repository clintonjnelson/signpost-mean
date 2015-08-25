'use strict';

var SignSchema = require('./SignSchema.js');
var Sign       = require('./Sign.js'      );

// New schema from base
var wordpressSignSchema = new SignSchema();

// BaseSchema: customBgColor, description, knownAs, linkUrl, published, userId
wordpressSignSchema.add({
  bgColor:         { type: String, default: '#21759b'     }, //#21759b (blue) #d54e21 (orange)
  icon:            { type: String, default: 'wordpress'   },
  profileId:       { type: String, required: true         },  // User ID
  siteId:          { type: String                         },  // id of site (can be shared)
  picUrl:          { type: String                         },
  signType:        { type: String, default: 'wordpress'   },
});

// Validations


// Export as Discriminator
module.exports = Sign.discriminator('WordpressSign', wordpressSignSchema);

