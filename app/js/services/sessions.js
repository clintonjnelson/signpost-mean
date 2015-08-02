'use strict';

module.exports = function(app) {
  app.factory('sessions', ['$cookies', '$location', '$routeParams', '$base64', '$http', function($cookies, $location, $routeParams, $base64, $http) {

    return {

      //------------------------ VIEW HELPERS ----------------
      isSignedIn: function isSignedIn() {
        return !!( $cookies.get('eat') && $cookies.get('eat').length );
      },

      isSignedOut: function isSignedOut() {
        return !this.isSignedIn();
      },


      //----------------------- BASIC AUTH --------------------
      // basic-auth login & set user session
      login: function login(user, callback) {
        // encode base64 for basic auth via passport
        console.log('USER IS: ', user);
        var encoded = $base64.encode(user.email + ':' + user.password);
        $http.get('/login', { headers: { 'Authorization': 'Basic ' + encoded} })
          .success(function(data) {
            this.setEat(data.eat);        // set cookie in App
            // TODO: SHOW SUCCESS FEEDBACK TO USER
            callback(data);               // pass data to cb

          }.bind(this))
          .error(function(err) {
            // TODO: SHOW ERROR FEEDBACK TO USER
            console.log("Error logging in.");
            callback(err);               // pass data to cb
          });
      },

      redirect: function(path) {
        $location.path(path);
      },

      //----------------------- OAUTH2 AUTH ----------------
      setCookieFromParamToken: function setCookieFromParamToken() {
        var currLoc = $location.path();
        console.log('CURRENT LOCATION IS:', currLoc);

        // if session w/ token, load/clear/redirect
        if ( ($location.path() === '/session') && $routeParams.token) {     // set user session & redirect to signs
          this.setEat($routeParams.token);
          this.clearTokenParam();
          $location.path('/signs');
        } else if ( currLoc === '/session') {
          $location.path('/login');  // if no token, redirect to login again
        }
        // other paths, do nothing
      },

      clearTokenParam: function clearTokenParam() {
        $location.search('token', null);
      },


      //---------------------- COOKIE MANAGEMENT ---------------
      getEat: function getEat() {
        return $cookies.get('eat');
      },

      setEat: function setEat(eat) {
        $cookies.put('eat', eat);
      },

      resetEat: function resetEat() {
        this.logout();
      },

      logout: function logout() {
        $cookies.put('eat', '' );
        $location.path('/login');
      },
    };
  }]);
};
