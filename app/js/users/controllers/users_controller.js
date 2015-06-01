'use strict';

module.exports = function(app) {
  app.controller('usersController', ['$scope', '$http', function($scope, $http) {

    // Errors
    $scope.errors = [];
    $scope.clearErrors = function() {
      $scope.errors = [];
    }

    // Show User
    $scope.getUser = function(user) {
      $http.get('/users/' + user._id)
        .success(function(user) {
          $scope.user = user;   // load user into $scope.user
          // do anything else?
        })
        .error(function(err) {
          // TODO: show error
          console.log('Error retrieving user: ', err);
        });
    };


    // Show Users
    $scope.getUsers = function() {
      $http.get('/users')
        .success(function(users) {
          // TODO: need to paginate this
          $scope.users = users
        })
        .error(function() {
          console.log('Error retrieving users: ', err);
          // TODO: show error
        });
    } ;

    // Create User
    $scope.createUser = function() {
      $http.post('/users', $scope.newUser)
        .success(function(data) {
          $scope.notify = 'user created'
          $scope.eat    = data.eat;
        })
        .error(function(err) {
          console.log('Error creating user: ', err);
          $scope.errors.push('NEED TO HANDLE THIS ERROR WELL: error creating user');
          // Display validation errors on error.
        });
    }

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
        .success(function() {
          console.log('update successful');
          // success banner or indicator?
          user.temp = null; // clear the temp
        })
        .error(function() {
          console.log('Error updating user: ', err);
          $scope.errors.push('NEED TO HANDLE THIS ERROR WELL: error updating user');
          user.username = user.temp
        });
    };

    // Destroy User

  }]);
};
