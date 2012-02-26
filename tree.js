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
		'*'        : { allows : 'Space' },
	},

	'Space' : {
		'items'    : { must : 'ItemCopse' },
		'z'        : { must : 'Array'     }
	},

	'ItemCopse'    : {
		'*'        : { allows : [ 'Note', 'Label', 'Relation' ], inc : true }
	},

	'Note' : {
		'doc'      : { must : 'Doc'  },
		'zone'     : { must : 'Rect' }
	},

	'Label' : {
		'doc'      : { must : 'Doc'   },
		'pnw'      : { must : 'Point' }
	},

	'Doc' : {
		'fontsize' : { must : 'Number'    },
		'paras'    : { must : 'ParaCopse' },
		'alley'    : { must : 'Array'     }
	},

	'ParaCopse'    : {
		'*'        : { allows : [ 'Para' ], inc : true }
	},

	'Para' : {
		'text'     : { must : 'String' },
	},

	'Rect' : {
		'^'        : function(t) { return new Fabric.Rect(t.pnw, t.pse); },
		'pnw'      : { must : 'Point' },
		'pse'      : { must : 'Point' },
	},

	'Point' : {
		'^'        : function(t) { return new Fabric.Point(t.x, t.y); },
		'x'        : { must : 'Number' }, // @@ Integer
		'y'        : { must : 'Number' }
	}
};


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
	default : return o.type;
	}
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
	var pattern = null;
	var twig, k;
	var ttype = twigtype(model);

	log('grow', twigtype(model), model);

	switch (ttype) {
	case 'Array' :
		pattern = 'Array';
		twig = [];
		break;
	case 'Number' :
	case 'String' :
		throw new Error('no need to "grow" native types');
	default :
		pattern = Patterns[ttype];
		if (!pattern) throw new Error('invalid type: '+ttype);
		// if a creator is given, aquire its data in a typeless object to be constructed later
		twig = pattern['^'] ? {} : new Twig();
	}

	// first copies the model
	for (k in model) {
		if (!Object.hasOwnProperty.call(model, k)) continue;
		twig[k] = model[k];
	}

	// then apply changes specified by the arguments
	a = 1;
	while(a < aZ && arguments[a] !== '++' && arguments[a] !== '--') {
		k = arguments[a];
		switch(k) {
		case '+' :
			if (ttype !== 'Array') throw new Error(ttype+' is no Array');
			twig.splice(arguments[a + 1], 0, arguments[a + 2]);
			a += 3;
			break;
		case '-' :
			if (ttype !== 'Array') throw new Error(type+' is no Array');
			twig.splice(arguments[a + 1], 1);
			a += 2;
			break;
		default  :
			twig[k] = arguments[a + 1];
			a += 2;
			break;
		}
	}

	if (a < aZ && ttype !== 'Array') {
		throw new Error(ttype+' is no Array');
	}

	if (arguments[a] === '--') {
		if (ttype !== 'Array') throw new Error(ttype+' is no Array');
		var shorten = arguments[a + 1];
		twig.splice(twig.length - shorten, shorten);
		a += 2;
	}

	if (arguments[a] === '++') {
		if (ttype !== 'Array') throw new Error(ttype+' is no Array');
		while (a < aZ) twig[twig.length] = arguments[a++];
	}

	if (a < aZ) {
		throw new Error('a < aZ should never happen here');
	}

	// TODO do not grow if the model was a twig.

	// now grow subtwigs, checks if all are valids
	if (ttype === 'Array') {
		for (var n = 0, nZ = twig.length; n < nZ; n++) {
			if (twig[n].constructor !== String) {
				throw new Error('Twig-Arrays may only have Strings');
			}
		}
	} else { // not an Array
		for (k in twig) {
			// checking
			if (!Object.hasOwnProperty.call(twig, k)) continue;
			var val = twig[k];
			if (k.constructor !== String) throw new Error('typeof key no String: '+k);
			var p = pattern['*'];
			if (k === 'type') continue;
			if (p) {
				if (p.allows.indexOf(val.type) < 0) {
					throw new Error(ttype+' does not allow '+val.type+' for '+k);
				}
			} else {
				p = pattern[k];
				if (!p) throw new Error(ttype+' does not allow key: '+k);
				if (twigtype(val) !== p.must) {
					throw new Error(ttype+'['+k+'] requires '+p.must+' got '+val.type);
				}
			}
			// and sub-grow non-natives
			switch (val.constructor) {
			case String : continue;
			case Number : continue;
			default : twig[k] = grow(twig[k]);
			}
		}
	}

	// TODO check all musts


	// if _inc is supported, sets it accordingly
	if (pattern['*'] && pattern['*'].inc) {
		var inc = isnon(model._inc) ? model._inc : '1';
		while(is(twig[inc])) inc = '' + (1 + inc);
		Object.defineProperty(twig, '_inc', { value: inc });
	}

	// calls a custom constructor if specified
	if (pattern['^']) twig = pattern['^'](twig);

	immute(twig);
	return twig;

	/*if (Tree.cogging) {
		throw new Error('TODO');
		//this.parent = null;
		//this.key$ = null;
		//
		//for (var k in twigs) {
		//	if (k === 'type' || k === 'alley') continue;
		//	switch (twigs.constructor) {
		//	case String : continue;
		//	case Number : continue;
		//	}
		//	if (!twigs[k] || twigs[k].noCogs) continue;
		//	twigs[k].parent = this;
		//	twigs[k].key$ = k;
		//}
	}*/
}

