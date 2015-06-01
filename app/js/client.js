'use strict'

require('angular/angular');

var signpostApp = angular.module('signpostApp', []);

// load controllers into App (via module instead of directly)
require('./sessions/controllers/sessions_controller.js')(signpostApp);
require('./users/controllers/users_controller.js'      )(signpostApp);

// Anything else put in here will get bundled
