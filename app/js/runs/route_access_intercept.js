'use strict';


// The RUN that manages whether users see or don't see routes
module.exports = function routeAccessIntercept(app) {
  app.run(['$rootScope', '$location', 'access', function($rootScope, $location, access) {
    var redirectBackAfterLogin = false;               // starts out false
    var loginRedirectUrl;                             // placeholder

    $rootScope.$on('$routeChangeStart', function(event, next) {
      var authorized;

      // if need to direct & wasn't orig going to /greet
      if (redirectBackAfterLogin && (next.originalPath !== '/greet') ) {
        redirectBackAfterLogin = false;               // set back to false
        $location.path(loginRedirectUrl).replace();   // take to orig intent & replace history
      }

      if (next.access !== undefined) {           // access obj on route?
        // authorize returns true/false/
        authorized = access.authorized(next.access.requiresLogin, next.access.requiredPermissions, next.access.permissionType);

        // if NOT logged in, save intended page & prompt greet
        // TODO: FLASH A LOGIN REQUIRED ERROR MESSAGE TO THE USER
        if (authorized.login) {                       // not logged in?
          redirectBackAfterLogin = true;
          loginRedirectUrl       = next.originalPath;
          $location.path('/greet');                   // redirect to greet
        }
        // if auth fails, replace history with reason it failed
        else if (authorized.failReason) {                   // not allowed?
          $location.path(authorized.failReason).replace();  // replace history with note
        }

        // ELSE if auth access is OK, let continue....
      }
    });
  }]);
};
