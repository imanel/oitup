module.exports = function(grunt) {

  grunt.initConfig({
    connect: {
      server: {
        options: {
          port: 9001
        }
      }
    },

    jshint: {
      files: ['src/**/*.js']
    },

    uglify: {
      application: {
        dest: 'application.js',
        src: ['src/**/*.js']
      }
    },

    watch: {
      scripts: {
        files: ['src/**/*.js'],
        tasks: ['jshint', 'uglify']
      },
    }
  });


  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['jshint', 'uglify']);
  grunt.registerTask('server', ['connect', 'watch']);

};
