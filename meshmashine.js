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
}

var Path       = Jools.Path;
var Signature  = Jools.Signature;

var debug      = Jools.debug;
var log        = Jools.log;
var clone      = Jools.clone;
var deepFreeze = Jools.deepFreeze;
var is         = Jools.is;
var isnon      = Jools.isnon;
var isString   = Jools.isString;
var isInteger  = Jools.isInteger;
var fixate     = Jools.fixate;
var reject     = Jools.reject;


function fail(args, aoffset) {
	var a = Array.prototype.slice.call(args, aoffset, args.length);
	for(var i = 2; i < arguments.length; i++) {
		a.push(arguments[i]);
	}
	var b = a.slice();
	b.unshift('fail');
	log.apply(this, b);
	throw reject(a.join(' '));
}

function check(condition) {
	if (!condition) fail(arguments, 1);
}

function checkWithin(v, low, high) {
	if (v < low || v > high) fail(arguments, 3, low, '<=', v, '<=', high);
}


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

	if (src.proc === 'arrange') return 'alley-place';
	if (trg.proc === 'arrange') return 'alley-take';

	if (is(src.val) && !is(trg.at1)) return 'set';
	if (is(src.val) &&  is(trg.at1)) return 'insert';
	if (is(src.at1) &&  is(src.at2) && !is(trg.at1)) return 'remove';

	if (Jools.prissy) { log('fail', this); throw new Error('invalid type'); }

	return null;
}


/**
| ++Causal consistency++
*/

