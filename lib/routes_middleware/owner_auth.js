'use strict';


module.exports = function(checkField) {
  // Middleware format
  return function(req, res, next) {
    // Verify requested param & user param match (id, username, etc)
    if ( req.params[checkField].toString() !== req.user[checkField].toString() ) {
      console.log('User tried to hack another user.');
      return res.status(401).json({ error: 'unauthorized' });
    }
    next();
  };
};
