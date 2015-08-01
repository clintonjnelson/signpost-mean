'use strict';

/*
  Reference:
    - http://paislee.io/a-healthy-gulp-setup-for-angularjs-projects/
    - https://github.com/paislee/healthy-gulp-angular

  Issues:
    - Bower CSS files do not inject into index.html (there is no vendor file yet)
    - Tries to put angular-material.css into JS uglification
    - Need to tell it to put angular-material.css into app.css
    - Renaming a file leaves it in dev/prod until next 'clean' happens
    - Need to incorporate testing (both mocha for server & karms for app)
    - COULD make the start of the stream in another file, so could reuse the middle.
      this would make them more modularized & versatile.

  Available "gulp-" Plugins:
    Note: Using plugins: plugin.pluginName (gulp-minity-css => plugins.minifyCss() )
    - angularFilesort
    - concat
    - debug
    - htmlhint
    - htmlmin
    - inject
    - jshint
    - livereload
    - mocha
    - minifyCss
    - order
    - print
    - rename
    - sass
    - sourcemaps
    - uglify
    - util

  Available Gulp Tasks:
  ---------- JSHINTING ----------
  $ gulp validate-devserver-scripts OO
  $ gulp validate-app-scripts       OO
  $ gulp validate-partials          OO
  $ gulp validate-index             OO

  ---------- BUILDING ----------
  $ gulp build-app-scripts-dev      OO
  $ gulp build-partials-dev         OO
  $ gulp build-app-scripts-prod     OO
  $ gulp build-styles-dev           OO
  $ gulp build-styles-prod          OO
  $ gulp build-vendor-scripts-dev   OO
  $ gulp build-vendor-scripts-prod  XX (angular-animate UGLIFY punc error)
  $ gulp build-index-dev            OO
  $ gulp build-index-prod           OO*

  ---------- BUILDING ----------
  $ gulp build-app-dev              OO
  $ gulp build-app-prod             OO*
  $ gulp clean-build-app-dev        OO
  $ gulp clean-build-app-prod       OO*
  $ gulp watch-dev                  00
  $ gulp watch-prod                 --

  Note: OO* indicates works, but DOES NOT currently concat/minify/add VENDOR CSS files
*/


//-------------------------------- MODULES -------------------------------------
var bf = require('bower-files');
var bowerFiles = require('main-bower-files' );
var del        = require('del'              ); // remove directories in clean tasks
var es         = require('event-stream'     );
var gulp       = require('gulp'             );
var plugins    = require('gulp-load-plugins')();  // all plugins loaded at once!
var print      = require('gulp-print'       );    // doesn't work with plugins...
var Q          = require('q'                );


//------------------------------ DIRECTORIES -----------------------------------
// paths to various app files & file types
var JSHINT_SERVER_SRC = ['*.js',
              'lib/**/*.js',
              'models/*.js',
              'routes/*.js',
              'tests/*.js'];
var paths = {
  appScripts:        './app/**/*.js',
  serverScripts:     JSHINT_SERVER_SRC,
  styles:           ['./app/**/*.css', './app/**/*.scss', './app/**/*.sass'],
  index:             './app/index.html',
  partials:         ['app/**/*.html', '!app/index.html'],
  distDev:           'build',           // dev env served folder
  distProd:          'dist',            // prod env served folder
  distScriptsProd:   'dist/scripts',    // prod env scripts
  scriptsDevServer: ['./lib/**/*.js', './models/**/*.js', './routes/*.js', './server.js']
};
var APP_NAME = 'signpost_mean';
var pipes = {}; // Objects of pipe transforms (named by their output)


//--------------------------------- PIPES --------------------------------------
// (using 'order' plugin) order scripts from vendors in order listed; mid-stream pipe
pipes.orderedVendorScripts = function() {
  return plugins.order(['angular.js']);   // add jQuery before Angular
};

// using angularFilesort, order angular app scripts properly; mid-stream pipe
pipes.orderedAppScripts = function() {
  return plugins.angularFilesort();
};

// rename minified files with .min before file extension (eg: app.css => app.min.css); mid-stream pipe
pipes.minifiedFileName = function() {
  return plugins.rename(function(path) {
    path.extname = '.min' + path.extname;   // add in .min
  });
};

