'use strict';

module.exports = function(grunt) {

  // Load Tasks
  grunt.loadNpmTasks('grunt-contrib-clean' );  // webpack: clean folder
  grunt.loadNpmTasks('grunt-contrib-copy'  );  // webpack: copy assets
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-jscs'          );
  grunt.loadNpmTasks('grunt-mocha-test'    );
  grunt.loadNpmTasks('grunt-nodemon'       );  // avoid server restarts
  grunt.loadNpmTasks('grunt-contrib-watch' );
  grunt.loadNpmTasks('grunt-webpack'       );

  // Configure Tasks
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    clean: {
      dev: {
        src: 'build/' // clean out webpack build folder
      }
    },
    copy: {
      htmlcss: {
        cwd: 'app/',
        expand: true,
        flatten: false,
        src: ['**/*.html', '**/*.css', '**/*.ico'],
        dest: 'build/',
        filter: 'isFile'
      }
    },
    jscs: {
      src: ['Gruntfile.js',
            '*.js',
            'lib/**/*.js',
            'models/**/*.js',
            'routes/**/*.js',
            'test/**/*.js'],
      options: {
        requireCurlyBraces: [false],
        verbose: false
      }
    },
    jshint: {
      dev: {
        src: ['Gruntfile.js',
            '!/build/bundle.js',
            '!/test/client/bundle.js',
            '*.js',
            'lib/**/*.js',
            'models/**/*.js',
            'routes/**/*.js',
            'test/**/*.js']
      },
      options: {
        jshintrc: true
      }
    },
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
          quiet: false,
          clearRequireCache: false
        },
        src: ['test/**/*_test.js']  // all test files
      }
    },
    watch: {

    },
    webpack: {
      client: { // webpack frontend production
        entry: __dirname + '/app/js/client.js',
        output: {
          path: 'build/',
          file: 'bundle.js'
        },
        stats: {
          colors: true
        },
        failOnError: false,
        watch: true,
        keepalive: true
      },
      test: { // webpack frontend tests
        entry: __dirname + '/test/client/test.js',
        output: {
          path: 'test/client/',
          file: 'test_bundle.js'
        },
        stats: {
          colors: true
        },
        failOnError: false,
        watch: false,
        keepalive: true
      }
    }
  });

  // Custom Task Chains
  grunt.registerTask('test',       ['jshint:dev', 'jscs', 'mochaTest'   ]);
  grunt.registerTask('build:dev',  ['copy:htmlcss', 'webpack:client'    ]);
  grunt.registerTask('build:test', ['copy:htmlcss', 'webpack:test'      ]);
  grunt.registerTask('build',      ['build:dev'                         ]);
  grunt.registerTask('default',    ['test', 'build'                     ]);
};
