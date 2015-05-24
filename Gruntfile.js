'use strict';

module.exports = function(grunt) {

  // Load Tasks
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-jscs'          );
  grunt.loadNpmTasks('grunt-mocha-test'    );
  grunt.loadNpmTasks('grunt-nodemon'       );

  // Configure Tasks
  grunt.initConfig({
    jscs: {
      src: ['Gruntfile.js',
            '*.js',
            'lib/**/*.js',
            'models/**/*.js',
            'routes/**/*.js',
            'test/**/*.js']
      options: {
        verbose: false
      }
    },
    jshint: {
      dev: {
        src: ['Gruntfile.js',
            '*.js',
            'lib/**/*.js',
            'models/**/*.js',
            'routes/**/*.js',
            'test/**/*.js']
      },
      options: {
        jshintrc: true
      }
    }
    nodemon: {
      dev: {
        script: 'server.js'
      }
    },
    mochaTest: {
      test: {
        options: {
          reporter: 'spec',
          captureFile: false,
          quiet: false
          clearRequireCache: false
        },
        src: ['test/**/*_test.js']  // all test files
      }
    }
  });

  // Custom Task Chains
  grunt.registerTask('test',    ['jshint:dev', 'jscs', 'mochaTest']);
  grunt.registerTask('default', ['test']);
};
