'use strict';

require('angular/angular'                  );
require('angular-animate/angular-animate'  );
require('angular-aria/angular-aria'        );
require('angular-base64'                   );
require('angular-cookies'                  );
require('angular-material/angular-material');
require('angular-route'                    );

var ngModules = ['ngRoute', 'ngCookies', 'ngMaterial', 'base64'];

var signpostApp = angular.module('signpostApp', ngModules);


// Services
require('./services/sessions.js')(signpostApp);

// Controllers
require('./controllers/sessions_controller.js')(signpostApp);
require('./controllers/users_controller.js'   )(signpostApp);

// Directives
require('./directives/sidenav_directive.js')(signpostApp);
require('./directives/login_directive.js'  )(signpostApp);

// Custom View Routes
signpostApp.config(['$routeProvider', function($routeProvider) {
  $routeProvider
    .when('/signs', {
      templateUrl: 'templates/views/signs/signs_view.html'
    })
    .when('/signup', {
      templateUrl: 'templates/views/users/new_view.html',
      controller: 'usersController'
    })
    .when('/login', {
      templateUrl: 'templates/views/sessions/login_view.html',
      controller: 'sessionsController'
    })
    .when('/oauth', {
      templateUrl: 'templates/views/sessions/oauth_view.html'
    })
    .when('/logout', {
      templateUrl: 'templates/views/sessions/logout_view.html',
      controller: 'sessionsController'
    })
    .otherwise({
      redirectTo: '/login'
    });
}]);
