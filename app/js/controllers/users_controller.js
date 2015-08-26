'use strict';

module.exports = function(app) {
  app.controller('usersController', ['$scope', '$http', 'sessions', function($scope, $http, sessions) {

    $scope.users = [];

    // Errors
    $scope.errors = [];
    $scope.clearErrors = function() {
      $scope.errors = [];
    };

    // Show User
    $scope.getUser = function(user) {
      $scope.user = sessions.getUser();
      // $http.get('/users/' + user._id)
      //   .success(function(user) {
      //     $scope.user = user;   // load user into $scope.user
      //     // do anything else?
      //   })
      //   .error(function(err) {
      //     // TODO: show error
      //     console.log('Error retrieving user: ', err);
      //   });
    };


    // Show Users
    $scope.getUsers = function() {
      $http.get('/users')
        .success(function(data) {
          // TODO: need to paginate this
          $scope.users = data.users;
        })
        .error(function(err) {
          console.log('Error retrieving users: ', err);
          // TODO: show error
        });
    };

    // // Create User
    // $scope.createUser = function() {
    //   $http.post('/users', $scope.newUser)
    //     .success(function(data) {
    //       //TODO: messages like: $scope.notify = 'user created';
    //     })
    //     .error(function(err) {
    //       console.log('Error creating user: ', err);
    //       // TODO: $scope.errors.push('NEED TO HANDLE THIS ERROR WELL: error creating user');
    //       // Display validation errors on error.
    //     });
    // };

    // Edit & Update User
    $scope.editUser = function(user) {
      user.editing = true;
      user.temp    = angular.copy(user);
    };
    $scope.cancelEdit = function(user) {
      user.editing = false;
      if (!!user.temp) {
        user      = user.temp;
        user.temp = null;
        return;
      }
    };
    $scope.updateUser = function(user) {
      user.editing = false;
      $http.patch( ('/users/' + user._id), user)
        // need to send auth?
        .success(function(data) {
          console.log('update successful. Returned user is: ', data.user);
          sessions.setUser(data.user);
          // success banner or indicator?
          user.temp = null; // clear the temp
        })
        .error(function(err) {
          console.log('Error updating user: ', err);
          $scope.errors.push('NEED TO HANDLE THIS ERROR WELL: error updating user');
          user.username = user.temp;
        });
    };
  }]);
};
