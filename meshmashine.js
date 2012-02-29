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

var Path       = Jools.Path;
var Signature  = Jools.Signature;

var debug      = Jools.debug;
var log        = Jools.log;
var clone      = Jools.clone;
var deepFreeze = Jools.deepFreeze;
var is         = Jools.is;
var isnon      = Jools.isnon;
var isPath     = Jools.isPath;
var isInteger  = Jools.isInteger;
var isString   = Jools.isString;
var fixate     = Jools.fixate;
var reject     = Jools.reject;


function fail(args, aoffset) {
	var a = Array.prototype.slice.call(args, aoffset, args.length);
	for(var i = 2; i < arguments.length; i++) {
		a.push(arguments[i]);
	}
	var b = a.slice();
	b.unshift('fail');
	log.apply(null, b);
	throw reject(a.join(' '));
}

function check(condition) {
	if (!condition) fail(arguments, 1);
}

function checkWithin(v, low, high) {
	if (v < low || v > high) fail(arguments, 3, low, '<=', v, '<=', high);
}

/**
| Returns true if v .matches w or w .matches v
*/
function matches(v, w) {
	// TODO change to checkMatch
	if (v === w) return true;
	if (v.matches) return v.matches(w);
	if (w.matches) return w.matches(v);
	log('warn', 'matches failed cause neither has matches()');
	return false;
}

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
     ,.   .  .                  .
    / |   |  |- ,-. ,-. ,-. ,-. |- . ,-. ,-.
   /~~|-. |  |  |-' |   | | ,-| |  | | | | |
 ,'   `-' `' `' `-' '   ' ' `-^ `' ' `-' ' '
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
 A single alternation (point in history)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
function Alternation(src, trg) {
	if (!(src instanceof Signature)) throw new Error('Alternation.src is no siganture');
	if (!(trg instanceof Signature)) throw new Error('Alternation.trg is no siganture');
	this.src = src;
	this.trg = trg;
}

/**
| TODO
*/
Alternation.type = function(src, trg) {
	if (trg.proc === 'splice') return 'split';
	if (src.proc === 'splice') return 'join';

	if (src.proc === 'arrange') return 'place';
	if (trg.proc === 'arrange') return 'take';

	if (is(src.val) && !is(trg.at1)) return 'set';
	if (is(src.val) &&  is(trg.at1)) return 'insert';
	if (is(src.at1) &&  is(src.at2) && !is(trg.at1)) return 'remove';

	if (Jools.prissy) { log('fail', this); throw new Error('invalid type'); }

	return null;
};


/**
| ++Causal consistency++
*/

/**
| Alters a tree
*/
function alter(tree, src, trg, report) {
	var atype = Alternation.type(src, trg);
	var cm = 'alter('+atype+')';  // check message TODO optimize away

	log('alter', 'src:', src, 'trg:', trg, 'atype:', atype);
	var result;

	switch (atype) {
	case 'set'    : result = alterSet   (tree, src, trg, report); break;
	case 'join'   : result = alterJoin  (tree, src, trg, report); break;
	case 'split'  : result = alterSplit (tree, src, trg, report); break;
	case 'insert' : result = alterInsert(tree, src, trg, report); break;
	case 'remove' : result = alterRemove(tree, src, trg, report); break;
	case 'place'  : result = alterPlace (tree, src, trg, report); break;
	case 'take'   : result = alterTake  (tree, src, trg, report); break;
	default       : throw reject('invalid atype:', atype);
	}

	return result;
}

