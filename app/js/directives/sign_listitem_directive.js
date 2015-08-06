'use strict';

module.exports = function(app) {
  app.directive('signListitemDirective', function(){

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
