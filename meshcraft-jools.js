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

var devel;

/**
| Running in node or browser?
*/
var inNode = true; try { module } catch (e) { inNode = false; }

if (inNode) {
	config = require('./config');
	devel = config.devel === true || config.devel === 'both' || config.devel === 'server';
} else { // inBrowser
	devel = config.devel === true || config.devel === 'both' || config.devel === 'client';
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
	if (jools.devel) {
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
	if (category === 'fail') {
		console.log('FAIL'); // TODO BREAKPOINT
	}
	if (category !== true && !config.log.all && !config.log[category]) return;
	var a = timestamp();
	if (category !== true) {
		a.push('(');
		a.push(category);
		a.push(') ');
	}
	for(var i = 1; i < arguments.length; i++) {
		if (i > 1) a.push(' ');
		a.push(JSON.stringify(arguments[i], null, config.jspacon ? config.jspacon : null));
	}
	console.log(a.join(''));
};

/**
| Shortcut for log('debug', ...);
*/
function debug() {
	if (!config.log.debug) return;
	var a = timestamp();
	a.push('(debug) ');
	for(var i = 0; i < arguments.length; i++) {
		if (i > 0) a.push(' ');
		a.push(JSON.stringify(arguments[i], null, config.jspacon ? config.jspacon : null));
	}
	console.log(a.join(''));
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
	if (is(master.val))   this.val   = master.val;
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
	if (master instanceof Path) master = master._path;
	if (!(master instanceof Array)) {
		log('fail', 'master:', master);
		throw new Error('invalid path master');
	}

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
jools = {
	Path          : Path,
	Signature     : Signature,

	clone         : clone,
	debug         : debug,
	deepFreeze    : deepFreeze,
	devel         : devel,
	fixate        : fixate,
	fixateNoEnum  : fixateNoEnum,
	is            : is,
	isnon         : isnon,
	isString      : isString,
	isInteger     : isInteger,
	log           : log,
	reject        : reject,
	subclass      : subclass,
};

if (inNode) {
	module.exports = jools;
}

})();


