var loaderUtils = require('loader-utils');
var closureTemplates = require('closure-templates');
var Promise = require('bluebird');
var soynode = Promise.promisifyAll(require('soynode'));
var fs = Promise.promisifyAll(require('fs'));
var rimrafAsync = Promise.promisify(require('rimraf'));
var path = require('path');

// Automatic cleanup of temporary files.

// Run the loader.
module.exports = function(source) {
	if (this.cacheable) this.cacheable();
	var loaderCallback = this.async();
	var query = this.query instanceof Object ? this.query : loaderUtils.parseQuery(this.query);
	var classpath = query.classpath ? (query.classpath instanceof Array ? query.classpath : [query.classpath]) : [];
	var pluginModules = query.pluginModules ? (query.pluginModules instanceof Array ? query.pluginModules : [query.pluginModules]) : [];

	// Get the configurable source of the soy runtime utilities, or use default.
	var runtimeUtils = require.resolve(query.utils || closureTemplates['soyutils.js']);
	// Create a require statement to be injected into the templates for shimming.
	runtimeUtils = 'require(\'exports-loader?goog,soy,soydata,soyshim!' + runtimeUtils + '\')';
	runtimeUtils = runtimeUtils.replace(/\\/g, '\\\\');

	this.addDependency(require.resolve(closureTemplates['soyutils.js']));
	soynode.setOptions({
		outputDir: '/',
		uniqueDir: false,
		eraseTemporaryFiles: false,
		classpath: classpath,
		pluginModules: pluginModules
	});

	// Grab namespace for shimming encapsulated module return value.
	var extracted = /\{namespace\s+((\w+)[^\s]*).*\}/.exec(source);
	var namespace = extracted[1];
	var baseVar = extracted[2]
	var tempDir = path.resolve(__dirname, [
		'soytemp', // directory prefix
		Date.now(), // datestamp
		(Math.random() * 0x100000000 + 1).toString(36) // randomized suffix
	].join('-'));

	// Compile the templates to a temporary directory for reading.
	var compileContent = fs.mkdirAsync(tempDir)

		// Get the temp directory path
		.then(function() {
			dirPath = tempDir;
			// Handle drive letters in windows environments (C:\)
			if (dirPath.indexOf(':') !== -1) {
				dirPath = dirPath.split(':')[1];
			}
			return path.join(dirPath, 'source.soy');

		// Write the raw source template into the temp directory
		}).then(function(soyPath) {
			return fs.writeFileAsync(path.resolve(soyPath), source).return(soyPath);

		// Run the compiler on the raw template
		}).then(function(soyPath) {
			return soynode.compileTemplateFilesAsync([soyPath]).return(soyPath);

		// Read the newly compiled source
		}).then(function(soyPath) {
			return fs.readFileAsync(path.resolve(soyPath) + '.js');

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
				'var ' + baseVar + ';',
				template,
				'module.exports = ' + namespace + ';'

			].join('\n'));
		// Handle any errors
		}).catch(function(e) {
			return loaderCallback(e);
		// Cleanup temp directory
		}).finally(function(template) {
			return rimrafAsync(tempDir).return(template);
			
		});
};
