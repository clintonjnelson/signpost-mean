'use strict';

var bodyparser   = require('body-parser'              );
var eatAuth      = require('../lib/routes_middleware/eat_auth.js')(process.env.AUTH_SECRET);
var FacebookSign = require('../models/FacebookSign.js');
var Sign         = require('../models/Sign.js'        );

module.exports = function(app) {
  app.use(bodyparser.json());

    //TODO: GET BY A USER VALUE, INSTEAD OF BY TOKEN
  app.get('/signs/:id', eatAuth, function(req, res) {
    // var userId = req.params.id;
    var userId = req.user._id
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

  app.post('/signs', eatAuth, function(req, res) {
    console.log('MADE IT TO THE SERVER CREATE.');
    console.log('USER IS: ', req.user);
    console.log('DATA IS: ', req.body);
    var currUser = req.user;
    var signData = req.body.sign;
    var newSign;

    // Modularize out the creation of Signs with Policy Object
    if (signData.type === 'facebook') {
      newSign = new FacebookSign({
        facebookId:     Date.now(),                 //CHANGE THIS
        linkUrl:        signData.link,
        facebookPicUrl: 'http://www.somepicurl.com',
        knownAs:        signData.knownAs,
        description:    signData.description,
        userId:         currUser._id,
      });

      console.log("NEW SIGN:", newSign);
      console.log("ABOUT TO SAVE SIGN...");
      newSign.save(function(err, data) {
        if(err) {
          console.log("Could not save sign. Error: ", err);
          return res.status(500).json({error: true, msg: 'could not save sign'});
        }

        console.log("SAVED SIGN IS: ", data);
        res.json({sign: data});
      });
    }
  });
};

