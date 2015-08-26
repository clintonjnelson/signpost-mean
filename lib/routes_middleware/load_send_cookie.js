'use strict';
// Sending token with Login

module.exports = function loginSuccess(req, res, next) {
  console.log("LOADSENDCOOKIE -- GENERATING TOKEN for user:", req.user);

  // Skip if skipGen exists (Auto-Sign)
  if( req.user.skipGen === true ) {
    console.log("SKIPGEN FOUND. SKIPPING TOKEN GENERATION...");
    return res.redirect('/#/');
  }

  // Else /login
  console.log("SKIPGEN NOT FOUND OR NOT RIGHT FORMAT. NOT SKIPPING TOKEN GEN.");
  req.user.generateToken(process.env.AUTH_SECRET, function(err, token) {
    if (err) {
      console.log('Error generating token. Error: ', err);
      return res.status(500).json({error: true, msg: 'internal server error'});
    }

    console.log("SUCCESSFUL TOKEN GENERATION. REDIRECTING With Token TO OAUTH /auth?token=...");
    token = encodeURIComponent(token);      // encode to HTML-safe for parsing
    return res.redirect('/#/oauth?token=' + token); // rediret & pass token as param
  });

};
