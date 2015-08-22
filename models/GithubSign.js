'use strict';

var SignSchema = require('./SignSchema.js');
var Sign       = require('./Sign.js'      );

// New schema from base
var githubSignSchema = new SignSchema();

// BaseSchema: customBgColor, description, knownAs, linkUrl, published, userId
githubSignSchema.add({
  bgColor:         { type: String, default: '#333333'     },
  followersCount:  { type: String                         },
  icon:            { type: String, default: 'github-box'  },
  profileId:       { type: String, required: true         },
  picUrl:          { type: String                         },
  signType:        { type: String, default: 'github'      },
});

// Validations


// Export as Discriminator
module.exports = Sign.discriminator('GithubSign', githubSignSchema);
