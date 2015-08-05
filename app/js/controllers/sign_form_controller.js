'use strict';


module.exports = function(app) {
  app.controller('signFormController', [
    '$scope',
    'RESTResource',
    '$routeParams',
    function($scope, RESTResource, $routeParams) {
      // routes for signs
      var SignHttp = RESTResource('signs');

      //----------------- $scope PROPS ----------------
      $scope.types = [
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
      // initial sign object
      $scope.sign  = {};

      // defaults
      $scope.defaults = {
        color: '#5a5a5a',
        size: '40',
      }

      // toggle clicked color to active class
      $scope.activeColor = function(type) { // pass type of clicked icon
        var activeType = $scope.sign.type;  // set current active type
        return (type === activeType ? (activeType + "-color" ) : 'default-form-icon');
      };

      //----------------- $scope FUNCTIONS ----------------
      // Create Sign Action
      // TODO: Make form action dynamic. Change this func name to createSign.
      $scope.createSign = function(sign) {
        console.log("DATA TO SEND IS: ", sign);
        console.log('HIT ACTION, ABOUT TO SEND...');
        SignHttp.create({sign: sign}, function(err, data) {
          if (err) {return console.log('ERROR IN CREATING: ', err);}
          console.log("SUCCESS! Data here: ", data);

        });
      };

      $scope.updateSign = function(sign) {
        SignHttp.update({sign: sign}, function(err, data) {
          if(err) {return console.log('Error updating sign: ', err);}
          console.log("SUCCESS UPDATING!", data);
        });
      }
    }
  ])
};
