module.exports = function (grunt) {
  //Project config
  grunt.initConfig({

    //--- watch
    watch: {
      jade: {
        files: ['views/**'],
        options: {
          livereload: true
        }
      },
      js: {
        files: ['public/assets/js/**', 'app/models/**/*.js'],
        options: {
          livereload: true
        }
      },
      uglify: {
        files: ['public/**/*.js'],
        tasks: ['jshint'],
        options: {
          livereload: true
        }
      },
      styles: {
        files: ['public/**/*.less'],
        tasks: ['less'],
        options: {
          nospawn: true
        }
      }

    },

    //--- jshint
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        ignores: ['public/assets/libs/**/*.js']
      },
      all: ['public/assets/js/*.js', 'test/**/*.js', 'app/**/*.js', 'app.js']
    },

    //--- less
    less: {
      development: {
        options: {

          compress: true,
          yuicompress: true,
          optimization: 2
        },

        files: {
          'public/build/index.css': 'public/assets/css/index.less'
        }
      }
    },

    //--- uglify
    uglify: {
      development: {
        files: {
          'public/build/admin.min.js': 'public/assets/js/main.js',
          // detail.js

        }
      }
    },

    //--- nodemon
    nodemon: {
      dev: {
        options: {
          file: 'app.js',
          args: [],
          ignoredFiles: ['README.md', 'node_modules/**', '.DS_Store'],
          watchedExtensions: ['js'],
          watchedFolder: ['./'],
          debug: true,
          delayTime: 1,
          env: {
            PORT: 3000

          },
          cwd: __dirname
        }

      }
    },

    //--- mochaTest
    mochaTest: {
      options: {
        reporter: 'spec'
      },
      src: ['test/**/*.js']
    },

    //--- concurrent
    concurrent: {
      // miss uglify
      tasks: ['nodemon', 'watch', 'less', 'jshint'],
      options: {
        logConcurrentOutput: true
      }
    }

  });

  // Load plugins
  grunt.loadNpmTasks('grunt-contrib-watch');    // 监听文件变更，重新注册任务
  grunt.loadNpmTasks('grunt-nodemon');          // 监听文件变更，重启服务
  grunt.loadNpmTasks('grunt-concurrent');       // 并发执行 grunt 任务
  grunt.loadNpmTasks('grunt-mocha-test');       // 集成 mocha 单元测试
  grunt.loadNpmTasks('grunt-contrib-less');     // 将 Less 编译为 CSS
  grunt.loadNpmTasks('grunt-contrib-uglify');   // js 文件压缩工具
  grunt.loadNpmTasks('grunt-contrib-jshint');   // js 语法检查工具

  // Default tasks
  grunt.option('force', true);
  grunt.registerTask('default', ['concurrent']);
  grunt.registerTask('test', ['mochaTest']);
}
