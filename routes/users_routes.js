'use strict';

var bodyparser = require('body-parser'      );
var contains   = require('lodash'           ).contains;
var eatAuth    = require('../lib/routes_middleware/eat_auth.js'  )(process.env.AUTH_SECRET);
var ownerAuth  = require('../lib/routes_middleware/owner_auth.js');
var User       = require('../models/User.js');

module.exports = function(router) {
  router.use(bodyparser.json());

  // Get user
  router.get('/users', function(req, res) {
    User.find({}, function(err, users) {
      if (err) {
        console.log('Error finding user. Error: ', err);
        return res.status(500).json({ error: 'user not found' });
      }
      res.json({users: users});
    });
  });

  // Create new user
  router.post('/users', function(req, res) {
    var newUser = new User({  // Explicitly populate to avoid exploit
      username: req.body.username,
      email:    req.body.email
    });

    newUser.generateHash(req.body.password, function(err, hash) {
      if (err) { return res.status(500).json({ error: true }); }
      newUser.auth.basic.password = hash;

      newUser.save(function(err, user) {
        if (err) { console.log('Error creating user. Error: ', err); }
        switch(true) {
          case !!(err && contains(err.errmsg, 'E11000')):
            return res.status(400).json({ error: 'username'  });
          case !!(err && contains(err.errmsg, '.email')):
            return res.status(400).json({ error: 'email'     });
          case !!(err):
            return res.status(400).json({ error: true        });
        }

        user.generateToken(process.env.AUTH_SECRET, function(err, eat) {
          if(err) {
            console.log(err);
            return res.status(500).json({ error: 'login' });
          }
          res.json({ eat: eat });
        });
      });
    });
  });

  // Update user
  router.patch('/users/:_id', eatAuth, ownerAuth('_id'), function(req, res) {
    var updUserData = req.body;

    delete updUserData._id;
    delete updUserData.eat;

    if(updUserData.password) {
      console.log("ABOUT TO UPDATE USER & PASS... Current user is: ", updUserData);

      req.user.generateHash(updUserData.password, function(err, hash) {
        if(err) { return res.status(500).json({error: true}); }
        updUserData.auth.basic.password = hash;

        updateUser(updUserData);
      });
    } else {
      console.log("ABOUT TO UPDATE USER... Current user is: ", updUserData);
      updateUser(updUserData);
    }

    function updateUser(userData) {
      console.log("ID TO UPDATE IS: ", req.user._id);
      User.findByIdAndUpdate(
        req.user._id,                      // id to find
        {$set: userData},                  // values to update
        {runValidators: true, new: true},  // mongoose options
        function(err, user) {              // callback
          if (err) { console.log('Error updating user. Error: ', err); }
          switch(true) {
            case !!(err && err.code === 11000):  // unique validation
              return res.status(400).json({ error: 'username already exists' });
            case !!(err && err.username): // required error
              return res.status(400).json({ error: err.username.message.replace('Path', '') });
            case !!(err):
              return res.status(500).json({ error: true });
          }
          console.log("Updated user is: ", user);
          res.json({ success: true, user: user });
        }
      );
    }
  });

  // Destroy User (soft destroy)
  router.delete('/users/:_id', eatAuth, ownerAuth('_id'), function(req, res) {
    var delUser;

    delUser = req.user;
    delUser.deleted = Date.now();
    delUser.save(function(err) {
      if (err) {
        console.log("Error saving deletion of user. Error: ", err);
        return res.status(500).json({ error: true });
      }
      res.json({ success: true });
    });
  });
};

















