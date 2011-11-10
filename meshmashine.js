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

var log = require('./meshcraft-log');

/**
| Deep copies an object.
*/
function clone(original) {
	//return JSON.parse(JSON.stringify(original));
	if(typeof(original) !== 'object' || original === null) {
		return original;
	}
	var copy = original.constructor();
	for(var i in original) {
		copy[i] = clone(original[i]);
	}
	return copy;
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

function isSpan(o) {
	if (!isArray(o)) return false;
	if (o.length === 0) return false;
	var last = o[o.length - 1];
	if (is(last.at1) && is(last.at2)) return true;
}

function isRoot(o) {
	if (!isArray(o)) return false;
	return o.length === 0;
}



function basePathLength(p) {
	var pl = p.length;
	if (pl === 0) return 0;
	if (isTable(p[pl - 1])) return pl - 1;
	return pl;
}

/**
| Compares if two signatories are the same,
| excluding possible index/spans at their end.
*/
function haveSameBase(p1, p2) {
	var bpl1 = basePathLength(p1);
	if (bpl1 !== basePathLength(p2)) return false;

	for(var pi = 0; pi < bpl1; pi++) {
		if (p1[pi] !== p2[pi]) return false;
	}
	return true;
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


/**
| Returns a rejection error
*/
function reject(message) {
	log('mm', 'reject', message);
	return {ok: false, message: message};
}

function fail(args, aoffset) {
	var a = Array.prototype.slice.call(args, aoffset, args.length);
	for(var i = 2; i < arguments.length; i++) {
		a.push(arguments[i]);
	}
	throw reject(a.join(' '));
}

function check(condition) {
	if (!condition) fail(arguments, 1);
}

function checkWithin(val, low, high) {
	if (val < low || val > high) fail(arguments, 3);
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
	check(isArray(sign), name, 'not an array');
	for (var i = 0; i < sign.length; i++) {
		check(isString(sign[i]) || isInteger(sign[i]) ||
			(i === sign.length - 1 && isTable(sign[i])),
			name, 'arcs must be string or integer or a postfix table');
		check(sign[i][0] !== '_', name, 'arcs must not start with _');
	}
	this._sign = clone(sign);
	this.name = name;
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
	if (i < 0) i = this._sign.length - i;
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
| True if this signature is the same as another.
*/
Signature.prototype.equals = function(o) {
	return this._sign.deepEqual(o._sign);
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
| Freezes this signature
*/
Signature.prototype.freeze = function() {
	if (this.readonly) return;
	this.readonly = true;
	Object.freeze(this);
	Object.freeze(this._sign);
	var pfx = this.postfix;
	if (pfx) {
		Object.freeze(pfx);
	}
}

/**
| Attunes the '_end' things of the postfix to match the string it points to.
*/
Signature.prototype.attunePostfix = function(str) {
	var pfx = this.postfix;
	check(pfx !== null, this.name, 'not a postfix');
	if (pfx.at1 === '_end') {
		check(!this.readonly, this.name, 'cannot change readonly');
		pfx.at1 = str.length;
	}
	if (pfx.at2 === '_end') {
		check(!this.readonly, this.name, 'cannot change readonly');
		pfx.at2 = str.length;
	}
	checkWithin(pfx.at1, 0, str.length, this.name, 'postfix.at1 invalid');
	if (is(pfx.at2)) {
		checkWithin(pfx.at2, 0, str.length, this.name, 'postfix.at2 invalid');
		check(pfx.at2 >= pfx.at1, this.name, 'postfix: at2 < at1');
	}
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
	var src = !backward ? this.src : this.trg;
	var trg = !backward ? this.trg : this.src;
	if (trg.proc === 'splice') return 'split';
	if (src.proc === 'splice') return 'join';
	if (is(src.val) && trg.sign.isPath()) return 'set';
	if (is(src.val) && trg.sign.isIndex()) return 'insert';
	if (src.sign.isSpan() && !trg.sign.isIndex()) return 'remove';
	return null;
}

Alternation.prototype.freeze = function() {
	if (this.src.sign) this.src.sign.freeze();
	if (this.trg.sign) this.trg.sign.freeze();
	Object.freeze(this);
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
	return node;
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
	node[sign.arc(i)] = val;
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

		var str = this.get(node, src.sign);
		check(isString(str), cm, 'src.sign signates no string');

		check(src.pivot === src.sign.length - 3,  cm, 'currently cannot splice trees');
		var sig_pfx = src.sign.attunePostfix(str);
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

		var pivotNode = this.get(node, src.sign, src.pivot);
		check(isArray(pivotNode), cm, 'src.pivot signates no array');

		var str = this.get(node, trg.sign);
		check(isString(str, cm, 'trg.sign signates no string'));

		check(trg.pivot === trg.sign.length - 3, cm, 'corrently cannot splice trees');
		var sig_pfx = trg.sign.attunePostfix(str);
		var sig_splice = trg.sign.arc(trg.pivot);
		checkWithin(sig_splice, 0, pivotNode.length -1, cm, 'splice out of range');

		var ppre = pivotNode[sig_splice];
		var pnex = pivotNode[sig_splice + 1];
		check(keysLength(ppre) === keysLength(pnex), cm, 'stubs.keys not equal');
		for(var k in ppre) {
			check(is(pnex[k]), cm, 'stub['+k+'] not equal');
			if (k !== trg.sign.arg(trg.pivot + 1)) {
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
			check(deepEqual(trg.val, save), cm, 'trg.val set incorrectly');
		} else {
			trg.val = save;
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

		var trg_pfx = trg.sign.attunePostfix(str);

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

		var src_pfx = src.sign.attunePostfix(str);
		if (src_p.at1 === src_p.at2) { log('alter', 'removed nothing'); return; }

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
		throw reject('invalid alter');
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
| Transforms a single signature for one historic moment
*/
MeshMashine.prototype.transformMoment = function(sign, alter) {
	var sig_pfx = sign.postfix;
	var src = alter.src;
	var trg = alter.trg;
	var atype = alter.type();
	switch(atype) {
	case 'split':
		if (!src.sign.isSubOf(sign, src.pivot)) return sign;
		log('te', 'alter-split');
		var src_i = src.sign[src.pivot.length];
		var sig_i = sign[src.pivot.length];
		if (sig_i < src_i) {
			log('te', 'split downside');
			return sign;
		}
		if (sig_i > src_i) {
			// split was before -> index shifted
			log('te', 'split upside');
			sign[src.piviot.length]++;
			return sign;
		}
		log('te', 'split here');
		// split is in same line;
		src_pfx = src.sign.postfix;
		if (isIndex(sign)) {
			log('te', 'split index');
			if (sig_p.at1 > src_p.at1) {
				log('te', 'split rigtside');
				return;
			}
			log('te', 'split leftside');
			sign[src.pivot.length]++;
			sig_p.at1 -= src_p.at1;
			return;
		}
		if (isSpan(sign)) {
			log('te', 'split span');
			//Span        mmmmm      <-- sig_p.at1--sig_at2
			//Splits:  1    2    3   <-- src_p.at1
			//case 3:
			if (sig_p.at2 < src_p.at1) {
				log('te', 'split rightside');
				return;
			}
			// case 1:
			if (sig_p.at1 > src_p.at1) {
				log('te', 'split leftside');
				sign[src.pivot.length]++;
				sig_p.at1 -= src_p.at1;
				sig_p.at2 -= src_p.at1;
				return;
			}
			// case 2 -> have to split!
			var sat2 = sig_p.at2;
			sig_p.at2 = src_p.at1;
			var sig2 = sign.splice();
			sig2.at1 = src_p.at1;
			sig2.at2 = sat2;
			return [sign, sat2];
		}
		throw reject('invalid split');
		break;
	case 'set':
		log('te', 'nothing to do');
		break;
	case 'insert':
		if (!haveSameBase(trg.sign, sign)) return;
		log('te', 'alter-insert');
		check(isSpan(trg.sign), 'history mangled');
		var trg_pfx = trg.sign.postfix;
		if (sig_o.at1 > trg_p.at1) { // or >= ?
			log('te', 'at1 += ',src.val.length);
			sig_p.at1 += src.val.length;
			if (is(sig_p.at2)) {
				log('te', 'at2 +=', src.val.length);
				sig_p.at2 += src.val.length;
			}
		}
		break;
	case 'remove':
		if (!haveSameBase(src, sign)) return;
		log('te', 'alter-remove');
		check(isSpan(src.sign), 'history mangled');
		var src_pfx = src.sign.postfix;
		//       123456789
		//         ^^^    <- removed
		//case1:       <->
		//case2:    <->
		if (signl.at1 > srcl.at1) {
			if (signl.at1 > srcl.at2) {
				log('te', 'at1 -=', trg.val.length);
				// case1
				signl.at1 -= trg.val.length;
				if (is(signl.at2)) {
					log('te', 'at2 -=', trg.val.length);
					signl.at2 -= trg.val.length;
				}
			} else {
				// case2
				if (is(signl.at2)) {
					log('te', 'at2 =', signl.at2 - signl.at1 + srcl.at1);
					singl.at2 = signl.at2 - signl.at1 + srcl.at1;
				}
				log('te', 'at1 =', srcl.at);
				signl.at1 = srcl.at1;
			}
		}
		break;
	default :
		throw new Error('history mangled, srcST: '+srcST+' trgST:'+trgST);
	}
}

/**
| Transforms a signature, possibly splitting up.
*/
MeshMashine.prototype.transform = function(time, sign) {
	log('te', 'in', time, sign);
	if (!is(sign)) return sign;
	if (isRoot(sign)) return sign;

	var sigs = null;
	for(var t = time; t < this.history.length; t++) {
		var moment = this.history[t];

		if (sigs === null) {
			asw = transformMoment(sign, moment.src, moment.trg);
			if (isArray(asw)) {
				sigs = asw;
			} else {
				if (asw !== sign) throw new Error('iFail, asw !== sign');
			}
		} else {
			for(var si = 0; si < sigs.length; si++) {
				var asw = transformMoment(sigs[si], moment.src, moment.trg);
				if (isArray(asw)) {
					for(var ai = 0; ai < asw.length; ai++) {
						sigs.splice(si++, asw[ai]);
					}
				} else {
					if (asw !== sign) throw new Error('iFail, asw !== sign');
				}
			}
		}
	}
	log('te', 'out', sign);
	return sign;
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
			alter(reflect, this.history[hi], true);
		}
		return reflect.get(sign);
	} catch (err) {
		// returns rejections but rethrows coding errors.
		if (err.ok !== false) throw err; else return err;
	}
}

/**
| Alters the repository.
*/
MeshMashine.prototype.alter = function(time, src, trg) {
	try {
		log('mm', 'alter time:', time, 'src:', src, 'trg:', trg);
		if (!this._isValidTime(time)) return reject('invalid time');

		var tsrc, ttrg;
		if (is(src.sign)) {
			src.sign = new Signature(src.sign, 'src.sign');
			tsrc = this.transform(time, src.sign);
		}
		if (is(trg.sign)) {
			trg.sign = new Signature(trg.sign, 'trg.sign');
			ttrg = this.transform(time, trg.sign);
		}
		var alts;

		if (!isArray(tsrc) && !isArray(ttrg)) {
			src.sign = tsrc;
			trg.sign = ttrg;
			alts = new Alternation(src, trg);
		} else if (!isArray(tsrc) && isArray(ttrg))  {
			src.sign = tsrc;
			alts = [];
			for(var i = 0; i < ttrg.length; i++) {
				var tc = clone(trg);
				tc.sign = ttrg[i];
				alts[i] = new Alternation(src, tc);
			}
		} else if (isArray(tsrc) && !isArray(ttrg)) {
			trg.sign = ttrg;
			alts = [];
			for(var i = 0; i < tsrc.length; i++) {
				var sc = clone(src);
				src.sign = tsrc[i];
				alts[i] = new Alternation(sc, trg);
			}
		}

		if (!isArray(alts)) {
			this.repository.alter(alts, false);
			alts.freeze();
			this.history.push(alts);
		} else {
			for(var i = 0; i < alts.length; i++) {
				alter(this.repository, alts[i], false);
				alts[i].freeze();
				this.history.push(alts[i]);
			}
		}

		return {ok: true, time: this.history.length, alts: alts };
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
		log('debug', this.repository);
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
