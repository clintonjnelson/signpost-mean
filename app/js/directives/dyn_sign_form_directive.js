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
      var base         = 'templates/directives/dynsignforms/';
      var end          = '_sign_form.html';
      var formType     = getFormType(scope.sign.signType);
      var templateUrl  = base + formType + end;

      // define function to get url
      scope.getFormUrl = function() {
        return templateUrl;
      }
    }


    function getFormType(signType) {
      var signMap = {
        custom:     'custom',
        // email:      'email',
        // phone:      'phone',
      };
      console.log('SIGNTYPE IS: ', signType)
      console.log('MAPPED FORM IS: ', signMap[signType]);

      return signMap[signType] || 'default';
    }
  });
};
