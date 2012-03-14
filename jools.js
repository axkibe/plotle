/**
| Common Javascript Tools for Meshcraft.
|
| Authors: Axel Kittenberger
| License: MIT(Expat), see accompanying 'License'-file
*/

/**
| Imports
*/
var config;

/**
| Exports
*/
var Jools;

/**
| Capsule
*/
(function(){

"use strict";

/**
| Config variables
*/
var devel;
var puffed;

/**
| returns true if param is true for the client
*/
var configSwitchClient = function(param) {
	return param === true || param === 'client' || param === 'both';
};

/**
| returns true if param is true for the server
| TODO combine with configSwitchClient into one function
*/
var configSwitchServer = function(param) {
	return param === true || param === 'server' || param === 'both';
};

/**
| Running in node or browser?
*/
if (typeof(window) === 'undefined') {
	// in node
	config = require('./config');
	devel  = configSwitchServer(config.devel);
	puffed = configSwitchServer(config.puffed);
} else {
	// ini browser
	devel  = configSwitchClient(config.devel);
	puffed = configSwitchClient(config.puffed);
}

/**
| Testers
*/
var is        = function(o) { return typeof(o) !== 'undefined'; };
var isnon     = function(o) { return typeof(o) !== 'undefined' && o !== null; };
var isInteger = function(o) { return typeof(o) === 'number' && Math.floor(o) === o; };
var isArray   = function(o) { return o.constructor === Array; };
var isString  = function(o) { return typeof(o) === 'string' || o instanceof String; };

/**
| Limits value to be between min and max
*/
var limit = function(min, val, max) {
	if (min > max) throw new Error('limit() min > max');
	if (val < min) return min;
	if (val > max) return max;
	return val;
};

/**
| Returns true if min <= val <= max
*/
var within = function(min, val, max) {
	if (val < min) return false;
	if (val > max) return false;
	return true;
};

/**
| Returns a rejection error
*/
var reject = function(message) {
	// in devel mode any failure is fatal.{
	if (Jools.devel) throw new Error(message);
	log('reject', 'reject', message);
	return {ok: false, message: message};
};

/**
| Legacy (for opera browser)
*/
if (!Object.defineProperty) {
	console.log('Using legacy Object.defineProperty');
	Object.defineProperty = function(obj, label, funcs) {
		if (typeof(funcs.value) !== 'undefined') {
			obj[label] = funcs.value;
			return;
		}
		if (funcs.get) obj.__defineGetter__(label, funcs.get);
		if (funcs.set) obj.__defineSetter__(label, funcs.set);
	};
}

if (!Object.freeze) {
	console.log('Using legacy Object.freeze');
	Object.freeze = function(obj) {};
}


/**
| Subclassing helper.
|
| sub: prototype to become a subclass.
| base: either a prototype to become the base.
|       or a table of prototype to become the base for multiple
|       inheritance.
*/
var subclass = function(sub, base) {
	function Inherit() {}
	if (base.constructor === Object) {
		// multiple inheritance
		for(var name in base) {
			for(var k in base[name].prototype) {
				if (k === 'constructor') continue;
				if(Inherit.prototype[k]) {
					throw new Error('Multiple inheritance clash for '+sub+' :'+k);
				}
				Inherit.prototype[k] = base[name].prototype[k];
			}
		}
	} else {
		// single inheritance
		Inherit.prototype = base.prototype;
	}
	sub.prototype = new Inherit();
	sub.prototype.constructor = sub;
};

/**
| Fixates a value to an object (not changeable)
*/
var fixate = function(obj, key, value) {
    Object.defineProperty(obj, key, {enumerable: true, value: value});
    return value;
};

/**
| Fixates a value to an object (not changeable) and makes it non enumerable.
*/
var fixateNoEnum = function(obj, key, value) {
    Object.defineProperty(obj, key, {value: value});
    return value;
};

/**
| Copies one object (not deep!)
|
| o ... the object to copy from
| c ... the object to copy into
*/
var copy = function(o, c) {
	for (var k in o) {
		if (!Object.hasOwnProperty.call(o, k)) continue;
		c[k] = o[k];
	}
	return c;
};


/**
| Returns true if this node matches a master or a node of equal class
*/
var matches = function(twig1, twig2) {
	if (twig1 === twig2) return true;
	switch(twig1.constructor) {
	case String : return false;
	case Number : return false;
	}

	var k1 = Object.keys(twig1);
	var k2 = Object.keys(twig2);
	if (k1.length !== k2.length) { return false; }
	for (var a = 0, aZ = k1.length; a < aZ; a++) {
		var k = k1[a];
		if (!matches(twig1[k], twig2[k])) return false;
	}
	return true;
};

/**
| Pushes a 2-decimal number on an array.
*/
var _pushpad = function(a, n, s) {
	if (n < 10) a.push('0');
	a.push(n);
	a.push(s);
	return a;
};

/**
| Creates a timestamp which will be returned as joinable array.
*/
var _timestamp = function(a) {
	var now = new Date();
	_pushpad(a, now.getMonth() + 1, '-');
	_pushpad(a, now.getDate(),      ' ');
	_pushpad(a, now.getHours(),     ':');
	_pushpad(a, now.getMinutes(),   ':');
	_pushpad(a, now.getSeconds(),   ' ');
	return a;
};

/**
| Pushes spaces into array for indentation.
*/
var _pushindent = function(indent, a) {
	for (var i = 0; i < indent; i++) a.push('  ');
};

/**
| Inspects an object and creates a descriptive string for it.
|
| Self-written instead of node.JS' since not available in browser.
| Not using toJSON since that fails on circles.
| This is the jools-internal version that pushes data directly on the array stack.
*/
var _inspect = function(o, array, indent, circle) {
	if (circle.indexOf(o) !== -1) {
		array.push('^circle^');
		return;
	}
	circle = circle.slice();
	circle.push(o);

	if (!indent) indent = 0;
	if (o && o.toJSON) o = o.toJSON();
	var to = typeof(o);

	if (to === 'undefined') {}
	else if (o === null) to = 'null';
	else {
		switch(o.constructor) {
		case String : to = 'string'; break;
		case Array  : to = 'array';  break;
		}
	}

	var k, first;
	switch (to) {
	case 'undefined': array.push('undefined'); return;
	case 'boolean'  : array.push(o ? 'true' : 'false'); return;
	case 'function' : array.push('function '); if (o.name) array.push(o.name); return;
	case 'string'   : array.push('"', o, '"'); return;
	case 'number'   : array.push(o); return;
	case 'null'     : array.push('null'); return;
	case 'array' :
		array.push('[');
		if (puffed) array.push('\n');
		for(var a = 0, aZ = o.length; a < aZ; a++) {
			if(a > 0) {
				array.push(',');
				array.push(puffed ? '\n' : ' ');
			}
			if (puffed) _pushindent(indent + 1, array);
			_inspect(o[a], array, indent + 1, circle);
		}
		first = true;
		for(k in o) {
			if (typeof(k) === 'number' || parseInt(k, 10) == k || !o.hasOwnProperty(k)) continue;
			if (first) {
				array.push(puffed ? '\n' : ' ');
				if (puffed) _pushindent(indent + 1, array);
				array.push('|');
				array.push(puffed ? '\n' : ' ');
				first = false;
			} else {
				array.push(',');
				array.push(puffed ? '\n' : ' ');
				if (puffed) _pushindent(indent + 1, array);
			}
			array.push(k);
			array.push(': ');
			_inspect(o[k], array, indent + 1, circle);
			array.push(puffed ? '\n' : ' ');
		}
		array.push(puffed ? '\n' : ' ');
		if (puffed) _pushindent(indent, array);
		array.push(']');
		return;
	case 'object' :
		array.push('{', puffed ? '\n' : ' ');
		first = true;
		for(k in o) {
			if (!o.hasOwnProperty(k)) continue;
			if (!first) array.push(',', puffed ? '\n' : ' '); else first = false;
			if (puffed) _pushindent(indent + 1, array);
			array.push(k, ': ');
			if (k === 'parent') {
				array.push('###');
				continue;
			}
			_inspect(o[k], array, indent + 1, circle);
		}
		array.push(puffed ? '\n' : ' ');
		if (puffed) _pushindent(indent, array);
		array.push('}');
		return;
	default :
		array.push('!!Unknown Type: ', to, '!!');
	}
};

/**
| Logs a number of inspected argument if category is configured to be logged.
*/
var log = function(category) {
	if (category === 'fail') {
		console.log('FAIL'); // TODO Just a line for breakpoints.
	}
	if (category !== true && !config.log.all && !config.log[category]) return;
	var a = _timestamp([]);
	if (category !== true) {
		a.push('(');
		a.push(category);
		a.push(') ');
	}
	for(var i = 1; i < arguments.length; i++) {
		if (i > 1) a.push(' ');
		_inspect(arguments[i], a, 0, []);
	}
	console.log(a.join(''));
};

/**
| Shortcut for log('debug', ...);
*/
function debug() {
	if (!config.log.debug) return;
	var a = _timestamp([]);
	a.push('(debug) ');
	for(var i = 0; i < arguments.length; i++) {
		if (i > 0) a.push(' ');
		_inspect(arguments[i], a, 0, []);
	}
	console.log(a.join(''));
}

/**
| Returns a descriptive string for an object.
*/
var inspect = function(o) {
	var a = [];
	_inspect(o, a, 0, []);
	return a.join('');
};

/**
| TODO
*/
var oleng$id = 0;

/**
| TODO
*/
var immute = function(obj) {
	if (obj._$id) throw new Error('already immutable');
	var names = Object.getOwnPropertyNames(obj);
	for (var a = 0, aZ = names.length; a < aZ; a++) {
		var desc = Object.getOwnPropertyDescriptor(obj, names[a]);
		if (!desc.configurable) continue;
		desc.configurable = false;
		desc.writable = false;
		Object.defineProperty(obj, names[a], desc);
	}
    Object.defineProperty(obj, '_$id', {value: ++oleng$id});
	return obj;
};

/**
| Exports
*/
Jools = {
	configSwitchClient : configSwitchClient,
	configSwitchServer : configSwitchServer,
	copy               : copy,
	debug              : debug,
	devel              : devel,
	fixate             : fixate,
	fixateNoEnum       : fixateNoEnum,
	inspect            : inspect,
	is                 : is,
	isnon              : isnon,
	isArray            : isArray,
	isInteger          : isInteger,
	isString           : isString,
	immute             : immute,
	limit              : limit,
	log                : log,
	matches            : matches,
	reject             : reject,
	subclass           : subclass
};

if (typeof(window) === 'undefined') {
	module.exports = Jools;
}

})();


