'use strict';

var bodyparser = require('body-parser');



module.exports = function(app, passport) {
  app.use(bodyparser.json());

  // Require routes by provider
  require('./oauth_routes/facebook.js')(app, passport);
  require('./oauth_routes/twitter.js' )(app, passport);
};






