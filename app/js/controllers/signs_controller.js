'use strict';
_ = require('lodash');

module.exports = function(app) {
  app.controller('signsController', ['$scope', 'RESTResource', function($scope, RESTResource) {
    // connect with Signs api
    var signHttp = RESTResource('signs');

    //----------------------------- SIGN LISTITEMS -----------------------------
    $scope.getSigns = function() {
      // TODO: TAILOR THIS TO GET THE SIGNS OF USER PASSED IN
          // THIS WILL ENABLE SAME DIRECTIVE TO VIEW OTHER USER's SIGNS
      signHttp.getAll({_id: 'placeholderIdName'}, function(err, data) {
        if(err) {return console.log("ERROR GETTING USERS: ", err);}
        console.log("SIGNS RETURNED ARE: ", data.signs)
        $scope.signs = data.signs;
      });
    };


    // general icon settings for directive
    $scope.icons = {
      color: '#808080',
      size:  '120',
    }

    // Edit/Cancel Editing Sign
    $scope.toggleEditing = function(sign) {
      if(sign.isEditing) {
        var ind             = $scope.signs.indexOf(sign);
        sign.temp.isEditing = false;            // temp will replace current
        $scope.signs[ind]   = sign.temp;        // top level: restore former state
        sign = sign.temp;                       // reset local sign
      } else {
        sign.isEditing = true;               // editing mode
        sign.temp      = _.cloneDeep(sign); // copy current state
      }
    };


    $scope.updateSign = function(sign) {
      console.log("UPDATING SIGN: ", sign);
      sign.isEditing      = false;
      sign.temp.isEditing = false;
      signHttp.update({sign: sign}, function(err, data) {
        if(err) {
          // TODO: Flash error to user
          console.log('Could not update sign.');
          $scope.signs.splice($scope.signs.indexOf(sign), 1, sign.temp); // reset sign info
          delete sign.temp;                                              // delete temp
          return console.log(err);
        }

        // TODO: Flash success to user
        delete sign.temp;                                 // delete the temp state
        console.log('Sign update successful.')
      });
    };
  }]);
};
