'use strict';

module.exports = function(app) {
  app.directive('dynSignFormDirective', function() {

    // Dynamically loads the appropriate template for the sign
    return {
      restrict:     'AE',
      replace:      true,
      scope: {
                    sign:           '=',
                    submitAction:   '&',
                    toggleEditing:  '&',
             },
      link:         linker,
      template:     '<div ng-include="getFormUrl()"></div>'
    };



    function linker(scope, elem, attrs) {
      console.log("SCOPE: ", scope);
      var base         = 'templates/directives/signforms/';
      var end          = '_sign_form.html';
      var formType     = getFormType(scope.sign.signType);
      var templateUrl  = base + formType + end;

      // define function to get url
      scope.getFormUrl = function() {
        return templateUrl;
      }


      // Helper function to return corresponding form type
      function getFormType(signType) {
        var signMap = {
          custom:     'custom',
          email:      'email',
          phone:      'phone',
        };

        return signMap[signType] || 'default';
      }
    }
  });
};
