module.exports = function(grunt) {

  grunt.initConfig({

    cwebp: {
      dynamic: {
        options: {
          q: 80
        },
        files: [{
          expand: true,
          cwd: 'img_src/', 
          src: ['*.{png,jpg,gif}'],
          dest: 'img/'
        }]
      },
    },
      

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
            quality: 80
          }, {
           name: "large",
           width: 800,
           quality: 80
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
  
  grunt.loadNpmTasks('grunt-cwebp');
  grunt.loadNpmTasks('grunt-responsive-images');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-mkdir');
  grunt.registerTask('default', ['clean', 'mkdir', 'cwebp', 'responsive_images']);
};
