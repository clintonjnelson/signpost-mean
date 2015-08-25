'use strict';

var LinkedinSign = require('../../models/LinkedinSign.js');

module.exports = function(signBuilder) {

  function buildLinkedinSign(lnData) {
    // base attrs:   customBgColor, description, knownAs, linkUrl, published, userId
    // custom attrs: bgColor, connections, profileId, picUrl, icon, signType

    var signProps = {
      // ----------------- BASE -----------------------
      description:    (lnData._json.headline         || lnData.description),                // optional for updates?
      knownAs:        (lnData.displayName            || lnData.knownAs),      // TODO: VERIFY || is NOT BACKWARDS!
      linkUrl:        (lnData._json.publicProfileUrl || lnData.linkUrl),      // TODO: VERIFY || is NOT BACKWARDS!
      location:       lnData._json.location.name,           // area
      // ----------------- CUSTOM ---------------------
      connections:    lnData._json.numConnections,
      profileId:      lnData.id,
      picUrl:         lnData._json.publicProfileUrl,
    };

    var newLinkedinSign = new LinkedinSign(signProps);

    return newLinkedinSign;
  }

  signBuilder.linkedin = buildLinkedinSign;
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
