/**
| Meshcraft Tree structure.
|
| Authors: Axel Kittenberger
| License: MIT(Expat), see accompanying 'License'-file
*/

/**
| Imports
*/
var Jools;
var Path;

/**
| Exports
*/
var Tree;

/**
| Capsule
*/
(function () {
"use strict";
if (typeof (window) === 'undefined') {
	// node imports
	Jools  = require('./jools');
	Path   = require('./path');
}

var copy         = Jools.copy;
var	debug        = Jools.debug;
var immute       = Jools.immute;
var	is           = Jools.is;
var	isnon        = Jools.isnon;
var isArray      = Jools.isArray;
var	isInteger    = Jools.isInteger;
var	isString     = Jools.isString;
var	log          = Jools.log;
var	reject       = Jools.reject;
var isPath       = Path.isPath;

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ,--,--'
 `- | . , , . ,-.
  , | |/|/  | | |
  `-' ' '   ' `-|
~ ~ ~ ~ ~ ~ ~ ~,| ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
               `'
 The base of all meshcraft-nodes.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

var Twig = function () { };

/**
| Returns the rank of the key (Returns the index of key in the alley)
*/
Twig.prototype.rank = function(key) {
	var alley = this.alley;
	if (!isArray(alley)) throw new Error('twig has no alley');
	// TODO caching!
	if (!is(this.copse[key])) return -1;
	return alley.indexOf(key);
};

/**
| Returns the twig that has rank r
*/
Twig.prototype.at = function(r) {
	var alley = this.alley;
	if (!isArray(alley)) throw new Error('twig has no alley');
	var k = alley[r];
	if (!is(k)) throw new Error('at, invalid index');
	return this.copse[k];
};

/**
| Returns the amount of ranks (length of the alley)
*/
Twig.prototype.ranks = function() {
	var alley = this.alley;
	if (!isArray(alley)) throw new Error('twig has no alley');
	return this.alley.length;
};

/**
| Returns a key not used in the copse
*/
Twig.prototype.vacantKey = function() {
	var copse = this.copse, inc = 1, sInc;
	while(is(copse[(sInc = '' + inc)])) inc++;
	return sInc;
};

/**
| Gets the twigs type
*/
var twigtype = function(o) {
	switch(o.constructor) {
	case Array  : return 'Array';
	case Number : return 'Number';
	case String : return 'String';
	default     : return o.type;
	}
};

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 +++Tree+++
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

 A meshcraft data tree.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
/**
| Constructor.
|
| TODO
*/
Tree = function(root, pattern) {
	this.pattern = pattern;
	this.root = this.grow(root);
};

/**
| Returns the pattern for object o
*/
Tree.prototype.getPattern = function(o) {
	return this.pattern[twigtype(o)];
};

/**
| Grows new twigs.
|
| The model is copied and extended by additional arguments.
|
| mandatory arguments:
|    model : the model to copy
|
| additional arguments:
|    'key', value        sets [key] = value
|    '+', key, value     inserts a key if this an array.
|    '-', key            removes a key if this an array,
|    '--', count         shortens an array by count.
|    '++', values...     for an array everything after '++' is extended.
*/
Tree.prototype.grow = function(model /*, ... */) {
	var a, aZ = arguments.length;
	if (model._$grown && aZ === 1) return model;
	var twig, k, k1, k2, val, vtype;
	var ttype = twigtype(model);

	log('grow', ttype, arguments);

	var pattern = this.pattern[ttype];
	if (!pattern) throw reject('cannot grow type: '+ttype);

	// copies the model
	twig = copy(model, new Twig());

	if (pattern.copse) twig.copse = model.copse ? copy(model.copse, {}) : {};
	if (pattern.alley) twig.alley = model.alley ? model.alley.slice()   : [];

	// applies changes specified by the arguments
	a = 1;
	while(a < aZ && arguments[a] !== '++' && arguments[a] !== '--') {
		k = arguments[a];
		k1 = arguments[a + 1];
		switch(k) {
		case '+' :
			if (!pattern.alley) throw reject('"+": '+ttype+' has no alley');
			k2 = arguments[a + 2];
			if (!isInteger(k1)) throw reject('"+": key must be an Integer');
			if (!isString (k2)) throw reject('"+": value must be a String');
			twig.alley.splice(k1, 0, k2);
			a += 3;
			break;
		case '-' :
			if (!pattern.alley) throw reject('"-": '+ttype+' has no alley');
			if (!isInteger(k1)) throw reject('"-": key must be an Integer');
			twig.alley.splice(k1, 1);
			a += 2;
			break;
		default  :
			if (isInteger(k)) {
				if (!pattern.alley) throw reject('"'+k+'": '+ttype+' has no alley');
				twig.alley[k] = k1;
			} else {
				if (!isString(k)) throw reject('"'+k+'": is neither String or Integer');
				if (pattern.copse) {
					twig.copse[k] = k1;
				} else {
					twig[k] = k1;
				}
			}
			a += 2;
			break;
		}
	}

	if (a < aZ) {
		if (!pattern.alley) throw reject('"'+arguments[a]+'": '+ttype+' has no alley');

		if (arguments[a] === '--') {
			var shorten = arguments[a + 1];
			twig.alley.splice(twig.alley.length - shorten, shorten);
			a += 2;
		}

		if (arguments[a] === '++') {
			for(a++; a < aZ; a++) {
				k = arguments[a++];
				if (!isString(k)) throw reject ('"++": '+k+' is no String');
				twig.push(k);
			}
		}

		if (a < aZ) throw reject('a < aZ should never happen here');
	}

	// grows the subtwigs
	var klen = 0;

	if (pattern.copse) {
		for (k in twig.copse) {
			if (!Object.hasOwnProperty.call(twig.copse, k)) continue;
			if (!isString(k)) throw reject('key of copse no String: '+k);

			val = twig.copse[k];
			if (val === null) { delete twig.copse[k]; continue; }
			klen++;
			vtype = twigtype(val);
			if (!pattern.copse[vtype]) throw reject(ttype+'.copse does not allow '+val.type);
			switch(val.constructor) {
			case String :
			case Number :
				break;
			default     :
				if (!val._$grown) twig.copse[k] = this.grow(twig.copse[k]);
			}
		}
	} else {
		for (k in twig) {
			if (!Object.hasOwnProperty.call(twig, k)) continue;
			if (!isString(k)) throw reject('key of twig is no String: '+k);
			if (k === 'type') { continue; }

			val = twig[k];
			if (val === null) { delete twig[k]; continue; }
			klen++;
			vtype = twigtype(val);
			if (!pattern.must[k]) throw reject(ttype+' does not allow key: '+k);
			switch(val.constructor) {
			case String :
			case Number :
				break;
			default     :
				if (!val._$grown) twig[k] = this.grow(twig[k]);
			}
		}
	}

	// makes some additional checks
	if (pattern.must) {
		for (k in pattern.must) {
			if (!isnon(twig[k])) throw reject(ttype+' requires "'+k+'"');
		}
	}

	if (pattern.alley) {
		aZ = twig.alley.length;
		if (aZ !== Object.keys(twig.alley).length) {
			throw reject('Alley not a sequence');
		}
		if (aZ !== klen) {
			throw reject('Alley length does not match to copse');
		}
		for (a = 0; a < aZ; a++) {
			k = twig.alley[a];
			if (!is(twig.copse[k])) {
				throw new Error('Copse misses Alley value: '+k);
			}
		}
	}

	// if there is a custom construcgtor, calls it to replace the new twig
	if (pattern.creator) twig = pattern.creator(twig);

	// mark the object to be fine
	Object.defineProperty(twig, '_$grown', { value : true });

	immute(twig);
	return twig;
};

/**
| Gets the node a path leads to.
*/
Tree.prototype.getPath = function(path, shorten) {
	if (!isPath(path)) throw new Error('getPath not a path.');
	var a, aZ;

	// if (shorten < 0) shorten += path.length; // TODO use this instead

	// TODO restructure
	if (is(shorten)) {
		aZ = shorten >= 0 ? shorten : path.length + shorten;
	} else {
		aZ = path.length;
	}

	var twig = this.root;
	for (a = 0; a < aZ; a++) {
		if (!isnon(twig)) throw reject('path goes nowhere: '+path);
		if (this.pattern[twigtype(twig)].copse) {
			twig = twig.copse[path.get(a)];
		} else {
			twig = twig[path.get(a)];
		}
	}
	return twig;
};

/**
| Returns a tree where the node pointed by path is replaced by val.
*/
Tree.prototype.setPath = function(path, val) {
	if (!isPath(path)) throw new Error('Tree.get no path');

	for(var a = path.length - 1; a >= 0; a--) {
		var twig = this.getPath(path, a);
		val = this.grow(twig, path.get(a), val);
	}

	return new Tree(val, this.pattern);
};

if (typeof(window) === 'undefined') {
	module.exports = Tree;
}

})();

