'use strict';

/*
  accessToken used for API requests to get more data
  Profile exists as an alternate to API request when info is adequate
*/
module.exports = function getInstagramInfo(accessToken, igProfile, callback) {

  // profile.user has the key sign data
  if(!igProfile || !igProfile._json) {
    console.log('Error: No profile info received.');
    return callback('No instagram profile info received.', null);
  }

  return callback(null, igProfile);
};

//--------------------- Sample of Data in Instagram PROFILE --------------------
/*
{ provider: 'instagram',
  id: '2131966332',
  displayName: 'Clint Nelson',
  name: { familyName: undefined, givenName: undefined },
  username: 'clintonjnelson',
  _raw: '{"meta":{"code":200},"data":{"username":"clintonjnelson","bio":"","website":"","profile_picture":"https:\\/\\/instagramimages-a.akamaihd.net\\/profiles\\/anonymousUser.jpg","fu…
  _json:
   { meta: { code: 200 },
     data:
      { username: 'clintonjnelson',
        bio: '',
        website: '',
        profile_picture: 'https://instagramimages-a.akamaihd.net/profiles/anonymousUser.jpg',
        full_name: 'Clint Nelson',
        counts: [Object],
        id: '2131966332' } } }
*/
