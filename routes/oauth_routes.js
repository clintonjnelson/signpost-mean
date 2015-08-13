'use strict';

var bodyparser = require('body-parser');
var setCors    = require('../lib/routes_middleware/set_cors_permissions.js');


module.exports = function(router, passport) {
  router.use(bodyparser.json());

  // Require routes by provider
  require('./oauth_routes/facebook.js')(router, passport);
  require('./oauth_routes/twitter.js' )(router, passport);
};






