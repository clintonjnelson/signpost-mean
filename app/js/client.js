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
require('./controllers/search_controller.js'    )(signpostApp);
require('./controllers/sessions_controller.js'  )(signpostApp);
require('./controllers/signs_controller.js'     )(signpostApp);
require('./controllers/users_controller.js'     )(signpostApp);

// Directives
require('./directives/dyn_sign_form_directive.js')(signpostApp);
require('./directives/new_signs_area_directive.js'  )(signpostApp);
require('./directives/hover_icon_img_directive.js'  )(signpostApp);
require('./directives/login_directive.js'           )(signpostApp);
require('./directives/sidenav_directive.js'         )(signpostApp);
require('./directives/sign_listitem_directive.js'   )(signpostApp);

// Custom View Routes
signpostApp.config(['$routeProvider', function($routeProvider) {
  var ownerAccess = {
    requiresLogin: true,
    requiredPermissions: ['user'],
    permissionType: 'atLeastOne'
  };


  $routeProvider

    //------------------- USERS ROUTES -----------------
    .when('/users/:username/edit', {
      templateUrl: 'templates/views/users/edit_view.html',
      access: ownerAccess
    })
    .when('/users/:username', {
      // should redirect to the signs view with matching username
      templateUrl: 'templates/views/signs/signs_view.html'
    })
    .when('/users', {
      templateUrl: 'templates/views/users/index_view.html'
    })

    //------------------- SEARCH ROUTES -----------------
    .when('/search', {
      templateUrl: 'templates/views/search_view.html',
      controller: 'searchController'
    })

    //------------------- AUTH ROUTES -----------------
    .when('/greet', {
      templateUrl: 'templates/views/greet_view.html'
    })
    .when('/oauth', {
      templateUrl: 'templates/views/sessions/oauth_view.html'
    })
    .when('/logout', {
      templateUrl: 'templates/views/sessions/logout_view.html',
      controller: 'sessionsController'
      // access: ownerAccess,
    })

    //------------------- SIGNS ROUTES -----------------
    .when('/signs/:username', {
      templateUrl: 'templates/views/signs/signs_view.html',
    })
    .when('/signs', {
      templateUrl: 'templates/views/signs/signs_view.html',
      access: ownerAccess,
    })
    .when('/:username', {
      templateUrl: 'templates/views/signs/signs_view.html'
    })
    .when('/', {
      templateUrl: '/templates/views/signs/signs_view.html',
      access: ownerAccess
    })
    .otherwise({
      redirectTo: '/greet'
    });
}]);
