'use strict';

var mongoose   = require('mongoose'       );
var SignSchema = require('./SignSchema.js');
var Sign       = require('./Sign.js'      );


var customSignSchema = new SignSchema({
  bgColor:        { type: String,  default: '#955251'       },  // signpost default color
  customIcon:     { type: String,  default: null            },  // custom icon
  icon:           { type: String,  default: 'label'         },  // default icon
  signName:       { type: String,  required: true           },  // user-supply sign name
  signType:       { type: String,  default: 'custom'        },  // sign type: 'custom'
});

// Validations?


// Export as Discriminator
module.exports = Sign.discriminator('CustomSign', customSignSchema)