// run scripts through jshint; starting-stream pipe
pipes.validatedAppScripts = function() {
  return gulp.src(paths.appScripts)
    .pipe(plugins.debug({title: 'adding:'}))  // list files read
    .pipe(plugins.jshint('.jshintrc'))
    .pipe(plugins.jshint.reporter('jshint-stylish'));
};

// Dev Build of scripts
// move dev scripts to dev folder, returning stream of moved files
pipes.builtAppScriptsDev = function() {
  return pipes.validatedAppScripts()  // runs LINT
  .pipe(gulp.dest(paths.distDev));    // then puts file in distDev (/build folder)
};


// Create Production Script file; mid-stream pipe
// Should validate, order, concatenate, uglify.
// Should also include html partials converted by Angular into JS for pre-load template cache
pipes.builtAppScriptsProd = function() {
  var scriptedPartials    = pipes.scriptedPartials();     // JS Angular Partials
  var validatedAppScripts = pipes.validatedAppScripts();  // LINT the files

  return es.merge(scriptedPartials, validatedAppScripts)  // combine streams (see sP below)
    .pipe(pipes.orderedAppScripts())  // order scripts
    .pipe(plugins.sourcemaps.init())  // open the sourcemap for creating new file
      .pipe(plugins.concat('app.min.js'))   // concat this into file
      .pipe(plugins.uglify())               // uglify the file stuffs
    .pipe(plugins.sourcemaps.write())       // write the file
    .pipe(gulp.dest(paths.distScriptsProd)); // write file to production scripts folder
};

// Stream to save 3rd party scripts into bower_components for dev env; starting-pipe
// no need to concat/minify or uglify them
pipes.builtVendorScriptsDev = function() {
  return gulp.src(bowerFiles('**/*.js'))                    // all needed files from bower
    .pipe(gulp.dest(paths.distDev + '/bower_components'));  // send files into this folder
};

// stream to save 3rd party scripts into bower_components for PROD env; starting-pipe
// concat/minigy & uglified. No sourcemap, since increases size too much.
pipes.builtVendorScriptsProd = function() {
  return gulp.src(bowerFiles('**/*.js'))
    .pipe(pipes.orderedVendorScripts())       // specify order of scripts
    .pipe(plugins.concat('vendor.min.js'))    // add with vendor file
    .pipe(plugins.uglify().on('error', plugins.util.log)) // uglify the stream +err logging
    .pipe(gulp.dest(paths.distScriptsProd));  // set destination for files
};

// get all server scripts and lint them for dev
pipes.validatedDevServerScripts = function() {
  return gulp.src(paths.serverScripts)                // get server JS files
    .pipe(plugins.debug({title: 'adding:'}))        // list files read
    .pipe(plugins.jshint())                           // lint them
    .pipe(plugins.jshint.reporter('jshint-stylish')); // report results
};


///// APPLICATION PARTIALS
// return stream of HTML files validated wit htmlHint; starting-pipe
pipes.validatedPartials = function() {
  return gulp.src(paths.partials)       // gets all html files specified abv
    .pipe(plugins.debug({title: 'adding:'}))          // list files read
    .pipe(plugins.htmlhint({'doctype-first': false}))   // check html
    .pipe(plugins.htmlhint.reporter());                 // report results
};

// validate & save partials for dev environment
pipes.builtPartialsDev = function() {
  return pipes.validatedPartials()       // run through lint
    .pipe(gulp.dest(paths.distDev));     // save files here
};

// convert partials to JS & preload into angular template cache; returns single JS file; ; midstream-pipe
// hints the html, minifies it (removing comments & whitespace)
// this stream is merged into pipes.builtAPpScriptsProd above
pipes.scriptedPartials = function() {
  return pipes.validatedPartials()
    .pipe(plugins.htmlhint.failReporter())
    .pipe(plugins.htmlmin({collapseWhitespace: true, removeComments: true}))
    .pipe(plugins.ngHtml2js({
      moduleName: APP_NAME      // should match name of app - set above
    }));
};

