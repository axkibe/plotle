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


                       ,-,-,-.           .   ,-,-,-.           .
                       `,| | |   ,-. ,-. |-. `,| | |   ,-. ,-. |-. . ,-. ,-.
                         | ; | . |-' `-. | |   | ; | . ,-| `-. | | | | | |-'
                         '   `-' `-' `-' ' '   '   `-' `-^ `-' ' ' ' ' ' `-'
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

 The causal consistency / operation transformation engine for meshcraft.

 Authors: Axel Kittenberger
 License: MIT(Expat), see accompanying 'License'-file

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

/**
| Imports
*/
var Jools;
var Path;
var Sign;
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
	Path  = require('./path');
	Sign  = require('./sign');
	Tree  = require('./tree');
}

var debug        = Jools.debug;
var log          = Jools.log;
var check        = Jools.check;
var checkLimits  = Jools.checkLimits;
var clone        = Jools.clone;
var fixate       = Jools.fixate;
var fixateNoEnum = Jools.fixateNoEnum;
var immute       = Jools.immute;
var is           = Jools.is;
var isnon        = Jools.isnon;
var isArray      = Jools.isArray;
var isInteger    = Jools.isInteger;
var isString     = Jools.isString;
var matches      = Jools.matches;
var reject       = Jools.reject;
var isPath       = Path.isPath;

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  ,--. .
 | `-' |-. ,-. ,-. ,-. ,-.
 |   . | | ,-| | | | | |-'
 `--'  ' ' `-^ ' ' `-| `-'
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ,| ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
                    `'
 A change to a tree.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

/**
| Constructor:
|
|   Change(src, trg)  -or-
|   Change(o)  where o contains o.src and o.trg
*/
var Change = function(a1, a2) {
	var src, trg;
	switch (arguments.length) {
	case 2:
		src = a1;
		trg = a2;
		break;
	case 1:
		src = a1.src;
		trg = a1.trg;
		break;
	default :
		throw new Error('#argument fail');
	}

	if (src.constructor === Sign) {
		this.src = src;
	} else {
		if (src.path && !isPath(src.path)) src.path = new Path(src.path);
		this.src = new Sign(src);
	}

	if (trg.constructor === Sign) {
		this.trg = trg;
	} else {
		if (trg.path && !isPath(trg.path)) trg.path = new Path(trg.path);
		this.trg = new Sign(trg);
	}

	immute(this);
};

/**
| Returns the type of an Alternation.
*/
Change.prototype.type = function() {
	if (is(this._type)) { return this._type; }

	var src = this.src;
	var trg = this.trg;
	var type;

	/**/ if (trg.proc === 'splice')                       { type = 'split';  }
	else if (src.proc === 'splice')                       { type = 'join';   }
	else if (is(src.val) && !is(trg.at1))                 { type = 'set';    }
	else if (is(src.val) &&  is(trg.at1))                 { type = 'insert'; }
	else if (is(src.at1) &&  is(src.at2) && !is(trg.at1)) { type = 'remove'; }
	else if (is(trg.rank))                                { type = 'rank';   }
	else {
		type = null;
		if (Jools.prissy) { log('fail', this); throw new Error('invalid type'); }
	}

	fixateNoEnum(this, '_type', type);
	return type;
};

/**
| Returns a reversed change.
*/
Change.prototype.reverse = function() {
	if (is(this._reverse)) { return this._reverse; }
	var r = new Change(this.trg, this.src);
	fixateNoEnum(this, '_reverse', r);
	fixateNoEnum(r, '_reverse', this);
	return r;
};

/**
| Change emulates an Array with the length of 1
*/
Change.prototype.length = 1;

Object.defineProperty(Change.prototype, 0, {
	get: function() { return this; }
});


/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  ,--. .                   ,,--.                 .
 | `-' |-. ,-. ,-. ,-. ,-. |`, | ,-. ,-. ,-. ,-. |- . ,-. ,-.
 |   . | | ,-| | | | | |-' |   | | | |-' |   ,-| |  | | | | |
 `--'  ' ' `-^ ' ' `-| `-' `---' |-' `-' '   `-^ `' ' `-' ' '
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ,|~ ~ ~ ~ ~ ~|~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
                    `'           '
 Changes a tree according to a change.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

/**
| Performes one or many changes on a tree
*/
var changeTree = function(tree, chgX) {
	if (arguments.length !== 2) { throw new Error('changeTree arguments fail'); }
	var aChgX = null;

	for(var a = 0, aZ = chgX.length; a < aZ; a++) {
		var chg = chgX[a];

		var ctype = chg.type();
		log('change', 'src:', chg.src, 'trg:', chg.trg, 'type:', ctype);

		var op = ChangeOps[ctype];
		if (!op) throw reject('invalid change: '+ctype);
		var r = op(tree, chg);
		if (r === null) { continue; }

		var rChg = new Change(r.src, r.trg);
		tree = r.tree;

		if (aZ > 1) {
			if (aChgX === null) { aChgX = []; }
			aChgX.push(rChg);
		} else {
			aChgX = rChg;
		}
	}

	return { tree: tree, chgX : aChgX };
};

/**
| The change operations.
*/
var ChangeOps = {};

/**
| Alter: A new item is inserted or replaces an existing.
*/
ChangeOps.set = function(tree, chg) {
	var cm = 'change.set';
	var src = chg.src;
	var trg = chg.trg;
	var pivot = null;
	var key = null;

	check(!is(trg.at1), cm, 'trg.at1 must not exist.');
	check(is(src.val), cm, 'src.val missing');


	if (trg.path.get(-1) === '$new') {
		pivot = tree.getPath(trg.path, -1);
		key = pivot.newUID();
		trg = new Sign(trg, 'path', new Path(trg.path, -1, key));
	}

	// stores the old value to be able restore the history
	var save = tree.getPath(trg.path);
	if (!is(save)) save = null;
	trg = trg.affix(is, cm, 'trg', 'val', save);
	src = src.affix(is, cm, 'src', 'path', trg.path);

	if (!is(trg.rank)) {
		tree = tree.setPath(trg.path, src.val);
	} else {
		src = src.affix(is, cm, 'src', 'rank', trg.rank);

		pivot = pivot || tree.getPath(trg.path, -1);
		if (key === null) key = trg.path.get(-1);
		if (src.val !== null) {
			pivot = tree.grow(pivot,
				key, src.val,
				'+', trg.rank, key
			);
		} else {
			check(trg.rank === null, cm, 'val <- null implies rank <- null');
			var orank = pivot.rankOf(key);
			pivot = tree.grow(pivot,
				key, src.val,
				'-', orank
			);
		}
		tree = tree.setPath(trg.path, pivot, -1);
	}

	return { tree: tree, src: src, trg: trg };
};

/**
| Alter: A string is inserted into a string item.
*/
ChangeOps.insert = function(tree, chg) {
	var cm = 'change.insert';
	var src = chg.src;
	var trg = chg.trg;

	check(isPath(trg.path), cm, 'trg.path missing');
	var str = tree.getPath(trg.path);
	check(isString(str), cm, 'trg.path signates no string');

	// where trg span should end
	var tat2 = trg.at1 + src.val.length;

	trg = trg.affix(is, cm, 'trg', 'at2', tat2);
	var nstr = str.substring(0, trg.at1) + src.val + str.substring(trg.at1);
	tree = tree.setPath(trg.path, nstr);

	return { tree: tree, src: src, trg: trg };
};

/**
| Alter: a part of a string item is removed.
*/
ChangeOps.remove = function(tree, chg) {
	var cm = 'change.remove';
	var src = chg.src;
	var trg = chg.trg;

	check(isPath(src.path), cm, 'src.path missing');
	var str = tree.getPath(src.path);
	check(isString(str), cm, 'src.path signates no string');

	if (src.at1 === src.at2) {
		log('change', 'removed nothing');
		return null;
	}

	var val = str.substring(src.at1, src.at2);
	trg = trg.affix(isnon, cm, 'trg', 'val', val);
	var nstr = str.substring(0, src.at1) + str.substring(src.at2);

	tree = tree.setPath(src.path, nstr);

	return { tree: tree, src: src, trg: trg };
};

/**
| Alter: two texts are joined into one.
*/
ChangeOps.join = function(tree, chg) {
	var cm   = 'change.join';
	var src  = chg.src;
	var trg  = chg.trg;
	var path = trg.path;

	var at1 = trg.at1;
	check(is(at1), cm, 'trg.at1 missing');
	var text = tree.getPath(path);
	check(isString(text), cm, 'trg signates no text');

	var key = path.get(-2);
	var pivot   = tree.getPath(path, -2);
	var pattern = tree.getPattern(pivot);
	check(pattern.ranks, cm, 'pivot has no ranks');
	var kn  = pivot.rankOf(key);
	check(kn >= 0, cm, 'invalid line key');
	check(kn < pivot.ranks.length,  cm, 'cannot join last line');
	var key2 = pivot.ranks[kn + 1];
	var path2 = new Path(path, -2, key2);
	src = src.affix(is, cm, 'src', 'path', path2);

	var para1 = pivot.copse[key];
	var para2 = pivot.copse[key2];
	// @@ check other keys to be equal
	para1 = tree.grow(para1,
		'text', para1.text + para2.text
	);
	pivot = tree.grow(pivot,
		key, para1,
		key2, null,
		'-', kn + 1
	);

	tree = tree.setPath(path, pivot, -2);

	return { tree: tree, src: src, trg: trg };
};

/**
| Alter: a text is split into two.
*/
ChangeOps.split = function(tree, chg) {
	var cm   = 'change.split';
	var src  = chg.src;
	var trg  = chg.trg;
	var path = src.path;

	var at1 = src.at1;
	check(is(at1), cm, 'src.at1 missing');
	var text = tree.getPath(path);
	check(isString(text), cm, 'src signates no text');

	var pivot   = tree.getPath(path, -2);
	var pattern = tree.getPattern(pivot);
	check(pattern.ranks, cm, 'pivot has no ranks');

	var vKey;
	if (is(trg.path)) {
		vKey = trg.path.get(-2);
	} else {
		vKey = pivot.newUID();
		trg = new Sign(trg,
			'path', new Path(src.path, -2, vKey)
		);
	}
	check(!isnon(pivot.copse[vKey]), cm, 'newUID not vacant: ', vKey);

	var key = path.get(-2);
	var kn  = pivot.rankOf(key);
	check(kn >= 0, cm, 'invalid line key');

	var para1, para2;
	para1 = pivot.copse[key];
	para2 = tree.grow(para1,
		'text', text.substring(at1, text.length)
	);
	para1 = tree.grow(para1,
		'text', text.substring(0, at1)
	);
	pivot = tree.grow(pivot,
		key,  para1,
		vKey, para2,
		'+', kn + 1, vKey
	);

	tree  = tree.setPath(path, pivot, -2);

	return { tree: tree, src: src, trg: trg };
};

/**
| A twig's rank in a copse is changed.
*/
ChangeOps.rank = function(tree, chg) {
	var cm  = 'change.rank';
	var src = chg.src;
	var trg = chg.trg;

	check(is(src.path), cm, 'src.path not present');
	check(is(trg.rank), cm, 'trg.rank not present');

	var pivot = tree.getPath(src.path, -1);
	check(is(pivot.ranks), cm, 'pivot not an ranks');
	var key = src.path.get(-1);
	var orank = pivot.rankOf(key);
	if (orank < 0) throw reject('invalid key :'+key);
	// @@ if (orank === trg.rank) return null;

	src = src.affix(is, cm, 'src', 'rank', orank);
	trg = trg.affix(is, cm, 'trg', 'path', src.path);
	pivot = tree.grow(pivot, '-', orank, '+', trg.rank, key);
	tree = tree.setPath(src.path, pivot, -1);
	return { tree: tree, src: src, trg: trg };
};

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ,--,--'                                   .
 `- | ,-. ,-. ,-. ,-. ," ,-. ,-. ,-,-. ,-. |- . ,-. ,-.
  , | |   ,-| | | `-. |- | | |   | | | ,-| |  | | | | |
  `-' '   `-^ ' ' `-' |  `-' '   ' ' ' `-^ `' ' `-' ' '
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ' ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

 Action Transformation. Changes signatures due to past alternations.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
/**
| List of formation action on different alternation types
*/
var TFXOps = {};

/**
| Transforms a signature on a single change
| If the signature is a span, it can return an array of signs.
*/
var tfxSign1 = function(sign, chg) {
	if (chg.length !== 1) { throw new Error('tfxSign1 chg.length !== 1'); }
	if (!is(sign.path)) return sign;

	var op = TFXOps[chg.type()];
	if (!op) { throw new Error('tfxSign1, no op'); }
	return op(sign, chg.src, chg.trg);  // @@ give, chg.
};

/**
| Transforms a signature on a list of alternations.
| If the signature is a span, it can return an array of signs.
|
| @@ check if t1/t2 params are ever user
*/
var tfxSign = function(sign, chgX) {
	log('tfx', 'tfxSign', sign, chgX);

	if (arguments.length !== 2) { throw new Error('tfxSign argument fail (n)'); }
	if (sign.constructor !== Sign) { throw new Error('tfxSign argument faili (1)'); }

	if (!is(sign.path) || sign.path.length === 0) {
		log('tfx', 'out', sign);
		return sign;
	}

	var signX = sign;

	for(var t = 0, tZ = chgX.length; t < tZ; t++) {
		var chg = chgX[t];

		switch(signX.constructor) {

		case Sign :
			signX = tfxSign1(signX, chg);
			break;

		case Array :
			for(var a = 0, aZ = signX.length; a < aZ; a++) {
				var fs = tfxSign1(sign[a], chg);
				if (fs === null) {
					sign.splice(a--, 1);
					continue;
				}
				switch (fs.constructor) {
				case Sign :
					signX[a] = fs;
					break;
				case Array :
					for(var b = 0, bZ = fs.length; b < bZ; b++) {
						signX.splice(a++, 0, fs[b]);
					}
					break;
				default :
					throw new Error('Invalid fs');
				}
			}
			break;

		default :
			throw new Error('Invalid signX');
		}
	}

	log('tfx', 'out', signX);
	return signX;
};

/**
| TODO
*/
var tfxChg = function(chg, chgX) {
	log('tfx', 'tfxChg', chg, chgX);
	if (chg.constructor !== Change) {
		log('fail','tfxChg param error', chg.constructor.name, chg); // TODO
		throw new Error('tfxChg param error');
	}

	var srcX = tfxSign(chg.src, chgX);
	var trgX = tfxSign(chg.trg, chgX);

	if (srcX === null || trgX === null) {
		log('tfx', 'transformed to null');
		return null;
	}

	var a, aZ, asw;
	var srcA = isArray(srcX);
	var trgA = isArray(trgX);

	if (!srcA && !trgA) {
		return new Change(srcX, trgX);
	} else if (!srcA && trgA)  {
		asw = [];
		for(a = 0, aZ = trgX.length; a < aZ; a++) {
			asw[a] = new Change(srcX, trgX[a]);
		}
		return asw;
	} else if (srcA && !trgA) {
		asw = [];
		for(a = 0, aZ = srcX.length; a < aZ; a++) {
			asw[a] = new Change(srcX[a], trgX);
		}
		return asw;
	} else {
		throw new Error('srcX and trgX arrays :-(');
	}
};

/**
| Changes an a Change or Array of Changes upon a Change or Array of Changes.
*/
var tfxChgX = function(chgX1, chgX2) {
	switch(chgX1.constructor) {
	case Change :
		return tfxChg(chgX1, chgX2);
	case Array :
		var chgA = [];
		for(var a = 0, aZ = chgX1.length; a < aZ; a++) {
			var rX = tfxChg(chgX1[a], chgX2);
			for(var b = 0, bZ = rX.length; b < bZ; b++) {
				chgA.push(rX[b]);
			}
		}
		return chgA;
	default :
		throw new Error('invalid chgX1');
	}
};

/**
| Transforms a signature on one a split.
*/
TFXOps.split = function(sign, src, trg) {
	// src.path -- the line splitted
	// trg.path -- the new line
	if (!src.path || !src.path.equals(sign.path)) return sign;

	// @@ form ranks
	// simpler case signature is only one point
	if (!is(sign.at2)) {
		log('tfx', 'split (simple)');
		if (sign.at1 < src.at1) return sign;
		return new Sign(sign, 'path', trg.path, 'at1', sign.at1 - src.at1);
	}

	// A more complicated signature is affected.
	//                   ............
	// Span                  mmmmm
	// Splits cases:      1    2    3

	if (sign.at2 <= src.at1) {
		log('tfx', 'split (span, case 1)');
		return sign;
	}

	if (sign.at1 >= src.at1) {
		log('tfx', 'split (span, case 2)');
		// signature goes into splitted line instead
		return new Sign(sign,
			'path', trg.path,
			'at1', sign.at1 - src.at1,
			'at2', sign.at2 - src.at1
		);
	}
	log('tfx', 'split (span, case 3');
	// the signature is splited into a part that stays and one that goes to next line.

	return [
		new Sign(sign,
			'at2', src.at1
		),
		new Sign(sign,
			'path', trg.path,
			'at1', 0,
			'at2', sign.at2 - src.at1
		)
	];
};

/**
| Transforms a signature on a join.
*/
TFXOps.join = function(sign, src, trg) {
	// trg.path is the line that got the join
	// src.path is the line that was removed
	if (!src.path || !sign.path.equals(src.path)) return sign;
	if (!trg.path) throw new Error('join missing trg.path');

	// @@ tfx ranks

	log('tfx', 'join', sign);
	if (!is(sign.at2)) {
		return new Sign(sign,
			'path', trg.path,
			'at1', sign.at1 + trg.at1
		);
	} else {
		return new Sign(sign,
			'path', trg.path,
			'at1', sign.at1 + trg.at1,
			'at2', sign.at2 + trg.at1
		);
	}
};

/**
| Transforms a signature on a join.
*/
TFXOps.set = function(sign, src, trg) {
	log('tfx', 'set');
	return sign;
};


/**
| Transforms a signature on an insert.
*/
TFXOps.insert = function(sign, src, trg) {
	if (!trg.path || !trg.path.equals(sign.path)) return sign;
	log('tfx', 'insert');
	if (!is(trg.at1) || !is(trg.at2)) throw new Error('history mangled');

	if (sign.at1 < trg.at1) return sign;
	var len = src.val.length;

	return (is(sign.at2) ?
		new Sign(sign,
			'at1', sign.at1 + len,
			'at2', sign.at2 + len
		) :
		new Sign(sign,
			'at1', sign.at1 + len
		)
	);
};

/**
| Transforms a signature on a remove
*/
TFXOps.remove = function(sign, src, trg) {
	if (!src.path || !src.path.equals(sign.path)) return sign;
	if (!is(src.at1) || !is(src.at2)) { throw new Error('history mangled'); }
	var len = src.at2 - src.at1;

	// simpler case signature is only one point
	if (!is(sign.at2)) {
		// src (removed span)      ######
		// sign, case0:        +   '    '      (sign to left,  no effect)
		// sign, case1:            ' +  '      (sign in middle, move to left)
		// sign, case2:            '    ' +    (sign to right, substract)

		if (sign.at1 <= src.at1) {
			log('tfx', 'remove (case s0)');
			return sign;
		}

		if (sign.at1 <= src.at2) {
			log('tfx', 'remove (case s1)');
			return new Sign(sign, 'at1', src.at1);
		}

		log('tfx', 'remove (case s2)');
		return new Sign(sign, 'at1', sign.at1 - len);
	}

	// More complicated signature is affected.
	// Supposedly its a remove as well.
	//
	//                     ............
	// src (removed span)      ######
	// sign, case0:        +++ '    '      (sign to left,  no effect)
	// sign, case1:            '    ' +++  (sign to right, move to left)
	// sign, case2:          +++++++++     (sign splitted into two)
	// sign, case3:            ' ++ '      (sign completely removed)
	// sign, case4:          ++++   '      (part of sign removed)
	// sign, case5:            '   ++++    (part of sign removed)

	if (sign.at2 <= src.at1) {
		log('tfx', 'remove (case 0)');
		return sign;
	}
	if (sign.at1 >= src.at2) {
		log('tfx', 'remove (case 1)');
		return new Sign(sign, 'at1', sign.at1 - len, 'at2', sign.at2 - len);
	}
	if (sign.at1 < src.at1 && sign.at2 > src.at2) {
		log('tfx', 'remove (case 2)');
		return new Sign(sign, 'at2', sign.at2 - len);
	}
	if (sign.at1 >= src.at1 && sign.at2 <= src.at2) {
		log('tfx', 'remove (case 3)');
		return null;
	}
	if (sign.at1 < src.at1 && sign.at2 <= src.at2) {
		log('tfx', 'remove (case 4)');
		return new Sign(sign, 'at2', src.at1);
	}
	if (sign.at1 <= src.at2 && sign.at2 > src.at2) {
		log('tfx', 'remove (case 5)');
		return new Sign(sign, 'at2', src.at2);
	}
	// should never happen
	throw new Error('remove no case fitted? '+sign.at1+'-'+sign.at2+' '+src.at1+'-'+src.at2);
};

/**
| Transforms a signature on a rank
*/
TFXOps.rank = function(sign, src, trg) {
	if (!src.path || !src.path.equals(sign.path)) return sign;
	log('tfx', 'rank');
	// TODO transform other rank commands
	return sign;
};


MeshMashine = {
	Change      : Change,

	tfxChg      : tfxChg,
	tfxChgX     : tfxChgX,
	tfxSign     : tfxSign,
	changeTree  : changeTree
};

/**
| Node
*/
if (typeof(window) === 'undefined') {
	module.exports = MeshMashine;
}

}());
