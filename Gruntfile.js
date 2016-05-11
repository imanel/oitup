module.exports = function(grunt) {

  grunt.initConfig({
    coffee: {
      application: {
        files: {
          'application.js': 'src/**/*.coffee'
        },
        options: {
          bare: true
        }
      }
    },

    connect: {
      server: {
        options: {
          port: 9001
        }
      }
    },

    jshint: {
      files: 'application.js'
    },

    uglify: {
      application: {
        dest: 'application.min.js',
        src: 'application.js'
      }
    },

    watch: {
      scripts: {
        files: ['src/**/*.coffee'],
        tasks: ['coffee', 'jshint', 'uglify']
      },
    }
  });

  grunt.loadNpmTasks('grunt-contrib-coffee');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['coffee', 'jshint', 'uglify']);
  grunt.registerTask('server', ['connect', 'watch']);

};
