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
function configSwitchClient(param) {
	return param === true || param === 'client' || param === 'both';
}

/**
| returns true if param is true for the server
*/
function configSwitchServer(param) {
	return param === true || param === 'server' || param === 'both';
}

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
function is(o)        { return typeof(o) !== 'undefined'; }
function isnon(o)     { return typeof(o) !== 'undefined' && o !== null; }
function isInteger(o) { return typeof(o) === 'number' && Math.floor(o) === o; }
function isPath(o)    { return o instanceof Path; } // TODO .con
function isArray(o)   { return o.constructor === Array; }
function isString(o)  { return typeof(o) === 'string' || o instanceof String; }

/**
| Limits value to be between min and max
*/
function limit(min, val, max) {
	if (min > max) throw new Error('limit() min > max');
	if (val < min) return min;
	if (val > max) return max;
	return val;
}

/**
| Returns true if min <= val <= max
*/
function within(min, val, max) {
	if (val < min) return false;
	if (val > max) return false;
	return true;
}

/**
| Returns a rejection error
*/
function reject(message) {
	// in devel mode any failure is fatal.{
	if (Jools.devel) throw new Error(message); 
	log('reject', 'reject', message);
	return {ok: false, message: message};
}

/**
| Legacy | (for opera browser)
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
	}
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
function subclass(sub, base) {
	function inherit() {}
	if (base.constructor === Object) {
		// multiple inheritance
		for(var name in base) {
			for(var k in base[name].prototype) {
				if (k === 'constructor') continue;
				if(inherit.prototype[k]) {
					throw new Error('Multiple inheritance clash for '+sub+' :'+k);
				}
				inherit.prototype[k] = base[name].prototype[k];
			}
		}
	} else {
		// single inheritance
		inherit.prototype = base.prototype;
	}
	sub.prototype = new inherit();
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
| Fixates a value to an object (not changeable) and makes it non enumerable.
*/
function fixateNoEnum(obj, key, value) {
    Object.defineProperty(obj, key, {value: value});
    return value;
}

/**
| Pushes a 2-decimal number on an array.
*/
function _pushpad(a, n, s) {
	if (n < 10) a.push('0');
	a.push(n);
	a.push(s);
	return a;
}

/**
| Creates a timestamp which will be returned as joinable array.
*/
function _timestamp(a) {
	var now = new Date();
	_pushpad(a, now.getMonth() + 1, '-');
	_pushpad(a, now.getDate(),      ' ');
	_pushpad(a, now.getHours(),     ':');
	_pushpad(a, now.getMinutes(),   ':');
	_pushpad(a, now.getSeconds(),   ' ');
	return a;
}

/**
| Pushes spaces into array for indentation.
*/
function _pushindent(indent, a) {
	for (var i = 0; i < indent; i++) a.push('  ');
}

