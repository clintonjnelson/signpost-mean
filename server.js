'use strict';

var express  = require('express'        );
var mongoose = require('mongoose'       );
var passport = require('passport'       );
var session  = require('express-session');
var app      = express();

// Routers
var authRouter  = new express.Router();
var oauthRouter = new express.Router();
var signsRouter = new express.Router();
var usersRouter = new express.Router();

// TEMP ENVIRONMENT VARIABLE
process.env.AUTH_SECRET = process.env.AUTH_SECRET || 'setThisVarInENV';

// Set mongoose connection
mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost/signpost');

// Initialize passport middleware & configure with passport_strategy.js
app.use(session({secret: 'oauth1sucks', id: 'oauth', maxAge: null}));
app.use(passport.initialize());
app.use(passport.session());            // only for oauth1 to work


// Load passport with strategies
require('./lib/passport_strategies/basic.js'   )(passport);
require('./lib/passport_strategies/facebook.js')(passport);
require('./lib/passport_strategies/twitter.js' )(passport);

// Populate Routes
require('./routes/oauth_routes.js')(oauthRouter, passport);
require('./routes/auth_routes.js' )(authRouter,  passport);
require('./routes/signs_routes.js')(signsRouter);
require('./routes/users_routes.js')(usersRouter);

// Route middleware
app.use(oauthRouter);
app.use(authRouter );
app.use(signsRouter);
app.use(usersRouter);

// Static Resources
var dir = process.env.WEBPACK_DIRECTORY || 'build';
app.use(express.static(__dirname + '/' + dir));

// Start server
app.listen(process.env.PORT || 3000, function() {
  console.log('server running on port ' + (process.env.PORT || 3000));
});

