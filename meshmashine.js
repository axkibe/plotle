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

function isIndex(o) {
	return typeof(o) === 'object' && isInteger(o.at1);
}

function isSpan(o) {
	return isIndex(o) && isInteger(o.at2);
}

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
| return the subnode path points at
*/
function get(node, path) {
	for (var i = 0; i < path.length; i++) {
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
function set(node, path, value) {
	if (path.length === 0) throw reject('cannot set empty path');
	var pi;
	for(pi = 0; pi < path.length - 1; pi++) {
		if (!node) throw reject('path points nowhere');
		node = node[path[i]];
	}
	node[path[pi]] = value;
}

/**
| Alters a string
*/
function alter(node, val, src, trg) {
	// todo moves
	log('alter', 'val:', val, 'src:', src, 'trg:', trg);
	if (!src) {
		// insert
		log('alter', 'is insert');
		if (!isIndex(trg)) throw reject('alter(insert).trg not an index');
		if (!isString(val)) throw reject('alter(insert).val not a string');
		var s = get(node, trg.path);
		var tat1 = trg.at1
		if (tat1 === -1) tat1 = s.length;
		if (tat1 < 0 || tat1 > s.length) throw reject('alter(insert).trg.at1 outside string');

		// make target a span.
		var tat2 = tat1 + val.length;
		if (is(trg.at2)) {
			if (trg.at2 !== tat2) throw reject('alter(inster).trg.at2 already set wrongly');
		} else {
			trg.at2 = tat2;
		}
		set(node, trg.path, s.substring(0, tat1) + val + s.substring(tat1));
		return val;
	} else if (!trg) {
		// remove
		log('alter', 'is remove');
		if (!isSpan(src)) throw reject('alter(remove).src not a span');
		var s = get(node, src.path);
		var sat1 = src.at1, sat2 = src.at2;
		if (sat1 === -1) sat1 = s.length;
		if (sat2 === -1) sat2 = s.length;
		if (sat1 === sat2) { log('alter', 'removed nothing'); return; }
		if (sat2 < sat1)     throw reject('alter(remove) src.at2 < src.at1');
		if (sat1 > s.length) throw reject('alter(remove) src.at1 outside string');
		if (sat2 > s.length) throw reject('alter(remove) src.at2 outside string');
		val = s.substring(sat1, sat2);
		set(node, src.path, s.substring(0, sat1) + s.substring(sat2));
		return val;
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
		if (!p) return false;
		if (p[0] === '_') return false;
	}
	return true;
}

/**
| Transforms an index or span.
*/
MeshMashine.prototype._transformIS = function(time, ios) {
	for(var t = time; t < this.history.length; t++) {
		var h = this.history[t];
		switch(h.cmd) {
		case 'set':
			if (isSubpath(h.path, ios.path)) {
				// this change is being overwritten
				log('ote', 'setted away');
				return null;
			}
			break;
		case 'alter' :
			if (!h.src && h.trg) {
				log('ote', 'alter-instert');
				if (!isSamepath(h.trg.path, ios.path)) break;
				if (!isSpan(h.trg)) throw new Error('history mangled');
				// or >= for insert after?
				if (ios.at1 > h.trg.at1) {
					ios.at1 += h.val.length;
					if (is(ios.at2)) ios.at2 += h.val.length;
				}
			} else if (h.src || !h.trg) {
				log('ote', 'alter-remove');
				if (!isSamepath(h.src.path, ios.path)) break;
				if (!isSpan(h.src)) throw new Error('history mangled');
				//       123456789
				//         ^^^    <- removed
				//case1:       '''
				//case2:    '''
				if (ios.at1 > h.src.at1) {
					if (ios.at1 > h.src.at2) {
						ios.at1 -= h.val.length;
						if (is(ios.at2)) ios.at2 -= h.val.length;
					} else {
						if (is(ios.at2)) ios.at2 = ios.at2 - ios.at1 + h.src.at1;
						ios.at1 = h.src.at1;
					}
				}
				if (typeof(ios.at2) !== 'undefined') ios.at2 -= h.val.length;
			} else {
				throw new Error('history mangled');
			}
			break;
		}
	}
	return ios;
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
		return get(reflect, path);
	} catch (err) {
		// returns mm rejections but rethrows coding errors.
		if (err.ok !== false) throw err; else return err;
	}
}

/**
| Alters a string.
*/
MeshMashine.prototype.alter = function(time, val, src, trg) {
	log('mm', 'alter time:', time, 'src:', src, 'trg:', trg);
	if (!this._isValidTime(time)) return reject('invalid time');
	if (!src) {
		if (!isIndex(trg))                return reject('alter(insert).trg is no index');
		if (!this._isValidPath(trg.path)) return reject('alter(insert).trg.path invalid');
		var ttrg = this._transformIS(time, trg);
		try {
			alter(this.repository, val, null, ttrg);
		} catch(err) {
			if (err.ok !== false) throw err; else return err;
		}
		// todo, check if more keys are set in trg than allowed.
		this.history.push({cmd: 'alter', val: val, src: null, trg: trg});
		return {ok: true, time: time};
	} else if (!trg) {
		if (!isIndex(src))                return reject('alter(remove).src is no span');
		if (!this._isValidPath(src.path)) return reject('alter(remove).src.path invalid');

		var tsrc = this._transformIS(time, src);

		var val;
		try {
			val = alter(this.repository, null, tsrc, null);
		} catch(err) {
			if (err.ok !== false) throw err; else return err;
		}
		this.history.push({cmd: 'alter', val: val, src: tsrc, trg: null});
		return {ok: true, time: time};
	} else {
		log(true, target);
		return reject('unimplemented');
	}
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
MeshMashine.prototype.set = function(time, path, value) {
	log('mm', 'set time:', time, 'path:', path, 'value:', value);
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
	node[path[pi]] = value;

	this.history.push({cmd: 'set', path: path, save: save, value : value});

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