/**
| Inspects an object and creates a descriptive string for it.
|
| Self-written instead of node.JS' since not available in browser.
| Not using toJSON since that fails on circles.
| This is the jools-internal version that pushes data directly on the array stack.
*/
function _inspect(o, a, indent, circle) {
	if (circle.indexOf(o) !== -1) {
		a.push('^circle^');
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

	switch (to) {
	case 'undefined':
		a.push('undefined');
		return;
	case 'boolean':
		a.push(o ? 'true' : 'false');
		return;
	case 'function' :
		a.push('function ');
		if (o.name) a.push(o.name);
		return;
	case 'string' :
		a.push('"');
		a.push(o);
		a.push('"');
		return;
	case 'number':
		a.push(o);
		return;
	case 'null':
		a.push('null');
		return;
	case 'array' :
		a.push('[');
		if (puffed) a.push('\n');
		for(var k = 0; k < o.length; k++) {
			if(k > 0) {
				a.push(',');
				a.push(puffed ? '\n' : ' ');
			}
			if (puffed) _pushindent(indent + 1, a);
			_inspect(o[k], a, indent + 1, circle);
		}
		var first = true;
		for(var k in o) {
			if (typeof(k) === 'number' || parseInt(k) == k || !o.hasOwnProperty(k)) continue;
			if (first) {
				a.push(puffed ? '\n' : ' ');
				if (puffed) _pushindent(indent + 1, a);
				a.push('|');
				a.push(puffed ? '\n' : ' ');
				first = false;
			} else {
				a.push(',');
				a.push(puffed ? '\n' : ' ');
				if (puffed) _pushindent(indent + 1, a);
			}
			a.push(k);
			a.push(': ');
			_inspect(o[k], a, indent + 1, circle);
			a.push(puffed ? '\n' : ' ');
		}
		a.push(puffed ? '\n' : ' ');
		if (puffed) _pushindent(indent, a);
		a.push(']');
		return;
	case 'object' :
		a.push('{');
		a.push(puffed ? '\n' : ' ');
	 	var first = true;
		for(var k in o) {
			if (!o.hasOwnProperty(k)) continue;
			if (first) {
				first = false;
			} else {
				a.push(',');
				a.push(puffed ? '\n' : ' ');
			};
			if (puffed) _pushindent(indent + 1, a);
			a.push(k);
			a.push(': ');
			if (k === 'parent') {
				a.push('###');
				continue;
			}
			_inspect(o[k], a, indent + 1, circle);
		}
		a.push(puffed ? '\n' : ' ');
			if (puffed) _pushindent(indent, a);
		a.push('}');
		return;
	default :
		a.push('!!Unknown Type: ');
		a.push(to);
		a.push('!!');
	}
}

/**
| Logs a number of inspected argument if category is configured to be logged.
*/
function log(category) {
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
function inspect(o) {
	var a = [];
	_inspect(o, a, 0, []);
	return a.join('');
}

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
		if (k === 'parent') throw new Error('deepFreezing a parent?');
		deepFreeze(obj[k]);
	}
}

/**
| TODO
*/
var oleng$id = 0;

/**
| TODO
*/
function immute(obj) {
	if (obj.o$id) throw new Error('already immutable');
	var names = Object.getOwnPropertyNames(obj);
	for (var a = 0, aZ = names.length; a < aZ; a++) {
		var desc = Object.getOwnPropertyDescriptor(obj, names[a]);
		if (!desc.configurable) continue;
		desc.configurable = false;
		desc.writable = false;
		Object.defineProperty(obj, names[a], desc);
	}
    Object.defineProperty(obj, 'o$id', {value: ++oleng$id});
}

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ++Signature++
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
 Signates an entry, string index or string span.
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
function Signature(master) {
	for(var k in master) {
		if (!Object.hasOwnProperty.call(master, k)) continue;
		if (!Signature.field[k]) throw reject('invalid Signature property: '+k);
		this[k] = master[k];
	}
	for (var a = 1, aZ = arguments.length; a < aZ; a+=2) {
		var k = arguments[a];
		if (!Signature.field[k]) throw reject('invalid Signature property: '+k);
		this[k] = arguments[a + 1];
	}
	if (is(this.val)) {
		// TODO remove this evil once immutables rule
		this.val = JSON.parse(JSON.stringify(this.val));
	}
	//immute(this);
}

/**
| TODO
*/
Signature.field = {
	'path'  : true,
	'at1'   : true,
	'at2'   : true,
	'pivot' : true,
	'proc'  : true,
	'val'   : true,
}
immute(Signature.field);

/**
| Attunes '$end' ats to match a string.
*/
Signature.prototype.attune = function(str, name) {
	var at1 = this.at1;
	var at2 = this.at2;
	if (this.at1 === '$end') at1 = str.length;
	if (this.at2 === '$end') at2 = str.length;
	if (is(at1) && !within(0, at1, str.length)) throw reject(name+' at1 not within string');
	if (is(at2) && !within(0, at2, str.length)) throw reject(name+' at2 not within string');
	return new Signature(this, 'at1', at1, 'at2', at2);
}

immute(Signature.prototype);

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ++Path++
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
 Path to an entitiy.
 TODO, make immuteable?
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

