'use strict';
// TODO: verify capitalization conventions

var mongoose   = require('mongoose'       );
var SignSchema = require('./SignSchema.js');
var Sign       = require('./Sign.js'      );


// new schema from base
var facebookSignSchema = new SignSchema();

// use this approach to extend
facebookSignSchema.add({
  bgColor:        { type: String,  default: '#3b5998'           },  // fb default color
  email:          { type: String                                },  // fb ref email
  facebookId:     { type: String, required: true                },  // fb #id
  facebookPicUrl: { type: String                                },  // picture url
  icon:           { type: String,  default: 'facebook-box'      },  // determines icon
  signType:       { type: String,  default: 'facebook'          },  // type reference
  // userId:      // inherited from SignSchema
});

    // TODO: GET THIS BACK & KEEP IT FROM BLOCKING OTHER SIGN TYPE CREATION DUE TO INDEX
    // MAYBE VERIFY MANUALLY NO DUPLICATES BEFORE SAVING...
// Validations
    // facebookSignSchema.path('facebookId').index({unique: true});

// Export as Discriminator
module.exports = Sign.discriminator('FacebookSign', facebookSignSchema);

