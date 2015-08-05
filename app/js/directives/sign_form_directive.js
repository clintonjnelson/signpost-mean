'use strict';

module.exports = function(app) {
  app.directive('signFormDirective', function() {

    return {
      restrict:     'AE',
      replace:      true,
      templateUrl:  'templates/directives/sign_form.html',

      controller:   ['$scope', 'RESTResource', function($scope, RESTResource) {
        // routes for signs
        var SignHttp = RESTResource('signs');

        //----------------- $scope PROPS ----------------
        $scope.TYPES = [
          { type: 'custom',         icon: 'label'          , disabled: false  },
          { type: 'facebook',       icon: 'facebook-box'   , disabled: false  },
          { type: 'github',         icon: 'github-box'     , disabled: true   },
          { type: 'twitter',        icon: 'twitter'        , disabled: true   },
          { type: 'google',         icon: 'google-plus-box', disabled: true   },
          { type: 'instagram',      icon: 'instagram'      , disabled: true   },
          { type: 'linkedin',       icon: 'linkedin-box'   , disabled: true   },
          { type: 'wordpress',      icon: 'wordpress'      , disabled: true   },
          { type: 'tumblr',         icon: 'tumblr'         , disabled: true   },
          { type: 'stackoverflow',  icon: 'stackoverflow'  , disabled: true   },
          { type: 'pintrest',       icon: 'pintrest-box'   , disabled: true   },
        ];

        // sign options?
        $scope.options = [
          {name: 'picture', selected: true}
        ];


        $scope.color = '#5a5a5a';
        $scope.size  = '40';
        $scope.sign  = {};

        // set sign name at top
        $scope.title = $scope.sign.type || '';

        // toggle active color class
        $scope.activeColor = function(type) {
          var active = $scope.sign.type
          return (type === active ? (active + "-color" ) : $scope.color);
        };

        //----------------- $scope FUNCTIONS ----------------
        // Create Sign Action
        // TODO: Make form action dynamic. Change this func name to createSign.
        $scope.signFormSubmit = function(sign) {
          console.log("DATA TO SEND IS: ", sign);
          console.log('HIT ACTION, ABOUT TO SEND...');
          // sign.type = $scope.sign.type;
          SignHttp.create({sign: sign}, function(err, data) {
            if (err) {return console.log('ERROR IN CREATING: ', err);}
            console.log("SUCCESS! Data here: ", data);

          });
        };
      }],
    };
  });
};
