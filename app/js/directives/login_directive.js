'use strict';


module.exports = function(app) {
  app.directive('loginDirective', function() {
    return {
      restrict:     'AE',
      replace:      true,
      templateUrl: '/templates/directives/login.html',
      // controller:  'sessionsController'
    };
  });
};
