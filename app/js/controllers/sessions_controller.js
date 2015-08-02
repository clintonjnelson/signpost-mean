'use strict';
/*
  Routes CoveredL
    - /session
    - /login

  This module covers two cases:
  Oauth signin where a cookie is sent to /session and parsed out of the params
  Basic signin, where the user creates a login through the website

*/

module.exports = function(app) {
  app.controller('sessionsController', ['sessions', '$scope', '$http', '$location', function(sessions, $scope, $http, $location) {


    //--------------------- BASIC AUTH ---------------------
    $scope.title = "HELLO WORLD";
    $scope.user = {};
    $scope.login = function(data) {
      sessions.login($scope.user, function(data) {
        session.redirect('/signs');
      });
    };

    //-------------------- OAUTH ------------------
    // set user session, if param token exists; clear token param
    sessions.setCookieFromParamToken();
  }]);
};
