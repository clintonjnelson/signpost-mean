// 'use strict';

// // TODO: Restructure this to return promises instead of provide callbacks

// module.exports = function(app) {

//   app.factory('restCustom', ['$http', 'sessions', function($http, sessions) {

//       var handleSuccess = function(callback) {
//         return function(data) {
//           callback(null, data);
//         };
//       };

//       var handleError = function(callback) {
//         return function(err) {
//           if (err && err.reset) {
//             // TODO: DISPLAY A NOTICE TO THE USER TO PLEASE LOG BACK IN
//             sessions.resetEat();
//           }
//           callback(err, null);
//         };
//       };


//     return function(resourceName) {

//       // set session token in req header
//       $http.defaults.headers.common.eat = sessions.getEat();

//       return {
//         createAutoSign: function(signType, callback) {
//           $http.get('/auto/' + signType)
//             .success(handleSuccess(callback))
//             .error(handleError(callback));
//         },

//       };
//     };
//   }]);
// };
