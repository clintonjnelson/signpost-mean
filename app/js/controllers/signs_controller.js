'use strict';
var _ = require('lodash');

module.exports = function(app) {
  app.controller('signsController', [
    '$scope',
    'RESTResource',
    '$window',
    '$routeParams',
    'sessions',
    function($scope, RESTResource, $window, $routeParams, sessions) {
    // connect with Signs api
    var signHttp = new RESTResource('signs');


    //----------------------------- SIGN LISTITEMS -----------------------------


    // general icon settings for directive
    $scope.icons = {
      color: '#808080',
      size:  '120',
    };

    $scope.getSigns = function() {
      var usernameData = {username: $routeParams.username};
      console.log('ROUTE PARAMS ARE: ', $routeParams);

      $routeParams.username ?
        signHttp.getBy(usernameData, 'username', getSignsCallback) :
        signHttp.getAll(getSignsCallback);

      function getSignsCallback(err, data) {
        // TODO: flash something to the user
        if(err) {return console.log("Error getting signs from server.");}

        console.log("SIGNS RETURNED ARE: ", data.signs);
        $scope.signs = data.signs;
      }
    };

    $scope.updateSign = function(sign) {
      console.log("UPDATING SIGN: ", sign);
      sign.isEditing      = false;
      sign.temp.isEditing = false;
      signHttp.update({sign: sign}, function(err, data) {
        if(err) {
          // TODO: Flash error to user
          console.log('Could not update sign.');
          $scope.signs.splice($scope.signs.indexOf(sign), 1, sign.temp); // reset sign info
          delete sign.temp;                                              // delete temp
          return console.log(err);
        }

        // TODO: Flash success to user
        delete sign.temp;                                 // delete the temp state
        console.log('Sign update successful.');
      });
    };

    // Edit/Cancel Editing Sign
    $scope.toggleEditing = function(sign) {
      if(sign.isEditing) {
        var ind             = $scope.signs.indexOf(sign);
        sign.temp.isEditing = false;            // temp will replace current
        $scope.signs[ind]   = sign.temp;        // top level: restore former state
        sign = sign.temp;                       // reset local sign
      } else {
        sign.isEditing = true;               // editing mode
        sign.temp      = _.cloneDeep(sign);  // copy current state
      }
    };

    $scope.isOwner = function(sign) {
      return sessions.isOwner(sign.userId);   // current user match sign owner?
    };




    //------------------------------ NEW SIGN FORM -----------------------------
    // TODO: THIS DATA SHOULD NOT BE STATIC, BUT SHOULD BE SENT BY SERVER
    // TODO: THIS DATA SHOULD BE MANAGED BY AN ADMIN ACCOUNT
    $scope.types = [
      { type: 'custom',         icon: 'label'          , disabled: false,  link: ''                   },
      { type: 'facebook',       icon: 'facebook-box'   , disabled: false,  link: '/auto/facebook'     },
      { type: 'github',         icon: 'github-box'     , disabled: false,  link: '/auto/github'       },
      { type: 'twitter',        icon: 'twitter'        , disabled: false,  link: '/auto/twitter'      },
      { type: 'google',         icon: 'google-plus-box', disabled: false,  link: '/auto/google'       },
      { type: 'instagram',      icon: 'instagram'      , disabled: false,  link: '/auto/instagram'    },
      { type: 'linkedin',       icon: 'linkedin-box'   , disabled: false,  link: '/auto/linkedin'     },
      { type: 'wordpress',      icon: 'wordpress'      , disabled: false,  link: '/auto/wordpress'    },
      { type: 'tumblr',         icon: 'tumblr'         , disabled: true,   link: '/auto/tumblr'       },
      { type: 'stackoverflow',  icon: 'stackoverflow'  , disabled: true,   link: '/auto/stackoverflow'},
      { type: 'pintrest',       icon: 'pintrest-box'   , disabled: true,   link: '/auto/pintrest'     },
    ];


    var currUser       = sessions.getUser() || {};
    $scope.isPageOwner = ($routeParams.username === currUser.username) || !$routeParams.username;
    $scope.newSign     = {isEditing: false};
    $scope.defaults    = {
      color: '#5a5a5a',
      size: '40',
    };

    // watched by all icons for CSS class -  passing their type & comparing active
    $scope.activeColor = function(type) {    // each passes its type
      var activeType = $scope.newSign.signType;  // check current type
      return (type === activeType ? (activeType + "-color" ) : 'default-form-icon');
    };

    $scope.hrefLink = function(type) {
      if(type === 'custom') { return '';                  }
      if(type !== 'custom') { return ('/auto/' + type); }
    };

    $scope.createAutoSign = function(type) {
      var signType = type.type;
      if(signType === 'custom') {
        return $scope.newSign.signType = signType; // trigger custom form
      }

      // Else redirect browser
      var autoSignUrl = '/auto/' + signType;
      $window.location.href = autoSignUrl;
    };

    $scope.createSign = function(sign) {
      console.log("DATA TO SEND IS: ", sign);
      console.log('HIT ACTION, ABOUT TO SEND...');
      signHttp.create({sign: sign}, function(err, data) {
        if (err) {
          // TODO: FLASH ERROR MESSAGE TO USER
          return console.log('ERROR IN CREATING: ', err);
        }

        console.log("SUCCESS! Data here: ", data);

        // add sign to end
        $scope.getSigns();
        $scope.newSign.isEditing = false;
      });
    };
  }]);
};
