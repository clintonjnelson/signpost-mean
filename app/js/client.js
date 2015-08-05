'use strict';

require('angular/angular'                  );
require('angular-animate/angular-animate'  );
require('angular-aria/angular-aria'        );
require('angular-base64'                   );
require('angular-cookies'                  );
require('angular-material/angular-material');
require('angular-route'                    );

var ngModules = ['ngRoute', 'ngCookies', 'ngMaterial', 'base64', 'ngMdIcons'];

var signpostApp = angular.module('signpostApp', ngModules);


// Services
require('./services/sessions.js'     )(signpostApp);
require('./services/rest_resource.js')(signpostApp);
accessService(signpostApp);

// Run Modules
routeAccess(signpostApp);

// Controllers
require('./controllers/users_controller.js'   )(signpostApp);
require('./controllers/sessions_controller.js')(signpostApp);
require('./controllers/signs_controller.js'   )(signpostApp);

// Directives
require('./directives/login_directive.js'    )(signpostApp);
require('./directives/sidenav_directive.js'  )(signpostApp);
require('./directives/sign_form_directive.js')(signpostApp);

// Custom View Routes
signpostApp.config(['$routeProvider', function($routeProvider) {
  var ownerAccess = {
    requiresLogin: true,
    requiredPermissions: ['user'],
    permissionType: 'atLeastOne'
  };


  $routeProvider
    //------------------- SIGNS ROUTES -----------------
    .when('/signs/new', {
      templateUrl: 'templates/views/signs/new_view.html',
      access: ownerAccess,
    })
    .when('/signs/:username', {
      templateUrl: 'templates/views/signs/signs_view.html',
    })
    .when('/signs', {
      templateUrl: 'templates/views/signs/signs_view.html',
      access: ownerAccess,
    })

    //------------------- AUTH ROUTES -----------------
    .when('/signup', {
      templateUrl: 'templates/views/users/new_view.html',
      controller: 'usersController'
    })
    .when('/login', {
      templateUrl: 'templates/views/sessions/login_view.html',
      controller: 'sessionsController',
      // access: { requiresLogout: true }
    })
    .when('/oauth', {
      templateUrl: 'templates/views/sessions/oauth_view.html'
    })
    .when('/logout', {
      templateUrl: 'templates/views/sessions/logout_view.html',
      controller: 'sessionsController',
      access: ownerAccess,
    })
    .otherwise({
      redirectTo: '/login'
    });
}]);

// The RUN to check authorization (access)
function routeAccess(app) {
  app.run([
    '$rootScope',
    '$location',
    'access',
    function($rootScope, $location, access) {
      var redirectBackAfterLogin = false;     // starts out false
      var loginRedirectUrl;                   // placeholder

      $rootScope.$on('$routeChangeStart', function(event, next) {
        var authorized;

        // if need to direct & didn't come from login
        if (redirectBackAfterLogin && (next.originalPath !== '/login') ) {
          redirectBackAfterLogin = false;               // set back to false
          $location.path(loginRedirectUrl).replace();   // redirect & replace with this
        }
        else if (next.access !== undefined) {           // access obj on route?
          // authorize returns true/false/
          authorized = access.authorized(next.access.requiresLogin, next.access.requiredPermissions, next.access.permissionType);

          // if OK, do nothing.
          if (authorized.login) {                         // not logged in?
            redirectBackAfterLogin = true;
            loginRedirectUrl       = next.originalPath;
            $location.path('/login');                     // redirect to login
          }
          else if (authorized.failReason) {                   // not allowed?
            $location.path(authorized.failReason).replace();  // replace history with note
          }
        }
      });
    }
  ]);
}

// TODO: Refactor to look up by UserId
// TODO: Refactor to Module
function accessService(app) {
  app.factory('access', [
    'sessions',
    function(sessions) {

      // returns authorization object to allow/deny access
      function authorized(requiresLogin, requiredPermissions, permissionType) {
        var result;                     // object return options library
        var eat  = sessions.getEat();   // session token
        var user = sessions.getUser();  // get current user
        var userPermissions = lcPermissions(user.permissions);
        permissionType = permissionType || 'atLeastOne';  // default type

        // login NOT required. DONE.
        if (!requiresLogin) {
          return setResult(true, false);
        }

        // ONLY login required, but logged out
        if(requiresLogin && (!eat || !user) ) {
          return setResult(false, true, 'login');
        }

        // logged in + NO permissions requirements
        if(requiresLogin && eat && user && (!requiredPermissions || !requiredPermissions.length) ) {
          return setResult(true, false);
        }

        // permissions requirements. Determine if meets:
        if(requiredPermissions) {
          requiredPermissions = Array.isArray(requiredPermissions) ?
            lcPermissions(requiredPermissions) :    // typ array case
            requiredPermissions.toLowerCase();      // handle string case

          for(var i=0, curr; i<requiredPermissions.length; i++) {
            curr = requiredPermissions[i];

            // if Type is atLeastOne, only need one
            if(permissionType === 'atLeastOne') {
              if(userPermissions.indexOf(curr) !== -1) {  // match found?
                return setResult(true, false);
              }
              if( atEnd(i, requiredPermissions) ) {     // no matches found?
                return setResult(false, false, 'access denied');
              }
            }

            // if Type is "all", must match all
            if (permissionType === 'all') {
              if(userPermissions.indexOf(curr) === -1) {  // fail to match?
                return setResult(false, false, 'access denied');
              }
              if( atEnd(i, requiredPermissions) ) {     // all match?
                return setResult(true, false);
              }
            }
          }
        }

        //NO explicit case found => default NO ACCESS
        return setResult(false, false, 'ambiguous');


        // check if at last item. Returns true/false
        function atEnd(ind, arr) {
          return (ind === arr.length-1);
        }

        // set the result object properties
        function setResult(ok, login, failReason) {
          return {
            ok: ok,                 // true, false
            login: login,           // true, false
            failReason: failReason, // login, access denied,
          };
        }

        function lcPermissions(perms) {
          return perms.map(function(elem, ind, orig) {
              return elem.toLowerCase();
            });
        }
      }

      return {
        authorized: authorized
      }
    }
  ]);
}
