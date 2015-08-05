'use strict';


module.exports = function accessService(app) {

  app.factory('access', ['sessions', function(sessions) {

    return {                    // Return library with named function
      authorized: authorized    // Use:  var authorized = access.authorized(....)
    };



    // returns authorization object to allow/deny access
    function authorized(requiresLogin, requiredPermissions, permissionType) {
      var result;                     // object return options library
      var eat  = sessions.getEat();   // session token
      var user = sessions.getUser();  // get current user
      var userPermissions = lcPermissions(user.permissions);
      permissionType = permissionType || 'atLeastOne';  // default type

      // login NOT required. DONE.
      if (!requiresLogin) {
        return setResult(true, false);
      }

      // ONLY login required, but logged out
      if(requiresLogin && (!eat || !user) ) {
        return setResult(false, true, 'login');
      }

      // logged in + NO permissions requirements
      if(requiresLogin && eat && user && (!requiredPermissions || !requiredPermissions.length) ) {
        return setResult(true, false);
      }

      // permissions requirements. Determine if meets:
      if(requiredPermissions) {
        requiredPermissions = Array.isArray(requiredPermissions) ?
          lcPermissions(requiredPermissions) :    // typ array case
          requiredPermissions.toLowerCase();      // handle string case

        for(var i=0, curr; i<requiredPermissions.length; i++) {
          curr = requiredPermissions[i];

          // if Type is atLeastOne, only need one
          if(permissionType === 'atLeastOne') {
            if(userPermissions.indexOf(curr) !== -1) {  // match found?
              return setResult(true, false);
            }
            if( atEnd(i, requiredPermissions) ) {     // no matches found?
              return setResult(false, false, 'access denied');
            }
          }

          // if Type is "all", must match all
          if (permissionType === 'all') {
            if(userPermissions.indexOf(curr) === -1) {  // fail to match?
              return setResult(false, false, 'access denied');
            }
            if( atEnd(i, requiredPermissions) ) {     // all match?
              return setResult(true, false);
            }
          }
        }
      }

      //NO explicit case found => default NO ACCESS
      return setResult(false, false, 'ambiguous');


      // check if at last item. Returns true/false
      function atEnd(ind, arr) {
        return (ind === arr.length-1);
      }

      // set the result object properties
      function setResult(ok, login, failReason) {
        return {
          ok: ok,                 // true, false
          login: login,           // true, false
          failReason: failReason, // login, access denied,
        };
      }

      function lcPermissions(perms) {
        return perms.map(function(elem, ind, orig) {
            return elem.toLowerCase();
          });
      }
    }
  }]);
};
