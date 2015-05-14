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
 * Greet a person.
 * @param name the person's first name
 */
{template .hello}
<h1>Hello {{$name}}</h1>
{/template}
```

**app.js**
```javascript
var greetPerson = require('./greetings.soy').hello;
target.innerHTML = greetPerson({ name: 'John' });
// => '<h1>Hello John</h1>'
```