///////////// STYLE FILES
// Convert SASS files into CSS & save for DEV env
pipes.builtStylesDev = function() {
  return gulp.src(paths.styles)       // get style files (.css, .sass, .scss)
    .pipe(plugins.sass())             // convert sass files to css
    .pipe(gulp.dest(paths.distDev));  // save here
};

// Convert SASS files into CSS & save as ONE FILE for DEV env
pipes.builtStylesProd = function() {
  return gulp.src(paths.styles)         // get all style files here
    .pipe(plugins.sourcemaps.init())    // use sourcemap for new file
      .pipe(plugins.sass())             // convert sass file contents to css
      .pipe(plugins.minifyCss())        // minify file contents
    .pipe(plugins.sourcemaps.write())   // write file (finalize it)
    .pipe(pipes.minifiedFileName())     // add .min to the filename
    .pipe(gulp.dest(paths.distProd));    // save here
};

/////// INDEX FILE
// returns index.html, validated with htmlhint
pipes.validatedIndex = function() {
  return gulp.src(paths.index)          // get the index file from here
    .pipe(plugins.htmlhint())           // hint the file
    .pipe(plugins.htmlhint.reporter()); // report results
};

// Gulp-Inject for sending the other files DIRECTLY into Index - DEV env
pipes.builtIndexDev = function() {
  var orderedVendorScripts = pipes.builtVendorScriptsDev()  // grab all bower scripts
    .pipe(pipes.orderedVendorScripts());                      // order them & send on

  var orderedAppScripts = pipes.builtAppScriptsDev()        // grap all app scripts
    .pipe(pipes.orderedAppScripts());                         // order them & send on

  var appStyles = pipes.builtStylesDev();                   // get all styles scripts

  // inject each part into the index.html file at destination
  return pipes.validatedIndex()           // get index file & hint
    .pipe(gulp.dest(paths.distDev))       // write first to get relative path for injecting
    .pipe(plugins.inject(orderedVendorScripts, {relative: true, name: 'bower'}))
    .pipe(plugins.inject(orderedAppScripts,    {relative: true}))
    .pipe(plugins.inject(appStyles,            {relative: true}))
    .pipe(gulp.dest(paths.distDev));      // save final result here
};

// Gulp-Inject for sending other files Directly into Index - PROD env
pipes.builtIndexProd = function() {
  var vendorScripts = pipes.builtVendorScriptsProd();
  var appScripts    = pipes.builtAppScriptsProd();
  var appStyles     = pipes.builtStylesProd();

  // inject each part (vendor scripts, app scripts, styles) into index
  return pipes.validatedIndex()
    .pipe(gulp.dest(paths.distProd))    // write first to get relative path
    .pipe(plugins.inject(vendorScripts, {relative: true, name: 'bower'}))
    .pipe(plugins.inject(appScripts,    {relative: true}))
    .pipe(plugins.inject(appStyles,     {relative: true}))
    .pipe(plugins.htmlmin({collapseWhitespace: true, removeComments: true}))
    .pipe(gulp.dest(paths.distProd));   // save final result here
};

//---------------------------- BUILD EVERYTHING --------------------------------
// Merge the Partials into Index for Development (can't get them there prior)
// this USES the prior Index stream & merges with Partials stream
// note:  the streams both have the same output location
pipes.builtAppDev = function() {
  return es.merge(pipes.builtIndexDev(), pipes.builtPartialsDev()); // merge index & partials
};

// Build by forwaring the stream from builtIndexProd
// note: for Production, partials are included in the appScripts, so no need to merge
pipes.builtAppProd = function() {
  return pipes.builtIndexProd();    // has index AND partials in Prod version per above
};


//--------------------------------- TASKS --------------------------------------

// Named Tasks
gulp.task('default', ['clean-build-app-dev']);

gulp.task('mocha', function() {   // run Mocha after lint
  return gulp.src(['tests/**/*_test.js'], {read: false})
    .pipe(plugins.mocha({
      reporter: 'spec',
      globals: {should: require('chai').should}
    }))
    .once('error', function() {
      process.exit(1);
    })
    .once('end', function() {
      process.exit();
    });
});

