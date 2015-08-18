'use strict';

// TODO: Restructure this to return promises instead of provide callbacks

module.exports = function(app) {

  app.factory('RESTResource', ['$http', 'sessions', function($http, sessions) {

      var handleSuccess = function(callback) {
        return function(data) {
          callback(null, data);
        };
      };

      var handleError = function(callback) {
        return function(err) {
          sessions.checkReset(err);
          callback(err, null);
        };
      };


    return function(resourceName) {

      // set session token in req header
      $http.defaults.headers.common.eat = sessions.getEat();


      // standard routes rely ok token or don't require
      // "id" routes rely on reference id being passed
      return {
        getAll: function(callback) {
          $http.get('/' + resourceName)
            .success(handleSuccess(callback))
            .error(handleError(callback));
        },

        getBy: function(resourceData, ref, callback) {
          $http.get('/' + resourceName + '/' + resourceData[ref])
            .success(handleSuccess(callback))
            .error(handleError(callback));
        },

        create: function(resourceData, callback) {
          // pass route + id, data
          $http.post(('/' + resourceName), resourceData)
            .success(handleSuccess(callback))
            .error(handleError(callback));
        },

        idCreate: function(resourceData, callback) {
          // pass route + id, data
          $http.post(('/' + resourceName + '/' + resourceData._id), resourceData)
            .success(handleSuccess(callback))
            .error(handleError(callback));
        },

        update: function(resourceData, callback) {
          $http.patch(('/' + resourceName), resourceData)
            .success(handleSuccess(callback))
            .error(handleError(callback));
        },

        updateId: function(resourceData, callback) {
          $http.patch(('/' + resourceName + '/'+ resourceData._id), resourceData)
            .success(handleSuccess(callback))
            .error(handleError(callback));
        },

        destroy: function(resourceData, callback) {
          $http.path(('/' + resourceName + '/' + resourceData._id), resourceData)
            .success(handleSuccess(callback))
            .error(handleError(callback));
        },
      };
    };
  }]);
};
