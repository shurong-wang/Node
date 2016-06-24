'use strict';
module.exports = function(grunt){
	// 引入相关模块
	require('load-grunt-tasks')(grunt);
	require('time-grunt')(grunt);

	// 配置项目路径
	var config = {
		app: 'app',
		dist: 'dist',
		tmp: 'tmp'
	};

	// 配置任务
	grunt.initConfig({
		// 引用 config 
		config: config,

		// 任务：复制文件
		copy: {
			dist_html: {
				files: [
					{
						expand: true
						,cwd: '<%= config.app %>/'
						//,src: '*.html'
						,src: '**/*.js'
						,dest: '<%= config.dist %>/'
						// ,ext: '.min.html'
						,ext: '.js'
						//,extDot: 'first'
						,extDot: 'last'
						//,flatten: false
						,flatten: true
						,rename: function (dest, src) {
							return dest + 'js/' + src;
						}
					}
				]
			}
		},

		// 任务：清理文件
		clean: {
			dist: {
				src: [
					'<%= config.dist%>/**/*'
				]
				//,filter: 'isFile'
				,filter: function(filepath) {
					return (! grunt.file.isDir(filepath));
				}
			}
		}


	});
}
