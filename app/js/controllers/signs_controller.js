'use strict';

module.exports = function(app) {
  app.controller('signsController', ['$scope', 'RESTResource', function($scope, RESTResource) {
    // connect with Signs api
    var signHttp = RESTResource('signs');

    // General settings for sign icons display
    $scope.icons = {
      color: '#808080',
      size:  '90',
    }

    // TODO: TAILOR THIS TO GET THE SIGNS OF USER PASSED IN
          // THIS WILL ENABLE SAME DIRECTIVE TO VIEW OTHER USER's SIGNS
    $scope.getSigns = function() {
      signHttp.getAll({_id: 'placeholderIdName'}, function(err, data) {
        if(err) {return console.log("ERROR GETTING USERS: ", err);}
        console.log("SIGNS RETURNED ARE: ", data.signs)
        $scope.signs = data.signs;
      });
    };
  }]);
};
