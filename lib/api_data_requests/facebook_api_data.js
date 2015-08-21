'use strict';

var request = require('./api_request.js');

module.exports = function getFacebookInfo(accessToken, noIdentifierNeeded, callback) {

  var apiInfo = {
    apiName: 'facebook',
    url: 'https://graph.facebook.com/me/',
    queryString: {fields: 'email,name,link,picture.width(720)'},
  };

  request(accessToken, apiInfo, callback);
};


//------------------------- Sample of API Data in Request ----------------------
// { email: 'superemail@example.com',
//   name: 'superman',
//   link: 'https://www.facebook.com/app_scoped_user_id/101043543728905444/',
//   picture:
//    { data:
//       { height: 720,
//         is_silhouette: false,
//         url: 'https://fbcdn-profile-a.akamaihd.net/hprofile-ak-xpf1/t31.0-1/p720x720/10986984_10104169375250478_43798324798_o.jpg',
//         width: 720 } },
//   id: '42798042378092347444' }
