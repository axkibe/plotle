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
var Twig;

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
| Node imports
*/
if (typeof (window) === 'undefined') {
	Jools = require('./jools');
	Path  = require('./path');
	Twig  = require('./twig');
}

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
	if (!Jools.isnon(pattern)) { throw new Error('aFail'); }
	this.pattern = pattern;
	this.root = this.grow(root);
};

/**
| Returns the pattern for object o
*/
Tree.prototype.getPattern = function(o) {
	return this.pattern[Twig.getType(o)];
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
	var ttype = Twig.getType(model);

	Jools.log('grow', ttype, arguments);

	var pattern = this.pattern[ttype];
	if (!pattern) throw Jools.reject('cannot grow type: '+ttype);

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
			if (!pattern.ranks)
				{ throw Jools.reject('"+": '+ttype+' has no ranks'); }
			k2 = arguments[a + 2];

			if (!Jools.isInteger(k1))
				{ throw Jools.reject('"+": key must be an Integer'); }

			if (!Jools.isString (k2))
				{ throw Jools.reject('"+": value must be a String'); }

			twig.ranks.splice(k1, 0, k2);
			a += 3;
			break;
		case '-' :
			if (!pattern.ranks)
				{ throw Jools.reject('"-": '+ttype+' has no ranks'); }

			if (!Jools.isInteger(k1))
				{ throw Jools.reject('"-": key must be an Integer'); }

			twig.ranks.splice(k1, 1);
			a += 2;
			break;
		default  :
			if (Jools.isInteger(k)) {
				if (!pattern.ranks)
					{ throw Jools.reject('"'+k+'": '+ttype+' has no ranks'); }

				twig.ranks[k] = k1;
			} else {
				if (!Jools.isString(k))
					{ throw Jools.reject('"'+k+'": is neither String or Integer'); }

				if (pattern.copse)
					{ twig.copse[k] = k1; }
				else
					{ twig[k] = k1; }
			}

			a += 2;
			break;
		}
	}

	if (a < aZ) {
		if (!pattern.ranks)
			{ throw Jools.reject('"'+arguments[a]+'": '+ttype+' has no ranks'); }

		if (arguments[a] === '--') {
			var shorten = arguments[a + 1];
			twig.ranks.splice(twig.ranks.length - shorten, shorten);
			a += 2;
		}

		if (arguments[a] === '++') {
			for(a++; a < aZ; a++) {
				k = arguments[a++];
				if (!Jools.isString(k))
					{ throw Jools.reject ('"++": '+k+' is no String'); }

				twig.push(k);
			}
		}

		if (a < aZ)
			{ throw Jools.reject('a < aZ should never happen here'); }
	}

	// grows the subtwigs
	var klen = 0;

	if (pattern.copse) {
		for (k in twig.copse) {
			if (!Object.hasOwnProperty.call(twig.copse, k))
				{ continue; }

			if (!Jools.isString(k)) throw Jools.reject('key of copse no String: '+k);

			val = twig.copse[k];

			if (val === null) {
				delete twig.copse[k];
				continue;
			}

			klen++;
			if (!pattern.copse[Twig.getType(val)])
				{ throw Jools.reject(ttype+'.copse does not allow '+val.type); }

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

			if (!Jools.isString(k))
				{ throw Jools.reject('key of twig is no String: ' + k); }

			if (k === 'type')
				{ continue; }

			val = twig[k];

			if (val === null) {
				delete twig[k];
				continue;
			}

			klen++;
			vtype = Twig.getType(val);

			if (!pattern.must[k])
				{ throw Jools.reject(ttype + ' does not allow key: ' + k); }

			switch(val.constructor) {
			case Boolean :
				if (vtype !== 'Boolean')
					{ throw Jools.reject(ttype + '[' + k + '] must be Boolean'); }

				break;
			case Number :
				if (vtype === 'Integer') {
					if (!Jools.isInteger(val))
						{ throw Jools.reject(ttype + '[' + k + '] must be Integer'); }
					break;
				}

				if (vtype !== 'Number')
					{ throw Jools.reject(ttype + '[' + k + '] must be Number'); }

				break;
			case String :
				if (vtype !== 'String')
					{ throw Jools.reject(ttype + '[' + k + '] must be String'); }

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
			if (!Jools.isnon(twig[k]))
				{ throw Jools.reject(ttype + ' requires "' + k + '"'); }
		}
	}

	if (pattern.ranks) {
		aZ = twig.ranks.length;
		if (aZ !== Object.keys(twig.ranks).length)
			{ throw Jools.reject('ranks not a sequence'); }

		if (aZ !== klen)
			{ throw Jools.reject('ranks length does not match to copse'); }

		for (a = 0; a < aZ; a++) {
			k = twig.ranks[a];
			if (!Jools.is(twig.copse[k]))
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
	var aZ = Jools.is(shorten) ? shorten : path.length;

	var twig = this.root;
	for (var a = 0; a < aZ; a++) {
		if (!Jools.isnon(twig))
			{ return null; }

		if (this.pattern[Twig.getType(twig)].copse)
			{ twig = twig.copse[path.get(a)]; }
		else
			{ twig = twig[path.get(a)]; }
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
	var aZ = Jools.is(shorten) ? shorten : path.length;

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

