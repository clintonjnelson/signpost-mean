'use strict';

var request = require('./api_request.js');

module.exports = function(accesstoken, gglProfile, callback) {
  console.log("PROFILE IN THE API DATA FILE IS: ", gglProfile);
  // Already have much data from Profile, so just send it to the callback
  if(!gglProfile || !gglProfile._json) {
    console.log('Error: No profile info received.');
    return callback('No google profile info available.', null);
  }

  // Send data for saving
  return callback(null, gglProfile);
};

//----------------------- Sample of Data in Google PROFILE ---------------------
/*
{ provider: 'google',
  id: '106631224798962932409',
  displayName: 'C Nelson',
  name: { familyName: 'Nelson', givenName: 'C' },
  photos: [ { value: 'https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg?sz=50' } ],
  gender: 'male',
  _raw: '{\n "kind": "plus#person",\n "etag": "\\"gLJf7LwN3wOpLHXk4IeQ9ES9mEc/OQAfcpfY1RiZ-m4NLUoY8d8DebY\\"",\n "gender": "male",\n "objectType": "person",\n "id": "1066312247989629324…
  _json:
   { kind: 'plus#person',
     etag: '"gLJf7LwN3wOpLHXk4IeQ9ES9mEc/OQAfcpfY1RiZ-m4NLUoY8d8DebY"',
     gender: 'male',
     objectType: 'person',
     id: '106631224798962932409',
     displayName: 'C Nelson',
     name: { familyName: 'Nelson', givenName: 'C' },
     url: 'https://plus.google.com/106631224798962932409',
     image:
      { url: 'https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg?sz=50',
        isDefault: true },
     isPlusUser: true,
     language: 'en',
     ageRange: { min: 21 },
     circledByCount: 0,
     verified: false } }
*/
