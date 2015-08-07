'use strict';

var request = require('superagent');


module.exports = function getFacebookInfo(accessToken, callback) {
  var url = 'https://graph.facebook.com/me/';
  request
    .get(url)
    .query({ access_token: accessToken })
    .query({ fields: 'email,name,link,picture.width(720)' })
    .end(function(err, res) {
      if (err) {
        console.log('Error accessing Facebook data');
        callback(err, null);
      };

      // if successful
      var fbData = JSON.parse(res.text);
      callback(null, fbData);
    });
};

//--------------------------- Sample of returned Data --------------------------
// { email: 'superemail@example.com',
//   name: 'superman',
//   link: 'https://www.facebook.com/app_scoped_user_id/101043543728905432/',
//   picture:
//    { data:
//       { height: 720,
//         is_silhouette: false,
//         url: 'https://fbcdn-profile-a.akamaihd.net/hprofile-ak-xpf1/t31.0-1/p720x720/10986984_10104169375250478_43798324798_o.jpg',
//         width: 720 } },
//   id: '42798042378092347089' }
