var webpack = require('webpack')
var commonsPlugin = new webpack.optimize.CommonsChunkPlugin('common.js');

module.exports = {
	entry: {
		app: './app.jsx',
		app2: './app2.jsx'
	},
	output: {
		path: './',
		filename: '[name].js',
	},
	plugins: [
		commonsPlugin
	],
	module: {
		loaders: [
			{
				test: /\.jsx$/,
				loader: 'jsx-loader',
			}
		]
	}
}