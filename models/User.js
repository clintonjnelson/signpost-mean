'use strict';

var bcrypt   = require('bcrypt-nodejs');
var eat      = require('eat'          );
var mongoose = require('mongoose'     );

// db schema for User
var UserSchema = mongoose.Schema({
  basic: {
    email:    { type: String, required: true, unique: true },
    password: { type: String, required: true               }     },
  confirmed:       { type: Boolean,  default: false              },
  deleted:         { type: Date,     default: null               },
  eat:             { type: Number    default: null               },
  prt:             { type: String,   default: null               },
  role:            { type: String,   default: null               },
  suspended:       { type: Boolean,  default: false              },
  termsconditions: { type: Date,     default: null               },
  updated_at:      { type: Date,     default: Date.now           },
  username:        { type: String,  required: true, unique: true },

  // ObjectId References
  location_id:     { type: mongoose.Schema.Types.ObjectId, ref: 'Location', required: false },
});

// Validations
UserSchema.path('basic.email'   ).required(true);
UserSchema.path('basic.email'   ).index({ unique: true });
UserSchema.path('basic.password').required(true);
UserSchema.path('username'      ).required(true);
UserSchema.path('username'      ).index({ unique: true });


// Created_at/Updated_at Management
UserSchema.pre('save', function(next) {
  var now = new Date();
  this.udpated_at = now;
  next();
});

// User Methods




// Export mongoose model/schems
module.exports = mongoose.model('User', UserSchema);
