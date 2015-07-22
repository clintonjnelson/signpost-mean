'use strict';

var gulp   = require('gulp'       );
var jshint = require('gulp-jshint');
var mocha  = require('gulp-mocha' );
var gutil  = require('gulp-util'  );

var JS_SRC = ['*.js',
              'lib/**/*.js',
              'models/*.js',
              'routes/*.js',
              'tests/*.js'];

// Named Tasks
gulp.task('default', ['lint', 'mocha']);


// Tasks
gulp.task('lint', function() {
  return gulp.src(JS_SRC)
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('mocha', ['lint'], function() {   // run Mocha after lint
  return gulp.src(['tests/**/*_test.js'], {read: false})
    .pipe(mocha({
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

