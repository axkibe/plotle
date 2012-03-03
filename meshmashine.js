/**                                                      _.._
                                                      .-'_.._''.
 __  __   ___       _....._              .          .' .'     '.\
|  |/  `.'   `.   .´       '.          .'|         / .'                                _.._
|   .-.  .-.   ' /   .-'"'.  \        (  |        . '            .-,.-~.             .' .._|    .|
|  |  |  |  |  |/   /______\  |        | |        | |            |  .-. |    __      | '      .' |_
|  |  |  |  |  ||   __________|    _   | | .'''-. | |            | |  | | .:-`.'.  __| |__  .'     |
|  |  |  |  |  |\  (          '  .' |  | |/.'''. \. '            | |  | |/ |   \ ||__   __|'-..  .-'
|  |  |  |  |  | \  '-.___..-~. .   | /|  /    | | \ '.         .| |  '- `" __ | |   | |      |  |
|__|  |__|  |__|  `         .'.'.'| |//| |     | |  '. `.____.-'/| |      .'.''| |   | |      |  |
                   `'-.....-.'.'.-'  / | |     | |    `-._____ / | |     / /   | |_  | |      |  '.'
                                 \_.'  | '.    | '.           `  |_|     \ \._,\ '/  | |      |   /
                                       '___)   '___)                      `~~'  `"   |_|      `--´


                       ,-,-,-.           .   ,-,-,-.           .
                       `,| | |   ,-. ,-. |-. `,| | |   ,-. ,-. |-. . ,-. ,-.
                         | ; | . |-' `-. | |   | ; | . ,-| `-. | | | | | |-'
                         '   `-' `-' `-' ' '   '   `-' `-^ `-' ' ' ' ' ' `-'

~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

 The causal consistency / operation transformation engine for meshcraft.

 Authors: Axel Kittenberger
 License: GNU Affero AGPLv3

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

/**
| Imports
*/
var Jools;
var Tree;

/**
| Exports
*/
var MeshMashine;

