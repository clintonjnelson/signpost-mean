'use strict';

var bodyparser    = require('body-parser'              );
var eatAuth       = require('../lib/routes_middleware/eat_auth.js')(process.env.AUTH_SECRET);
var signOwnerAuth = require('../lib/routes_middleware/sign_owner_auth.js');
var FacebookSign  = require('../models/FacebookSign.js');
var Sign          = require('../models/Sign.js'        );
var signBuilder   = require('../lib/sign_builder.js'   );

module.exports = function(app) {
  app.use(bodyparser.json());

    //TODO: GET BY A USER VALUE, INSTEAD OF BY TOKEN
  app.get('/signs/:id', eatAuth, function(req, res) {
    // var userId = req.params.id;
    var userId = req.user._id;
    console.log("ID CAME IN AS: ", userId);
    Sign.find({userId: userId}, function(err, signs) {
      if(err) {
        console.log("Error getting signs: ", err);
        return res.status(500).json({error: true, msg: 'Database error finding signs.'});
      }

      console.log("SIGNS FOUND: ", signs);
      res.json({signs: signs});
    });

  });


  // eatAuth: Creation should be made only by the user - verify. Use token.
  // Should verify url param :type. Default is custom. Custom can be anything.
      // custom avoids asking for info directly
  // If request for known :type param (user wants autoload), use that proceedure via oauth or API.
      // Procedure should be loaded via sign-creation-library supported by modules
  app.post('/signs/:type?', eatAuth, function(req, res) {
    console.log('CREATING SIGN....');
    console.log('DATA IS: ', req.body);

    var currUser = req.user;
    var signData = req.body.sign;
    var type     = req.params.type || 'custom';         // passed param or custom
    var newSign;


    // catch wrong types
    if( !signBuilder[type] ) {
      console.log('Type ' + type + ' is not a valid build type.');
      return res.status(400).json({error: true, msg: 'type does not exist'});
    }

    // build sign according to "type" (see above)
    newSign = signBuilder[type](signData);
    newSign.userId = currUser.id;           // add userId before saving
    console.log("ABOUT TO SAVE SIGN...", newSign);

    newSign.save(function(err, data) {
      if(err) {
        console.log("Could not save sign. Error: ", err);
        return res.status(500).json({error: true, msg: 'could not save sign'});
      }

      console.log("SAVED SIGN IS: ", data);
      return res.json({sign: data});
    });
  });

  // Update after verifying user & owner
  app.patch('/signs', eatAuth, signOwnerAuth, function(req, res) {
    console.log('MADE IT TO THE SERVER UPDATE.');
    console.log('USER IS: ', req.user);
    console.log('DATA IS: ', req.body);

    var currUser = req.user;
    var signData = req.body.sign;

    Sign.update({_id: signData._id}, signData, function(err, data) {
      if(err) {
        console.log('Database error finding sign to update.');
        return res.status(500).json({error: true, msg: 'database error'});
      }

      console.log('UPDATE SUCCESSFUL!');
      res.json({error: false});
    });
  });
};

