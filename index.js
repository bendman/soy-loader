var loaderUtils = require('loader-utils');
var closureTemplates = require('closure-templates');
var Promise = require('bluebird');
var soynode = Promise.promisifyAll(require('soynode'));
var fs = Promise.promisifyAll(require('fs'));
var temp = Promise.promisifyAll(require('temp'));
var path = require('path');

// Automatic cleanup of temporary files.
temp.track();

// Run the loader.
module.exports = function(source) {
	if (this.cacheable) this.cacheable();
	var loaderCallback = this.async();
	var query = this.query instanceof Object ? this.query : loaderUtils.parseQuery(this.query);

	// Get the configurable source of the soy runtime utilities, or use default.
	var runtimeUtils = require.resolve(query.utils || closureTemplates['soyutils.js']);
	// Create a require statement to be injected into the templates for shimming.
	runtimeUtils = 'require(\'exports?goog,soy,soydata,soyshim!' + runtimeUtils + '\')';
	runtimeUtils = runtimeUtils.replace(/\\/g, '\\\\');

	this.addDependency(require.resolve(closureTemplates['soyutils.js']));
	soynode.setOptions({
		outputDir: '/',
		uniqueDir: false,
		eraseTemporaryFiles: false
	});

	// Grab namespace for shimming encapsulated module return value.
	var namespace = /\{namespace\s+(\w+)/.exec(source)[1];

	// Compile the templates to a temporary directory for reading.
	var compileContent = temp.mkdirAsync('soytemp')

		// Get the temp directory path
		.then(function(dirPath) {
			// Handle drive letters in windows environments (C:\)
			if (dirPath.indexOf(':') !== -1) {
				dirPath = dirPath.split(':')[1];
			}
			return path.join(dirPath, 'source.soy');

		// Write the raw source template into the temp directory
		}).then(function(soyPath) {
			return fs.writeFileAsync(soyPath, source).return(soyPath);

		// Run the compiler on the raw template
		}).then(function(soyPath) {
			return soynode.compileTemplateFilesAsync([soyPath]).return(soyPath);

		// Read the newly compiled source
		}).then(function(soyPath) {
			return fs.readFileAsync(soyPath + '.js');

		// Return utils and module return value, shimmed for module encapsulation.
		}).then(function(template) {

			return loaderCallback(null, [
				// Shims for encapsulating the soy runtime library. Normally these are exposed globally by
				// including soyutils.js. Here we encapsulate them and require them in the template.
				'var goog = ' + runtimeUtils + '.goog;',
				'var soy = ' + runtimeUtils + '.soy;',
				'var soydata = ' + runtimeUtils + '.soydata;',
				'var soyshim = ' + runtimeUtils + '.soyshim;',

				// Shims for encapsulating the compiled template.
				'var ' + namespace + ';',
				template,
				'module.exports = ' + namespace + ';'

			].join('\n'));
		});
};
