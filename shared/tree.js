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

                                        ,--,--'
                                        `- | ,-. ,-. ,-.
                                         , | |   |-' |-'
                                         `-' '   `-' `-'
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

 Meshcraft Tree structure.

 Authors: Axel Kittenberger
 License: MIT(Expat), see accompanying 'License'-file

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

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

var	is           = Jools.is;
var	isnon        = Jools.isnon;
var	isInteger    = Jools.isInteger;
var	isString     = Jools.isString;
var lazyFixate   = Jools.lazyFixate;
var	reject       = Jools.reject;

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ,--,--'
 `- | . , , . ,-.
  , | |/|/  | | |
  `-' ' '   ' `-|
~ ~ ~ ~ ~ ~ ~ ~,| ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
               `'
 The base of all meshcraft-nodes.
 TODO make seperate file
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

var Twig = function () { };

/**
| Returns the rank of the key (Returns the index of key in the ranks array)
*/
Twig.prototype.rankOf = function(key) {
	var ranks = this.ranks;
	if (!Jools.isArray(ranks)) { throw new Error('twig has no ranks'); }
	if (!isString(key))  { throw new Error('key no string'); }

	// check rank of cache
	var rof = this._rof;
	if (!rof)
		{ Object.defineProperty(this, '_rof', rof = {}); }

	var r = rof[key];
	if (is(r))
		{ return r; }

	var x = is(this.copse[key]) ? ranks.indexOf(key) : -1;
	return rof[key] = x;
};

/**
| Returns length of a copse
*/
lazyFixate(Twig.prototype, 'length', function() {
	return this.ranks.length;
});

/**
| Creates a new unique identifier
*/
Twig.prototype.newUID = function() {
	var u = Jools.uid();
	return (!is(this.copse[u])) ? u : this.newUID();
};

/**
| Gets the twigs type
*/
var twigtype = function(o) {
	switch(o.constructor) {
	case Array   : return 'Array';
	case Boolean : return 'Boolean';
	case Number  : return 'Number';
	case String  : return 'String';
	default      : return o.type;
	}
};

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ,--,--'
 `- | ,-. ,-. ,-.
  , | |   |-' |-'
  `-' '   `-' `-'
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

 A meshcraft data tree.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
