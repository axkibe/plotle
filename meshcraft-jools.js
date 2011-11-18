/**
| Common Javascript Tools for Meshcraft.
|
| Authors: Axel Kittenberger
| License: GNU Affero AGPLv3
*/

/**
| Imports
*/
var config;

/**
| Exports
*/
var jools = {};

/**
| Capsule
*/
(function(){

"use strict";

/**
| In Browser this should already be defined.
*/
try {
	config = require('./config');
	// executed in Node.JS
	jools.debug  = config.debug === true || (config.debug % 4 - config.debug % 2) === 2;
} catch(e) {
	// require failed running in browser
	jools.debug  = config.debug === true || (config.debug % 2) === 1;
}

/**
| Subclassing helper.
|
| sub: prototype to become a subclass.
| base: prototype to become the baseclass.
*/
jools.subclass = function(sub, base) {
   function inherit() {}
   inherit.prototype = base.prototype;
   sub.prototype = new inherit();
   sub.prototype.constructor = sub;
}


/**
| Inspects an object and creates a descriptes string for it.
|
| This is self written instead of using the nodeJS' one, so its identical in server and browser.
| It pushes the string in serveral pars onto a.
*/
function inspect(o, a, indent) {
	if (!indent) indent = 0;
	var to = typeof(o);
	if (to === 'function')	{
		a.push('function ');
		if (o.name) a.push(o.name);
		return;
	}
	if (to === 'string' || o instanceof String) {
		a.push('"');
		a.push(o);
		a.push('"');
		return;
	}
	if (to === 'number') {
		a.push(o);
		return;
	}
	if (o === null) {
		a.push('null');
		return;
	}
	if (o instanceof Array) {
		a.push('[\n');
		for(var k = 0; k < o.length; k++) {
			if(k > 0) {
				a.push(',\n');
			}
			for (var i = 0; i < indent; i++) a.push('  ');
			inspect(o[k], a, indent + 1);
		}
		var first = true;
		for(var k in o) {
			if (typeof(k) === 'number' || parseInt(k) == k || !o.hasOwnProperty(k)) continue;
			if (first) {
				a.push('\n');
				for (var i = 0; i < indent; i++) a.push('  ');
				a.push('|\n');
				first = false;
			} else {
				a.push(',\n');
				for (var i = 0; i < indent; i++) a.push('  ');
			}
			a.push(k);
			a.push(': ');
			inspect(o[k], a, indent + 1);
			a.push('\n');
		}
		a.push('\n');
		for (var i = 0; i < indent - 1; i++) a.push('  ');
		a.push(']');
		return;
	}
	a.push('{\n');
	var first = true;
	for(var k in o) {
		if (!o.hasOwnProperty(k)) continue;
		if (first) { first = false; } else { a.push(',\n')};
		for (var i = 0; i < indent; i++) a.push('  ');
		a.push(k);
		a.push(': ');
		inspect(o[k], a, indent + 1);
	}
	a.push('\n');
	for (var i = 0; i < indent - 1; i++) a.push('  ');
	a.push('}');
}

/**
| Pushes a 2-decimal number on an array.
*/
function pushpad(a, n, s) {
	if (n < 10) a.push('0');
	a.push(n);
	a.push(s);
}

/**
| Creates a timestamp which will be returned as joinable array.
| TODO do not create the array here.
*/
function timestamp() {
	var now = new Date();
	var a = [];
	pushpad(a, now.getMonth() + 1, '-');
	pushpad(a, now.getDate(),      ' ');
	pushpad(a, now.getHours(),     ':');
	pushpad(a, now.getMinutes(),   ':');
	pushpad(a, now.getSeconds(),   ' ');
	return a;
}


/**
| Logs a number of inspected argument if category is configured to be logged.
*/
jools.log = function(category) {
	if (category !== true && !config.log.all && !config.log[category]) return;
	var a = timestamp();
	if (category !== true) {
		a.push('(');
		a.push(category);
		a.push(') ');
	}
	for(var i = 1; i < arguments.length; i++) {
		if (i > 1) a.push(' ');
		inspect(arguments[i], a);
	}
	console.log(a.join(''));
};

/**
| Export for Node.js
*/
try {
	module.exports = jools;
} catch(e) {
	// browser;
};

})();


