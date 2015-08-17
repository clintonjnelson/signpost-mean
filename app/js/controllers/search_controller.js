'use strict';

module.exports = function(app) {

  app.controller('searchController', [
    '$scope',
    '$routeParams',
    '$http',
    function($scope, $routeParams, $http) {

      console.log("ROUTE PARAMS IS: ", $routeParams);
      var init = function() {
        var paramsQuery = $routeParams.searchStr;
        if(paramsQuery) {
          databaseSearch(paramsQuery);
        }
      };
      init();

      $scope.searchStr = '';
      $scope.users     = [];    // found users
      $scope.signs     = [];    // found signs


      $scope.searchUsers = function() {
        console.log("SEARCHING CLICKED!");
        console.log("Search string is: ", $scope.searchStr);

        databaseSearch($scope.searchStr);
      };

      function databaseSearch(queryStr) {
        $http.get('/search', {params: {'searchStr': queryStr} })
          .success(function(data) {
            console.log("SUCCESSFUL SEARCH. DATA IS: ", data);
            $scope.users = data.users;
            $scope.signs = data.signs;
          })
          .error(function(err) {
            console.log("Error searching.");
          })
      }
    }
  ]);
}
