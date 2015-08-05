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
            this.setSession();    // set user session for all http requests
            // TODO: SHOW SUCCESS FEEDBACK TO USER
            callback(data);               // pass data to cb

          }.bind(this))
          .error(function(err) {
            // TODO: SHOW ERROR FEEDBACK TO USER
            console.log("Error logging in.");
            callback(err);               // pass data to cb
          });
      },

      redirect: function redirect(path) {
        $location.path(path);      // redirect view here
      },

      currPath: function currPath() {
        return $location.path();   // return current path
      },

      //----------------------- OAUTH2 AUTH ----------------
      setCookieFromParamToken: function setCookieFromParamToken() {
        this.setEat($routeParams.token);
        this.clearTokenParam();
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

      resetEat: function resetSession() {
        this.logout();
      },

      // TODO: SEND & SAVE THIS
      getUser: function getUser() {
        // return $cookies.get('user');
        return {
          permissions: ['user'],
          _id: 1
        };
      },

      setUser: function setUser(user) {
        $cookies.put('user', user);
      },

      setSession: function setSession() {
        // set session eat header to current value of EAT
        $http.defaults.headers.common.eat = this.getEat();
      },

      logout: function logout() {
        $cookies.put('eat', '' );
        $cookies.put('user', '');
        $location.path('/login');
      },
    };
  }]);
};