// clean the dev build folder (usually before adding files)
gulp.task('clean-dev', function() {
  var deferred = Q.defer();           // make promise to keep things ordered
  del(paths.distDev, function() {     // delete stuff in directory & then call resolve
    deferred.resolve();               // promise resolved after cleaning done
  });
  return deferred.promise;            // return the promise async & wait for resolve
});

// clean the prod dist folder (usually before adding files)
gulp.task('clean-prod', function() {
  var deferred = Q.defer();
  del(paths.distProd, function() {
    deferred.resolve();
  });
  return deferred.promise;
});

// check html source files for syntax errors
gulp.task('validate-partials', pipes.validatePartials);

// run htmlhint on index.html
gulp.task('validate-index', pipes.validateIndex);

// move html source files to dev build folder
gulp.task('build-partials-dev', pipes.builtPartialsDev);

// convert partials to JS
gulp.task('convert-partials-to-js', pipes.scriptedPartials);

// lint the dev server scripts
gulp.task('validate-devserver-scripts', pipes.validatedDevServerScripts);

// lint the app scripts
gulp.task('validate-app-scripts', pipes.validatedAppScripts);

// move app scripts to dev build folder
gulp.task('build-app-scripts-dev', pipes.builtAppScriptsDev);

// minify/uglify/move scripts/partials to prod dist folder
gulp.task('build-app-scripts-prod', pipes.builtAppScriptsProd);

// compile css/sass to dev build folder
gulp.task('build-styles-dev', pipes.builtStylesDev);

// compile/minify css/sass to prod dist folder
gulp.task('build-styles-prod', pipes.builtStylesProd);

// move vendor scripts to dev build folder
gulp.task('build-vendor-scripts-dev', pipes.builtVendorScriptsDev);

// minify/uglify/move vendor scriptd to prod dist folder
gulp.task('build-vendor-scripts-prod', pipes.builtVendorScriptsProd);

// validate/inject sources into index.html & move to dev build folder
gulp.task('build-index-dev', pipes.builtIndexDev);

// validate/inject sources into index.html & move to prod dist folder
gulp.task('build-index-prod', pipes.builtIndexProd);

// build COMPLETE dev build folder
gulp.task('build-app-dev', pipes.builtIndexProd);

// build COMPLETE prod dist folder
gulp.task('built-app-prod', pipes.buildAppProd);

// clean & build complete dev build folder
gulp.task('clean-build-app-dev', ['clean-dev'], pipes.builtAppDev);

// clean and build complete production env
gulp.task('clean-build-app-prod', ['clean-prod'], pipes.builtAppProd);

// clean, build, and watch for changes
gulp.task('watch-dev', ['clean-build-app-dev', 'validate-devserver-scripts'], function() {
  // start nodemon watching server
  plugins.nodemon({ script: 'server.js',                  // run this file as server
                    ext:    'js',                         // watch these extensions
                    watch:  paths.serverScripts,          // watch this file
                    env:    {NODE_ENV: 'development'} })  // dev environment only
    .on('change', ['mocha', 'validate-devserver-scripts'])// lint task on any change
    .on('restart', function() {                           // when server restsrt do this
      console.log('[nodemon] restarted the dev server');
    });

  // start live-reload server
  plugins.livereload.listen({start: true});

  // watch index.html for changes
  gulp.watch(paths.index, function() {
    return pipes.builtIndexDev()        // re-build dev index if change
      .pipe(plugins.livereload());      // live-reload the browser
  });

  // watch app scripts for changes
  gulp.watch(paths.appScripts, function() {
    return pipes.builtAppScriptsDev()   // re-build dev index if scripts change
      .pipe(plugins.livereload());      // live-reload the browser
  });

  // watch html partials for changes
  gulp.watch(paths.partials, function() {
    return pipes.builtPartialsDev()     // re-build the partials if change
      .pipe(plugins.livereload());      // live-reload the browser
  });

  // watch styles for changes
  gulp.watch(paths.partials, function() {
    return pipes.builtStylesDev()       // re-build the styles if change
      .pipe(plugins.livereload());       // live-reload the browser
  });
});

// WHY EVER DO THIS? JUST BUIlD WHEN READY, RIGHT?
// gulp.task('watch-prod'......)


