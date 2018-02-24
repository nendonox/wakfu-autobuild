'use strict';

module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    eslint: {
      target: ['client/scripts/*.js', 'client/scripts/*/*.js']
    },
    concat: {
      scripts: {
        src: ['bower_components/lodash/dist/lodash.js',
          'client/scripts/main.js', 'client/scripts/**/*.js'],
        dest: 'dest/build/scripts/main.js'
      },
      workers: {
        src: ['bower_components/lodash/dist/lodash.js',
          'client/scripts/lib/cartesian-gen.js',
          'client/workers/searcher.js'],
        dest: 'dest/build/workers/searcher.js'
      }
    },
    pug: {
      options: {
        pretty: true
      },
      source: {
        expand: true,
        cwd: 'client/pug',
        src: '**/**/!(_)*.pug',
        dest: 'dest/build',
        ext: '.html'
      }
    },
    less: {
      files: {
        src: 'client/less/main.less',
        dest: 'dest/build/styles/main.css'
      }
    },
    copy: {
      res: {
        expand: true,
        src: ['res/*'],
        cwd: 'client/',
        dest: 'dest/build'
      },
      data: {
        expand: true,
        src: ['equipment.json'],
        cwd: 'dest/data/',
        dest: 'dest/build/res'
      }
    },
    watch: {
      default: {
        tasks: ['eslint', 'pug', 'less', 'copy', 'concat'],
        files: ['client/**/*']
      }
    }
  });

  grunt.loadNpmTasks('grunt-eslint');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-pug');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.registerTask('build', ['eslint', 'pug', 'less', 'copy', 'concat']);
};
