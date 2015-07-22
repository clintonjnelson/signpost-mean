'use strict'

require('angular/angular');
require('angular-route'  );

var signpostApp = angular.module('signpostApp', ['ngRoute']);


// Services
require('./services/sessions.js')(signpostApp);

// Controllers
require('./controllers/sessions_controller.js')(signpostApp);
require('./controllers/users_controller.js'   )(signpostApp);

// Directives

// Custom View Routes
signpostApp.config(['$routeProvider'], function($routeProvider) {
  $routeProvider
    .when('login', {
      templateUrl: 'templates/views/login.html'
    })
    .when('/auth', {
      templateUrl: 'templates/views/auth_view.html'
    })

});