/**
| Constructor.
*/
Tree = function(root, pattern) {
	if (!isnon(pattern)) { throw new Error('aFail'); }
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

	Jools.log('grow', ttype, arguments);

	var pattern = this.pattern[ttype];
	if (!pattern) throw reject('cannot grow type: '+ttype);

	// copies the model
	twig = Jools.copy(model, new Twig());

	if (pattern.copse) twig.copse = model.copse ? Jools.copy(model.copse, {}) : {};
	if (pattern.ranks) twig.ranks = model.ranks ? model.ranks.slice()   : [];

	// applies changes specified by the arguments
	a = 1;
	while(a < aZ && arguments[a] !== '++' && arguments[a] !== '--') {
		k = arguments[a];
		k1 = arguments[a + 1];
		switch(k) {
		case '+' :
			if (!pattern.ranks) throw reject('"+": '+ttype+' has no ranks');
			k2 = arguments[a + 2];
			if (!isInteger(k1)) throw reject('"+": key must be an Integer');
			if (!isString (k2)) throw reject('"+": value must be a String');
			twig.ranks.splice(k1, 0, k2);
			a += 3;
			break;
		case '-' :
			if (!pattern.ranks) throw reject('"-": '+ttype+' has no ranks');
			if (!isInteger(k1)) throw reject('"-": key must be an Integer');
			twig.ranks.splice(k1, 1);
			a += 2;
			break;
		default  :
			if (isInteger(k)) {
				if (!pattern.ranks) throw reject('"'+k+'": '+ttype+' has no ranks');
				twig.ranks[k] = k1;
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
		if (!pattern.ranks) throw reject('"'+arguments[a]+'": '+ttype+' has no ranks');

		if (arguments[a] === '--') {
			var shorten = arguments[a + 1];
			twig.ranks.splice(twig.ranks.length - shorten, shorten);
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
			if (!Object.hasOwnProperty.call(twig.copse, k))
				{ continue; }

			if (!isString(k)) throw reject('key of copse no String: '+k);

			val = twig.copse[k];

			if (val === null) {
				delete twig.copse[k];
				continue;
			}

			klen++;
			if (!pattern.copse[twigtype(val)])
				{ throw reject(ttype+'.copse does not allow '+val.type); }

			switch(val.constructor) {
			case Boolean : throw new Error('.copse does not allow native Boolean');
			case Number  : throw new Error('.copse does not allow native Number');
			case String  : throw new Error('.copse does not allow native String');
			}

			if (!val._$grown)
				{ twig.copse[k] = this.grow(twig.copse[k]); }
		}
	} else {
		for (k in twig) {
			if (!Object.hasOwnProperty.call(twig, k))
				{ continue; }

			if (!isString(k))
				{ throw reject('key of twig is no String: ' + k); }

			if (k === 'type')
				{ continue; }

			val = twig[k];

			if (val === null) {
				delete twig[k];
				continue;
			}

			klen++;
			vtype = twigtype(val);

			if (!pattern.must[k])
				{ throw reject(ttype + ' does not allow key: ' + k); }

			switch(val.constructor) {
			case Boolean :
				if (vtype !== 'Boolean')
					{ throw reject(ttype + '[' + k + '] must be Boolean'); }

				break;
			case Number :
				if (vtype === 'Integer') {
					if (!isInteger(val))
						{ throw reject(ttype + '[' + k + '] must be Integer'); }
					break;
				}

				if (vtype !== 'Number')
					{ throw reject(ttype + '[' + k + '] must be Number'); }

				break;
			case String :
				if (vtype !== 'String')
					{ throw reject(ttype + '[' + k + '] must be String'); }

				break;
			default :
				if (!val._$grown)
					{ twig[k] = this.grow(twig[k]); }
			}
		}
	}

	// makes some additional checks
	if (pattern.must) {
		for (k in pattern.must) {
			if (!isnon(twig[k]))
				{ throw reject(ttype + ' requires "' + k + '"'); }
		}
	}

	if (pattern.ranks) {
		aZ = twig.ranks.length;
		if (aZ !== Object.keys(twig.ranks).length)
			{ throw reject('ranks not a sequence'); }

		if (aZ !== klen)
			{ throw reject('ranks length does not match to copse'); }

		for (a = 0; a < aZ; a++) {
			k = twig.ranks[a];
			if (!is(twig.copse[k]))
				{ throw new Error('copse misses ranks value: '+k); }
		}
	}

	// if there is a custom constructor, it is called to replace the new twig.
	if (pattern.creator)
		{ twig = pattern.creator(twig); }

	// marks the object to be fine
	Object.defineProperty(twig, '_$grown', { value : true });

	return Jools.immute(twig);
};

/**
| Gets the node a path leads to.
*/
Tree.prototype.getPath = function(path, shorten) {
	if (!Path.isPath(path)) throw new Error('getPath not a path.');

	if (shorten < 0) shorten += path.length;
	if (shorten < 0) throw new Error('getPath invalid shorten');
	var aZ = is(shorten) ? shorten : path.length;

	var twig = this.root;
	for (var a = 0; a < aZ; a++) {
		// if (!isnon(twig)) throw reject('path goes nowhere: '+path);
		if (!isnon(twig)) return null;
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
Tree.prototype.setPath = function(path, val, shorten) {
	if (!Path.isPath(path)) throw new Error('Tree.get no path');

	if (shorten < 0) shorten += path.length;
	if (shorten < 0) throw new Error('getPath invalid shorten');
	var aZ = is(shorten) ? shorten : path.length;

	for(var a = aZ - 1; a >= 0; a--) {
		var twig = this.getPath(path, a);
		val = this.grow(twig, path.get(a), val);
	}

	return new Tree(val, this.pattern);
};

if (typeof(window) === 'undefined') {
	module.exports = Tree;
}

})();

