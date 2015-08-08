'use strict';
// Sending token with Login

module.exports = function loginSuccess(req, res, next) {
  console.log("GENERATING TOKEN for user:", req.user);

  req.user.generateToken(process.env.AUTH_SECRET, function(err, token) {
    if (err) {
      console.log('Error generating token. Error: ', err);
      return res.status(500).json({error: true, msg: 'internal server error'});
    }

    console.log("SUCCESSFUL TOKEN GENERATION. REDIRECTING TO OAUTH...");
    token = encodeURIComponent(token);      // encode to HTML-safe for parsing
    res.redirect('/#/oauth?token=' + token); // rediret & pass token as param
  });
};
