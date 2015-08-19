'use strict';

module.exports = function(app) {
  app.directive('newSignsAreaDirective', function() {

    // Form to create new signs
    return {
      restrict:     'AE',
      replace:      true,
      templateUrl:  'templates/directives/new_signs_area.html',
      scope: {
        activeColor:    '&',  // pass action name
        buttonName:     '@',  // use name passed
        createAutoSign: '&',  // create matching autosign
        defaults:       '=',  // pass parent defaults
        formType:       '@',  // pass form type (heading)
        isPageOwner:    '@',  // owner check for content
        sign:           '=',  // allow access to parent sign
        submitAction:   '&',  // use action name passed
        toggleEditing:  '&',  // toggle sign editing
        types:          '=',  // pass parent types
      },
    };
  });
};
