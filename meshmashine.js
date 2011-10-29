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
	return typeof(o) !== 'undefined' && (o !== null);
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

function signatoryType(o) {
	if (o === null) return 'nil';
	if (isArray(o)) {
		if (o.length === 0) return 'root';
		var last = o[o.length - 1];
		if (isTable(last)) {
			if (is(last.at1) && is(last.at2)) return 'span';
			if (is(last.at1)) return 'index';
			return null;
		}
		return 'path';
	}
	if (!isTable(o)) return null;
	if (is(o.val)) return 'value';
	if (isEmpty(o)) return 'empty';
	return null;
}

//function isIndex(o) { xxxxx
//	return typeof(o) === 'object' && isInteger(o.at1);
//}
//
//function isSpan(o) { xxxxx
//	return isIndex(o) && isInteger(o.at2);
//}

function isSamepath(p1, p2) {
	if (p1.length !== p2.length) return false;
	for(var p = 0, pl = p1.length; p < pl; p++) {
		if (p1[p] !== p2[p]) return false;
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
*/
function get(node, path, pathlen) {
	for (var i = 0; i < pathlen; i++) {
		if (node === null) {
			return reject('path points nowhere.');
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
function set(node, path, val) {
	if (path.length === 0) throw reject('cannot set empty path');
	var pi;
	for(pi = 0; pi < path.length - 1; pi++) {
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
	log('alter', 'src:', src);
	var srcST = signatoryType(src);

	log('alter', 'trg:', trg);
	var trgST = signatoryType(trg);

	if (srcST === 'value') {
		log('alter', 'is insert');
		var bm = 'alter(remove) ';
		checkOneOf(trgST, 'index', 'span', bm, 'trg not an index');

		var s = get(node, trg, trg.length - 1);
		check(isString(s), bm, 'trg signates no string');

		var tlast = trg[trg.length - 1];
		if (tlast.at1 === -1) {
			check(!readonly, bm, 'not changing readonly signatory');
			tlast.at1 = s.length;
		}
		checkBoundaries(tlast.at1, 0, s.length, bm, 'trg at1 outside string');

		// where trg span should end
		var tat2 = tlast.at1 + src.val.length;
		if (is(trg.at2)) {
			check(trg.at2 === tat2, bm, 'trg at2 preset incorrectly');
		} else {
			check(!readonly, bm, 'not changing readonly signatory');
			trg.at2 = tat2;
		}
		set(node, trg, s.substring(0, trg.at1) + src.val + s.substring(trg.at1));
	} else if (trgST === 'empty' || trgST === 'value') {
		log('alter', 'is remove');
		var bm = 'alter(remove) ';
		check(srcST === 'span', bm, 'src not a span');
		var s = get(node, src, src.length - 1);
		var slast = src[src.length - 1];
		if (slast.at1 === -1) {
			check(!readonly, bm, 'not changing readonly signatory');
			slast.at1 = s.length;
		}
		if (slast.at2 === -1) {
			check(!readonly, bm, 'not changing readonly signatory');
			slast.at2 = s.length;
		}
		if (slast.at1 === slast.at2) { log('alter', 'removed nothing'); return; }
		check(slast.at2 > slast.at1, bm, 'src at2 < at1');
		checkBoundaries(slast.at1, 0, s.length, bm, 'src at1 outside string');
		checkBoundaries(slast.at2, 0, s.length, bm, 'src at2 outside string');

		val = s.substring(slast.at1, slast.at2);
		if (trgST === 'value') {
			check(val == trg.val, bm, 'trg val preset incorrectly');
		} else {
			check(!readonly, bm, 'not changing readonly signatory');
			trgST.val = val;
		}

		set(node, src, s.substring(0, src.at1) + s.substring(src.at2));
	} else {
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
| Transforms an index or span.
*/
MeshMashine.prototype.transform = function(time, sign) {
	log('debug', sign);
	var signST = signatoryType(sign);
	log('debug', signST);
	switch (signST) {
	case 'nil' :
	case 'value' :
		return sign;
	case 'path' :
	case 'index' :
	case 'span' :
		break;
	default :
		throw reject('transform unknown signatory type: '+signST);
		break;
	}

	var signL = sign[sign.length - 1];

	for(var t = time; t < this.history.length; t++) {
		var h = this.history[t];
		switch(h.cmd) {
		case 'set':
			if (isSubpath(h.path, sign)) {
				// this change is being overwritten
				log('te', 'setted away');
				return null;
			}
			break;
		case 'alter' :
			var src = h.src;
			var trg = h.trg;
			var srcST = signatoryType(h.src);
			var trgST = signatoryType(h.trg);
			if (srcST === 'value') {
				if (!isSamepath(trg, sign)) break;
				log('te', 'alter-insert');

				var trgL = trg[trg.length - 1];
				check(trgST === 'span', 'history mangled');
				if (signL.at1 > trgl.at1) { // or >= ?
					log('te', 'at1 += ',trg.val.length);
					signL.at1 += trg.val.length;
					if (is(signL.at2)) {
						log('te', 'at2 +=', trg.val.length);
						signL.at2 += trg.val.length;
					}
				}
			} else if (trgST === 'value') {
				if (!isSamepath(src, sign)) break;
				log('te', 'alter-remove');

				var srcL = src[src.length - 1];
				check(srcST === 'span', 'history mangled');
				//       123456789
				//         ^^^    <- removed
				//case1:       <->
				//case2:    <->
				if (signL.at1 > srcL.at1) {
					if (signL.at1 > srcL.at2) {
						log('te', 'at1 -=', trg.val.length);
						// case1
						signL.at1 -= trg.val.length;
						if (is(signL.at2)) {
							log('te', 'at2 -=', trg.val.length);
							signL.at2 -= trg.val.length;
						}
					} else {
						// case2
						if (is(signL.at2)) {
							log('te', 'at2 =', signL.at2 - signL.at1 + srcL.at1);
							singL.at2 = signL.at2 - signL.at1 + srcL.at1;
						}
						log('te', 'at1 =', srcL.at);
						signL.at1 = srcL.at1;
					}
				}
			} else {
				throw new Error('history mangled');
			}
			break;
		}
	}
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
		switch(h.cmd) {
		case 'alter':
			try {
				alter(reflect, h.val, h.trg, h.src);
			} catch (err) {
				if (err.ok !== false) throw err;
				throw new Error('history mismatch, alter: '+err.message);
			}
			break;
		case 'set' :
			set(reflect, h.path, clone(h.save));
			break;
		default:
			throw new Error('history mismatch, unknown command.');
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
| Alters a string.
*/
MeshMashine.prototype.alter = function(time, src, trg) {
	log('mm', 'alter time:', time, 'src:', src, 'trg:', trg);
	if (!this._isValidTime(time)) return reject('invalid time');

	try {
		log('te', 'src');
		var tsrc = this.transform(time, src);
		log('te', 'trg');
		var ttrg = this.transform(time, trg);
		alter(this.repository, tsrc, ttrg, false);
	} catch(err) {
		if (err.ok !== false) throw err; else return err;
	}

	this.history.push({cmd: 'alter', src: tsrc, trg: ttrg});
}

/**
| Gets a node (which also can be the complete repository).
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
*/
MeshMashine.prototype.now = function() {
	log('mm', 'now');
	log('mm', 'ok', this.history.length);
	return {ok: true, time: this.history.length };
}

/**
| Sets a node.
*/
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

	if (path[pi] === -1) {
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
}

/**
| Returns all changes from time to now.
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
