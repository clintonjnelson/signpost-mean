'use strict';

var bodyparser = require('body-parser'      );
var User       = require('../models/User.js');
var Sign       = require('../models/Sign.js');


module.exports = function(router) {
  router.use(bodyparser.json());

  router.get('/search', function(req, res) {
    console.log("SEARCH STRING RECEIVED AS: ", req.query.searchStr);

    var searchStr = req.query.searchStr.trim();
    var regex     = new RegExp('.*' + searchStr + '.*');
    var count     = 0;
    var resCount  = 2;
    var resObj    = {};


    User.find({'username': {'$regex': regex} }, buildQueryCallback('users'));
    Sign.find({'knownAs':  {'$regex': regex} }, buildQueryCallback('signs'));

    function buildQueryCallback(type) {
      return function queryCallback(err, data) {
        if(err) {return res.status(500).json({error: true, msg: 'database error'});}
        console.log(type + " FOUND AS: ", data);

        resObj[type] = data;
        count++;
        responseCheck();
      };

      // ensure all searches run
      function responseCheck() {
        if(count === resCount) {
          return res.json(resObj);  // send total response object
        }
      }
    }
  });
};
