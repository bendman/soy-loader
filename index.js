
var loaderUtils = require('loader-utils');
var closureTemplates = require('closure-templates');

var Promise = require('bluebird');
var soynode = Promise.promisifyAll(require('soynode'));
var fs = Promise.promisifyAll(require('fs'));
var temp = Promise.promisifyAll(require('temp'));
var path = require('path');

// Automatic cleanup of temporary files.
temp.track();

// function createSoyFile(source, callback) {
//
//
//
//
// 	temp.mkdir('soytmp2', function(err, dirPath) {
// 		console.log('DIRECTORY CREATED', dirPath);
//
// 		var soyPath = path.join(dirPath, 'source.soy');
// 		fs.writeFile(soyPath, source, function(err) {
// 			if (err) throw err;
//
// 			console.log('SOY WRITTEN');
//
// 			soynode.compileTemplateFiles([soyPath], function(err) {
// 				if (err) throw err;
//
// 				console.log('SOY COMPILED');
//
// 				fs.readFile(soyPath + '.js', function(err, data) {
// 					if (err) throw err;
//
// 					console.log('READ JS FILE', data);
// 					callback(null, data);
// 				});
// 			});
// 		});
// 	});
// }

module.exports = function(source) {
	if (this.cacheable) this.cacheable();
	var loaderCallback = this.async();
	var query = this.query instanceof Object ? this.query : loaderUtils.parseQuery(this.query);
	var utilsPath = require.resolve(query.utils || closureTemplates['soyutils.js']);

	this.addDependency(require.resolve(closureTemplates['soyutils.js']));
	soynode.setOptions({
		outputDir: '/',
		uniqueDir: false,
		eraseTemporaryFiles: false
	});

	var namespace = /\{namespace\s+(\w+)/.exec(source)[1];

	var soyUtilsContent = fs.readFileAsync(utilsPath);
	var compileContent = temp.mkdirAsync('soytemp')
		.then(function(dirPath) {
			return path.join(dirPath, 'source.soy');
		}).then(function(soyPath) {
			return fs.writeFileAsync(soyPath, source).return(soyPath);
		}).then(function(soyPath) {
			return soynode.compileTemplateFilesAsync([soyPath]).return(soyPath);
		}).then(function(soyPath) {
			return fs.readFileAsync(soyPath + '.js');
		});

	Promise.join(soyUtilsContent, compileContent, function(utils, template){
		var buffer = [utils, 'var ' + namespace + ';', template, 'module.exports = ' + namespace + ';'].join('\n');
		console.log(buffer);
		loaderCallback(null, buffer);
	});
};
