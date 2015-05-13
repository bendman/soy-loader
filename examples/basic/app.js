var templates = require('./greeting.soy');

document.getElementById('target').innerHTML = templates.examples.greeting();
