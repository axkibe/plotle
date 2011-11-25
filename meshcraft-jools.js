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
var jools;

/**
| Capsule
*/
(function(){

"use strict";

var debug;

/**
| In Browser this should already be defined.
*/
try {
	config = require('./config');
	// executed in Node.JS
	debug  = config.debug === true || (config.debug % 4 - config.debug % 2) === 2;
} catch(e) {
	// require failed running in browser
	debug  = config.debug === true || (config.debug % 2) === 1;
}

/**
| Subclassing helper.
|
| sub: prototype to become a subclass.
| base: prototype to become the baseclass.
*/
function subclass(sub, base) {
   function inherit() {}
   inherit.prototype = base.prototype;
   sub.prototype = new inherit();
   sub.prototype.super = base.prototype;
   sub.prototype.constructor = sub;
}


/**
| Fixates a value to an object (not changeable)
*/
function fixate(obj, key, value) {
    Object.defineProperty(obj, key, {enumerable: true, value: value});
    return value;
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
function log(category) {
	if (category !== true && !config.log.all && !config.log[category]) return;
	var a = timestamp();
	if (category !== true) {
		a.push('(');
		a.push(category);
		a.push(') ');
	}
	for(var i = 1; i < arguments.length; i++) {
		if (i > 1) a.push(' ');
		a.push(JSON.stringify(arguments[i], null, ". "));
	}
	console.log(a.join(''));
};

/**
| Deep copies an object.
*/
function clone(original) {
	//return JSON.parse(JSON.stringify(original));
	if(typeof(original) !== 'object' || original === null) {
		return original;
	}

	if (original.clone) return new original.clone();

	var copy = original.constructor();
	for(var k in original) {
		copy[k] = clone(original[k]);
	}
	return copy;
}

/**
| Deep freezes an object.
*/
function deepFreeze(obj) {
	if (typeof(obj) !== 'object' || obj === null) return;
	Object.freeze(obj);
	for (var k in obj) {
		deepFreeze(obj[k]);
	}
}

/**
| Exports
*/
jools = {
	clone      : clone,
	debug      : debug,
	deepFreeze : deepFreeze,
	fixate     : fixate,
	log        : log,
	subclass   : subclass,
};

try {
	module.exports = jools;
} catch(e) {
	// browser;
};

})();