/**
| Constructs a new Path.
| master can be an array or another path or null
| arguments followed by master are appended to the path
*/
function Path(master) {
	var path;
	// if true the path needs to be copied
	var copy = arguments.length > 1;

	switch(master.constructor) {
	case Path  : path = master._path; break;
	case Array : path = master; break;
	case null  : path = []; copy = false; break;
	default    :
		if (!master.parent) throw new Error('invalid path master');
		// constructs the path from an entities key chain
		path = [];
		copy = false;
		var len = 0;
		// count size
		// TODO simplify
		for(var n = master; n; n = n.parent) {
			if (n.parent) {
				path.push(null);
				len++;
			}
		}

		// reverse fills the path;
		n = master;
		for(var a = len; a > 0; a--) {
			var key = n.getOwnKey();
			if (key === null) throw new Error('Cannot get path key');
			path[--len] = key;
			n = n.parent;
		}
		break;
	}

	if (copy) path = path.slice();

	// appends additional arguments.
	for (var a = 1, aZ = arguments.length; a < aZ; a++) {
		path[path.length] = arguments[a];
	}

	// checks the path lengths
	// @@ might be needed only for copies
	for (var a = 0, aZ = path.length; a < aZ; a++) {
		if (!_isValidPathArc(path[a])) throw reject('invalid path arc');
	}

	Object.freeze(path);
	fixateNoEnum(this, '_path', path);
	immute(this);
}

/**
| Returns true is arc is a valid path arc.
*/
function _isValidPathArc(arc) {
	if (isInteger(arc)) return true;
	if (!isString(arc)) return false;
	if (arc[0] === '_') return false;
	return true;
}


/**
| Length of the signature.
*/
Object.defineProperty(Path.prototype, 'length', {
	get: function() { return this._path.length; },
});

/**
| Returns the signature at index i.
*/
Path.prototype.get = function(i) {
	if (i < 0) i += this._path.length;
	if (i < 0 || i >= this._path.length) throw new Error('invalid get');
	return this._path[i];
}

/**
| Fits the arc numeration to be in this signature.
*/
Path.prototype.fit = function(a, edge) {
	if (!is(a)) a = edge ? this._path.length : 0;
	if (a < 0) a += this._path.length;
	if (a < 0) throw new Error('invalid fit');
	return a;
}

/**
| Sets arc [i]
*/
Path.prototype.set = function(i, v) {
	var path = this._path.slice();
	if (i < 0) i += path.length;
	path[i] = v;
	return new Path(path);
}

/**
| Appends an arc
*/
Path.prototype.push = function() {
	var path = this._path.slice();
	for (var a = 0, aZ = arguments.length; a < aZ; a++) {
		path[path.length] = arguments[a];
	}
	return new Path(path);
}

/**
| Adds to integer arc[a]
*/
Path.prototype.add = function(a, v) {
	var path = this._path.slice();
	if (a < 0) a = path.length + a;
	if (!isInteger(path[a])) {
		throw new Error('cannot change non-integer arc: '+this._path[a]);
	}
	path[a] += v;
	return new Path(path);
}

/**
| True if this path is the same as another.
*/
Path.prototype.equals = function(o) {
	if (this._path.length !== o._path.length) return false;
	for(var k in this._path) {
		if (this._path[k] !== o._path[k]) return false;
	}
	return true;
}

/**
| True if this path is a subpath of another.
|
| o: the other path
| [len]: the length of this path to consider.
*/
Path.prototype.like = function(o, len) {
	if (!is(len)) len  = this.length;
	if (len < 0)  len += this.length;
	if (len < 0)  len  = 0;

	if (len > o.length) return false;
	for(var i = 0; i < len; i++) {
		if (this._path[i] !== o._path[i]) return false;
	}
	return true;
}


/**
| stringify
*/
Path.prototype.toString = function() {
	throw new Error("is this used?");
	return this._path.toString();
}

/**
| jsonfy
*/
Path.prototype.toJSON = function() {
	return this._path;
}


/**
| Exports
*/
Jools = {
	Path               : Path,
	Signature          : Signature,

	clone              : clone,
	configSwitchClient : configSwitchClient,
	configSwitchServer : configSwitchServer,
	debug              : debug,
	deepFreeze         : deepFreeze,
	devel              : devel,
	fixate             : fixate,
	fixateNoEnum       : fixateNoEnum,
	inspect            : inspect,
	is                 : is,
	isnon              : isnon,
	isInteger          : isInteger,
	isPath             : isPath,
	isString           : isString,
	limit              : limit,
	log                : log,
	reject             : reject,
	subclass           : subclass,
};

if (typeof(window) === 'undefined') {
	module.exports = Jools;
}

})();


