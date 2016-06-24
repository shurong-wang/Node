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
				files: {
					'<%= config.dist%>/index.html': '<%= config.app%>/index.html',
					'<%= config.dist%>/js/index.js': '<%= config.app%>/js/index.js'
				}
			}
		},

		// 任务：清理文件
		clean: {
			dist: {
				src: [
					'<%= config.dist%>/**/*'
				]
			}
		}


	});
}