/**
| Alters the repository.
*/
function alter(meshtree, src, trg, telling, cogging) {
	var atype = Alternation.type(src, trg);
	var cm = 'alter('+atype+')';

	log('alter', 'src:', src, 'trg:', trg, 'atype:', atype);
	switch (atype) {
	case 'split' :
		// a string item is splitted into two.

		check(is(src.at1), cm, 'src.at1 missing');
		check(isInteger(src.pivot), cm, 'src.pivot not an integer');

		var pivot = meshtree.get(src.path, 0, src.pivot);
		check(pivot.isAlley, cm, 'src.path[src.pivot] not an alley');

		var str = meshtree.get(src.path);
		check(isString(str), cm, 'src.path signates no string');

		check(src.pivot === src.path.length - 2,  cm, 'currently cannot splice trees');
		src = src.attune(str, 'src.path');

		var sig_splice = src.path.get(src.pivot);
		checkWithin(sig_splice, 0, pivot.length, cm, 'splice out of range');
		check(src.path.get(-1) === 'text', cm, 'split must be on .text');

		var ppre = pivot.get(sig_splice);

		// no rejects after here
		var pnew = new ppre.constructor(ppre);
		if (cogging) {
			pnew.parent = ppre.parent;
			pnew.key$ = ppre.key$ + 1;
		}

		var text = ppre.get('text');
		pnew.mmSet('text', text.substring(src.at1));
		ppre.mmSet('text', text.substring(0, src.at1));

		pivot.splice(sig_splice + 1, 0, pnew);

		if (telling) {
			if (pivot.listen) pivot.tell('split', src.path.get(src.pivot), src.at1, pnew);
			if (ppre.listen)   ppre.tell('split', src.path.get(-1), src.at1, pnew);
		}
		break;
	case 'join' :
		// two string items are joined into one.

		check(is(trg.at1), cm, 'trg.at1 missing');
		check(isInteger(trg.pivot), cm, 'trg.pivot not an integer');

		var pivot = meshtree.get(trg.path, 0, trg.pivot);

		check(pivot.isAlley, cm, 'trg.path[pivot] not an Alley');

		var str = meshtree.get(trg.path);

		check(isString(str, cm, 'trg.path signates no string'));
		check(trg.pivot === trg.path.length - 2, cm, 'corrently cannot splice trees');

		trg = trg.attune(str, 'trg.path');
		var sig_splice = trg.path.get(trg.pivot);

		checkWithin(sig_splice, 0, pivot.length -1, cm, 'splice out of range');
		check(trg.path.get(trg.pivot + 1) === 'text', cm, 'join must be on .text');

		var ppre = pivot.get(sig_splice);
		var pnex = pivot.get(sig_splice + 1);

		check(ppre.constructor === pnex.constructor, 'cannot join different types');

		ppre.mmSet('text', ppre.get('text') + pnex.get('text'));
		pivot.splice(sig_splice + 1, 1);

		if (telling) {
			if (pivot.listen) pivot.tell('join', trg.path.get(trg.pivot), trg.at1, ppre);
			if (ppre.listen) ppre.tell('join>', trg.path.get(-1), trg.path.get(trg.pivot), trg.at1);
			if (pnex.listen) pnex.tell('join<', trg.path.get(-1), trg.path.get(trg.pivot), trg.at1);
		}
		break;
	case 'set':
		// a new item is inserted or replaces an existing

		check(!is(trg.at1), cm, 'trg.at1 must not exist.');
		var parent = meshtree.get(trg.path, 0, -1);

		if (trg.path.get(-1) === '$new') {
			log('alter', 'grow new');
 			trg.path = parent.grow(trg.path);
		}

		var save = meshtree.get(trg.path);
		if (is(trg.val)) {
			check(matches(save, trg.val), cm, 'trg.val preset incorrectly');
		} else {
			if (!is(save)) save = null;
			// TODO remove evil copy for immutables
			trg.val = JSON.parse(JSON.stringify(save));
		}

		if (is(src.path)) {
			check(trg.path.equals(src.path), cm, 'src.path preset incorrectly');
		} else {
			src = new Signature(src, 'path', trg.path);
		}

		meshtree.mmSet(trg.path, src.val);

		if (telling && parent.listen) parent.tell('set', trg.path.get(-1), src.val);
		break;
	case 'insert':
		// a string is inserted into a string item.

		var str = meshtree.get(trg.path);
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
		meshtree.mmSet(trg.path, nstr);

		if (telling) {
			var parent = meshtree.get(trg.path, 0, -1);
			if (parent.listen) parent.tell('insert', trg.path.get(-1), trg.at1, src.val);
		}
		break;
	case 'remove':
		// a part of a string item is removed.

		var str = meshtree.get(src.path);
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
		meshtree.mmSet(src.path, nstr);

		if (telling) {
			var parent = meshtree.get(src.path, 0, -1);
			if (parent.listen) parent.tell('remove', src.path.get(-1), src.at1, src.at2, val);
		}
		break;

	case 'alley-place' :
		// a new item is placed (inserted) into an alley.

		check(is(src.val),  cm, 'src.val not present');
		check(is(trg.path), cm, 'trg.path not present');
		check(is(trg.at1),  cm, 'trg.at1 not present');
		var alley = meshtree.get(trg.path);
		check(alley && alley.isAlley, cm, 'trg.path not an alley');

		if (trg.at1 === '$top') trg.at1 = 0;
		if (trg.at1 === '$end') trg.at1 = alley.length;
		check(trg.at1 >= 0 && trg.at1 <= alley.length, cm, 'trg.at1 not inside alley');

		alley.splice(trg.at1, 0, src.val);

		if (telling && alley.listen) alley.tell('alley-place', trg.path.get(-1), trg.at1, src.val);
		break;

	case 'alley-take' :
		// an item is taken (removed) from an alley.

		check(is(src.path), cm, 'src.path not present');
		check(is(src.at1),  cm, 'src.at1 not present');
		var alley = meshtree.get(src.path);
		check(alley && alley.isAlley, cm, 'src.path not an alley');
		check(src.at1 >= 0 && src.at1 <= alley.length, cm, 'src.at1 not inside alley');

		var val = alley.get(src.at1);
		if (is(trg.val)) {
			check(matches(val, trg.val), cm, 'trg.val preset incorrectly');
		} else {
			trg.val = val;
		}
		alley.splice(src.at1, 1);

		if (telling && alley.listen) alley.tell('alley-take', src.path.get(-1), src.at1, val);
		break;

	default:
		throw reject('invalid atype:', atype);
	}
	
	return new Alternation(src, trg);
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
MeshMashine = function(RootType, telling, cogging) {
	this.repository = new RootType();
	this.history    = [];
	this.telling    = telling;
	this.cogging    = cogging;
}

/**
| Returns true if time is valid.
*/
MeshMashine.prototype._isValidTime = function(time) {
	return isInteger(time) && time >= 0 && time <= this.history.length;
}

/**
| Transforms a single signature (src or trg) on one historic moment
*/
MeshMashine.prototype.transformOnMoment = function(sign, alter) {
	if (!is(sign.path)) return sign;
	var src = alter.src;
	var trg = alter.trg;
	var atype = alter.type();
	switch(atype) {
	case 'split':
		if (!src.path.like(sign.path, src.pivot)) return sign;
		log('te', 'alter-split');
		var src_i = src.path.get(src.pivot);
		var sig_i = sign.path.get(src.pivot);
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
	case 'set':
		log('te', 'nothing to do');
		return sign;
	case 'insert':
		if (!trg.path || !trg.path.equals(sign.path)) return sign;
		log('te', 'alter-insert');
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
		log('te', 'alter-remove');
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
	case 'alley-place' :
		if (!trg.path.like(sign.path)) return sign;
		log('te', 'alter-alley-place');
		var trg_i =  trg.alley.get(-1);
		var sig_i = sign.path.get(trg.alley.length);

		log('te', 'sig_i', sig_i, 'trg_i', trg_i);

		if (sig_i >= trg_i) {
			// insert was before -> index shifted
			log('te', 'place shifted');
			sign.path = sign.path.add(trg.alley.length, 1);
		}
		return sign;
	case 'alley-take' :
		if (!src.alley.like(sign.path)) return sign;
		log('te', 'alter-alley-take');
		var src_i =  src.path.get(-1);
		var sig_i = sign.path.get(src.alley.length);
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
}

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
}


/**
| Reflects the state of the repository at time.
| If path is not null it cares only to rebuild what is necessary to see the ida.
*/
// TODO partial reflects
MeshMashine.prototype._reflect = function(time, path) {
	try {
		var reflect = new this.repository.constructor(this.repository);

		// playback
		for(var hi = this.history.length - 1; hi >= time; hi--) {
			var moment = this.history[hi];
			alter(reflect, moment.trg, moment.src, false, this.cogging);
		}
	} catch (err) {
		// this should not ever fail, thus rethrow a lethal error
		err.ok = null;
		throw new Error(err.stack);
	}
	return reflect.get(path);
}

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

		var alts;
		if (!(tsrca instanceof Array) && !(ttrga instanceof Array)) {
			alts = new Alternation(tsrca, ttrga);
		} else if (!(tsrca instanceof Array) && (ttrga instanceof Array))  {
			alts = [];
			for(var i = 0; i < ttrga.length; i++) {
				alts[i] = new Alternation(clone(tsrca), ttrga[i]);
			}
		} else if ((tsrca instanceof Array) && !(ttrga instanceof Array)) {
			alts = [];
			for(var i = 0; i < tsrca.length; i++) {
				alts[i] = new Alternation(tsrca[i], clone(ttrga));
			}
		}

		var apply = function (alt) {
			alt = alter(this.repository, alt.src, alt.trg, this.telling, this.cogging);
			deepFreeze(alt);  // @@ extra safety, but superflous.
			this.history.push(alt);
		}

		if (alts instanceof Array) {
			for(var i = 0; i < alts.length; i++) apply.call(this, alts[i]);
		} else {
			apply.call(this, alts);
		}

		return {
			ok: true,
			time: this.history.length,
			alts: alts,
		};
	} catch(err) {
		// returns rejections but rethrows coding errors.
		log('fail', 'error', err);
		if (err.ok !== false) throw new Error(err.stack); else return err;
	}
}

/**
| Gets a node (which can go up to the complete repository).
| TODO add timespans
*/
MeshMashine.prototype.get = function(time, path) {
	try {
		log('mm', 'get time:', time, ' path:', path);
		if (time >= 0) {
			if (!this._isValidTime(time)) return reject('invalid time');

			var reflect = this._reflect(time, path);
			// remove nulls
			//for(var key in reflect) {
			//	if (reflect[key] === null) delete reflect[key];
			//}
		} else {
			reflect = this.repository.get(path);
			time = this.history.length;
		}
		log('mm', 'ok', time, reflect);
		return {ok: true, time: time, node: reflect };
	} catch(err) {
		// returns rejections but rethrows coding errors.
		if (err.ok !== false) throw new Error(err.stack); else return err;
	}
}

/**
| Returns the current time position
| TODO remove
*/
MeshMashine.prototype.now = function() {
	log('mm', 'now');
	log('mm', 'ok', this.history.length);
	return {ok: true, time: this.history.length };
}

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
}

if (typeof(window) === 'undefined') {
	module.exports = MeshMashine;
}

}());
