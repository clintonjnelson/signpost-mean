'use strict';
// TODO: verify capitalization conventions

var mongoose   = require('mongoose'       );
var util       = require('util'           );
var SignSchema = require('./SignSchema.js');


// Extend for Custom Schema
var facebookSignSchema = new SignSchema({
  facebookId:     { type: String, required: true },
  facebookName:   { type: String                 },
  facebookPicUrl: { type: String                 },
  published:      { type: Boolean, default: true },
  // userId:      { type: String                 }  // inherited from SignSchema
});

// Validations
facebookSignSchema.path('facebookId').index({unique: true});

// Create base Sign for Discriminator
var BaseSignSchema = new SignSchema();
var Sign           = mongoose.model('Sign', BaseSignSchema);

// Export as Discriminator
module.exports = Sign.discriminator('FacebookSign', facebookSignSchema);

