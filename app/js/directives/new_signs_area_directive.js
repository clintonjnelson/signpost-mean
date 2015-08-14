'use strict';

module.exports = function(app) {
  app.directive('newSignsAreaDirective', function() {

    // Form to create new signs
    return {
      restrict:     'AE',
      replace:      true,
      templateUrl:  'templates/directives/new_signs_area.html',
      scope: {
        sign:           '=',  // allow access to parent sign
        defaults:       '=',  // pass parent defaults
        types:          '=',  // pass parent types
        formType:       '@',  // pass form type (heading)
        submitAction:   '&',  // use action name passed
        buttonName:     '@',  // use name passed
        activeColor:    '&',  // pass action name
        toggleEditing:  '&',  // toggle sign editing
        createAutoSign: '&',  // create matching autosign
      },
    };
  });
};
