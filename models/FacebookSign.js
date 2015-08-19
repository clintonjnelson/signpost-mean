'use strict';
// TODO: verify capitalization conventions

var mongoose   = require('mongoose'       );
var SignSchema = require('./SignSchema.js');
var Sign       = require('./Sign.js'      );


// New schema from base
var facebookSignSchema = new SignSchema();

// BaseSchema: customBgColor, description, knownAs, linkUrl, published, userId
facebookSignSchema.add({
  bgColor:        { type: String,  default: '#3b5998'           },  // fb default color
  email:          { type: String                                },  // fb ref email
  icon:           { type: String,  default: 'facebook-box'      },  // determines icon
  profileId:      { type: String, required: true                },  // fb #id
  picUrl:         { type: String                                },  // picture url
  signType:       { type: String,  default: 'facebook'          },  // type reference
});

    // TODO: GET THIS BACK & KEEP IT FROM BLOCKING OTHER SIGN TYPE CREATION DUE TO INDEX
    // MAYBE VERIFY MANUALLY NO DUPLICATES BEFORE SAVING...
// Validations
    // facebookSignSchema.path('facebookId').index({unique: true});

// Export as Discriminator
module.exports = Sign.discriminator('FacebookSign', facebookSignSchema);

