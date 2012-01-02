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
	Jools = require('./meshcraft-jools');
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
var jsonfy     = Jools.jsonfy;
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



function keysLength(o) {
	var n = 0;
	for(var k in o) {
		n++;
	}
	return n;
}

function deepEqual(o1, o2) {
	if (o1 === o2) return true;
	if (keysLength(o1) !== keysLength(o2)) return false;

	for(var k in o1) {
		return deepEqual(o1[k], o2[k]);
	}
	return true;
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

Alternation.prototype.type = function(backward) {
	var src = backward ? this.trg : this.src;
	var trg = backward ? this.src : this.trg;
	if (trg.proc === 'splice') return 'split';
	if (src.proc === 'splice') return 'join';
	if (is(src.val) && !is(trg.at1)) return 'set';
	if (is(src.val) &&  is(trg.at1)) return 'insert';
	if (is(src.at1) &&  is(src.at2) && !is(trg.at1)) return 'remove';
	if (Jools.prissy) {
		log('fail', this);
		throw new Error('invalid type');
	}
	return null;
}


/**
| ++Causal consistency++
*/

/**
| Alters the repository.
*/
function alter(meshtree, alternation, backward) {
	var atype = alternation.type(backward);
	var cm = 'alter('+atype+')';
	var src = !backward ? alternation.src : alternation.trg;
	var trg = !backward ? alternation.trg : alternation.src;

	log('alter', 'src:', src, 'trg:', trg, 'atype:', atype);
	switch (atype) {
	case 'split' :
		check(is(src.at1), cm, 'src.at1 missing');
		check(isInteger(src.pivot), cm, 'src.pivot not an integer');

		var pivotNode = meshtree.get(src.path, 0, src.pivot);
		check(pivotNode.isAlley, cm, 'src.path[src.pivot] not an Alley');

		var str = meshtree.get(src.path);
		check(isString(str), cm, 'src.path signates no string');

		check(src.pivot === src.path.length - 2,  cm, 'currently cannot splice trees');
		src.attune(str, 'src.path');
		var sig_splice = src.path.get(src.pivot);
		checkWithin(sig_splice, 0, pivotNode.length, cm, 'splice out of range');

		var ppre = pivotNode.get(sig_splice);

		// no rejects after here
		var pnew = new ppre.constructor();
		var ksplit = src.path.get(-1);
		ppre.forEach(function(v, k) {
			if (k === ksplit) {
				pnew.set(k, v.substring(src.at1));
				ppre.set(k, v.substring(0, src.at1));
			} else {
				pnew.set(k, v);
			}
		});
		pivotNode.splice(sig_splice + 1, 0, pnew);
		break;
	case 'join' :
		check(is(trg.at1), cm, 'trg.at1 missing');
		check(isInteger(trg.pivot), cm, 'trg.pivot not an integer');

		var pivotNode = meshtree.get(trg.path, 0, trg.pivot);
		check(pivotNode.isAlley, cm, 'trg.path[pivot] not an Alley');

		var str = meshtree.get(trg.path);
		check(isString(str, cm, 'trg.path signates no string'));

		check(trg.pivot === trg.path.length - 2, cm, 'corrently cannot splice trees');
		trg.attune(str, 'trg.path');
		var sig_splice = trg.path.get(trg.pivot);
		checkWithin(sig_splice, 0, pivotNode.length -1, cm, 'splice out of range');

		var ppre = pivotNode.get(sig_splice);
		var pnex = pivotNode.get(sig_splice + 1);
		check(ppre.constructor === pnex.constructor, 'cannot join different types')

		// no rejects after here
		ppre.forEach(function(v, k) {
			if (k === trg.path.get(trg.pivot + 1)) {
				ppre.set(k, v + pnex.get(k));
			}
		});
		pivotNode.splice(sig_splice + 1, 1);
		break;
	case 'set':
		check(!is(trg.at1), cm, 'trg.at1 must not exist.');
		switch(trg.path.get(-1)) {
		case '$new':
			log('alter', 'grow new');
			var nParent = meshtree.get(trg.path, 0, -1);
			nParent.growNew(trg.path);
			break;
		case '$end' :
			var nParent = meshtree.get(trg.path, 0, -1);
			check(nParent.isAlley, cm, '$end only applicatable on Alleys');
			trg.path.set(-1, nParent.length);
			break;
		}
		var save = meshtree.get(trg.path);
		if (is(trg.val)) {
			check(trg.val === save || save.matches(trg.val), cm, 'trg.val set incorrectly');
		} else {
			if (!is(save)) save = null;
			//trg.val = (save && save.constructor) ? new save.constructor(save) : save; TODO
			trg.val = JSON.parse(JSON.stringify(save));
		}

		if (is(src.path)) {
			check(trg.path.equals(src.path), cm, 'src.path set incorrectly');
		} else {
			src.path = trg.path;
		}
		meshtree.set(trg.path, src.val);
		break;
	case 'insert':
		var str = meshtree.get(trg.path);
		check(isString(str), cm, 'trg.path signates no string');

		trg.attune(str, 'trg.path');
		// where trg span should end
		var tat2 = trg.at1 + src.val.length;
		if (is(trg.at2)) {
			check(trg.at2 === tat2, cm, 'trg.at2 preset incorrectly',
				trg.at2, '!==', tat2);
		} else {
			trg.at2 = tat2;
		}
		var nstr = str.substring(0, trg.at1) + src.val + str.substring(trg.at1);
		meshtree.set(trg.path, nstr);
		break;
	case 'remove':
		var str = meshtree.get(src.path);
		check(isString(str), cm, 'src.path signates no string');

		src.attune(str, 'src.path');
		if (src.at1 === src.at2) { log('alter', 'removed nothing'); return; }

		var val = str.substring(src.at1, src.at2);
		if (isnon(trg.val)) {
			check(val === trg.val, cm, 'trg.val preset incorrectly:', val, '!==', trg.val);
		} else {
			trg.val = val;
		}
		var nstr = str.substring(0, src.at1) + str.substring(src.at2);
		meshtree.set(src.path, nstr);
		break;
	default:
		throw reject('invalid atype:', atype);
	}
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
MeshMashine = function(RootType) {
	this.repository = new RootType();
	this.history    = [];
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
			sign.path.add(src.pivot, 1);
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
				sign.path.add(src.pivot, 1);
				sign.at1 -= src.at1;
				sign.at2 -= src.at1;
				return sign;
			}
			// case 2 -> have to split!
			log('te', 'split split');
			var sat2 = sign.at2 - src.at1;
			sign.at2 = src.at1;

			var sign2 = new Signature(sign);
			sign2.path.add(src.pivot, 1);
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
			sign.path.add(src.pivot, 1);
			sign.at1 -= src.at1;
			return sign;
		}
		throw reject('invalid split');
	case 'join':
		if (!trg.path.like(sign, trg.pivot)) return sign;
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
			sign.path.add(src.pivot, -1);
			return sign;
		}
		log('te', 'join here');
		// join is in same line;
		sign.path.add(trg.pivot, -1);
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
// todo partial reflects
MeshMashine.prototype._reflect = function(time, path) {
	try {
		var reflect = new this.repository.constructor(this.repository);

		// playback
		for(var hi = this.history.length - 1; hi >= time; hi--) {
			alter(reflect, this.history[hi], true);
		}
	} catch (err) {
		// this should not ever fail, does rethrow a lethal error
		err.ok = null; throw err;
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
			alter(this.repository, alt, false);
			deepFreeze(alt);
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
		if (err.ok !== false) throw err; else return err;
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
		if (err.ok !== false) throw err; else return err;
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
