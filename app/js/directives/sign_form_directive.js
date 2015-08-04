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
          { type: 'facebook',       icon: 'facebook-box'    },
          { type: 'github',         icon: 'github-box'      },
          { type: 'twitter',        icon: 'twitter'         },
          { type: 'google',         icon: 'google-plus-box' },
          { type: 'instagram',      icon: 'instagram'       },
          { type: 'linkedin',       icon: 'linkedin-box'    },
          { type: 'wordpress',      icon: 'wordpress'       },
          { type: 'tumblr',         icon: 'tumblr'          },
          { type: 'stackoverflow',  icon: 'stackoverflow'   },
          { type: 'pintrest',       icon: 'pintrest-box'    },
          { type: 'custom',         icon: 'add_box'         },
        ];

        $scope.options = [
          {name: 'picture', selected: true}
        ];
        $scope.color = '#5a5a5a';
        $scope.size = '40';
        $scope.sign = {};



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
