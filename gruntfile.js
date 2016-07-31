module.exports = function (grunt) {

   grunt.initConfig({
      pkg: grunt.file.readJSON('package.json'),
      project: {
         src: 'static',
         sass: ['<%= project.src %>/sass/*.sass'],
         js: ['<%= project.src %>/js/*.js']
      },
      jshint: {
         files: ['Gruntfile.js', 'static/js/**/*.js', 'test/**/*.js'],
         options: {
            globals: {
               jQuery: true
            }
         }
      },
      bower: {
         dev: {
            options: {
               keepExpandedHierarchy: false,
               packageSpecific: {
                  'bootstrap': {
                     files: [
                        'dist/css/bootstrap.css',
                        'dist/fonts/*',
                        'dist/js/bootstrap.js',
                     ]
                  },
                  'x-editable': {
                     files: [
                        'dist/bootstrap3-editable/js/bootstrap-editable.js',
                        'dist/bootstrap3-editable/css/bootstrap-editable.css',
                        'dist/bootstrap3-editable/img/**'
                     ]
                  },
                  'moment': {
                     keepExpandedHierarchy: true,
                     files: [
                        'moment.js',
                        'locale/ru.js',
                        'locale/en-gb.js'
                     ]
                  },
                  // 'bootstrap-datepicker': {
                  // files: ["dist/js/bootstrap-datepicker.js"]
                  // },
                  'air-datepicker': {
                     files: ["dist/js/datepicker.js", "dist/css/datepicker.css"]
                  },
                  'selectize': {
                     files: ["dist/js/selectize.js", "dist/css/selectize.css", "dist/css/selectize.bootstrap3.css"]
                  },
//                  'doT': {
//                     files: ["doT.js"]
//                  },
//                  'typeahead.js': {
//                     files: ["dist/typeahead.jquery.js"]
//                  },
                  requirejs: {
                     js_dest: 'static/js'
                  }
               }
            },
            dest: 'static/other/vendor',
            js_dest: 'static/js/vendor',
            css_dest: 'static/styles/vendor',
            fonts_dest: 'static/styles/fonts'
         }
      },
      copy: {
         main: {
            expand: true,
            cwd: 'static/js',
            src: '**',
            dest: 'static/dev/js'
         }
      },
      sass: {
         dev: {
            options: {
               style: 'expanded'
               //banner: '<%= tag.banner %>',
               //compass: true
            },
            files: {
               '<%= project.src %>/dist/css/style.css': '<%= project.sass %>'
            }
         },
         dist: {
            options: {
               style: 'compressed'
               //compass: true
            },
            files: {
               '<%= project.src %>/dist/css/base.css': '<%= project.sass %>'
            }
         }
      },
      watch: {
         sass: {
            files: '<%= project.src %>/sass/{,*/}*.{scss,sass}',
            tasks: ['sass:dev']
         },
         js: {
            files: ['<%= jshint.files %>'],
            tasks: ['jshint']
         }
      }
   });

   grunt.loadNpmTasks('grunt-contrib-sass');
   grunt.loadNpmTasks('grunt-contrib-jshint');
   grunt.loadNpmTasks('grunt-contrib-watch');
   grunt.loadNpmTasks('grunt-contrib-copy');
   grunt.loadNpmTasks('grunt-bower');

   grunt.registerTask('default', ['bower', 'sass', 'jshint', 'watch']);
   // grunt.registerTask('bower-setup', ['bower']);

};