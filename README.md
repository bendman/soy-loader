# soy loader for webpack

This is for compiling and loading Google Closure Templates (*.soy* files) into [webpack](http://webpack.github.io/docs/what-is-webpack.html) builds. The loader also shims compiled soy, which is normally revealed globally, and instead returns imported soy namespaces as a module to be consume by webpack.

## Installation

`npm i soy-loader --save-dev`

## Usage

[Documentation: Using loaders](http://webpack.github.io/docs/using-loaders.html)

[Documentation: Google Closure Templates Templates](https://developers.google.com/closure/templates/index)

```javascript
var templates = require('soy!./templates.soy');
// => returns an object for the template namespace.
```

### Example

**webpack.config.js**
```javascript
module.exports = {
	// ...
	module: {
		loaders: [
			// ...
			{ test: /\.soy$/, loader: 'soy-loader' }
		]
	}
};

```

**greetings.soy**
```
{namespace greetingTemplates}

/**
 * This is an example template without variables.
 */
{template .hello}
<h1>Hello World</h1>
{/template}
```

**app.js**
```javascript
var renderedGreeting = require('./greetings.soy').hello();
// => '<h1>Hello World</h1>'
```
