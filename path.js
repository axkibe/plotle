/**
| Meshcraft Path.
|
| Authors: Axel Kittenberger
| License: MIT(Expat), see accompanying 'License'-file
*/

/**
| Imports
*/
var Jools;

/**
| Exports
*/
var Path;

/**
| Capsule
*/
(function () {
"use strict";
if (typeof (window) === 'undefined') { Jools  = require('./jools'); }

var copy         = Jools.copy;
var	debug        = Jools.debug;
var fixate       = Jools.fixate;
var fixateNoEnum = Jools.fixateNoEnum;
var immute       = Jools.immute;
var	is           = Jools.is;
var	isnon        = Jools.isnon;
var	isInteger    = Jools.isInteger;
var	isString     = Jools.isString;
var	log          = Jools.log;
var	reject       = Jools.reject;
var	subclass     = Jools.subclass;

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 .-,--.     .  .
  '|__/ ,-. |- |-.
  ,|    ,-| |  | |
  `'    `-^ `' ' '
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

 Path to an entitiy.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
/**
| Constructs a new Path.
| model can be an array or another path or null
| arguments followed by master are appended to the path
*/
Path = function(model) {
	var path;
	// if true the path needs to be copied
	var slice = arguments.length > 1;
	switch(model.constructor) {
	case Path  : path = model._path; break;
	case Array : path = model; break;
	case null  : path = []; slice = false; break;
	default    : throw new Error('invalid path-model');
	}

	var mlen = path.length; // length of model
	if (slice) path = path.slice();

	// appends additional arguments
	var a = 1, aZ = arguments.length;
	while(a < aZ && arguments[a] !== '--' && arguments[a] !== '++') {
		var k = arguments[a];
		if (k < 0) k += mlen;
		if (k < 0) throw new Error('invalid path key');
		path[k] = arguments[a + 1];
		a += 2;
	}
	if (arguments[a] === '--') {
		var short = arguments[a + 1];
		path.splice(path.length - short, short);
		a += 2;
	}
	if (arguments[a] === '++') {
		a++;
		while (a < aZ) path[path.length] = arguments[a++];
	}

	// checks the path arcs
	// @@ might be needed only for copies
	for (a = 0, aZ = path.length; a < aZ; a++) {
		if (!_isValidPathArc(path[a])) throw reject('invalid path arc: '+path[a]);
	}

	// @@ might change Path to be child of Array.
	Object.freeze(path);
	fixateNoEnum(this, '_path', path);
	immute(this);
};

/**
| Returns true if o is a path
*/
Path.isPath = function(o) {
	return o.constructor === Path;
};

/**
| Returns true is arc is a valid path arc.
*/
var _isValidPathArc = function(arc) {
	if (isInteger(arc)) return true;
	if (!isString(arc)) return false;
	if (arc[0] === '_') return false;
	if (arc === 'copse') { throw new Error('copse in Path'); }  // TODO remove this later
	if (arc === 'ranks') { throw new Error('ranks in Path'); }  // TODO remove this later
	return true;
};


/**
| Length of the signature.
*/
Object.defineProperty(Path.prototype, 'length', {
	get: function() { return this._path.length; }
});

/**
| Returns the signature at index i.
*/
Path.prototype.get = function(i) {
	if (i < 0) i += this._path.length;
	if (i < 0 || i >= this._path.length) throw new Error('invalid get');
	return this._path[i];
};

/**
| Fits the arc numeration to be in this signature.
| TODO remove?
*/
/*
Path.prototype.fit = function(a, edge) {
	if (!is(a)) a = edge ? this._path.length : 0;
	if (a < 0) a += this._path.length;
	if (a < 0) throw new Error('invalid fit');
	return a;
}*/

/**
| Returns new path with arc i set to v.
*/
/*Path.prototype.set = function(i, v) {
	if (i < 0) i += path.length;
	return new Path(this, i, v);
};
*/

/**
| Appends an arc
| TODO move into constructor
*/
/*Path.prototype.push = function() {
	var path = this._path.slice();
	for (var a = 0, aZ = arguments.length; a < aZ; a++) {
		path[path.length] = arguments[a];
	}
	return new Path(path);
}*/

/**
| Adds to integer arc[a]
| TODO remove
*/
/*Path.prototype.add = function(a, v) {
	var path = this._path.slice();
	if (a < 0) a = path.length + a;
	if (!isInteger(path[a])) {
		throw new Error('cannot change non-integer arc: '+this._path[a]);
	}
	path[a] += v;
	return new Path(path);
}*/

/**
| True if this path is the same as another.
*/
Path.prototype.equals = function(o) {
	if (this._path.length !== o._path.length) return false;
	for(var k in this._path) {
		if (this._path[k] !== o._path[k]) return false;
	}
	return true;
};

/**
| True if this path is a subpath of another.
|
| o: the other path
| [len]: the length of this path to consider.
*/
Path.prototype.subpathOf = function(o, len) {
	if (!is(len)) {
		len  = this._path.length;
	} else {
		if (len < 0) len += this._path.length;
		if (len < 0) throw new Error('subpathOf out of range');
	}

	if (len > o._path.length) return false;
	for(var a = 0; a < len; a++) {
		if (this._path[a] !== o._path[a]) return false;
	}
	return true;
};

/**
| Turns the path to a String.
*/
Path.prototype.toString = function() {
	return '['+this._path.toString()+']';
};

/**
| Jsonfy.
*/
Path.prototype.toJSON = function() {
	return this._path;
};


if (typeof(window) === 'undefined') { module.exports = Path; }

})();

