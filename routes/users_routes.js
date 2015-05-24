'use strict';

var bodyparser = require('body-parser');
var contains   = require('lodash').contains;
var eatAuth    = require('../lib/eat_auth.js')(process.env.AUTH_SECRET);
var ownerAuth  = require('../lib/owner_auth.js');
var User       = require('../models/User.js');

module.exports = function(router) {
  router.use(bodyparser.json());

  // Create new user
  router.post('/users', function(req, res) {
    var newUser = new User({  // Explicitly populate to avoid exploit
      username: req.body.username,
      basic: req.body.email
    });

    newUser.generateHash(req.body.password, function(hash) {
      newUser.basic.password = hash;
      newUser.save(function(err, user) {
        if (err) console.log('Error creating user. Error: ', err);
        switch(true) {
          case !!(err && _.contains(err.errmsg, '$user')):
            return res.status(400).json({ error: 'user'  });
          case !!(err && _.contains(err.errmsg, '.email')):
            return res.status(400).json({ error: 'email' });
          case !!(err):
            return res.status(400).json({ error: true    });
        }
        user.generateToken(process.env.AUTH_SECRET, function(err, eat) {
          if(err) {
            console.log(err);
            res.status(500).json({ error: 'login' });
          }
          res.json({ eat: eat });
        });

        res.json({ success: true });
      });
    });
  });

  // Get user
  router.get('/users/:username', function(req, res) {
    User.find({'username': req.params.username}, function(err, user) {
      if (err) {
        console.log('Error finding user. Error: ', err);
        return res.status(500).json({ error: 'user not found' });
      }
      res.json(user);
    });
  });

  // Update user
  router.patch('/users/:id', eatAuth, ownerAuth, function(req, res) {
    var updateUserData = req.body;
    delete updateUserData._id;
    delete updateUserData.eat;

    // TEMP ownerAuth FUNCTION INSIDE the patch
    if (req.params._id === req.user._id) {
      console.log('User tried to update another user');
      return res.status(401).json({ error: 'Unauthorized' });
    }

    User.update({'_id': req.user.id}, updateUserData, {runValidators: true}, function(err) {
      if (err) console.log('Error updating user. Error: ', err);
      switch(true) {
        case !!(err && err.code === 11000):  // unique validation
          return res.json({ error: 'username already exists' });
        case !!(err && err.username): // required error
          return res.json({ error: err.username.message.replace('Path', '') });
        case !!(err):
          return res.status(500).json({ error: true });
      }

      res.json({ success: true });
    });
  });

  // Destroy User (soft destroy)
  router.delete('/users/:id', eatAuth, ownerAuth, function(req, res) {
    if (req.params._id === req.user._id) {
      console.log('User tried to delete another user');
      return res.status(401).json({ error: 'Unauthorized' });
    }

    delUser = req.user;
    delUser.deleted = Date.now();
    delUser.save(function(err) {
      if (err) {
        console.log("Error saving deletion of user. Error: ", err);
        res.status(500).json({ error: true });
      }
      res.json({ success: true });
    });
  });
};

















