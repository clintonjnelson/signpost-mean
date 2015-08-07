'use strict';

var request = require('./api_request.js');

module.exports = function getTwitterInfo(accessToken, twitterId, callback) {

  var apiInfo = {
    apiName: 'twitter',
    url: 'https://api.twitter.com/1.1/users/show.json',
    queryString: {user_id: twitterId},  // identifier should be the twitterId
  };

  request(accessToken, apiInfo, callback);
}

//------------------------- Sample of API Data in Request ----------------------
/*
{ id: 2244994945,
  id_str: '2244994945',
  name: 'TwitterDev',
  screen_name: 'TwitterDev',
  location: 'Internet',
  profile_location: null,
  description: 'Developer and Platform Relations @Twitter. We are developer advocates. We can\'t answer all your questions, but we listen to all of them!',
  url: 'https://t.co/66w26cua1O',
  entities: { url: { urls: [Object] }, description: { urls: [] } },
  protected: false,
  followers_count: 216354,
  friends_count: 1488,
  listed_count: 571,
  created_at: 'Sat Dec 14 04:35:55 +0000 2013',
  favourites_count: 833,
  utc_offset: -25200,
  time_zone: 'Pacific Time (US & Canada)',
  geo_enabled: true,
  verified: true,
  statuses_count: 1438,
  lang: 'en',
  status:
   { created_at: 'Thu Aug 06 16:28:36 +0000 2015',
     id: 629328226939056100,
     id_str: '629328226939056128',
     text: 'We’re excited to pilot new data and functionality with @SproutSocial and @Oracle: https://t.co/yUbL0aHtPo',
     source: '<a href="http://twitter.com" rel="nofollow">Twitter Web Client</a>',
     truncated: false,
     in_reply_to_status_id: null,
     in_reply_to_status_id_str: null,
     in_reply_to_user_id: null,
     in_reply_to_user_id_str: null,
     in_reply_to_screen_name: null,
     geo: null,
     coordinates: null,
     place: null,
     contributors: null,
     retweet_count: 13,
     favorite_count: 16,
     entities:
      { hashtags: [],
        symbols: [],
        user_mentions: [Object],
        urls: [Object] },
     favorited: false,
     retweeted: false,
     possibly_sensitive: false,
     lang: 'en' },
  contributors_enabled: false,
  is_translator: false,
  is_translation_enabled: false,
  profile_background_color: 'FFFFFF',
  profile_background_image_url: 'http://abs.twimg.com/images/themes/theme1/bg.png',
  profile_background_image_url_https: 'https://abs.twimg.com/images/themes/theme1/bg.png',
  profile_background_tile: false,
  profile_image_url: 'http://pbs.twimg.com/profile_images/530814764687949824/npQQVkq8_normal.png',
  profile_image_url_https: 'https://pbs.twimg.com/profile_images/530814764687949824/npQQVkq8_normal.png',
  profile_banner_url: 'https://pbs.twimg.com/profile_banners/2244994945/1396995246',
  profile_link_color: '0084B4',
  profile_sidebar_border_color: 'FFFFFF',
  profile_sidebar_fill_color: 'DDEEF6',
  profile_text_color: '333333',
  profile_use_background_image: false,
  has_extended_profile: false,
  default_profile: false,
  default_profile_image: false,
  following: false,
  follow_request_sent: false,
  notifications: false }
*/