/**
| Returns a path for from a path ending with '_new' to grow a new twig.
*/
function incPath(tree, path) {
	//if (!tree._grow) throw new Error('_grow not set');
	//while (is(tree.get('' + this._grow))) this._grow++;
	//return path.set(-1, '' + this._grow);
	throw new Error('TODO');
}

/**
| TODO
*/
function getPath(tree, path) {
	if (!isPath(path)) throw new Error('Tree.get no path');
	var twig = tree;
	for (var a = 0, aZ = path.length; a < aZ; a++) {
		if (!isnon(twig)) throw reject('path goes nowhere');
		twig = twig[path.get(a)];
	}
	return twig;
}

/**
| TODO
*/
function setPath(tree, path, val) {
	if (!isPath(path)) throw new Error('Tree.get no path');
	var a, aZ;
	debug('SETPATH', tree, path, val);
	for (a = 0, aZ = path.length - 1; a < aZ; a++) {
		if (!isnon(tree)) throw reject('path goes nowhere');
		tree = tree[path.get(a)];
		debug('GOD', path.get(a), tree);
	}
	for(a; a >= 0; a--) {
		debug('setPath', a, tree);
		tree = grow(tree, path.get(a), val);
		val = tree;
	}
	return tree;
}


/**
| Returns true if this node matches a master or a node of equal class
*/
function matches(twig1, twig2) {
	throw new Error('TODO');
	/*
	if (!isnon(master) || !master.constructor) return false;

	if (this.constructor === master.constructor) {
		// allow matching of nodes equal class
		master = master._twigs;
	}

	var klen = 0;
	for(var k in this._twigs) {
		if (k === 'type') continue;
		var v1 = this._twigs[k];
		var v2 = master[k];

		if (k === 'alley') {
			if (v1.length !== v2.length) return false;
			for (var i = 0, len = v1.length; i < len; i++) {
				if (v1[i].matches) {
					if (!v1[i].matches(v2[i])) return false;
				} else {
					if (v1[i] !== v2[i]) return false;
				}
			}
		} else if (v1.matches) {
			if (!v1.matches(v2)) return false;
		} else {
			if (v1 !== v2) return false;
		}
		klen++;
	}

	// tests if there aren't additional keys in o.
	for (var k in master) {
		if (k !== 'type') klen--;
	}
	return klen === 0;*/
}

/**
| Adds a listener for set events.
*/
/*
Stem.prototype.addListener = function(listener) {
	// TODO make a copy.
	if (!this.listen) this.listen = [];
	var listen = this.listen;
	if (listen.indexOf(listener) !== -1) return false;
	listen.push(listener);
	return true;
}
*/

/**
| Removes a listener.
*/
/*
Stem.prototype.removeListener = function(listener) {
	// TODO make a copy.
	var listen = this.listen;
	if (!listen) return false;
	var idx = listen.indexOf(listener);
	if (idx === -1) return false;
	listen.splice(idx, 1);
	return true;
}
*/

/**
| Tells all listeners of an event.
*/
/*
Stem.prototype.tell = function() {
	var listen = this.listen.slice();
	for (var a = 0, aZ = listen.length; a < aZ; a++) {
		var v = listen[a];
		v.event.apply(v, arguments);
	}
}
*/

/**
| Gets the key of this node.
*/
/*Stem.prototype.getOwnKey = function() {
	if (!Tree.cogging) throw new Error('getOwnKey() requires cogging');
	if (this.parent === null) return null;
	if (this.parent.get(this.key$) === this) return this.key$;
	return this.key$ = this.parent.getKeyOf(this);
}
*/

/**
| Gets the key of a child node
*/
/*Stem.prototype.getKeyOf = function(v, nocache) {
	if (!Tree.cogging) throw new Error('getKeyOf() requires cogging');
	if (v.parent !== this) return null;
	if (!nocache && this.get(v.key$) === v) return v.key$;

	var twigs = this._twigs;
	if (twigs.alley) {
		var idx = twigs.alley.indexOf(v);
		if (idx >= 0) {
			if (!nocache) v.key$ = idx;
			return idx;
		}
	}

	for(var k in twigs) {
		if (twigs[k] === v) {
			if (!nocache) v.key$ = k;
			return k;
		}
	}

	return null;
}
*/

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 Module Export
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
Tree = {
	grow    : grow,
	incPath : incPath,
	getPath : getPath,
	setPath : setPath
//	cogging : false,
};

if (typeof(window) === 'undefined') {
	module.exports = Tree;
}

})();

