var exec = require('child_process').exec;
var fs = require('fs');
var temp = require('temp');
var path = require('path');
// var Promise = require('bluebird');
// Promise.promisifyAll(fs);
// Promise.primisifyAll(child_process);

var soynode = require('soynode');
var closureTemplates = require('closure-templates');

// Automatic cleanup of temporary files.
temp.track();

function createSoyFile(source, callback) {

	temp.mkdir('soytmp', function(err, dirPath) {
		console.log('DIRECTORY CREATED', dirPath);

		soynode.setOptions({
			outputDir: '/',
			uniqueDir: false,
			eraseTemporaryFiles: false
		});

		var soyPath = path.join(dirPath, 'source.soy');
		fs.writeFile(soyPath, source, function(err) {
			if (err) throw err;

			console.log('SOY WRITTEN');

			soynode.compileTemplateFiles([soyPath], function(err) {
				if (err) throw err;

				console.log('SOY COMPILED');

				fs.readFile(soyPath + '.js', function(err, data) {
					if (err) throw err;

					console.log('READ JS FILE', data);
					callback(null, data);
				});
			});
		});
	});
}

module.exports = function(source) {
	if (this.cacheable) this.cacheable();
	var callback = this.async();
	createSoyFile(source, callback);
};
