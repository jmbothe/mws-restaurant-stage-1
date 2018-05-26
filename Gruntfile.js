module.exports = function(grunt) {

  grunt.initConfig({
    responsive_images: {
      dev: {
        options: {
          engine: 'im',
          sizes: [{
            name: "small",
            width: 376,
            quality: 100
          }, {
            name: "medium",
            width: 640,
            quality: 100
          }, {
           name: "large",
           width: 800,
           quality: 100
          }]
        },

        files: [{
          expand: true,
          src: ['*.{gif,jpg,png}'],
          cwd: 'img_src/',
          dest: 'img/'
        }]
      }
    },

    clean: {
      dev: {
        src: ['img'],
      },
    },

    mkdir: {
      dev: {
        options: {
          create: ['img']
        },
      },
    },

  });
  
  grunt.loadNpmTasks('grunt-responsive-images');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-mkdir');
  grunt.registerTask('default', ['clean', 'mkdir', 'responsive_images']);
};
