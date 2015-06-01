'use strict';

var express  = require('express');
var mongoose = require('mongoose');
var passport = require('passport');
var app      = express();

// Routers
var usersRouter = new express.Router();
var authRouter  = new express.Router();

// TEMP ENVIRONMENT VARIABLE
process.env.AUTH_SECRET = process.env.AUTH_SECRET || 'setThisVarInENV';

// SETUP: CHANGE APP NAME
// Set mongoose connection
mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost/signpost');

// Initialize passport middleware & configure with passport_strategy.js
app.use(passport.initialize());

// Load passport with strategy
require('./lib/passport_strategy')(passport);

// Populate Routes
require('./routes/users_routes.js')(usersRouter);
require('./routes/auth_routes.js' )(authRouter, passport);

// Route middleware
app.use(usersRouter);
app.use(authRouter );

// Static Resources
app.use(express.static(__dirname + '/build'));


// Start server
app.listen(process.env.PORT || 3000, function() {
  console.log('server running on port ' + (process.env.PORT || 3000));
});

