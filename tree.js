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
	Nexus : {
		'*': { Space : 'opt' }
	},

	Space : {
		items : { ItemCopse : 'must' },
		z     : { ArcAlley  : 'must' }
	},

	ItemCopse : {
		'*' : {
			Note     : 'opt',
			Label    : 'opt',
			Relation : 'opt'
		},
		'_new' : true // support '_new' keys
	},

	ArcAlley : {
		'#' : { '*' : 'opt' }
	},

	Note : {
		doc  : { Doc  : 'must' },
		zone : { Rect : 'must' }
	},

	Label : {
		doc : { Doc   : 'must' },
		pnw : { Point : 'must'}
	},

	Doc : {
		'#'      : { Para : 'opt' },
		fontsize : { '#'  : 'must'}
	},

	Rect : {
		'^' : Fabric.Rect   // take prototype from Fabric.Rect
	},

	Point : {
		'^' : Fabric.Point, // take prototype from Fabric.Point
		'x' : { '#' : 'must' },
		'y' : { '#' : 'must' }
	}
};


/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 +++ Twig +++
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

 The base of all meshcraft-nodes.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

var Twig = function () { };

/**
| Creates new twigs, either extending an existing twig or creates one from a master.
*/
function grow(model /* ... */) {
	var a, aZ = arguments.length;
	switch (model.constructor) {
	case Number :
		if (aZ !== 1) throw new Error('Cannot grow Numbers with arguments.');
		return model;
	case String :
		if (aZ !== 1) throw new Error('Cannot grow Strings with arguments.');
		return model;
	}

	// determines the constructor of the twig to grow
	var constructor = model.constructor.prototype.constructor;

	var pattern = Patterns[model.type];
	if (!pattern) throw new Error('No matching pattern to: '+model.type);

	// sees if an Object should become an Array
	if (constructor === Object) {
		for(a = 1; a < aZ; a+=2) {
			var arg = arguments[a];
			if (arg === '++' || arg === '+' || arg === '-') {
				constructor = Array;
				break;
			}
		}
	}

	// sees if the pattern defines the constructor
	if (pattern['^'] && constructor !== pattern['^']) {
		if (constructor !== Object) throw new Error('Constructor mismatch');
		constructor = pattern['^'];
	}

	// creates the twig
	Twig.prototype = constructor.prototype;
	var twig = new Twig();

	// first copies over the model
	var k;
	for (k in model) {
		if (!Object.hasOwnProperty.call(model, k)) continue;
		if (k.constructor === Number && constructor !== Array) {
			throw new Error('Numbers need Arrays');
		}
		twig[k] = model[k];
	}

	// set the new values from the arguments
	a = 1;
	while(a < aZ && arguments[a] !== '++') {
		k = arguments[a];
		if (k.constructor === Number && constructor !== Array) {
			throw new Error('Numbers need Arrays');
		}
		switch(k) {
		case '+' :
			if (constructor !== Array) throw new Error('Splicing needs Arrays');
			twig.splice(arguments[a + 1], 0, arguments[a + 2]);
			a += 3;
			break;
		case '-' :
			if (constructor !== Array) throw new Error('Splicing needs Arrays');
			twig.splice(arguments[a + 1], 1);
			a += 2;
			break;
		default  :
			twig[k] = arguments[a + 1];
			a += 2;
			break;
		}
	}
	// if there was an '++' append the rest of the arguments
	if (a < aZ && constructor !== Array) throw new Error('Appending needs Arrays');
	while (a < aZ) twig[twig.length] = arguments[a++];

	// TODO check pattern

	// TODO do not grow if the model was a twig.
	for (k in twig) {
		if (!Object.hasOwnProperty.call(twig, k)) continue;
		if (k === 'alley') continue; // TODO remove?
		debug('subgrow', k);
		twig[k] = grow(twig[k]);
	}

	if (twig.alley) {
		var alley = twig.alley;
		if (constructor !== Array) throw new Error('Alleys need Arrays');
		for (var ka in alley) {
			if (!Object.hasOwnProperty.call(alley, k)) continue;
			debug('subgrow', ka);
			twig[ka] = grow(alley[ka]);
		}
	}

	// if _new is supported, set it accordingly
	if (pattern._new) {
		var _new = isnon(model._new) ? model._new : '1';
		while(is(twig[_new])) _new = '' + (1 + _new);
		Object.defineProperty(twig, '_new', { value: _new });
	}

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
function newKey(tree, path) {
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
	getPath : getPath,
	setPath : setPath
//	cogging : false,
};

if (typeof(window) === 'undefined') {
	module.exports = Tree;
}

})();

