'use strict';


module.exports = function(app) {
  app.directive('sidenavDirective', function() {
    return {
      restrict:    'AE',
      replace:     true,
      templateUrl: '/templates/directives/sidenav.html',
      // scope:
      controller:  ['$scope', '$mdSidenav', function($scope, $mdSidenav) {
        $scope.openLeftMenu = function() {
          $mdSidenav('left').toggle();
        };
      }]
    };
  });
};
