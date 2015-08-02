'use strict';
// Sending token with Login

module.exports = function loginSuccess(req, res, next) {
  req.user.generateToken(function(err, token) {
    if (err) {
      console.log('Error generating token. Error: ', err);
      return res.status(500).json({error: true, msg: 'internal server error'});
    }

    token = encodeURIComponent(token);      // encode to HTML-safe for parsing
    res.redirect('/#/oauth?token=' + token); // rediret & pass token as param
  });
};
