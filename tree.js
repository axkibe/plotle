/**
| Meshcraft Tree structure.
|
| Authors: Axel Kittenberger
| License: GNU Affero AGPLv3
*/

/**
| Imports
*/
var Jools;
var Fabric;

/**
| Exports
*/
var Tree;

/**
| Capsule
*/
(function () {

"use strict";

/**
| Running in node or browser?
*/
if (typeof (window) === 'undefined') {
	Jools  = require('./jools');
	Fabric = require('./fabric');
}

var Path      = Jools.Path;
var Signature = Jools.Signature;
var	debug     = Jools.debug;
var immute    = Jools.immute;
var	is        = Jools.is;
var	isnon     = Jools.isnon;
var	isInteger = Jools.isInteger;
var	isString  = Jools.isString;
var	isPath    = Jools.isPath;
var	log       = Jools.log;
var	reject    = Jools.reject;
var	subclass  = Jools.subclass;

/**
| TODO
*/
var Patterns = {
	'Nexus' : {
		copse : { 'Space' : true }
	},

	'Space' : {
		copse : {
			'Note'     : true,
			'Label'    : true,
			'Relation' : true
		},
		alley : true,
		inc   : true
	},

	'Note' : {
		must : {
			'doc'      : 'Doc',
			'zone'     : 'Rect',
			'fontsize' : 'Number'
		}
	},

	'Label' : {
		must : {
			'doc'      : 'Doc',
			'pnw'      : 'Point',
			'fontsize' : 'Number'
		}
	},

	'Doc' : {
		copse : { 'Para' : true },
		alley : true,
		inc   : true
	},

	'Para' : {
		must : { 'text' : 'String' }
	},

	'Rect' : {
		creator : function(t) {
			return new Fabric.Rect(t.pnw, t.pse);
		},

		must : {
			'pnw' : 'Point',
			'pse' : 'Point'
		}
	},

	'Point' : {
		creator : function(t) {
			return new Fabric.Point(t.x, t.y);
		},

		must : {
			'x' : 'Number', // @@ Integer
			'y' : 'Number'
		}
	}
};

/**
| Some sanity tests on the patterns.
| @@ this might be disabled in release mode.
*/
(function(patterns) {
	for(var k in patterns) {
		var p = patterns[k];

		// TODO turn on immuting
		// immute(p)
		//if (p.copse) immute(p.copse);
		//if (p.must) immute(p.must);

		if (p.must && p.copse)   throw new Error('Patterns must not have .must and .copse');
		if (p.alley && !p.copse) throw new Error('Patterns must not have .alley without .copse');
	}
})(Patterns);

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 +++ Twig +++
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

 The base of all meshcraft-nodes.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

var Twig = function () { };

/**
| Gets the twigs type
*/
function twigtype(o) {
	switch(o.constructor) {
	case Array  : return 'Array';
	case Number : return 'Number';
	case String : return 'String';
	default     : return o.type;
	}
}

/**
| Copies one object (not deep!)
|
| o ... the object to copy from
| c ... the object to copy into
*/
function copy(o, c) {
	for (var k in o) {
		if (!Object.hasOwnProperty.call(o, k)) continue;
		c[k] = o[k];
	}
	return c;
}

/**
| Returns the pattern for object o
*/
function getPattern(o) {
	return Patterns[twigtype(o)];
}

/**
| Grows new twigs, the model is copies and extended by addtional arguments.
| Possible Arguments:
|  'key', value        sets [key] = value
|  '+', key, value     inserts a key if this an array
|  '-', key            removes a key if this an array
|  '--', count         shortens an array by count
|  '++', values...     for an array everything after '++' is extended.
*/
function grow(model /*, ... */) {
	var a, aZ = arguments.length;
	if (model._$grown && aZ === 1) return model;
	var twig, k, k1, k2, val, vtype;
	var ttype = twigtype(model);

	log('grow', ttype, arguments);

	var pattern = Patterns[ttype];
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
			case String : break;
			case Number : break;
			default     : if (!val._$grown) twig.copse[k] = grow(twig.copse[k]);
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
			case String : break;
			case Number : break;
			default     : if (!val._$grown) twig[k] = grow(twig[k]);
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
			debug(twig.copse, ':', klen, ' vs ', twig.alley, ':', aZ);
			throw reject('Alley length does not match to copse');
		}
		for (a = 0; a < aZ; a++) {
			var k = twig.alley[a];
			if (!is(twig.copse[k])) {
				throw new Error('Copse misses Alley value: '+k);
			}
		}
	}

	// if _inc is supported, sets it accordingly
	if (pattern.inc) {
		var inc = isnon(model._inc) ? model._inc : 1;
		while(is(twig.copse['' + inc])) inc++;
		Object.defineProperty(twig, '_inc', { value: '' + inc });
	}

	// if there is a custom construcgtor, calls it to replace the new twig
	if (pattern.creator) twig = pattern.creator(twig);

	// mark the object to be fine
	Object.defineProperty(twig, '_$grown', { value : true });

	immute(twig);
	return twig;
}

/**
| Returns a path for from a path ending with '_new' to grow a new twig.
*/
//function sproutPath(tree, path) {
	//if (!tree._grow) throw new Error('_grow not set');
	//while (is(tree.get('' + this._grow))) this._grow++;
	//return path.set(-1, '' + this._grow);
//	throw new Error('TODO');
//}

/**
| Gets the node a path leads to.
*/
function getPath(tree, path, shorten) {
	if (!isnon(tree)) throw reject('Tree.getPath not a tree.');
	if (!isPath(path)) throw new Error('Tree.getPath not a path.');
	var a, aZ;

	if (is(shorten)) {
		aZ = shorten >= 0 ? shorten : path.length + shorten;
	} else {
		aZ = path.length;
	}

	for (a = 0; a < aZ; a++) {
		if (!isnon(tree)) throw reject('path goes nowhere: '+path);
		if (Patterns[twigtype(tree)].copse) {
			tree = tree.copse[path.get(a)];
		} else {
			tree = tree[path.get(a)];
		}
	}
	return tree;
}

/**
| Returns a tree where the node pointed by path is replaced by val.
*/
function setPath(tree, path, val) {
	if (!isPath(path)) throw new Error('Tree.get no path');

	for(var a = path.length - 1; a >= 0; a--) {
		var node = Tree.getPath(tree, path, a);
		val = grow(node, path.get(a), val);
	}

	return val;
}


/**
| Returns true if this node matches a master or a node of equal class
*/
function matches(twig1, twig2) {
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
}

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 Module Export
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
Tree = {
	grow       : grow,
	getPattern : getPattern,
	getPath    : getPath,
	setPath    : setPath,
	matches    : matches
};

if (typeof(window) === 'undefined') {
	module.exports = Tree;
}

})();

