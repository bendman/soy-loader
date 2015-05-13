/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var templates = __webpack_require__(1);

	document.getElementById('target').innerHTML = templates.examples.greeting();


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	// This file was automatically generated from source.soy.
	// Please don't edit this file by hand.

	/**
	 * @fileoverview Templates in namespace Templates.examples.
	 */

	if (typeof Templates == 'undefined') { var Templates = {}; }
	if (typeof Templates.examples == 'undefined') { Templates.examples = {}; }


	/**
	 * @param {Object.<string, *>=} opt_data
	 * @param {(null|undefined)=} opt_ignored
	 * @param {Object.<string, *>=} opt_ijData
	 * @return {!soydata.SanitizedHtml}
	 * @suppress {checkTypes}
	 */
	Templates.examples.greeting = function(opt_data, opt_ignored, opt_ijData) {
	  return soydata.VERY_UNSAFE.ordainSanitizedHtml('<h1>Hello World</h1>');
	};
	if (goog.DEBUG) {
	  Templates.examples.greeting.soyTemplateName = 'Templates.examples.greeting';
	}


/***/ }
/******/ ]);