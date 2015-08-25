'use strict';

var SignSchema = require('./SignSchema.js');
var Sign       = require('./Sign.js'      );

// New schema from base
var stackexchangeSignSchema = new SignSchema();

// BaseSchema: customBgColor, description, knownAs, linkUrl, published, userId
stackexchangeSignSchema.add({
  badgeCounts:      { type: Object                             },
  bgColor:          { type: String, default: '#5184C1'         },
  icon:             { type: String, default: 'stackoverflow'   },
  location:         { type: String                             },
  picUrl:           { type: String                             },
  profileId:        { type: String, required: true             },
  reputation:       { type: String                             },
  signIdentifier:   { type: String, required: true             },
  signType:         { type: String, default: 'stackexchange'   },
});

// Validations

// Export as Discriminator
module.exports = Sign.discriminator('StackexchangeSign', stackexchangeSignSchema);
