'use strict';

var mongoose   = require('mongoose'       );
var util       = require('util'           );
var SignSchema = require('./SignSchema.js');

// Load Base Schema
var BaseSignSchema = new SignSchema({
  // userId: { type: String }       // inherited from SignSchema
});

// Export the Top-Level Sign model (useful for mongoose queries & creating Children)
module.exports = mongoose.model('Sign', BaseSignSchema);
