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
          startPath: "./demos/index.html",
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
        tasks: ['jshint:source'/*, 'nodeunit'*/,'concat','closureCompiler']
      },
      template:{
        files:'templates/**/*.html',
        tasks:['tmod','concat','closureCompiler']
      },
      lib:{
        files:'lib/**/*.js',
        tasks:['concat','closureCompiler']
      },
      test: {
        files: '<%= jshint.test.src %>',
        tasks: ['jshint:test'/*, 'nodeunit'*/]
      },
    },


    tmod: {
      template: {
        src: './templates/**/*.html',
        dest: './templates/compiled/template.js',
        options: {
            base: './templates'
        } 
      }
    },

    concat: {
      dist: {
        options: {
          // Replace all 'use strict' statements in the code with a single one at the top
          //banner: "'use strict';\n",
          //process: function(src, filepath) {
            //return '// Source: ' + filepath + '\n' +
            //  src.replace(/(^|\n)[ \t]*('use strict'|"use strict");?\s*/g, '$1');
          //},
        },
        files: {
          'dist/magicform-1.0.js': 
          ['templates/compiled/template.js','src/magicform.js'],
        },
      },
    },

    closureCompiler: {
        options: {
        // [REQUIRED] Path to closure compiler
        compilerFile: 'tools/compiler.jar',

        // [OPTIONAL] set to true if you want to check if files were modified
        // before starting compilation (can save some time in large sourcebases)
        checkModified: true,

        // [OPTIONAL] Set Closure Compiler Directives here
        compilerOpts: {
          /**
           * Keys will be used as directives for the compiler
           * values can be strings or arrays.
           * If no value is required use null
           *
           * The directive 'externs' is treated as a special case
           * allowing a grunt file syntax (<config:...>, *)
           *
           * Following are some directive samples...
           */
           compilation_level: 'ADVANCED_OPTIMIZATIONS'
        },
        // [OPTIONAL] Set exec method options
        execOpts: {
           /**
            * Set maxBuffer if you got message "Error: maxBuffer exceeded."
            * Node default: 200*1024
            */
           maxBuffer: 999999 * 1024
        },
        // [OPTIONAL] Java VM optimization options
        // see https://code.google.com/p/closure-compiler/wiki/FAQ#What_are_the_recommended_Java_VM_command-line_options?
        // Setting one of these to 'true' is strongly recommended,
        // and can reduce compile times by 50-80% depending on compilation size
        // and hardware.
        // On server-class hardware, such as with Github's Travis hook,
        // TieredCompilation should be used; on standard developer hardware,
        // d32 may be better. Set as appropriate for your environment.
        // Default for both is 'false'; do not set both to 'true'.
        d32: false, // will use 'java -client -d32 -jar compiler.jar'
        TieredCompilation: true // will use 'java -server -XX:+TieredCompilation -jar compiler.jar'
      },

      // any name that describes your task
      targetName: {

        /**
         *[OPTIONAL] Here you can add new or override previous option of the Closure Compiler Directives.
         * IMPORTANT! The feature is enabled as a temporary solution to [#738](https://github.com/gruntjs/grunt/issues/738).
         * As soon as issue will be fixed this feature will be removed.
         */
        TEMPcompilerOpts: {
        },

        // [OPTIONAL] Target files to compile. Can be a string, an array of strings
        // or grunt file syntax (<config:...>, *)
        src: 'dist/magicform-1.0.js',

        // [OPTIONAL] set an output file
        dest: 'dist/magicform-1.0.min.js'
      }
    }

  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-nodeunit');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-express-server');
  grunt.loadNpmTasks('grunt-browser-sync');
  grunt.loadNpmTasks('grunt-tmod');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-closure-tools');

  // Default task.
  grunt.registerTask('default', ['jshint', 'tmod','concat','closureCompiler', 'browserSync', 'watch']);

};
