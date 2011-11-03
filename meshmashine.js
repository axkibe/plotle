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

function alterType(src, trg) {
	if (is(src.val) && isPathSign(trg.sign))            return 'set';
	if (is(src.val) && isIndexSign(trg.sign))           return 'insert';
	if (isSpanSign(src.sign) && !isIndexSign(trg.sign)) return 'remove';
	return null;
}

function isIndexSign(o) {
	if (!isArray(o)) return false;
	if (o.length === 0) return false;
	var last = o[o.length - 1];
	if (is(last.at1)) return true;
}

function isSpanSign(o) {
	if (!isArray(o)) return false;
	if (o.length === 0) return false;
	var last = o[o.length - 1];
	if (is(last.at1) && is(last.at2)) return true;
}

function isPathSign(o) {
	if (!isArray(o)) return false;
	if (o.length === 0) return false;
	var last = o[o.length - 1];
	return isInteger(last) || isString(last);
}

function isRootSign(o) {
	if (!isArray(o)) return false;
	return o.length === 0;
}

function basepathLen(p) {
	var pl = p.length;
	if (pl === 0) return 0;
	if (isTable(p[pl - 1])) return pl - 1;
	return pl;
}

/**
| Compares if two paths are the same, excluding possible
| signatories.
*/
function haveSameBase(p1, p2) {
	var bpl1 = basepathLen(p1);
	if (bpl1 !== basepathLen(p2)) return false;
	for(var pi = 0; pi < bpl1; pi++) {
		if (p1[pi] !== p2[pi]) return false;
	}
	return true;
}

function isSubpath(p1, p2) {
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

/**
| a kind of assert.
*/
function check(condition, msg1, msg2) {
	if (!condition) throw reject((msg1||'')+(msg2||''));
}

/**
| a kind of assert.
*/
function checkBoundaries(value, lowest, highest, msg1, msg2) {
	if (value < lowest || value > highest) throw reject((msg1||'')+(msg2||''));
}

/**
| a kind of assert.
*/
function checkOneOf(value) {
	for (var i = 1; i < arguments.length - 2; i++) {
		if (value === arguments[i]) return;
	}
	throw reject(arguments[arguments.length - 2]||'')+(arguments[arguments.length - 1]||'');
}

/**
| Returns the subnode path points at.
| TODO check for leading '_'
*/
function get(node, path, pathlen) {
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
	// todo moves
	var atype = alterType(src, trg);
	var bm = 'alter('+atype+')';

	log('alter', 'src:', src);
	log('alter', 'trg:', trg);
	log('alter', 'atype:', atype);
	switch (atype) {
	case 'set':
		var sub = get(node, trg.sign, trg.sign.length - 1);
		var tslast = trg.sign[trg.sign.length - 1];
		if (node[tslast] === '_new') {
			// append to end.
			log('alter', 'grow new');
			check(!readonly, bm, 'not changing readonly signatory');
			check(isTable(sub), bm, 'node cannot grow new subnodes');
			if (!node._grow) node._grow = 1;
			tslast = trg.sign[trg.sign.length - 1] = node._grow++;
		}
		var save = sub[tslast] || null;
		if (is(trg.val)) {
			check(deepEqual(trg.val, save), bm, 'trg.val set incorrectly');
		} else {
			check(!readonly, bm, 'not changing readonly signatory');
			trg.val = save;
		}

		if (is(src.sign)) {
			check(deepEqual(trg.sign, src.sign), bm, 'src.sign set incorrectly');
		} else {
			check(!readonly, bm, 'not changing readonly signatory');
			src.sign = trg.sign;
		}
		node[tslast] = src.val;
		break;
	case 'insert':
		var s = get(node, trg.sign, trg.sign.length - 1);
		check(isString(s), bm, 'trg.sign signates no string');

		var tlast = trg.sign[trg.sign.length - 1];  // TODO rename trgl
		if (tlast.at1 === '_end') {
			check(!readonly, bm, 'not changing readonly signatory');
			tlast.at1 = s.length;
		}
		checkBoundaries(tlast.at1, 0, s.length, bm, 'trg.sign...at1 outside string');

		// where trg span should end
		var tat2 = tlast.at1 + src.val.length;
		if (is(tlast.at2)) {
			check(tlast.at2 === tat2, bm, 'trg.sign...at2 preset incorrectly');
		} else {
			check(!readonly, bm, 'not changing readonly signatory');
			tlast.at2 = tat2;
		}
		var sn = s.substring(0, tlast.at1) + src.val + s.substring(tlast.at1);
		set(node, trg.sign, trg.sign.length - 1, sn);
		break;
	case 'remove':
		var s = get(node, src.sign, src.sign.length - 1);
		check(isString(s), bm, 'src.sign signates no string');

		// todo check s
		var slast = src.sign[src.sign.length - 1];
		if (slast.at1 === '_end') {
			check(!readonly, bm, 'not changing readonly signatory');
			slast.at1 = s.length;
		}
		if (slast.at2 === '_end') {
			check(!readonly, bm, 'not changing readonly signatory');
			slast.at2 = s.length;
		}
		if (slast.at1 === slast.at2) { log('alter', 'removed nothing'); return; }
		check(slast.at2 > slast.at1, bm, 'src at2 < at1');
		checkBoundaries(slast.at1, 0, s.length, bm, 'src.sign...at1 outside string');
		checkBoundaries(slast.at2, 0, s.length, bm, 'src.sign...at2 outside string');

		val = s.substring(slast.at1, slast.at2);
		if (isnon(trg.val)) {
			check(val == trg.val, bm, 'trg.val preset incorrectly');
		} else {
			check(!readonly, bm, 'not changing readonly signatory');
			trg.val = val;
		}
		var sn = s.substring(0, slast.at1) + s.substring(slast.at2);
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
	if (isRootSign(sign)) return sign;

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
			check(isSpanSign(trg.sign), 'history mangled');

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
| Sets a node.
*/
/*

TODO delete

MeshMashine.prototype.set = function(time, path, val) {
	log('mm', 'set time:', time, 'path:', path, 'val:', val);
	if (!this._isValidTime(time)) return reject('invalid time');
	if (!this._isValidPath(path)) return reject('invalid path');

	var node = this.repository;
	var pi;
	for (pi = 0; pi < path.length - 1; pi++) {
		node = node[path[pi]];
		if (typeof(node) === 'undefined') return reject('path points nowhere');
	}

	if (path[pi] === '_end') {
		// append to end.
		if (typeof(node) !== 'object' || node instanceof Array) {
			return reject('node not growable');
		}
		if (!node._grow) node._grow = 1;
		path[pi] = node._grow++;
	}

	var save = node[path[pi]] || null;
	node[path[pi]] = val;

	this.history.push({cmd: 'set', path: path, save: save, val : val});

	log('mm', 'ok', time, path, save);
	return {ok: true, time: time, path: path, save: save};
}*/

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
