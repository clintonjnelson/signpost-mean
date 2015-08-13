'use strict';

module.exports = function setCorsPermissions(env, allowedDomainsArr, router) {

  // Handle CORS for Dev Environment
  if (process.env.NODE_ENV === env) {
    router.use(function(req, res, next) {
      res.setHeader('Access-Control-Allow-Origin', allowedDomainsArr);
      res.setHeader('Access-Control-Allow-Credentials', true);
      res.setHeader("Access-Control-Allow-Headers", ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'eat']);
      next();
    });
  }
};
