'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    nodeunit: {
      files: ['test/**/*_test.js'],
    },

    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      gruntfile: {
        src: 'Gruntfile.js'
      },
      source: {
        src: ['src/**/*.js']
      },
      test: {
        src: ['test/**/*.js']
      },
    },

    browserSync: {
      dev:{
        bsFiles: {
          src : ['demos/**/*.*','dist/**/*.js']
        },
        options: {
          server: {
            baseDir: "./"
          },
          startPath: "./demos/index-handlebars.html",
          watchTask: true
        }
      }
    },

    watch: {
      gruntfile: {
        files: '<%= jshint.gruntfile.src %>',
        tasks: ['jshint:gruntfile']
      },
      source: {
        files: '<%= jshint.source.src %>',
        tasks: ['jshint:source'/*, 'nodeunit'*/,'concat']
      },
      template:{
        files:'templates/**/*.hbs',
        tasks:['handlebars','concat']
      },
      lib:{
        files:'lib/**/*.js',
        tasks:['concat']
      },
      test: {
        files: '<%= jshint.test.src %>',
        tasks: ['jshint:test'/*, 'nodeunit'*/]
      },
    },


    handlebars: {
      compile: {
        options: {
          namespace: "magicform.template",
          processName: function(filePath) {
              return filePath.replace(/^templates\//, '').replace(/\-handlebars\.hbs$/, '');
          }
        },
        files: {
          "templates/compiled/template-handlebars.js": "templates/**/*.hbs"
        }
      }
    },

    concat: {
      dist: {
        options: {
          // Replace all 'use strict' statements in the code with a single one at the top
          banner: "'use strict';\n",
          process: function(src, filepath) {
            return '// Source: ' + filepath + '\n' +
              src.replace(/(^|\n)[ \t]*('use strict'|"use strict");?\s*/g, '$1');
          },
        },
        files: {
          'dist/magicform-1.0.handlebars.js': 
          ['src/magicform-handlebars.js','lib/handlebars.runtime-v1.3.0.js','templates/compiled/template-handlebars.js'],
        },
      },
    }

  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-nodeunit');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-express-server');
  grunt.loadNpmTasks('grunt-browser-sync');
  grunt.loadNpmTasks('grunt-contrib-handlebars');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.registerTask('web','launch webserver and watch tasks',['express:web']);

  // Default task.
  grunt.registerTask('default', ['jshint', 'handlebars','concat', 'browserSync', 'watch']);

};
