var greetPerson = require('./greetings.soy').hello;
// => '<h1>Hello World</h1>'

document.getElementById('target').innerHTML = greetPerson({
	name: 'John'
});
