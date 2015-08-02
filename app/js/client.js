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
      templateUrl: 'templates/views/signs'
    })
    .when('/signup', {
      templateUrl: 'templates/views/users/new.html',
      controller: 'usersController'
    })
    .when('/login', {
      templateUrl: 'templates/views/login.html',
      controller: 'sessionsController'
    })
    .when('/session', {
      templateUrl: 'templates/views/sessions_view.html'
    })
    .otherwise({
      redirectTo: '/login'
    });
}]);
