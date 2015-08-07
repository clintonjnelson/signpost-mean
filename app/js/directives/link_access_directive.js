'use strict';
// TODO: Implement this attribute in links. Alternate to ng-if, but only hides.

module.exports = function(app) {
  app.directive('linkAccessDirective', [
    'access',
    'sessions',
    function(access, sessions) {

      return {
        restrict: 'A',
        link: function(scope, element, attrs) {
          var roles = attrs.linkAccessDirective.split(',').trim();

          // show/hide the link
          function makeVisible() {
            element.removeClass('hidden');
          }
          function makeHidden() {
            element.addClass('hidden');
          }

          function determineVisibility(resetFirst) {
            var result;
            if (resetFirst) { makeVisible(); }

            result = access.authorized(true, roles, attrs.accessPermissionType);
            if (result.ok) { makeVisible(); }
            else           { makeHidden();  }
          }

          // Show/hide
          determineVisibility(true);

        } //link
      };  //return
    }     //function
  ]);     //directive
};        //module
