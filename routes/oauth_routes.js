'use strict';

var bodyparser           = require('body-parser');
var setCors              = require('../lib/routes_middleware/set_cors_permissions.js');
var removePassptSessions = require('../lib/routes_middleware/remove_passport_sessions.js');


module.exports = function(router, passport) {
  router.use(bodyparser.json());
  router.use(removePassptSessions);  // bypass oauth1 sessions

  // Require routes by provider
  require('./oauth_routes/facebook.js' )(router, passport);
  require('./oauth_routes/github.js'   )(router, passport);
  require('./oauth_routes/google.js'   )(router, passport);
  require('./oauth_routes/instagram.js')(router, passport);
  require('./oauth_routes/linkedin.js' )(router, passport);
  require('./oauth_routes/twitter.js'  )(router, passport);
  require('./oauth_routes/wordpress.js')(router, passport);
};






