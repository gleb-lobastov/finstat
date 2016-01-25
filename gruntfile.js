module.exports = function(grunt) {

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
      sass: {
         dev: {
            options: {
               style: 'expanded',
               //banner: '<%= tag.banner %>',
               //compass: true
            },
            files: {
               '<%= project.src %>/dist/css/style.css': '<%= project.sass %>'
            }
         },
         dist: {
            options: {
               style: 'compressed',
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

   grunt.registerTask('default', ['sass', 'jshint', 'watch']);

};