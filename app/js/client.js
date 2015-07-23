'use strict'

require('angular/angular'                  );
require('angular-animate/angular-animate'  );
require('angular-aria/angular-aria'        );
require('angular-cookies'                  );
require('angular-material/angular-material');
require('angular-route'                    );

var signpostApp = angular.module('signpostApp', ['ngRoute', 'ngCookies', 'ngMaterial']);


// Services
require('./services/sessions.js')(signpostApp);

// Controllers
require('./controllers/sessions_controller.js')(signpostApp);
require('./controllers/users_controller.js'   )(signpostApp);

// Directives
require('./directives/sidenav_directive.js')(signpostApp);

// Custom View Routes
signpostApp.config(['$routeProvider', function($routeProvider) {
  $routeProvider
    .when('/login', {
      templateUrl: 'templates/views/login.html'
    })
    .when('/sessions', {
      templateUrl: 'templates/views/sessions_view.html'
    })
    .otherwise({
      redirectTo: '/login'
    })
}]);
