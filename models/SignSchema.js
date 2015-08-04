'use strict';

var mongoose = require('mongoose');
var util     = require('util'    );

// TODO: refactor using more-functional/less-classical syntax
function SignSchema() {
  mongoose.Schema.apply(this, arguments);

  // Schema fields
  this.add({
    userId:       { type: mongoose.Schema.Types.ObjectId, ref: 'User' },  // needed for ALL Signs
    knownAs:      { type: String                                      },
    description:  { type: String                                      },
    linkUrl:      { type: String                                      },
  });
}
util.inherits(SignSchema, mongoose.Schema);  // extend mongoose Schema

// Export Schema for use
module.exports = SignSchema;
