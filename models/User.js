'use strict';

var bcrypt   = require('bcrypt-nodejs');
var eat      = require('eat'          );
var mongoose = require('mongoose'     );

// db schema for User
var UserSchema = mongoose.Schema({
  auth: {
    basic: {
      password:    { type: String,    default: null }             },
    facebook: {
      facebookId:          { type: String,   default: null    },
      facebookAccessToken: { type: String,   default: null    },  },
                                                                      },
  confirmed:       { type: Boolean,  default: false                   },
  deleted:         { type: Date,     default: null                    },
  eat:             { type: Number,   default: null                    },
  email:           { type: String,  required: true, unique: true      },
  prt:             { type: String,   default: null                    },
  role:            { type: String,   default: null                    },
  suspended:       { type: Boolean,  default: false                   },
  termsconditions: { type: Date,     default: null                    },
  updated_at:      { type: Date,     default: Date.now                },
  username:        { type: String,   default: null                    },

  // ObjectId References
  location_id:     { type: mongoose.Schema.Types.ObjectId, ref: 'Location', required: false },
});

// Validations
UserSchema.path('auth.basic.password').required(true);
UserSchema.path('email'              ).required(true);
UserSchema.path('email'              ).index( { unique: true } );
// UserSchema.path('username'      ).required(true);
// UserSchema.path('username'      ).index( { unique: true } );


// Hooks
UserSchema.pre('save', function(next) { // Update_at Hook
  this.udpated_at = Date.now();
  next();
});

// User Methods
UserSchema.methods.generateHash = function generateHash(password, callback) {
  bcrypt.genSalt(8, function(err, salt) {
    bcrypt.hash(password, salt, null, function saveHashedPassword(err, hash) {
      if (err) {
        console.log('Error generating hash. Error: ', err);
        return callback(err, null);
      }
      callback(null, hash);
    });
  });
};

UserSchema.methods.checkPassword = function checkPassword(password, callback) {
  bcrypt.compare(password, this.auth.basic.password, function validatePassword(err, res) {
    if (err) {
      console.log('Error checking password. Error: ', err);
      return callback(err, null);
    }
    callback(null, res);  // if failure, res=false. if success, res=true
  });
};

UserSchema.methods.generateToken = function generateToken(secret, callback) {
  this.eat = Date.now();
  this.save(function(err, user) {
    if (err) {
      console.log('Error creating new token. Error: ', err);
      return callback(err, null);
    }

    eat.encode({eat: user.eat}, secret, function encodeEat(err, eatoken) {
      if (err) {
        console.log('Error encoding eat. Error: ', err);
        return callback(err, null);
      }
      callback(null, eatoken);
    });
  });
};

UserSchema.methods.invalidateToken = function invalidateToken(callback) {
  this.eat = null;
  this.save(function(err, user) {
    if (err) {
      console.log('Could not save invalidated token. Error: ', err);
      return callback(err, null);
    }
    callback(null, user);
  });
};


// Export mongoose model/schems
module.exports = mongoose.model('User', UserSchema);
