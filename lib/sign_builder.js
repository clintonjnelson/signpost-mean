'use strict';
// This compiles all of the build types into one builder object

var builder = {};


// Load Build Types
require('./sign_build_types/custom_build.js'  )(builder);   // Custom
require('./sign_build_types/facebook_build.js')(builder);
require('./sign_build_types/github_build.js'  )(builder);
require('./sign_build_types/twitter_build.js' )(builder);


// export the builder library
module.exports = builder;




