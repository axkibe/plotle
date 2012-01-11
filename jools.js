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
	config = require('./config');
	devel  = configSwitchServer(config.devel);
	puffed = configSwitchServer(config.puffed);
} else { // inBrowser
	devel  = configSwitchClient(config.devel);
	puffed = configSwitchClient(config.puffed);
}

/**
| Testers
*/
function is(o)        { return typeof(o) !== 'undefined'; }
function isnon(o)     { return typeof(o) !== 'undefined' && o !== null; }
function isString(o)  { return typeof(o) === 'string' || o instanceof String; }
function isInteger(o) { return typeof(o) === 'number' && Math.floor(o) === o; }

/**
| Returns a rejection error
*/
function reject(message) {
	if (Jools.devel) {
		throw new Error(message); // in devel mode any failure is fatal.
	}
	log('reject', 'reject', message);
	return {ok: false, message: message};
}

/**
| Legacy
| (Opera Browser)
*/
if (!Object.defineProperty) {
	console.log('Using legacy Object.defineProperty');
	Object.defineProperty = function(obj, label, funcs) {
		if (typeof(funcs.value) !== 'undefined') {
			obj[label] = funcs.value;
			return;
		}
		if (funcs.get) {
			obj.__defineGetter__(label, funcs.get);
		}
		if (funcs.set) {
			obj.__defineSetter__(label, funcs.set);
		}
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
| Turns an object to it JSON representation (as objects yet, not string)
*/
function jsonfy(obj) {
	if (typeof(obj) === 'undefined' || obj === null) return obj;
	if (obj.toJSON) obj = obj.toJSON();
	return obj;
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
| Self-written instead of nodeJS` since not available in browser. Not using toJSON since
| that fails on circles. This is the jools-internal version that pushes directly on the
| stack.
*/
function _inspect(o, a, indent) {
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
			_inspect(o[k], a, indent + 1);
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
			_inspect(o[k], a, indent + 1);
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
			_inspect(o[k], a, indent + 1);
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
		console.log('FAIL'); // TODO BREAKPOINT
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
		_inspect(arguments[i], a, 0);
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
		if (i > 1) a.push(' ');
		_inspect(arguments[i], a, 0);
	}
	console.log(a.join(''));
}

/**
| Returns a descriptive string for an object.
*/
function inspect(o) {
	var a = [];
	_inspect(o, a, 0);
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


/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ++Signature++
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
 Signates an entry, string index or string span.
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
function Signature(master) {
	if (is(master.path))  this.path  = new Path(master.path);
	if (is(master.at1))   this.at1   = master.at1;
	if (is(master.at2))   this.at2   = master.at2;
	if (is(master.pivot)) this.pivot = master.pivot;
	if (is(master.proc))  this.proc  = master.proc;
	if (is(master.val))   this.val   = JSON.parse(JSON.stringify(master.val));
}

/**
| Attunes '$end' ats to match a string.
*/
Signature.prototype.attune = function(str, name) {
	if (this.at1 === '$end') this.at1 = str.length;
	if (this.at2 === '$end') this.at2 = str.length;
	if(is(this.at1) && (this.at1 < 0 || this.at1 > str.length))
		throw reject(name+' at1 not within string');
	if(is(this.at2) && (this.at2 < 0 || this.at2 > str.length))
		throw reject(name+' at2 not within string');
	return this;
}

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ++Path++
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
 Path to a node.
 TODO, make immuteable?
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
function Path(master) {
	if (master instanceof Path) {
		master = master._path;
	}

	if (master instanceof Array) {
		for (var i = 0, mlen = master.length; i < mlen; i++) {
			var v = master[i];
			if (isInteger(v)) continue;
			if (isString(v)) {
				if (v[0] === '_') throw reject('Path arcs must not start with _');
				continue;
			}
			throw reject('Path arcs must be String or Integer');
		}
		this._path = master.slice();
	} else if (master.key$ && master.parent) {
		var path = [];
		var len = 0;
		// count size
		for(var n = master; n; n = n.parent) {
			if (n.parent) {
				path.push(null);
				len++;
			}
		}
		// reverse fill the path;
		n = master;
		for(var i = len; i > 0; i--) {
			if (n.parent && n.parent.get(n.key$) !== n) {
				throw new Error('cogging defect');
			}
			path[--len] = n.key$;
			n = n.parent;
		}
		this._path = path;
	} else {
		log('fail', 'master:', master);
		throw new Error('invalid path master');
	}
}

/**
| Length of the signature.
*/
Object.defineProperty(Path.prototype, 'length', {
	get: function() {
		if (!this._path) {
			debug('NO PATH');
		}
		return this._path.length;
	},
});

/**
| Returns the signature at index i.
*/
Path.prototype.get = function(i) {
	if (i < 0) i += this._path.length;
	if (i < 0) return undefined;
	return this._path[i];
}

/**
| Fits the arc numeration to be in this signature.
*/
Path.prototype.fit = function(a, edge) {
	if (!is(a)) a = edge ? this._path.length : 0;
	if (a < 0) a += this._path.length;
	if (a < 0) a = 0;
	return a;
}

/**
| Sets arc i
*/
Path.prototype.set = function(i, v) {
	if (i < 0) i += this._path.length;
	return this._path[i] = v;
}

/**
| Adds to integer arc i
*/
Path.prototype.add = function(i, v) {
	if (i < 0) i = this._path.length + i;
	if (!isInteger(this._path[i])) {
		throw new Error('cannot change non-integer arc: '+this._path[i]);
	}
	return this._path[i] += v;
}

/**
| True if this path is the same as another.
*/
Path.prototype.equals = function(o, len) {
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
| [slen]: the length of this path to consider.
*/
Path.prototype.like = function(o, slen) {
	if (!is(slen)) slen  = this.length;
	if (slen < 0)  slen += this.length;
	if (slen < 0)  slen  = 0;

	if (slen > o.length) return false;
	for(var i = 0; i < slen; i++) {
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
	isString           : isString,
	isInteger          : isInteger,
	jsonfy             : jsonfy,
	log                : log,
	reject             : reject,
	subclass           : subclass,
};

if (typeof(window) === 'undefined') {
	module.exports = Jools;
}

})();


