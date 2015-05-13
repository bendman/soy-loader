var path = require('path');

module.exports = {
	entry: './app.js',
	output: {
		path: 'dist',
		filename: 'bundle.js'
	},
	module: {
		loaders: [{
			test: /\.soy$/,
			loader: path.resolve(__dirname, '../../')
		}]
	}
};
