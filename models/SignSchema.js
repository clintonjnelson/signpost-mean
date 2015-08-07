'use strict';

var mongoose = require('mongoose');
var util     = require('util'    );

// TODO: refactor using more-functional/less-classical syntax
function SignSchema() {
  mongoose.Schema.apply(this, arguments);

  // Schema fields
  this.add({
    customBgColor:  { type: String,  default: null                     }, // custom sign color
    description:    { type: String                                     }, // sign desc (opt)
    knownAs:        { type: String                                     }, // username ref
    linkUrl:        { type: String                                     }, // link to site
    published:      { type: Boolean, default: true                     }, // remove from public
    userId:         { type: mongoose.Schema.Types.ObjectId, ref: 'User' , required: true},  // needed for ALL Signs
  });
}
util.inherits(SignSchema, mongoose.Schema);  // extend mongoose Schema

// Export Schema for use
module.exports = SignSchema;
