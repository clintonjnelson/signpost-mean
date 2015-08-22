'use strict';

var request = require('./api_request.js');

module.exports = function(accessToken, lnProfile, callback) {
  console.log("PROFILE IN THE API DATA FILE IS: ", lnProfile);

  // Already have much data from Profile, so just send it to the callback
  if(!lnProfile || !lnProfile._json) {
    console.log('Error: No profile info received.');
    return callback('No google profile info available.', null);
  }

  // Send data for saving
  return callback(null, lnProfile);
};


//---------------------- Sample of Data in Linkedin PROFILE --------------------
/*
{ provider: 'linkedin',
  id: '_roGa3fds9',
  displayName: 'Clint Nelson',
  name: { familyName: 'Nelson, PE', givenName: 'Clint' },
  emails: [ { value: undefined } ],
  photos: [ 'https://media.licdn.com/mpr/mprx/0_m1fIsdOh28KLjjkjT1cI-oNhecS9YDXl2AcIpjl3DQ2BRjzy31BItd03oK3BR2ZADczwtfyT3KAcZdNj38octjgSkKAnZdll38oHMpe87lXVt0EDSAyQJeQlXLIQAd68eiOGrTM…
  _raw: '{\n  "apiStandardProfileRequest": {\n    "headers": {\n      "_total": 1,\n      "values": [{\n        "name": "x-li-auth-token",\n        "value": "name:54E"\n      }]\n    }…
  _json:
   { apiStandardProfileRequest:
      { headers: [Object],
        url: 'https://api.linkedin.com/v1/people/_roGa3fds9' },
     distance: 0,
     firstName: 'Clint',
     formattedName: 'Clint Nelson, PE',
     headline: 'Software Engineer, Business Developer, Efficiency Advocate',
     id: '_roGa3fds9',
     industry: 'Computer Software',
     lastName: 'Nelson, PE',
     location: { country: [Object], name: 'Greater Seattle Area' },
     numConnections: 229,
     numConnectionsCapped: false,
     pictureUrl: 'https://media.licdn.com/mpr/mprx/0_m1fIsdOh28KLjjkjT1cI-oNhecS9YDXl2AcIpjl3DQ2BRjzy31BItd03oK3BR2ZADczwtfyT3KAcZdNj38octjgSkKAnZdll38oHMpe87lXVt0EDSAQJeQlXLIQAd68eimF…
     positions: { _total: 1, values: [Object] },
     publicProfileUrl: 'https://www.linkedin.com/in/clintonjnelson',
     relationToViewer: { distance: 0 },
     siteStandardProfileRequest: { url: 'https://www.linkedin.com/profile/view?id=298084646&authType=name&authToken=54EU&trk=api*a4592171*s4908891*' },
     summary: 'I\'m a software developer with experience in engineering, management, and business development. \nI love efficiency, readable code, and helping grow great companies. \n\n…
*/
