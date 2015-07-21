'use strict';

var express  = require('express');
var mongoose = require('mongoose');
var passport = require('passport');
var app      = express();

// Routers
var authRouter  = new express.Router();
var oauthRouter = new express.Router();
var usersRouter = new express.Router();

// TEMP ENVIRONMENT VARIABLE
process.env.AUTH_SECRET = process.env.AUTH_SECRET || 'setThisVarInENV';

// Set mongoose connection
mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost/signpost');

// Initialize passport middleware & configure with passport_strategy.js
app.use(passport.initialize());

// Load passport with strategies
require('./lib/passport_strategies/basic.js'   )(passport);
require('./lib/passport_strategies/facebook.js')(passport);

// Populate Routes
require('./routes/auth_routes.js' )(authRouter,  passport);
require('./routes/oauth_routes.js')(oauthRouter, passport);
require('./routes/users_routes.js')(usersRouter);

// Route middleware
app.use(authRouter );
app.use(usersRouter);

// Static Resources
app.use(express.static(__dirname + '/build'));


// Start server
app.listen(process.env.PORT || 3000, function() {
  console.log('server running on port ' + (process.env.PORT || 3000));
});

