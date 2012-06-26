/**                                                      _.._
                                                      .-'_.._''.
 __  __   ___       _....._              .          .' .'     '.\
|  |/  `.'   `.   .'       '.          .'|         / .'                                _.._
|   .-.  .-.   ' /   .-'"'.  \        (  |        . '            .-,.-~.             .' .._|    .|
|  |  |  |  |  |/   /______\  |        | |        | |            |  .-. |    __      | '      .' |_
|  |  |  |  |  ||   __________|    _   | | .'''-. | |            | |  | | .:-`.'.  __| |__  .'     |
|  |  |  |  |  |\  (          '  .' |  | |/.'''. \. '            | |  | |/ |   \ ||__   __|'-..  .-'
|  |  |  |  |  | \  '-.___..-~. .   | /|  /    | | \ '.         .| |  '- `" __ | |   | |      |  |
|__|  |__|  |__|  `         .'.'.'| |//| |     | |  '. `.____.-'/| |      .'.''| |   | |      |  |
                   `'-.....-.'.'.-'  / | |     | |    `-._____ / | |     / /   | |_  | |      |  '.'
                                 \_.'  | '.    | '.           `  |_|     \ \._,\ '/  | |      |   /
                                       '___)   '___)                      `~~'  `"   |_|      `--'

                                          .-,--.     .  .
                                           '|__/ ,-. |- |-.
                                           ,|    ,-| |  | |
                                           `'    `-^ `' ' '
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

 Paths describe places in a tree.

 Authors: Axel Kittenberger
 License: MIT(Expat), see accompanying 'License'-file

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

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
var immute       = Jools.immute;
var innumerable  = Jools.innumerable;
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
	var copy = arguments.length > 1;

	switch(model.constructor) {
	case Path  :
		path = (copy) ? (model._path.slice()) : (model._path);
		break;
	case Array :
		path = (copy) ? (model.slice()) : (model);
		break;
	case null  :
		path = [];
		break;
	default :
		throw new Error('invalid path-model');
	}

	// length of model
	var mlen = path.length;

	// appends additional arguments
	var a = 1, aZ = arguments.length;
	while(a < aZ && arguments[a] !== '--' && arguments[a] !== '++') {
		var k = arguments[a];
		if (k < 0) k += mlen;
		if (k < 0) throw new Error('invalid path key');

		_checkValidPathArc(arguments[a + 1]);

		path[k] = arguments[a + 1];
		a += 2;
	}

	if (arguments[a] === '--') {
		var s = arguments[a + 1];
		path.splice(path.length - s, s);
		a += 2;
	}

	if (arguments[a] === '++') {
		for(a++; a < aZ; a++) {
			_checkValidPathArc(arguments[a]);
			path[path.length] = arguments[a++];
		}
	}

	// TODO might change Path to be child of Array.
	Object.freeze(path);
	innumerable(this, '_path', path);
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
var _checkValidPathArc = function(arc) {
	if (!isString(arc))
		{ throw new Error('Path arc not a string'); }

	if (arc[0] === '_')
		{ throw new Error('Path arc begins with "_"'); }
};

/**
| Length of the signature.
| TODO lazy fixate
*/
Object.defineProperty(Path.prototype, 'length', {
	get: function() { return this._path.length; }
});

/**
| Returns the signature at index i.
*/
Path.prototype.get = function(i) {
	if (i < 0)
		{ i += this._path.length; }

	if (i < 0 || i >= this._path.length)
		{ throw new Error('invalid get'); }

	return this._path[i];
};

/**
| True if this path is the same as another.
*/
Path.prototype.equals = function(o) {
	if (!o)
		{ return false; }

	if (this._path.length !== o._path.length)
		{ return false; }

	for(var k in this._path) {
		if (this._path[k] !== o._path[k])
			{ return false; }
	}

	return true;
};

/**
| True if this path is a subPath of another.
|
| o: the other path
| [len]: the length of this path to consider.
*/
Path.prototype.subPathOf = function(o, len) {
	if (!is(len)) {
		len  = this._path.length;
	} else {
		if (len < 0) len += this._path.length;
		if (len < 0) throw new Error('subPathOf out of range');
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
	return '[' + this._path.toString() + ']';
};

/**
| Jsonfy.
*/
Path.prototype.toJSON = function() {
	return this._path;
};

/**
| Node export
*/
if (typeof(window) === 'undefined')
	{ module.exports = Path; }

})();

