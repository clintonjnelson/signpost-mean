'use strict';

module.exports = function(app) {
  app.factory('sessions', [
    '$cookies',
    '$location',
    '$routeParams',
    '$base64',
    '$http',
    function($cookies, $location, $routeParams, $base64, $http) {

    return {

      //------------------------ VIEW HELPERS ----------------
      isSignedIn: function isSignedIn() {
        return !!( $cookies.get('eat') && $cookies.get('eat').length );
      },

      isSignedOut: function isSignedOut() {
        return !this.isSignedIn();
      },

      isOwner: function isOwner(signOwnerId) {
        var currentUserId = this.getUser()._id;
        return signOwnerId === currentUserId;
      },

      redirect: function redirect(path) {
        $location.path(path);      // redirect view here
      },

      currPath: function currPath() {
        return $location.path();   // return current path
      },


      //----------------------- BASIC AUTH --------------------
      // basic-auth login & set user session
      login: function login(user, callback) {
        // encode base64 for basic auth via passport
        var encoded = $base64.encode(user.email + ':' + user.password);
        $http.get('/login', { headers: { 'Authorization': 'Basic ' + encoded} })
          .success(function(data) {
            this.setEat(data.eat);              // set cookie in App
            this.setSessionHeader();            // set user session for all http requests
            // TODO: SHOW SUCCESS FEEDBACK MSG TO USER
            callback(null, data);               // pass data to cb

          }.bind(this))
          .error(function(err) {
            // TODO: SHOW ERROR FEEDBACK TO USER
            console.log("Error logging in.");
            callback(err, null);               // pass data to cb
          });
      },

      setBasicSession: function setBasicSession(apiData) {
        this.setEat(apiData.eat);       // set Eat cookie
        this.setUser(apiData.user);
        this.setSessionHeader();        // http auto-send Eat cookie
      },


      //----------------------- OAUTH2 AUTH ----------------
      // handle separately, since only sends eat. User is separate request.
      setCookieFromParamToken: function setCookieFromParamToken() {
        this.setEat($routeParams.token);
        this.clearTokenParam();
      },

      clearTokenParam: function clearTokenParam() {
        $location.search('token', null);
      },

      setOauthSession: function setOauthSession() {
        this.setCookieFromParamToken();
        this.setUserFromApi();
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
        return $cookies.getObject('user');
      },

      setUser: function setUser(user) {
        $cookies.putObject('user', user);
      },

      setUserFromApi: function getUserFromApi() {
        $http.get('/login/user')
          .success(function(data) {
            this.setUser(data.user);
            this.redirect('/signs');   // TODO: VERIFY redirect back if user was not at /greet
          }.bind(this))
          .error(function(err) {
            // TODO: HANDLE WITH ERROR MESSAGE TO USER
            console.log("Could not retrieve user from db. Try logging in again.");
          });
      },

      setSessionHeader: function setSessionHeader() {
        // set session eat header to current value of EAT
        $http.defaults.headers.common.eat = this.getEat();
      },

      logout: function logout() {
        $cookies.put('eat', '' );
        $cookies.put('user', '');
        $location.path('/greet');
      },
    };
  }]);
};