/**
| Alter: A new item is inserted or replaces an existing.
*/
function alterSet(tree, src, trg, report) {
	var cm = 'alterSet';

	check(!is(trg.at1), cm, 'trg.at1 must not exist.');
	check(is(src.val), cm, 'src.val missing');
	var path = trg.path;
	//var ppath = new Path(path, '--', 1);
	//var parent = tree.get(ppath);
	//if (path.get(-1) === '$new') path = Tree.newKey(tree, path);

	var save = Tree.getPath(tree, path);

	if (is(trg.val)) {
		check(matches(save, trg.val), cm, 'trg.val preset incorrectly');
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
}

/**
| Alter: A string is inserted into a string item.
*/
function alterInsert(tree, src, trg, report) {
	var cm = 'alterInsert';

	check(isPath(trg.path), cm, 'trg.path missing');
	var str = Tree.get(tree, trg.path);
	check(isString(str), cm, 'trg.path signates no string');

	trg = trg.attune(str, 'trg.path');

	// where trg span should end
	var tat2 = trg.at1 + src.val.length;
	if (is(trg.at2)) {
		check(trg.at2 === tat2, cm, 'trg.at2 preset incorrectly');
	} else {
		trg.at2 = tat2;
	}
	var nstr = str.substring(0, trg.at1) + src.val + str.substring(trg.at1);
	tree.mmSet(trg.path, nstr);

	if (report) {
		var parent = tree.get(trg.path, 0, -1);
		if (parent.report) parent.report('insert', trg.path.get(-1), trg.at1, src.val);
	}
	return { tree: tree, src: src, trg: trg };
}

/**
| Alter: a part of a string item is removed.
*/
function alterRemove(tree, src, trg, report) {
	var cm = 'alterRemove';
	var str = tree.get(src.path);
	check(isString(str), cm, 'src.path signates no string');

	src = src.attune(str, 'src.path');
	if (src.at1 === src.at2) { log('alter', 'removed nothing'); return; }

	var val = str.substring(src.at1, src.at2);
	if (isnon(trg.val)) {
		check(matches(val, trg.val), cm, 'trg.val preset incorrectly:',
			val, '!==', trg.val);
	} else {
		trg.val = val;
	}
	var nstr = str.substring(0, src.at1) + str.substring(src.at2);
	tree.mmSet(src.path, nstr);

	if (report) {
		var parent = tree.get(src.path, 0, -1);
		if (parent.report) parent.report('remove', src.path.get(-1), src.at1, src.at2, val);
	}
	return { tree: tree, src: src, trg: trg };
}

/**
| Alter: two texts are joined into one.
*/
function alterJoin(tree, src, trg, report) {
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

	checkWithin(key, 0, pivot.length -1, cm, 'splice out of range');

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
}

/**
| Alter: a text is split into two.
*/
function alterSplit(tree, src, trg, report) {
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
	checkWithin(key, 0, pivot.length, cm, 'splice out of range');

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
}

/**
| Alter: a value is placed into an alley(array)
*/
function alterPlace(tree, src, trg, report) {
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
}

/**
| Alter: a value is taken from an alley(array)
*/
function alterTake(tree, src, trg, report) {
	// an item is taken (removed) from an alley.
	var cm = alterTake;

	check(is(src.path), cm, 'src.path not present');
	check(is(src.at1),  cm, 'src.at1 not present');
	var alley = tree.get(src.path);
	check(alley && alley.isAlley, cm, 'src.path not an alley');
	check(src.at1 >= 0 && src.at1 <= alley.length, cm, 'src.at1 not inside alley');

	var val = alley.get(src.at1);
	if (is(trg.val)) {
		check(matches(val, trg.val), cm, 'trg.val preset incorrectly');
	} else {
		trg.val = val;
	}
	alley.splice(src.at1, 1);

	if (report && alley.report) alley.report('take', src.path.get(-1), src.at1, val);
	return { tree: tree, src: src, trg: trg };
}


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
	this.tree    = tree;
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
| Transforms a single signature (src or trg) on one historic moment
*/
MeshMashine.prototype.transformOnMoment = function(sign, alter) {
	if (!is(sign.path)) return sign;
	var src = alter.src;
	var trg = alter.trg;
	var atype = Alternation.type(src, trg);
	var src_i, trg_i, sig_i; // TODO split case into functions.
	switch(atype) {
	case 'split':
		if (!src.path.like(sign.path, src.pivot)) return sign;
		log('te', 'alter-split');
		src_i = src.path.get(src.pivot);
		sig_i = sign.path.get(src.pivot);
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
	case 'join':
		if (!trg.path.like(sign, trg.pivot)) return sign; // TODO this looks wrong
		log('te', 'alter-join');
		trg_i =  trg.path.get(trg.pivot);
		sig_i = sign.path.get(trg.pivot);
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
	case 'set':
		log('te', 'nothing to do');
		return sign;
	case 'insert':
		if (!trg.path || !trg.path.equals(sign.path)) return sign;
		log('te', 'insert');
		check(is(trg.at1) && is(trg.at2), 'history mangled');
		if (sign.at1 > trg.at1) { // or >= ?
			log('te', 'at1 += ',src.val.length);
			sign.at1 += src.val.length;
			if (is(sign.at2)) {
				log('te', 'at2 +=', src.val.length);
				sign.at2 += src.val.length;
			}
		}
		return sign;
	case 'remove':
		if (!src.path.equals(sign.path)) return sign;
		log('te', 'remove');
		check(is(src.at1) && is(src.at2), 'history mangled');
		//       123456789
		//         ^^^    <- removed
		//case1:       <->
		//case2:    <->
		if (sign.at1 > src.at1) {
			if (sign.at1 > src.at2) {
				log('te', 'at1 -=', trg.val.length);
				// case1
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
	case 'place' :
		if (!trg.path.like(sign.path)) return sign;
		log('te', 'place');
		trg_i =  trg.alley.get(-1);
		sig_i = sign.path.get(trg.alley.length);

		log('te', 'sig_i', sig_i, 'trg_i', trg_i);

		if (sig_i >= trg_i) {
			// insert was before -> index shifted
			log('te', 'place shifted');
			sign.path = sign.path.add(trg.alley.length, 1);
		}
		return sign;
	case 'take' :
		if (!src.alley.like(sign.path)) return sign;
		log('te', 'take');
		src_i =  src.path.get(-1);
		sig_i = sign.path.get(src.alley.length);
		log('te', 'sig_i', sig_i, 'src_i', src_i);

		if (sig_i >= src_i) {
			// take was before -> index shifted
			log('te', 'place shifted');
			sign.path = sign.path.add(src.alley.length, -1);
		}
		return sign;
	default :
		throw new Error('unknown atype: '+atype);
	}
};

/**
| Transforms a signature, possibly splitting it up into several.
*/
MeshMashine.prototype.transform = function(time, sign) {
	log('te', 'in', time, sign);
	if (!is(sign.path)) return sign;
	if (sign.path.length === 0) return sign;

	var signa = sign; // sign or array of signs // TODO dont rename
	for(var t = time; t < this.history.length; t++) {
		var moment = this.history[t];

		if (!(signa instanceof Array)) {
			signa = this.transformOnMoment(signa, moment);
		} else {
			for(var i = 0; i < signa.length; i++) {
				var tom = this.transformOnMoment(signa[i], moment);
				if (tom instanceof Array) {
					for(var tomi = 0; tomi < tom.length; tomi++) {
						signa.splice(i++, tom[tomi]);
					}
				} else {
					check(tom === signa[i], 'tom !== signa[i]');
				}
			}
		}
	}
	log('te', 'out', signa);
	return signa;
};


/**
| Reflects the state of the tree at a time.
| If path is not null it cares only to rebuild what is necessary to see the ida.
*/
// TODO partial reflects
MeshMashine.prototype._reflect = function(time, path) {

	// XXX TODO
	throw new Error('TODO');
	/*
	try {
		var reflect = new this.repository.constructor(this.repository);

		// playback
		for(var hi = this.history.length - 1; hi >= time; hi--) {
			var moment = this.history[hi];
			alter(reflect, moment.trg, moment.src, false);
		}
	} catch (err) {
		// this should not ever fail, thus rethrow a lethal error
		err.ok = null;
		throw new Error(err.stack);
	}
	return reflect.get(path);*/
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
			alts = new Alternation(tsrca, ttrga);
		} else if (!(tsrca instanceof Array) && (ttrga instanceof Array))  {
			alts = [];
			for(i = 0; i < ttrga.length; i++) {
				alts[i] = new Alternation(tsrca, ttrga[i]);
			}
		} else if ((tsrca instanceof Array) && !(ttrga instanceof Array)) {
			alts = [];
			for(i = 0; i < tsrca.length; i++) {
				alts[i] = new Alternation(tsrca[i], ttrga);
			}
		}

		var apply = function (alt) {
			var result = alter(this.tree, alt.src, alt.trg, this.report);
			alt = new Alternation(result.src, result.trg);
			deepFreeze(alt);  // @@ extra safety, but superflous.
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
			reflect = this._reflect(time, path);
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
