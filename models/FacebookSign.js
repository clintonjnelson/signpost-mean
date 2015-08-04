'use strict';
// TODO: verify capitalization conventions

var mongoose   = require('mongoose'       );
var SignSchema = require('./SignSchema.js');
var Sign       = require('./Sign.js'      );



// Extend for Custom Schema
var facebookSignSchema = new SignSchema({
  facebookId:     { type: String, required: true            },
  facebookPicUrl: { type: String                            },
  email:          { type: String                            },
  signtype:       { type: String,  default: 'facebook'      },
  icon:           { type: String,  default: 'facebook-box'  },
  bgColor:        { type: String,  default: '#3b5998'       },
  published:      { type: Boolean, default: true            },
  // userId:      { type: String                 }  // inherited from SignSchema
});

// Validations
facebookSignSchema.path('facebookId').index({unique: true});

// // Create base Sign for Discriminator
// var BaseSignSchema = new SignSchema();
// var Sign           = mongoose.model('Sign', BaseSignSchema);

// Export as Discriminator
module.exports = Sign.discriminator('FacebookSign', facebookSignSchema);

