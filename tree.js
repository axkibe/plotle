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
function checkPatterns(patterns) {
	for(var k in patterns) {
		var p = patterns[k];
		if (p.must && p.copse)   throw new Error('Patterns must not have .must and .copse');
		if (p.alley && !p.copse) throw new Error('Patterns must not have .alley without .copse');
	}
}
checkPatterns(Patterns);

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
	var twig, k, k1, k2, val, vtype, klen;
	var ttype = twigtype(model);

	log('grow', ttype, model);

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
	klen = 0;

	if (pattern.copse) {
		for (k in twig.copse) {
			if (!Object.hasOwnProperty.call(twig, k)) continue;
			if (!isString(k)) throw reject('key of copse no String: '+k);
			klen++;

			val = twig.copse[k];
			if (val === null) { delete twig.copse[k]; break; }
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
			klen++;

			val = twig[k];
			if (val === null) { delete twig[k]; break; }
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
			if (!twig[k]) throw reject(ttype+' requires "'+k+'"');
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
			var k = twig.alley[a];
			if (!is(twig.copse[k])) {
				throw new Error('Copse misses Alley value: '+k);
			}
		}
	}

	// if _inc is supported, sets it accordingly
	if (pattern.inc) {
		var inc = isnon(model._inc) ? model._inc : '1';
		while(is(twig[inc])) inc = '' + (1 + inc);
		Object.defineProperty(twig, '_inc', { value: inc });
	}

	// if there is a custom construcgtor, calls it to replace the new twig
	if (pattern.creator) twig = pattern.creator(twig);

	// mark the object to be fine
	Object.defineProperty(twig, '_$grown', { value : true });

	immute(twig);
	return twig;

	// if (Tree.cogging) {} TODO
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
	for (var a = 0, aZ = path.length; a < aZ; a++) {
		if (!isnon(tree)) throw reject('path goes nowhere');
		tree = tree[path.get(a)];
	}
	return tree;
}

/**
| TODO
*/
function setPath(tree, path, val) {
	if (!isPath(path)) throw new Error('Tree.get no path');
	var a, aZ;
	for (a = 0, aZ = path.length - 1; a < aZ; a++) {
		if (!isnon(tree)) throw reject('path goes nowhere');
		tree = tree[path.get(a)];
	}
	for(a; a >= 0; a--) {
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

