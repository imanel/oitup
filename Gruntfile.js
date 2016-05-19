module.exports = function(grunt) {

  grunt.initConfig({
    coffee: {
      application: {
        files: {
          'xcode/oitup/application.js': 'src/**/*.coffee'
        },
        options: {
          bare: true
        }
      }
    },

    jshint: {
      files: 'xcode/oitup/application.js',
      options: {
        eqnull: true
      }
    },

    watch: {
      scripts: {
        files: ['src/**/*.coffee'],
        tasks: ['coffee', 'jshint']
      },
    }
  });

  grunt.loadNpmTasks('grunt-contrib-coffee');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['coffee', 'jshint']);
};
