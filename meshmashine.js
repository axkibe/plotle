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
| Deep copies an object.
*/
function clone(original) {
	if(typeof(original) !== 'object' || original === null) {
		return original;
	}
	if (original instanceof Array) {
		return original.slice();
	}

	var copy = {}
	for(var i in original) {
		copy[i] = clone(original[i]);
	}
	return copy;
}

var log = require('./meshcraft-log');

/**
| Type check shortcuts
*/
function is(o) {
	return typeof(o) !== 'undefined';
}

function isnon(o) {
	return typeof(o) !== 'undefined' && o !== null;
}

function isString(o) {
	return typeof(o) === 'string' || o instanceof String;
}

function isArray(o)  {
	return o instanceof Array;
}

function isEmpty(o)  {
	for(var _ in o) return false;
	return true;
}

function isTable(o)  {
	return typeof(o) === 'object' && !(o instanceof Array) && !(o instanceof String);
}

function isInteger(o) {
	return typeof(o) === 'number' && Math.floor(o) === o;
}

function isIndex(o) {
	if (!isArray(o)) return false;
	if (o.length === 0) return false;
	var last = o[o.length - 1];
	if (is(last.at1)) return true;
}

function isSpan(o) {
	if (!isArray(o)) return false;
	if (o.length === 0) return false;
	var last = o[o.length - 1];
	if (is(last.at1) && is(last.at2)) return true;
}

function isPath(o) {
	if (!isArray(o)) return false;
	if (o.length === 0) return false;
	var last = o[o.length - 1];
	return isInteger(last) || isString(last);
}

function isRoot(o) {
	if (!isArray(o)) return false;
	return o.length === 0;
}

