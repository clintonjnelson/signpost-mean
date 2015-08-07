'use strict';

var mongoose   = require('mongoose'       );
var util       = require('util'           );
var SignSchema = require('./SignSchema.js');

// Load Base Schema; inherits all attributes from SignSchema, then adds with discriminators
var BaseSignSchema = new SignSchema();


// Export the Top-Level Sign model (useful for mongoose queries & creating Children)
module.exports = mongoose.model('Sign', BaseSignSchema);
