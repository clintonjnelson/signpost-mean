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
  app.controller('sessionsController', [
    'sessions',
    '$scope',
    '$http',
    '$routeParams',
    '$window',
    function(sessions, $scope, $http, $routeParams, $window) {

      var currPath = sessions.currPath();

      //-------------------- LOGOUT ------------------
      if ( checkPath('/logout') ) {
        sessions.resetSession();             // clear token, redirect greet
        $window.location.reload();
        sessions.redirect('/greet');
      }

      console.log("SHOULD NOT HIT THIS ON LOGOUT");
      //-------------------- OAUTH ------------------
      if ( checkPath('/oauth') && $routeParams.token) {
        console.log("ITS TRYING OAUTH", $routeParams.token);
        sessions.setOauthSession();   // session+token+user => load/clear/redirect
      }

      else if ( checkPath('/oauth') ) {   // no token? login again
        sessions.redirect('/greet');
      }

      //--------------------- BASIC AUTH ---------------------
      // $scope & initial values
      $scope.user = {};
      $scope.user.newAccount = false;
      $scope.user.termsCond  = false;

      // Functions
      $scope.login = function() {
        if($scope.user.newAccount) {  // new user

          if($scope.user.termsCond) { // agree to T&C?
            $http.post('/users', $scope.user)
              .success(function(data) {       // TODO: flash success msg to user
                sessions.setBasicSession(data);        // sets: eat, user, http-eat-header
                console.log('User created.');
              })
              .error(function(err) {  // TODO: flash validation/error to user;
                console.log('Error creating user.');
              });
          } else {  // T&C not agreed to
            // TODO: FLASH TERMS & CONDITIONS REQUIRED MESSAGE
          }
        } else {    //
          sessions.login($scope.user, function(err, data) {
            if(err) {return console.log("ERROR LOGGING IN: ", err);}
            console.log("LOGGED IN.")
            sessions.redirect('/');            // redirects if not successful
          });
        }
      };


      function checkPath(path) {
        return (currPath === path ? true : false);
      }
  }]);
};