function alterType(src, trg) {
	if (trg.proc === 'splice')                          return 'split';
	if (src.proc === 'splice')                          return 'join';
	if (is(src.val) && isPath(trg.sign))            return 'set';
	if (is(src.val) && isIndex(trg.sign))           return 'insert';
	if (isSpan(src.sign) && !isIndex(trg.sign)) return 'remove';
	return null;
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

function isSubPath(p1, p2) {
	if (p1.length > p2.length) return false;
	for(var p = 0, pl = p1.length; p < pl; p++) {
		if (p1[p] !== p2[p]) return false;
	}
	return true;
}

function deepEqual(o1, o2) {
	if (o1 === o2) return true;
	if (o1.keys.length !== o2.keys.length) return false;

	for(k in o1) {
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
	var a = args.slice(aoffset, args.length);
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

function checkReadWrite(readonlys) {
	if (!readonly) fail(arguments, 1, 'readonly flag forbids change');
}

function checkIsPath(val) {
	if (!isPath(val)) fail(arguments, 1, 'not a path');
}

function checkIsIndex(val) {
	if (!isIndex(value)) fail(arguments, 1, 'not an index');
}

function checkIsSpan(val) {
	if (!isSpan(value)) fail(arguments, 1, 'not a span');
}

function checkIsArray(val) {
	if (!isArray(value)) fail(arguments, 1, 'not an array');
}

function checkIsString(val) {
	if (!isString(value)) fail(arguments, 1, 'not a string');
}

function checkIsTable(val) {
	if (!isTable(value)) fail(arguments, 1, 'not a table');
}

function checkIsSubPath(v1, v2, vs1, vs2) {
	if (!isSubPath(v1, v2)) fail(arguments, 4, vs1, 'not a subpath of', vs2);
}

function getPostfix(sign) {
	if (!(sign > 0)) throw new Error();
	return sign[sig.length - 1];
}

function convertPostfix(sp, str, readonly, cm1, cm2) {
	check(is(sp.at1), cm1, cm2, 'not a postfix');
	if (sp.at1 === '_end') {
		checkReadWrite(readonly, cm1, cm2);
		sigl.at1 = str.length;
	}
	if (sp.at2 === '_end') {
		checkReadWrite(readonly, cm1, cm2);
		sigl.at2 = str.length;
	}
	checkWithin(sp.at1, 0, str.length, cm, 'postfix.at1 outside string');
	if (is(sp.at2)) checkWithin(sp.at2, 0, str.length, cm, 'postfix.at2 outside string');
}

/**
| Returns the subnode path points at.
| TODO check for leading '_'
*/
function get(node, path, pathlen) {
	if (!is(pathlen)) pathlen = path.length;
	if (pathlen < 0) pathlen = path.length + pathlen;
	if (pathlen < 0) throw reject('invalid path');
	for (var i = 0; i < pathlen; i++) {
		if (node === null) {
			throw reject('path points nowhere.');
		}
		node = node[path[i]];
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
function set(node, path, pathlen, val) {
	if (!is(pathlen)) pathlen = path.len;
	if (pathlen < 0) pathlen = path.len - pathlen;
	if (pathlen <= 0) throw reject('cannot set empty path');
	var pi;
	for(pi = 0; pi < pathlen - 1; pi++) {
		if (!node) throw reject('path points nowhere');
		node = node[path[pi]];
	}
	node[path[pi]] = val;
}

/**
| Alters a string
|
| node: the tree to alter
| src: the source signatory
| trg: the target signatory
| readonly: if true alter will not change any signatory but fail if it would.
|           but it will change node!
*/
function alter(node, src, trg, readonly) {
	var atype = alterType(src, trg);
	var cm = 'alter('+atype+')';

	log('alter', 'src:', src);
	log('alter', 'trg:', trg);
	log('alter', 'atype:', atype);
	switch (atype) {
	case 'split' :
		checkIsPath(src.pivot, cm, 'src.pivot');
		checkIsIndex(src.sign, cm, 'src.sign');
		checkIsSubPath(src.pivot, src.sign, cm, 'src.pivot', 'src.sign');
		var pivotNode = get(node, src.pivot);
		checkIsArray(pivotNode, cm, 'src.pivot');

		var str = get(node, src.sign, -1);
		checkIsString(str, cm, 'content of src.sign');

		var sig_p = getPostfix(src.sign);
		convertPostfix(sig_p, str, readonly, cm, 'src.sign');
		check(src.sign.length - 3 === src.pivot.length, cm, 'currently cannot splice trees');

		var piv_p = getPostfix(src.pivot);
		var ppre = pivotNode[src.sign[src.pivot.length]];
		log('debug', 'pre', ppre);
		for(k in ppre) {
			var pk = ppre[k];
			check(!isArray(pk) && !isTable(pk), cm, 'cannot splice arrays or tables');
		}
		// no rejects after here
		var pnew = {};
		var ksplit = src.sign[src.sign.length - 2];
		for(k in ppre) {
			if (k === ksplit) {
				pnew[k] = ppre[k].substring(sigl.at1);
				ppre[k] = ppre[k].substring(0, sigl.at1);
			} else {
				pnew[k] = ppre[k];
			}
		}
		log('debug', 'splice', src.sign[src.pivot.length], pnew);
		pivotNode.splice(src.sign[src.pivot.length], pnew);
		break;
	case 'set':
		var sub = get(node, trg.sign, -1);
		var trgs = getSignSuffif(trg);
		if (node[trgs] === '_new') {
			// append to end.
			log('alter', 'grow new');
			checkReadWrite(readonly, cm);
			checkIsTable(sub, bm);
			if (!node._grow) node._grow = 1;
			trgs = trg.sign[trg.sign.length - 1] = node._grow++;
		}
		var save = sub[tslast] || null;
		if (is(trg.val)) {
			check(deepEqual(trg.val, save), cm, 'trg.val set incorrectly');
		} else {
			checkReadWrite(readonly, cm);
			trg.val = save;
		}

		if (is(src.sign)) {
			check(deepEqual(trg.sign, src.sign), bm, 'src.sign set incorrectly');
		} else {
			checkReadWrite(readonly, cm);
			src.sign = trg.sign;
		}
		node[tslast] = src.val;
		break;
	case 'insert':
		var str = get(node, trg.sign, trg.sign.length - 1);
		check(isString(s), bm, 'trg.sign signates no string');

		var trg_p = getPostfix(trg.sign);
		if (trg_p.at1 === '_end') {
			checkReadWrite(readonly, cm);
			trg_p.at1 = s.length;
		}
		checkBoundaries(trg_p.at1, 0, str.length, cm, 'trg.sign...at1 outside string');

		// where trg span should end
		var tat2 = tlast.at1 + src.val.length;
		if (is(tlast.at2)) {
			check(tlast.at2 === tat2, cm, 'trg.sign...at2 preset incorrectly');
		} else {
			checkReadWrite(readonly, cm);
			tlast.at2 = tat2;
		}
		var str_n = str.substring(0, tlast.at1) + src.val + str.substring(tlast.at1);
		set(node, trg.sign, trg.sign.length - 1, str_n);
		break;
	case 'remove':
		var str = get(node, src.sign, src.sign.length - 1);
		checkIsString(str, cm, 'content of src.sign');

		var slast = src.sign[src.sign.length - 1];

		if (slast.at1 === '_end') {
			checkReadWrite(readonly, cm);
			slast.at1 = s.length;
		}
		if (slast.at2 === '_end') {
			checkReadWrite(readonly, cm);
			slast.at2 = s.length;
		}
		if (slast.at1 === slast.at2) { log('alter', 'removed nothing'); return; }
		check(slast.at2 > slast.at1, bm, 'src at2 < at1');
		checkBoundaries(slast.at1, 0, s.length, cm, 'src.sign...at1 outside string');
		checkBoundaries(slast.at2, 0, s.length, cm, 'src.sign...at2 outside string');

		val = s.substring(slast.at1, slast.at2);
		if (isnon(trg.val)) {
			check(val == trg.val, cm, 'trg.val preset incorrectly');
		} else {
			checkReadWrite(readonly, cm);
			trg.val = val;
		}
		var sn = str.substring(0, slast.at1) + s.substring(slast.at2);
		set(node, src.sign, src.sign.length - 1, sn);
		break;
	default:
		throw reject('invalid alter');
	}
}

/**
| Constructor.
*/
function MeshMashine() {
	this.repository = {};
	this.history    = [];
}

/**
| Returns true if time is valid.
*/
MeshMashine.prototype._isValidTime = function(time) {
	return typeof(time) === 'number' && time >= 0 && time <= this.history.length;
}

/**
| Returns true if path is valid.
*/
MeshMashine.prototype._isValidPath = function(path) {
	if (!isArray(path)) return false;
	for (var pi = 0; pi < path.length; pi++) {
		var p = path[pi];
		if (typeof(p) === 'undefined') return false;
		//if (p[0] === '_') return false;
	}
	return true;
}

/**
| Transforms a signature
*/
MeshMashine.prototype.transform = function(time, sign, msg) {
	log('te', msg, 'in', time, sign);
	if (!is(sign)) return sign;
	if (isRoot(sign)) return sign;

	var sigl = sign[sign.length - 1];

	for(var t = time; t < this.history.length; t++) {
		var h = this.history[t];
		var src = h.src;
		var trg = h.trg;
		var atype = alterType(src, trg);
		log('debug', 'atype:', atype);

		switch(atype) {
		case 'set':
			log('tw', msg, 'unimplemented');
			break;
		case 'insert':
			if (!haveSameBase(trg.sign, sign)) continue;
			log('te', 'alter-insert');
			check(isSpan(trg.sign), 'history mangled');

			var trgl = trg.sign[trg.sign.length - 1];
			if (sigl.at1 > trgl.at1) { // or >= ?
				log('te', 'at1 += ',src.val.length);
				sigl.at1 += src.val.length;
				if (is(sigl.at2)) {
					log('te', 'at2 +=', src.val.length);
					sigl.at2 += src.val.length;
				}
			}
			break;
		case 'remove':
			log('debug', 'remove?', trg, sign);
			if (!haveSameBase(src, sign)) continue;
			log('te', 'alter-remove');
			check(isSpan(src.sign), 'history mangled');

			var srcl = src[src.length - 1];
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
	log('te', msg, 'out', sign);
	return sign;
}


/**
| Reflects the state of the repository at time.
| If path is not null it cares only to rebuild what is necessary to see the ida.
*/
// todo partial reflects
MeshMashine.prototype._reflect = function(time, path) {
	var reflect = clone(this.repository);

	// playback
	for(var hi = this.history.length - 1; hi >= time; hi--) {
		var h = this.history[hi];
		try {
			alter(reflect, h.trg, h.src);
		} catch (err) {
			if (err.ok !== false) throw err;
			throw new Error('history mismatch, alter: '+err.message);
		}
	}

	try {
		return get(reflect, path, path.length);
	} catch (err) {
		// returns mm rejections but rethrows coding errors.
		if (err.ok !== false) throw err; else return err;
	}
}

/**
| Alters the repository.
*/
MeshMashine.prototype.alter = function(time, src, trg) {
	log('mm', 'alter time:', time, 'src:', src, 'trg:', trg);
	if (!this._isValidTime(time)) return reject('invalid time');

	try {
		src.sign = this.transform(time, src.sign, 'src');
		trg.sign = this.transform(time, trg.sign, 'trg');
		alter(this.repository, src, trg, false);
	} catch(err) {
		if (err.ok !== false) throw err; else return err;
	}

	this.history.push({src: src, trg: trg});
	return {ok: true, time: this.history.length, src: src, trg: trg };
}

/**
| Gets a node (which can go up to the complete repository).
| TODO add timespans
*/
MeshMashine.prototype.get = function(time, path) {
	log('mm', 'get time:', time, ' path:', path);
	if (!this._isValidTime(time)) return reject('invalid time');
	if (!this._isValidPath(path)) return reject('invalid path');

	var reflect = this._reflect(time, path);

	// remove nulls
	for(var key in reflect) {
		if (reflect[key] === null) delete reflect[key];
	}

	log('mm', 'ok', time, reflect);
	return {ok: true, time: time, node: reflect };
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
