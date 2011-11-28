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
var jools;
var woods;

/**
| Exports
*/
var meshmashine;

/**
| Capsule
*/
(function() {

"use strict";

try {
	// if not fails running nodejs
	jools = require('./meshcraft-jools');
	woods = require('./meshcraft-woods');
} catch(e) {
	// require failed, running in browser
}

var log        = jools.log;
var clone      = jools.clone;
var deepFreeze = jools.deepFreeze;
var fixate     = jools.fixate;
var Signature  = woods.Signature;

/**
| Returns a rejection error
*/
function reject(message) {
	if (jools.debug) throw new Error(message); // in debug mode any failure is fatal.
	log('mm', 'reject', message);
	return {ok: false, message: message};
}

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


/**
| Type check shortcuts
*/
function is(o)        { return typeof(o) !== 'undefined'; }
function isnon(o)     { return typeof(o) !== 'undefined' && o !== null; }
function isString(o)  { return typeof(o) === 'string' || o instanceof String; }
function isTable(o)   { return o.constructor === Object; }
function isInteger(o) { return typeof(o) === 'number' && Math.floor(o) === o; }

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
	this.src = src;
	this.trg = trg;
}

Alternation.prototype.type = function(backward) {
	var src = backward ? this.trg : this.src;
	var trg = backward ? this.src : this.trg;
	if (trg.proc === 'splice') return 'split';
	if (src.proc === 'splice') return 'join';
	if (is(src.val) && trg.sign && trg.sign.isPath()) return 'set';
	if (is(src.val) && trg.sign && trg.sign.isIndex()) return 'insert';
	if (src.sign && src.sign.isSpan() && !(trg.sign && trg.sign.isIndex())) return 'remove';
	if (jools.debug) {
		log('debug', this);
		throw new Error('invalid type');
	}
	return null;
}


/**
| ++Causal consistency++
*/

/**
| Alters a string
*/
function alter(meshtree, alternation, backward) {
	var atype = alternation.type(backward);
	var cm = 'alter('+atype+')';
	var src = !backward ? alternation.src : alternation.trg;
	var trg = !backward ? alternation.trg : alternation.src;

	log('alter', 'src:', src, 'trg:', trg, 'atype:', atype);
	switch (atype) {
	case 'split' :
		check(isInteger(src.pivot), cm, 'src.pivot not an integer');
		check(src.sign.isIndex(), cm, 'src.sign not an index');

		var pivotNode = meshtree.get(src.sign, 0, src.pivot);
		check(pivotNode.isAlley, cm, 'src.pivot signates no Alley');

		var str = meshtree.get(src.sign);
		check(isString(str), cm, 'src.sign signates no string');

		check(src.pivot === src.sign.length - 3,  cm, 'currently cannot splice trees');
		var sig_pfx = src.sign.attunePostfix(str, 'src.sign');
		var sig_splice = src.sign.arc(src.pivot);
		checkWithin(sig_splice, 0, pivotNode.length, cm, 'splice out of range');

		var ppre = pivotNode.get(sig_splice);
		/*
		for(var k in ppre) {
			var pk = ppre.get(k);
			//check(!pk.isAlley && !isTable(pk), cm, 'cannot splice arrays or tables');
		}
		*/

		// no rejects after here
		var pnew = new ppre.constructor();
		var ksplit = src.sign.arc(-2);
		ppre.forEach(function(v, k) {
			log('debug', 'VK', v, k);
			if (k === ksplit) {
				pnew.set(k, v.substring(sig_pfx.at1));
				ppre.set(k, v.substring(0, sig_pfx.at1));
			} else {
				pnew.set(k, v);
			}
		});
		pivotNode.splice(sig_splice + 1, 0, pnew);
		break;
	case 'join' :
		check(isInteger(trg.pivot), cm, 'trg.pivot not an integer');
		check(trg.sign.isIndex(), cm, 'trg.sign not an index');

		var pivotNode = meshtree.get(trg.sign, 0, trg.pivot);
		check(pivotNode.isAlley, cm, 'trg.sign(pivot) signates no Alley');

		var str = meshtree.get(trg.sign);
		check(isString(str, cm, 'trg.sign signates no string'));

		check(trg.pivot === trg.sign.length - 3, cm, 'corrently cannot splice trees');
		var sig_pfx = trg.sign.attunePostfix(str, 'trg.sign');
		var sig_splice = trg.sign.arc(trg.pivot);
		checkWithin(sig_splice, 0, pivotNode.length -1, cm, 'splice out of range');

		var ppre = pivotNode[sig_splice];
		var pnex = pivotNode[sig_splice + 1];
		check(keysLength(ppre) === keysLength(pnex), cm, 'stubs.keys not equal');
		for(var k in ppre) {
			check(is(pnex[k]), cm, 'stub['+k+'] not equal');
			if (k !== trg.sign.arc(trg.pivot + 1)) {
				check(deepEqual(ppre[k], pnex[k]), cm, 'stub['+k+'] not deep equal');
			} else {
				check(k.indexOf('%') > 0, cm, 'stub['+k+'] does not contain %');
				check(isString(ppre[k]), cm, 'stub['+k+'] not a string');
			}
		}
		// no rejects after here
		for(k in ppre) {
			if (k === trg.sign.arc(trg.pivot + 1)) {
				ppre[k] += pnex[k];
			}
		}
		pivotNode.splice(sig_splice + 1, 1);
		break;
	case 'set':
		check(trg.sign.postfix === null, cm, 'trg.sign must not have postfix');
		if (trg.sign.arc(-1) === '_new') {
			// append to end.
			log('alter', 'grow new');
			var nParent = meshtree.get(trg.sign, 0, -1);
			check(isTable(nParent), cm, 'can only grow tables');
			if (!nParent._grow) nParent._grow = 1;
			trg.sign.setarc(-1, nParent._grow++);
		}
		var save = meshtree.get(trg.sign);
		if (is(trg.val)) {
			check(deepEqual(trg.val, save), cm, 'trg.val set incorrectly', trg.val, '!=', save);
		} else {
			trg.val = save && save.constructor ? new save.constructor(save) : save;
			//trg.val = clone(save);
		}

		if (is(src.sign)) {
			check(trg.sign.equals(src.sign), cm, 'src.sign set incorrectly');
		} else {
			src.sign = trg.sign;
		}
		meshtree.set(trg.sign, src.val);
		break;
	case 'insert':
		var str = meshtree.get(trg.sign);
		check(isString(str), cm, 'trg.sign signates no string');

		var trg_pfx = trg.sign.attunePostfix(str, 'trg.sign');

		// where trg span should end
		var tat2 = trg_pfx.at1 + src.val.length;
		if (is(trg_pfx.at2)) {
			check(trg_pfx.at2 === tat2, cm, 'trg.sign...at2 preset incorrectly',
				trg_pfx.at2, '!==', tat2);
		} else {
			trg_pfx.at2 = tat2;
		}
		var nstr = str.substring(0, trg_pfx.at1) + src.val + str.substring(trg_pfx.at1);
		meshtree.set(trg.sign, nstr);
		break;
	case 'remove':
		var str = meshtree.get(src.sign);
		check(isString(str), cm, 'src.sign signates no string');

		var src_pfx = src.sign.attunePostfix(str, 'src.sign');
		if (src_pfx.at1 === src_pfx.at2) { log('alter', 'removed nothing'); return; }

		var val = str.substring(src_pfx.at1, src_pfx.at2);
		if (isnon(trg.val)) {
			check(val == trg.val, cm, 'trg.val preset incorrectly:', val, '!==', trg.val);
		} else {
			trg.val = val;
		}
		var nstr = str.substring(0, src_pfx.at1) + str.substring(src_pfx.at2);
		meshtree.set(src.sign, nstr);
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
function MeshMashine(RootType) {
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
| Transforms a single waypoint (src or trg) for one historic moment
*/
MeshMashine.prototype.transformOnMoment = function(way, alter) {
	if (!is(way.sign)) return way;
	var sign = way.sign;
	var sig_pfx = sign.postfix;
	var src = alter.src;
	var trg = alter.trg;
	var atype = alter.type();
	switch(atype) {
	case 'split':
		if (!src.sign.isSubOf(sign, src.pivot)) return way;
		log('te', 'alter-split');
		var src_i = src.sign.arc(src.pivot);
		var sig_i = sign.arc(src.pivot);
		log('te', 'sig_i', sig_i, 'src_i', src_i);
		if (sig_i < src_i) {
			log('te', 'split downside');
			return way;
		}
		if (sig_i > src_i) {
			// split was before -> index shifted
			log('te', 'split upside');
			sign.addarc(src.pivot, 1);
			return way;
		}
		log('te', 'split here');
		// split is in same line;
		src_pfx = src.sign.postfix;
		if (sign.isSpan()) {
			log('te', 'split span');
			//Span        mmmmm      <-- sig_p.at1--sig_at2
			//Splits:  1    2    3   <-- src_p.at1
			//case 3:
			if (sig_pfx.at2 < src_pfx.at1) {
				log('te', 'split rightside');
				return way;
			}
			// case 1:
			if (sig_pfx.at1 > src_pfx.at1) {
				log('te', 'split leftside');
				sign.addarc(src.pivot)++;
				sig_pfx.at1 -= src_pfx.at1;
				sig_pfx.at2 -= src_pfx.at1;
				return way;
			}
			// case 2 -> have to split!
			log('te', 'split split');
			var sat2 = sig_pfx.at2 - src_pfx.at1;
			sig_pfx.at2 = src_pfx.at1;

			var way2 = clone(way);
			way2.sign.addarc(src.pivot, 1);
			var sig2_pfx = way2.sign.postfix;
			sig2_pfx.at1 = 0;
			sig2_pfx.at2 = sat2;
			return [way, way2];
		}
		if (sign.isIndex()) {
			log('te', 'split index');
			if (src_pfx.at1 > sig_pfx.at1) {
				log('te', 'split rigtside');
				return way;
			}
			log('te', 'split leftside');
			sign.addarc(src.pivot, 1);
			sig_pfx.at1 -= src_pfx.at1;
			return way;
		}
		throw reject('invalid split');
	case 'join':
		if (!trg.sign.isSubOf(sign, trg.pivot)) return way;
		log('te', 'alter-join');
		var trg_i = trg.sign.arc(trg.pivot);
		var sig_i = sign.arc(trg.pivot);
		if (sig_i < trg_i) {
			log('te', 'join downside');
			return way;
		}
		if (sig_i > trg_i) {
			// split was before -> index shifted
			log('te', 'join upside');
			sign.addarc(src.pivot, -1);
			return way;
		}
		log('te', 'join here');
		// join is in same line;
		trg_pfx = trg.sign.postfix;
		sign.addarc(trg.pivot, -1);
		sig_pfx.at1 += trg_pfx.at1;
		if (is(sig_pfx.at2)) {
			sig_pfx.at1 += trg_pfx.at1;
		}
		return way;
	case 'set':
		log('te', 'nothing to do');
		return way;
	case 'insert':
		if (!trg.sign || !trg.sign.equalPaths(sign)) return way;
		log('te', 'alter-insert');
		check(trg.sign.isSpan(), 'history mangled');
		var trg_pfx = trg.sign.postfix;
		if (sig_pfx.at1 > trg_pfx.at1) { // or >= ?
			log('te', 'at1 += ',src.val.length);
			sig_pfx.at1 += src.val.length;
			if (is(sig_pfx.at2)) {
				log('te', 'at2 +=', src.val.length);
				sig_pfx.at2 += src.val.length;
			}
		}
		return way;
	case 'remove':
		if (!src.sign.equalPaths(sign)) return way;
		log('te', 'alter-remove');
		check(src.sign && src.sign.isSpan(), 'history mangled');
		var src_pfx = src.sign.postfix;
		//       123456789
		//         ^^^    <- removed
		//case1:       <->
		//case2:    <->
		if (sig_pfx.at1 > src_pfx.at1) {
			if (sig_pfx.at1 > src_pfx.at2) {
				log('te', 'at1 -=', trg.val.length);
				// case1
				sig_pfx.at1 -= trg.val.length;
				if (is(sig_pfx.at2)) {
					log('te', 'at2 -=', trg.val.length);
					sig_pfx.at2 -= trg.val.length;
				}
			} else {
				// case2
				if (is(sig_pfx.at2)) {
					log('te', 'at2 =', sig_pfx.at2 - sig_pfx.at1 + src_pfx.at1);
					sig_pfx.at2 = sig_pfx.at2 - sig_pfx.at1 + src_pfx.at1;
				}
				log('te', 'at1 =', src_pfx.at);
				sig_pfx.at1 = src_pfx.at1;
			}
		}
		return way;
	default :
		throw new Error('unknown atype: '+atype);
	}
}

/**
| Transforms a signature, possibly splitting up.
*/
MeshMashine.prototype.transform = function(time, way) {
	log('te', 'in', time, way);
	if (!is(way.sign)) return way;
	if (way.sign.length === 0) return sign;

	var waya = way; // way or array of ways
	for(var t = time; t < this.history.length; t++) {
		var moment = this.history[t];

		if (!(waya instanceof Array)) {
			waya = this.transformOnMoment(waya, moment);
		} else {
			for(var i = 0; i < waya.length; i++) {
				var tom = this.transformOnMoment(waya[i], moment);
				if (tom instanceof Array) {
					for(var tomi = 0; tomi < tom.length; tomi++) {
						waya.splice(i++, tom[tomi]);
					}
				} else {
					check(tom === waya[i], 'tom !== waya[i]');
				}
			}
		}
	}
	log('te', 'out', waya);
	return waya;
}


/**
| Reflects the state of the repository at time.
| If path is not null it cares only to rebuild what is necessary to see the ida.
*/
// todo partial reflects
MeshMashine.prototype._reflect = function(time, sign) {
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
	return reflect.get(sign);
}

/**
| Alters the repository.
*/
MeshMashine.prototype.alter = function(time, src, trg) {
	log(true, 'test');
	try {
		log('mm', 'alter time:', time, 'src:', src, 'trg:', trg);
		log('debug', 'before', this.repository);
		if (!this._isValidTime(time)) return reject('invalid time');

		if (is(src.sign)) src.sign = new Signature(src.sign, 'src.sign');
		if (is(trg.sign)) trg.sign = new Signature(trg.sign, 'trg.sign');

		var tsrca = this.transform(time, src);
		var ttrga = this.transform(time, trg);

		var alta;
		if (!(tsrca instanceof Array) && !(ttrga instanceof Array)) {
			alta = new Alternation(tsrca, ttrga);
		} else if (!(tsrca instanceof Array) && (ttrga instanceof Array))  {
			alta = [];
			for(var i = 0; i < ttrga.length; i++) {
				alta[i] = new Alternation(clone(tsrca), ttrga[i]);
			}
		} else if ((tsrca instanceof Array) && !(ttrga instanceof Array)) {
			alta = [];
			for(var i = 0; i < tsrca.length; i++) {
				alta[i] = new Alternation(tsrca[i], clone(ttrga));
			}
		}

		if (!(alta instanceof Array)) {
			alter(this.repository, alta, false);
			deepFreeze(alta);
			this.history.push(alta);
		} else {
			for(var i = 0; i < alta.length; i++) {
				alter(this.repository, alta[i], false);
				deepFreeze(alta[i]);
				this.history.push(alta[i]);
			}
		}

		log('debug', 'after', this.repository);
		return {ok: true, time: this.history.length, alts: alta };
	} catch(err) {
		// returns rejections but rethrows coding errors.
		log(true, 'error', err);
		if (err.ok !== false) throw err; else return err;
	}
}

/**
| Gets a node (which can go up to the complete repository).
| TODO add timespans
*/
MeshMashine.prototype.get = function(time, sign) {
	try {
		log('mm', 'get time:', time, ' sign:', sign);
		if (time > 0) {
			if (!this._isValidTime(time)) return reject('invalid time');

			var reflect = this._reflect(time, sign);
			// remove nulls
			//for(var key in reflect) {
			//	if (reflect[key] === null) delete reflect[key];
			//}
		} else {
			reflect = this.repository.get(sign);
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

/**
| export
*/
meshmashine = {
	MeshMashine     : MeshMashine,
}


try {
	module.exports = meshmashine;
} catch(err){
	// browser
}

}());
