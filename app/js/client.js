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
require('./services/access.js'       )(signpostApp);

// Runs
require('./runs/route_access_intercept.js')(signpostApp);

// Controllers
require('./controllers/users_controller.js'     )(signpostApp);
require('./controllers/sessions_controller.js'  )(signpostApp);
require('./controllers/sign_form_controller.js' )(signpostApp);
require('./controllers/signs_controller.js'     )(signpostApp);

// Directives
require('./directives/login_directive.js'    )(signpostApp);
require('./directives/sidenav_directive.js'  )(signpostApp);
require('./directives/sign_form_directive.js')(signpostApp);
require('./directives/sign_listitem_directive.js')(signpostApp);

// Custom View Routes
signpostApp.config(['$routeProvider', function($routeProvider) {
  var ownerAccess = {
    requiresLogin: true,
    requiredPermissions: ['user'],
    permissionType: 'atLeastOne'
  };


  $routeProvider
    //------------------- SIGNS ROUTES -----------------

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
