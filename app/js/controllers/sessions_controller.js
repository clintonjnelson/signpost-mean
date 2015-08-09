'use strict';
/*
  Routes Covered:
    - /oauth
    - /login

  This module covers two cases:
  Oauth signin where a cookie is sent to /oauth and parsed out of the params
  Basic signin, where the user creates a login through the website
*/

module.exports = function(app) {
  app.controller('sessionsController', ['sessions', '$scope', '$http', '$routeParams', function(sessions, $scope, $http, $routeParams) {
    var currPath = sessions.currPath();

    //-------------------- LOGOUT ------------------
    if ( checkPath('/logout') ) {
      console.log("MADE IT TO LOGOUT");
      sessions.logout();             // clear token, redirect login
    }

    //-------------------- OAUTH ------------------
    if ( checkPath('/oauth') && $routeParams.token) {
      sessions.setCookieFromParamToken();   // session+token => load/clear/redirect
      console.log("SET COOKIE AS: ", sessions.getEat());
      return sessions.redirect('/signs');
    }
    if ( checkPath('/oauth') ) {   // no token? login again
      return sessions.redirect('/greet');
    }

    //--------------------- BASIC AUTH ---------------------
    $scope.user = {};
    $scope.login = function(data) {
      sessions.login($scope.user, function(data) {
        sessions.redirect('/signs');
      });
    };


    function checkPath(path) {
      return (currPath === path ? true : false);
    }
  }]);
};
