'use strict';

module.exports = function(app) {
  app.directive('signListitemDirective', function(){

    // Card to show/edit signs
    return {
      restrict:     'AE',   // specify as attribute or element
      replace:      true,
      templateUrl: 'templates/directives/sign_listitem.html',
      scope: {
        icons:          '=',
        sign:           '=',
        types:          '=',
        toggleEditing:  '&',
        submitAction:   '&',
      },
    };

  });
};