/**
| Capsule
*/
(function() {

"use strict";

/**
| Node includes.
*/
if (typeof(window) === 'undefined') {
	Jools = require('./jools');
	Tree  = require('./tree');
}

var Path        = Jools.Path;
var Signature   = Jools.Signature;

var debug       = Jools.debug;
var log         = Jools.log;
var clone       = Jools.clone;
var deepFreeze  = Jools.deepFreeze;
var is          = Jools.is;
var isnon       = Jools.isnon;
var isArray     = Jools.isArray;
var isPath      = Jools.isPath;
var isInteger   = Jools.isInteger;
var isString    = Jools.isString;
var fixate      = Jools.fixate;
var reject      = Jools.reject;

function fail(args, aoffset) {
	var a = Array.prototype.slice.call(args, aoffset, args.length);
	for(var i = 2; i < arguments.length; i++) { a.push(arguments[i]); }
	var b = a.slice();
	b.unshift('fail');
	log.apply(null, b);
	throw reject(a.join(' '));
}

/**
| Throws a reject if condition is not met.
*/
function check(condition) {
	if (!condition) fail(arguments, 1);
}

/**
| Throws a reject if v is not within limits
*/
function checkLimits(v, low, high) {
	if (v < low || v > high) fail(arguments, 3, low, '<=', v, '<=', high);
}

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
     ,.   .  .                  .
    / |   |  |- ,-. ,-. ,-. ,-. |- . ,-. ,-.
   /~~|-. |  |  |-' |   | | ,-| |  | | | | |
 ,'   `-' `' `' `-' '   ' ' `-^ `' ' `-' ' '
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

 The causal consistency engine.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
var Alter = {};

/**
| TODO
*/
Alter.type = function(src, trg) {
	if (trg.proc === 'splice') return 'split';
	if (src.proc === 'splice') return 'join';

	if (src.proc === 'arrange') return 'place'; // TODO changed?
	if (trg.proc === 'arrange') return 'take';  // TODO changed?

	if (is(src.val) && !is(trg.at1)) return 'set';
	if (is(src.val) &&  is(trg.at1)) return 'insert';
	if (is(src.at1) &&  is(src.at2) && !is(trg.at1)) return 'remove';

	if (Jools.prissy) { log('fail', this); throw new Error('invalid type'); }

	return null;
};

/**
| Alters a tree
*/
Alter.apply = function(tree, src, trg, report) {
	var atype = Alter.type(src, trg);
	log('Aplternation.apply', 'src:', src, 'trg:', trg, 'atype:', atype);
	if (!Alter[atype]) throw reject('invalid atype:', atype);
	return Alter[atype](tree, src, trg, report);
};

/**
| Alter: A new item is inserted or replaces an existing.
*/
Alter.set = function(tree, src, trg, report) {
	var cm = 'alterSet';

	check(!is(trg.at1), cm, 'trg.at1 must not exist.');
	check(is(src.val), cm, 'src.val missing');
	var path = trg.path;
	//var ppath = new Path(path, '--', 1);
	//var parent = tree.get(ppath);
	//if (path.get(-1) === '$new') path = Tree.newKey(tree, path);

	var save = Tree.getPath(tree, path);

	if (is(trg.val)) {
		check(Tree.matches(save, trg.val), cm, 'trg.val preset incorrectly');
	} else {
		if (!is(save)) save = null;
		trg = new Signature(trg, 'val', save);
	}

	if (is(src.path)) {
		check(path.equals(src.path), cm, 'src.path preset incorrectly');
	} else {
		src = new Signature(src, 'path', trg.path);
	}

	tree = Tree.setPath(tree, path, src.val);

	//if (report && parent.report) parent.report('set', trg.path.get(-1), src.val);
	return { tree: tree, src: src, trg: trg };
};

/**
| Alter: A string is inserted into a string item.
*/
Alter.insert = function(tree, src, trg, report) {
	var cm = 'alterInsert';

	check(isPath(trg.path), cm, 'trg.path missing');
	var str = Tree.getPath(tree, trg.path);
	check(isString(str), cm, 'trg.path signates no string');

	trg = trg.attune(str, 'trg.path');

	// where trg span should end
	var tat2 = trg.at1 + src.val.length;
	if (is(trg.at2)) {
		check(trg.at2 === tat2, cm, 'trg.at2 preset incorrectly');
	} else {
		trg = new Signature(trg, 'at2', tat2);
	}
	var nstr = str.substring(0, trg.at1) + src.val + str.substring(trg.at1);
	tree = Tree.setPath(tree, trg.path, nstr);

	//if (report) {
	//	var parent = tree.get(trg.path, 0, -1);
	//	if (parent.report) parent.report('insert', trg.path.get(-1), trg.at1, src.val);
	//}
	return { tree: tree, src: src, trg: trg };
};

/**
| Alter: a part of a string item is removed.
*/
Alter.remove = function(tree, src, trg, report) {
	var cm = 'alterRemove';
	check(isPath(src.path), cm, 'src.path missing');
	var str = Tree.getPath(tree, src.path);
	check(isString(str), cm, 'src.path signates no string');

	src = src.attune(str, 'src.path');
	if (src.at1 === src.at2) { log('alter', 'removed nothing'); return; }

	var val = str.substring(src.at1, src.at2);
	if (isnon(trg.val)) {
		check(Tree.matches(val, trg.val), cm,
			'trg.val preset incorrectly:',
			val, '!==', trg.val
		);
	} else {
		trg = new Signature(trg, 'val', val);
	}
	var nstr = str.substring(0, src.at1) + str.substring(src.at2);
	tree = Tree.setPath(tree, src.path, nstr);

	//if (report) {
	//	var parent = tree.get(src.path, 0, -1);
	//	if (parent.report) parent.report('remove', src.path.get(-1), src.at1, src.at2, val);
	//}
	return { tree: tree, src: src, trg: trg };
};

/**
| Alter: two texts are joined into one.
*/
Alter.join = function(tree, src, trg, report) {
	var cm = 'alterJoin';

	check(is(trg.at1), cm, 'trg.at1 missing');
	var path = trg.path;
	var text = tree.get(path);
	check(isString(text), cm, 'trg.path signates no text');

	var vpath = new Path(path, '--', 2);
	var pivot = Tree.getPath(tree, vpath);
	check(pivot instanceof Array, cm, 'pivot not an array');

	trg = trg.attune(text, 'trg');
	var key = path.get(-2);

	checkLimits(key, 0, pivot.length -1, cm, 'splice out of range');

	var para1 = pivot[key];
	var para2 = pivot[key + 1];

	// @@ check other keys to be equal
	para1 = Tree.grow(para1, 'text', para1.text + para2.text);
	pivot = Tree.grow(pivot, key, para1, '-', key + 1);
	tree  = Tree.setPath(tree, vpath, pivot);

//	if (report) {
//		if (pivot.report) pivot.report('join', path.get(trg.pivot), trg.at1, ppre);
//		if (ppre.report)  ppre.report('join>', path.get(-1), path.get(trg.pivot), trg.at1);
//		if (pnex.report)  pnex.report('join<', path.get(-1), path.get(trg.pivot), trg.at1);
//	}
	return { tree: tree, src: src, trg: trg };
};

/**
| Alter: a text is split into two.
*/
Alter.split = function(tree, src, trg, report) {
	var cm = 'alterSplit';
	var path = src.path;
	check(is(src.at1), cm, 'src.at1 missing');
	check(path.get(-1) === 'text', cm, 'splits must be on .text');
	var text = Tree.getPath(tree, path);
	check(isString(text), cm, 'src signates no string');

	var vpath = new Path(path, '--', 2);
	var pivot = Tree.getPath(tree, vpath);
	check(pivot instanceof Array, cm, 'pivot not an array');

	src = src.attune(text, 'src');

	var key = path.get(-2);
	checkLimits(key, 0, pivot.length, cm, 'splice out of range');

	var para1 = pivot[key], para2;
	para1 = Tree.grow(para1, 'text', text.substring(src.at1));
	para2 = Tree.grow(para1, 'text', text.substring(0, src.at1));
	pivot = Tree.grow(pivot, key, para1, '+', key + 1, para2);
	tree  = Tree.setPath(tree, vpath, pivot);

//	if (report) {
//		if (pivot.report) pivot.report('split', src.path.get(src.pivot), src.at1, pnew);
//		if (ppre.report)   ppre.report('split', src.path.get(-1), src.at1, pnew);
//	}
	return { tree: tree, src: src, trg: trg };
};

/**
| Alter: a value is placed into an alley(array)
*/
Alter.place = function(tree, src, trg, report) {
	var cm = 'alterPlace';
	check(is(src.val),  cm, 'src.val not present');
	check(is(trg.path), cm, 'trg.path not present');
	check(is(trg.at1),  cm, 'trg.at1 not present');
	var alley = tree.get(trg.path);
	check(alley && alley.isAlley, cm, 'trg.path not an alley');

	if (trg.at1 === '$top') trg.at1 = 0;
	if (trg.at1 === '$end') trg.at1 = alley.length;
	check(trg.at1 >= 0 && trg.at1 <= alley.length, cm, 'trg.at1 not inside alley');

	alley.splice(trg.at1, 0, src.val);

	if (report && alley.report) alley.report('place', trg.path.get(-1), trg.at1, src.val);
	return { tree: tree, src: src, trg: trg };
};

/**
| Alter: a value is taken from an alley(array)
*/
Alter.take = function(tree, src, trg, report) {
	// an item is taken (removed) from an alley.
	var cm = alterTake;

	check(is(src.path), cm, 'src.path not present');
	check(is(src.at1),  cm, 'src.at1 not present');
	var alley = tree.get(src.path);
	check(alley && alley.isAlley, cm, 'src.path not an alley');
	check(src.at1 >= 0 && src.at1 <= alley.length, cm, 'src.at1 not inside alley');

	var val = alley.get(src.at1);
	if (is(trg.val)) {
		check(Tree.matches(val, trg.val), cm, 'trg.val preset incorrectly');
	} else {
		trg.val = val;
	}
	alley.splice(src.at1, 1);

	if (report && alley.report) alley.report('take', src.path.get(-1), src.at1, val);
	return { tree: tree, src: src, trg: trg };
};

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
,--,--'
`- | ,-. ,-. ,-. ,-. ," ,-. ,-. ,-,-.
 , | |   ,-| | | `-. |- | | |   | | |
 `-' '   `-^ ' ' `-' |  `-' '   ' ' '
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~'~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

 Action Transformation. Changes Signatures due to past alternations.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
var Transform = {};

/**
| Transforms a signature on one history moment
*/
Transform.one = function(sign, src, trg) {
	if (!is(sign.path)) return sign;
	var atype = Alter.type(src, trg);
	if (!Transform[atype]) { throw new Error('unknown atype: '+atype); }
	return Transform[atype](sign, src, trg);
};

/**
| Transforms a signature on one a split.
*/
Transform.split = function(sign, src, trg) {
	log('te', 'split');
	if (!src.path.subpathOf(sign.path)) return sign;
	var src_i = src.path.get(src.pivot); // TODO
	var	sig_i = sign.path.get(src.pivot); // TODO
	log('te', 'sig_i', sig_i, 'src_i', src_i);
	if (sig_i < src_i) {
		log('te', 'split downside');
		return sign;
	}
	if (sig_i > src_i) {
		// split was before -> index shifted
		log('te', 'split upside');
		sign.path = sign.path.add(src.pivot, 1);
		return sign;
	}
	log('te', 'split here');
	// split is in same line;
	if (is(sign.at1) && is(sign.at2)) {
		log('te', 'split span');
		//Span        mmmmm      <-- sig_p.at1--sig_at2
		//Splits:  1    2    3   <-- src_p.at1
		//case 3:
		if (sign.at2 < src.at1) {
			log('te', 'split rightside');
			return sign;
		}
		// case 1:
		if (sign.at1 > src.at1) {
			log('te', 'split leftside');
			sign.path = sign.path.add(src.pivot, 1);
			sign.at1 -= src.at1;
			sign.at2 -= src.at1;
			return sign;
		}
		// case 2 -> have to split!
		log('te', 'split split');
		var sat2 = sign.at2 - src.at1;
		sign.at2 = src.at1;

		var sign2 = new Signature(sign);
		sign2.path = sign2.path.add(src.pivot, 1);
		sign2.at1 = 0;
		sign2.at2 = sat2;
		return [sign, sign2];
	}
	if (is(sign.at1)) {
		log('te', 'split index');
		if (src.at1 > sign.at1) {
			log('te', 'split rigtside');
			return sign;
		}
		log('te', 'split leftside');
		sign.path = sign.path.add(src.pivot, 1);
		sign.at1 -= src.at1;
		return sign;
	}
	throw reject('invalid split');
};

/**
| Transforms a signature on one a join.
*/
Transform.join = function(sign, src, trg) {
	if (!trg.path.like(sign, trg.pivot)) return sign; // TODO this looks wrong
	log('te', 'alter-join');
	var trg_i =  trg.path.get(trg.pivot);
	var sig_i = sign.path.get(trg.pivot);
	if (sig_i < trg_i) {
		log('te', 'join downside');
		return sign;
	}
	if (sig_i > trg_i) {
		// split was before -> index shifted
		log('te', 'join upside');
		sign.path = sign.path.add(src.pivot, -1);
		return sign;
	}
	log('te', 'join here');
	// join is in same line;
	sign.path = sign.path.add(trg.pivot, -1);
	sign.at1 += trg.at1;
	if (is(sign.at2)) sign.at1 += trg.at1;
	return sign;
};

/**
| Transforms a signature on a join.
*/
Transform.set = function(sign, src, trg) {
	log('te', 'nothing to do');
	return sign;
};


/**
| Transforms a signature on an insert.
*/
Transform.insert = function(sign, src, trg) {
	if (!trg.path || !trg.path.equals(sign.path)) return sign;
	log('te', 'insert');
	if (!is(trg.at1) || !is(trg.at2)) throw new Error('history mangled');

	if (sign.at1 < trg.at1) return sign;
	var len = src.val.length;
	if (is(sign.at2)) { return new Signature(sign, 'at1', sign.at1 + len, 'at2', sign.at2 + len); }
	return new Signature(sign, 'at1', sign.at1 + len);
};

/**
| Transforms a signature on a insert
*/
Transform.remove = function(sign, src, trg) {
	if (!src.path || !src.path.equals(sign.path)) return sign;
	log('te', 'remove');
	if (!is(src.at1) || !is(src.at2)) { throw new Error('history mangled'); }
	var len = src.at2 - src.at1;

	// simpler case signature is only one point
	if (!is(sign.at2)) {
		if (sign.at1 <= src.at1) return sign;
		return new Signature(sign, 'at1', sign.at1 - len);
	}

	// more complicated signature is a span that may be affected
	// supposedly its a remove as well.
	//
	//                     ............
	// src (removed span)      ######
	// sign, case0:        +++ '    '      (sign to left,  no effect)
	// sign, case1:            '    ' +++  (sign to right, move to left)
	// sign, case2:          ++++   '      (part of sign removed)
	// sign, case3:            '   ++++    (part of sign removed)
	// sign, case4:          +++++++++     (sign splitted into two)
	// sign, case5:            ' ++ '      (sign completely removed)

	// case0
	if (sign.at2 <= src.at1) { return sign; }

	// case1
	if (sign.at1 >= src.at2) {
		return new Signature(sign, 'at1', sign.at1 - len, 'at2', sign.at2 - len);
	}

	// case2
	if (sign.at1 <= src.at1 && sign.at2 <= src.at2) {
		return new Signature(sign, 'at2', src.at1);
	}

	// case3
	if (sign.at2 <= src.at2 && 
XXX
			log('te', 'at1 -=', trg.val.length);
			sign.at1 -= trg.val.length;
			if (is(sign.at2)) {
				log('te', 'at2 -=', trg.val.length);
				sign.at2 -= trg.val.length;
			}
		} else {
			// case2
			if (is(sign.at2)) {
				sign.at2 = sign.at2 - sign.at1 + src.at1;
				log('te', 'at2 =', sign.at2);
			}
			log('te', 'at1 =', src.at1);
			sign.at1 = src.at1;
		}
	}

	return sign;
};

/**
| Transforms a signature on a place
| TODO needed?
*/
Transform.place = function(sign, src, trg) {
	if (!trg.path.like(sign.path)) return sign;
	log('te', 'place');
	var trg_i =  trg.alley.get(-1);
	var sig_i = sign.path.get(trg.alley.length);
	log('te', 'sig_i', sig_i, 'trg_i', trg_i);
	if (sig_i >= trg_i) {
		// insert was before -> index shifted
		log('te', 'place shifted');
		sign.path = sign.path.add(trg.alley.length, 1);
	}
	return sign;
};


/**
| Transforms a signature on a take.
| TODO needed?
*/
Transform.take = function(sign, src, trg) {
	if (!src.alley.like(sign.path)) return sign;
	log('te', 'take');
	var src_i =  src.path.get(-1);
	var sig_i = sign.path.get(src.alley.length);
	log('te', 'sig_i', sig_i, 'src_i', src_i);

	if (sig_i >= src_i) {
		// take was before -> index shifted
		log('te', 'place shifted');
		sign.path = sign.path.add(src.alley.length, -1);
	}
	return sign;
};



/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ,-,-,-.           .   ,-,-,-.           .
 `,| | |   ,-. ,-. |-. `,| | |   ,-. ,-. |-. . ,-. ,-.
   | ; | . |-' `-. | |   | ; | . ,-| `-. | | | | | |-'
   '   `-' `-' `-' ' '   '   `-' `-^ `-' ' ' ' ' ' `-'
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

 Thats the thing.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

/**
| Constructor.
*/
// XXX repository
MeshMashine = function(tree, report) {
	this.tree    = tree;  // TODO make private
	this.history = [];
	this.report  = report;
};

/**
| Returns true if time is valid.
*/
MeshMashine.prototype._isValidTime = function(time) {
	return isInteger(time) && time >= 0 && time <= this.history.length;
};


/**
| Transforms a signature, possibly splitting it up into several.
*/
MeshMashine.prototype.transform = function(time, sign) {
	log('te', 'in', time, sign);
	if (!is(sign.path)) return sign;
	debug('PL', sign.path.length);
	debug('T',  time);
	debug('TZ', this.history.length);
	if (sign.path.length === 0) return sign;

	for(var t = time, tZ = this.history.length; t < tZ; t++) {
		var moment = this.history[t];
		log('te', 'transform one', t);

		switch(sign.constructor) {
		case Signature : sign = Transform.one(sign, moment.src, moment.trg); break;
		case Array :
			for(var a = 0, aZ = sign.length; a < aZ; a++) {
				var tom = Transform.one(sign[i], moment.src, moment.trg);
				switch (tom.constructor) {
				case Signature : sign[a] = tom; break;
				case Array :
					for(var b = 0, bZ = tom.length; b < bZ; b++) {
						sign.splice(a++, 0, tom[b]);
					}
				default : throw new Error('Invalid sign');
				}
			}
			break;
		default : throw new Error('Invalid sign');
		}
	}
	log('te', 'out', sign);
	return sign;
};


/**
| Reflects the state of the tree at a time.
| If path is not null it cares only to rebuild what is necessary to see the node.
*/
// TODO partial reflects
MeshMashine.prototype._reflect = function(time, path) {
	if (is(path)) { throw new Error('Not yet supported!'); }
	try {
		var reflect = this.tree;

		// playback
		for(var hi = this.history.length - 1; hi >= time; hi--) {
			var moment = this.history[hi];
			var asw = Alter.apply(reflect, moment.trg, moment.src, false);
			reflect = asw.tree;
		}
		return reflect;
	} catch (err) {
		// this should not ever fail, thus rethrow a lethal error
		err.ok = null;
		throw new Error(err.stack);
	}
};

/**
| Alters the repository.
*/
MeshMashine.prototype.alter = function(time, src, trg) {
	try {
		log('mm', 'alter time:', time, 'src:', src, 'trg:', trg);
		if (time < 0) time = this.history.length;
		if (!this._isValidTime(time)) return reject('invalid time');
		if (!(src instanceof Signature)) throw new Error('alter src not a Signature');
		if (!(trg instanceof Signature)) throw new Error('alter trg not a Signature');

		var tsrca = this.transform(time, src);
		var ttrga = this.transform(time, trg);

		// TODO beautify this, (especially the loops)
		var alts, i;
		if (!(tsrca instanceof Array) && !(ttrga instanceof Array)) {
			alts = { src : tsrca, trg : ttrga };  // TODO immute
		} else if (!(tsrca instanceof Array) && (ttrga instanceof Array))  {
			alts = [];
			for(i = 0; i < ttrga.length; i++) {
				alts[i] = { src : tsrca, trg : ttrga[1] };  // TODO immute
			}
		} else if ((tsrca instanceof Array) && !(ttrga instanceof Array)) {
			alts = [];
			for(i = 0; i < tsrca.length; i++) {
				alts[i] = { src : tsrca[i], trg : ttrga };  // TODO immute
			}
		}

		var apply = function (alt) {
			var result = Alter.apply(this.tree, alt.src, alt.trg, this.report);
			alt = { src : result.src, trg : result.trg}; // TODO immute
			this.history.push(alt);
			this.tree = result.tree;
		};

		// TODO ugly for
		if (alts instanceof Array) {
			for(i = 0; i < alts.length; i++) apply.call(this, alts[i]);
		} else {
			apply.call(this, alts);
		}

		return {
			ok: true,
			time: this.history.length,
			alts: alts
		};
	} catch(err) {
		// returns rejections but rethrows coding errors.
		log('fail', 'error', err);
		if (err.ok !== false) throw new Error(err.stack); else return err;
	}
};

/**
| Gets a subtree.
| TODO add timespans
*/
MeshMashine.prototype.get = function(time, path) {
	try {
		log('mm', 'get time:', time, ' path:', path);
		var reflect;

		if (time >= 0) {
			if (!this._isValidTime(time)) return reject('invalid time');
			reflect = this._reflect(time);
			reflect = Tree.getPath(reflect, path);
		} else {
			reflect = Tree.getPath(this.tree, path);
			time = this.history.length;
		}
		log('mm', 'ok', time, reflect);
		return {ok: true, time: time, node: reflect };
	} catch(err) {
		// returns rejections but rethrows coding errors.
		if (err.ok !== false) throw new Error(err.stack); else return err;
	}
};

/**
| Returns the current time position
| TODO remove
*/
MeshMashine.prototype.now = function() {
	log('mm', 'now');
	log('mm', 'ok', this.history.length);
	return {ok: true, time: this.history.length };
};

/**
| Returns all changes from time to now.
| TODO remove
*/
MeshMashine.prototype.update = function(time) {
	log('mm', 'update time:', time);
	if (!this._isValidTime(time)) return reject('invalid time');
	var update = [];
	for(var ti = time; ti < this.history.length; ti++) {
		update.push((this.history[ti]));
	}
	log('mm', 'ok', this.history.length, update);
	return {ok: true, time: this.history.length, update: update };
};

if (typeof(window) === 'undefined') {
	module.exports = MeshMashine;
}

}());
