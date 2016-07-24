module.exports = function (grunt) {
    grunt.initConfig({
        imagemin: {
          dist: {

            options: {
                optimizationLevel: 3
            },

            files: [{
              expand: true,
              cwd: '<%= config.app %>/images',
              src: '{,*/}*.{gif,jpeg,jpg,png}',
              dest: '<%= config.dist %>/images'
            }]
          }
        },
    });
    grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.registerTask('img', ['imagemin']);
};