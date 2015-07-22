'use strict';

module.exports = function(app) {
  app.factory('auth', ['$cookies', '$location', '$routeParams'], function($cookies, $location, $routeParams) {
    return {

      // Session Helpers
      isSignedIn: function isSignedIn() {
        return !!( cookies.get('eat') && $cookies.get('eat').length );
      },

      isSignedOut: function isSignedOut() {
        return !this.isSignedIn();
      },


      // Login Param Controls
      setCookieFromParamToken: function setCookieFromParamToken() {
        if ($routeParams.token) {     // set user session & redirect to signs
          this.setEat($routeParams.token);
          this.clearTokenParam();
          $location.path('/signs')
        } else {                      // if not token to set, redirect to login again
          $location.path('/login')
        }
      },

      clearTokenParam: function clearTokenParam() {
        $location.search('token', null);
      },


      // Cookie/Session Management
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
  });
};
