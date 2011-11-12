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
"use strict";

var debug = true;

var log = require('./meshcraft-log');

/**
| Deep copies an object.
*/
function clone(original) {
	//return JSON.parse(JSON.stringify(original));
	if(typeof(original) !== 'object' || original === null) {
		return original;
	}
	if (original instanceof Signature) {
		return new Signature(original, 'clone');
	}

	var copy = original.constructor();
	for(var k in original) {
		copy[k] = clone(original[k]);
	}
	return copy;
}

/**
| Deep freezes an object.
*/
function deepFreeze(obj) {
	if (typeof(obj) !== 'object' || obj === null) return;
	Object.freeze(obj);
	for (var k in obj) {
		deepFreeze(obj[k]);
	}
}

/**
| Type check shortcuts
*/
function is(o)        { return typeof(o) !== 'undefined'; }
function isnon(o)     { return typeof(o) !== 'undefined' && o !== null; }
function isString(o)  { return typeof(o) === 'string' || o instanceof String; }
function isArray(o)   { return o instanceof Array; }
function isSign(o)    { return o instanceof Signature; }
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


/**
| Returns a rejection error
*/
function reject(message) {
	if (debug) throw new Error(message); // in debug mode any failure is fatal.
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

function fixate(obj, key, value) {
    Object.defineProperty(obj, key, {enumerable: true, value: value});
    return value;
}


/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 .---.               .
 \___  . ,-. ,-. ,-. |- . . ,-. ,-.
     \ | | | | | ,-| |  | | |   |-'
 `---' ' `-| ' ' `-^ `' `-^ '   `-'
~ ~ ~ ~ ~ ,|~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
          `'
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

/**
| Signates an entry, string index or string span.
| TODO check for leading '_'
*/
function Signature(sign, name) {
	if (isSign(sign)) sign = sign._sign;
	check(isArray(sign), name, 'not an array');
	for (var i = 0; i < sign.length; i++) {
		check(isString(sign[i]) || isInteger(sign[i]) ||
			(i === sign.length - 1 && isTable(sign[i])),
			name, 'arcs must be string or integer or a postfix table');
		check(sign[i][0] !== '_', name, 'arcs must not start with _');
	}
	this._sign = clone(sign);
}

/**
| Length of the signature.
*/
Object.defineProperty(Signature.prototype, 'length', {
	get: function() { return this._sign.length; },
});

/**
| If the signature is an index or span it will return that.
*/
Object.defineProperty(Signature.prototype, 'postfix', {
	get: function() {
		if (this._sign.length === 0) return null;
		var pfx = this._sign[this._sign.length - 1];
		return isTable(pfx) ? pfx : null;
	},
});

/**
| Length of the path / signature without postfix.
*/
Object.defineProperty(Signature.prototype, 'pathlen', {
	get: function() {
		return this._sign.length - (this.postfix ? 1 : 0);
	},
});

/**
| True if the signature ends as string index.
*/
Signature.prototype.isIndex = function() {
	var pfx = this.postfix;
	return (pfx !== null) && is(pfx.at1);
}

/**
| True if the signature ends as string span.
*/
Signature.prototype.isSpan = function() {
	var pfx = this.postfix;
	return (pfx !== null) && is(pfx.at1) && is(pfx.at2);
}

/**
| True if the signature is only a path (without postfix)
*/
Signature.prototype.isPath = function() {
	return (this.postfix === null);
}

/**
| Returns the signature at index i.
*/
Signature.prototype.arc = function(i) {
	if (i < 0) i = this._sign.length + i;
	if (i < 0) return null;
	return this._sign[i];
}

/**
| Returns the signature at index i.
*/
Signature.prototype.setarc = function(i, v) {
	check(!this.frozen, 'changing readonly signature');
	if (i < 0) i = this._sign.length - i;
	return this._sign[i] = v;
}

/**
| Returns the signature at index i.
*/
Signature.prototype.addarc = function(i, v) {
	check(!this.frozen, 'changing readonly signature');
	if (i < 0) i = this._sign.length + i;
	check(isInteger(this._sign[i]), 'cannot add to non integer arc: ', this._sign[i]);
	return this._sign[i] += v;
}

/**
| True if this signature is the same as another.
*/
Signature.prototype.equals = function(o) {
	return deepEqual(this._sign, o._sign);
}

/**
| True if this signature has the same path (that is without postfix)
| than another
*/
Signature.prototype.equalPaths = function(o) {
	var pl = this.pathlen;
	if (pl !== o.pathlen) return false;
	for(var i = 0; i < pl; i++) {
		if (this._sign[i] !== o._sign[i]) return false;
	}
	return true;
}

/**
| True if this signature is start of another.
|
| o: the other signature
| [slan]: the length of this signature to consider.
*/
Signature.prototype.isSubOf = function(o, slen) {
	if (!is(slen)) slen = this.pathlen;
	if (slen < 0) slen = this.pathlen + slen;
	if (slen < 0) slen = 0;

	if (slen === this.length && this.postfix) return false;
	if (slen > o.pathlen) return false;
	for(var i = 0; i < slen; i++) {
		if (this._sign[i] !== o._sign[i]) return false;
	}
	return true;
}


/**
| stringify
*/
Signature.prototype.toString = function() {
	return this._sign.toString();
}

/**
| Attunes the '_end' things of the postfix to match the string it points to.
*/
Signature.prototype.attunePostfix = function(str, name) {
	var pfx = this.postfix;
	check(pfx !== null, name, 'not a postfix');
	if (pfx.at1 === '_end') {
		check(!this.readonly, name, 'cannot change readonly');
		pfx.at1 = str.length;
	}
	if (pfx.at2 === '_end') {
		check(!this.readonly, name, 'cannot change readonly');
		pfx.at2 = str.length;
	}
	/* todo proper checking
	checkWithin(pfx.at1, 0, str.length, name, 'postfix.at1 invalid');
	if (is(pfx.at2)) {
		checkWithin(pfx.at2, 0, str.length, name, 'postfix.at2 invalid');
		check(pfx.at2 >= pfx.at1, name, 'postfix: at2 < at1');
	}*/
	return pfx;
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
	if (debug) {
		log('debug', this);
		throw new Error('invalid type');
	}
	return null;
}

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ,-,-.  ,--,--'
 ` | |  `- | ,-. ,-. ,-.
   | |-. , | |   |-' |-'
  ,' `-' `-' '   `-' `-'
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
 a node tree (repository)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
function NTree(master) {
	this.tree = master ? clone(master.tree) : {};
}

/**
| Returns the subnode path points at.
*/
NTree.prototype.get = function(sign, slen) {
	if (!is(slen)) slen = sign.pathlen;
	if (slen < 0) slen = sign.pathlen + slen;
	if (slen < 0) slen = 0;

	var node = this.tree;
	for (var i = 0; i < slen; i++) {
		check(node !== null, sign.name, 'points nowhere');
		node = node[sign.arc(i)];
	}
	return is(node) ? node : null;
}

/**
| Sets the value of a node.
|
| node:  the repo or part of
| path:  path to the value (relative to node)
| value: the new value to set
*/
NTree.prototype.set = function(sign, val, slen) {
	if (!is(slen)) slen = sign.pathlen;
	if (slen < 0) slen = sign.pathlen + slen;
	if (slen < 0) slen = 0;

	var i;
	var node = this.tree;
	for(i = 0; i < slen - 1; i++) {
		check(node !== null, sign.name, 'points nowhere');
		node = node[sign.arc(i)];
	}
	node[sign.arc(i)] = clone(val);
}

/**
| Alters a string
*/
NTree.prototype.alter = function(alternation, backward) {
	var atype = alternation.type(backward);
	var cm = 'alter('+atype+')';
	var src = !backward ? alternation.src : alternation.trg;
	var trg = !backward ? alternation.trg : alternation.src;

	log('alter', 'src:', src);
	log('alter', 'trg:', trg);
	log('alter', 'atype:', atype);
	switch (atype) {
	case 'split' :
		check(isInteger(src.pivot), cm, 'src.pivot not an integer');
		check(src.sign.isIndex(), cm, 'src.sign not an index');

		var pivotNode = this.get(src.sign, src.pivot);
		check(isArray(pivotNode), cm, 'src.pivot signates no array');

		var str = this.get(src.sign);
		check(isString(str), cm, 'src.sign signates no string');

		check(src.pivot === src.sign.length - 3,  cm, 'currently cannot splice trees');
		var sig_pfx = src.sign.attunePostfix(str, 'src.sign');
		var sig_splice = src.sign.arc(src.pivot);
		checkWithin(sig_splice, 0, pivotNode.length, cm, 'splice out of range');

		var ppre = pivotNode[sig_splice];
		for(var k in ppre) {
			var pk = ppre[k];
			check(!isArray(pk) && !isTable(pk), cm, 'cannot splice arrays or tables');
		}

		// no rejects after here
		var pnew = {};
		var ksplit = src.sign.arc(-2);
		for(var k in ppre) {
			if (k === ksplit) {
				pnew[k] = ppre[k].substring(sig_pfx.at1);
				ppre[k] = ppre[k].substring(0, sig_pfx.at1);
			} else {
				pnew[k] = ppre[k];
			}
		}
		pivotNode.splice(sig_splice + 1, 0, pnew);
		break;
	case 'join' :
		check(isInteger(trg.pivot), cm, 'trg.pivot not an integer');
		check(trg.sign.isIndex(), cm, 'trg.sign not an index');

		var pivotNode = this.get(trg.sign, trg.pivot);
		check(isArray(pivotNode), cm, 'trg.sign(pivot) signates no array');

		var str = this.get(trg.sign);
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
			var nParent = this.get(trg.sign, -1);
			check(isTable(nParent), cm, 'can only grow tables');
			if (!nParent._grow) nParent._grow = 1;
			trg.sign.setarc(-1, nParent._grow++);
		}
		var save = this.get(trg.sign);
		if (is(trg.val)) {
			check(deepEqual(trg.val, save), cm, 'trg.val set incorrectly', trg.val, '!=', save);
		} else {
			trg.val = clone(save);
		}

		if (is(src.sign)) {
			check(trg.sign.equals(src.sign), cm, 'src.sign set incorrectly');
		} else {
			src.sign = trg.sign;
		}
		this.set(trg.sign, src.val);
		break;
	case 'insert':
		var str = this.get(trg.sign);
		check(isString(str), cm, 'trg.sign signates no string');

		var trg_pfx = trg.sign.attunePostfix(str, 'trg.sign');

		// where trg span should end
		var tat2 = trg_pfx.at1 + src.val.length;
		if (is(trg_pfx.at2)) {
			check(trg_pfx.at2 === tat2, cm, 'trg.sign...at2 preset incorrectly');
		} else {
			trg_pfx.at2 = tat2;
		}
		var nstr = str.substring(0, trg_pfx.at1) + src.val + str.substring(trg_pfx.at1);
		this.set(trg.sign, nstr);
		break;
	case 'remove':
		var str = this.get(src.sign);
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
		this.set(src.sign, nstr);
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
function MeshMashine() {
	this.repository = new NTree();
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
		var src_i = src.sign[src.pivot];
		var sig_i = sign[src.pivot];
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
				sign[src.pivot]++;
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
		var trg_i = trg.sign[trg.pivot];
		var sig_i = sign[trg.pivot];
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

		if (!isArray(waya)) {
			waya = this.transformOnMoment(waya, moment);
		} else {
			for(var i = 0; i < waya.length; i++) {
				var tom = transformOnMoment(waya[si], moment);
				if (isArray(tom)) {
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
		var reflect = new NTree(this.repository);

		// playback
		for(var hi = this.history.length - 1; hi >= time; hi--) {
			reflect.alter(this.history[hi], true);
		}
		return reflect.get(sign);
	} catch (err) {
		// nothing should ever fail, does rethrow as lethal error
		err.ok = null; throw err;
	}
}

/**
| Alters the repository.
*/
MeshMashine.prototype.alter = function(time, src, trg) {
	try {
		log('mm', 'alter time:', time, 'src:', src, 'trg:', trg);
		if (!this._isValidTime(time)) return reject('invalid time');

		if (is(src.sign)) src.sign = new Signature(src.sign, 'src.sign');
		if (is(trg.sign)) trg.sign = new Signature(trg.sign, 'trg.sign');

		var tsrca = this.transform(time, src);
		var ttrga = this.transform(time, trg);

		var alta;
		if (!isArray(tsrca) && !isArray(ttrga)) {
			alta = new Alternation(tsrca, ttrga);
		} else if (!isArray(tsrca) && isArray(ttrga))  {
			alta = [];
			for(var i = 0; i < ttrga.length; i++) {
				alta[i] = new Alternation(clone(tsrca), ttrga[i]);
			}
		} else if (isArray(tsrca) && !isArray(ttrga)) {
			alta = [];
			for(var i = 0; i < tsrca.length; i++) {
				alta[i] = new Alternation(tsrca[i], clone(ttrga));
			}
		}

		if (!isArray(alta)) {
			this.repository.alter(alta, false);
			deepFreeze(alta);
			this.history.push(alta);
		} else {
			for(var i = 0; i < alta.length; i++) {
				this.repository.alter(alta[i], false);
				deepFreeze(alta[i]);
				this.history.push(alta[i]);
			}
		}

		return {ok: true, time: this.history.length, alts: alta };
	} catch(err) {
		// returns rejections but rethrows coding errors.
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
		if (!this._isValidTime(time)) return reject('invalid time');
		sign = new Signature(sign, 'sign');

		var reflect = this._reflect(time, sign);
		// remove nulls
		// todo, hierachical.
		for(var key in reflect) {
			if (reflect[key] === null) delete reflect[key];
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

module.exports = MeshMashine;
