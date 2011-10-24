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
	return typeof(o) === 'object' && isInteger(o.from);
}

function isSpan(o) {
	return isIndex(o) && isInteger(o.to);
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
function alter(node, origin, target) {
	// todo moves
	log('alter', origin, target);
	if (isString(origin.text)) {
		// insert
		log('alter', 'insert');
		var s = get(node, target.path);
		var tf = target.from;
		if (tf > s.length) throw reject('.target.from outside string');
		if (tf === -1) tf = s.length;
		if (tf < 0) throw reject('.target.from outside string');
		var to = tf + origin.length;
		// make target a span.
		if (typeof(target.to) !== 'undefined') {
			if (target.to !== to) throw reject('.target.to set but wrong');
		} else {
			target.to = to;
		}
		set(node, target.path, s.substring(0, tf) + origin.text + s.substring(tf));
	} else if (isEmpty(target)) {
		// remove
		log('alter', 'remove');
		if (!isSpan(origin)) throw reject('origin no span');
		var s = get(node, origin.path);
		var of = origin.from;
		var ot = origin.to;
		target.text = s.substring(of, ot);
		set(node, origin.path, s.substring(0, of) + s.substring(ot));
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
			if (!isSamepath(h.path, ios.path)) break;
			log('ote', 'altered');
			if (isString(h.origin)) {
				// was an insert
				if (!isSpan(h.target)) throw new Error('history mangled');
				if (iod.from > h.target.from) { // or >= for insert after?
					iod.from += h.target.to - h.target.from;
				}
				if (iod.to > h.target.from) { // or >= for insert after?
					iod.to += h.target.to - h.target.from;
				}
			} else if (h.target === null || isString(h.target)) {
				// was a remove
				if (!isSpan(h.origin)) throw new Error('history mangled');
				if (ios.from > h.origin.from) ios.from -= h.origin.to - h.origin.from;
				if (ios.to > h.origin.from) ios.to -= h.origin.to - h.origin.from;
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
				alter(reflect, h.target, h.origin);
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
		// returns mm rejections but rethrows on coding errors.
		if (err.ok !== false) throw err; else return err;
	}
}

/**
| Alters a string.
*/
MeshMashine.prototype.alter = function(time, origin, target) {
	log('mm', 'alter', origin, target);
	if (!this._isValidTime(time)) return reject('invalid time');

	if (isString(origin.text)) {
		if (!isIndex(target)) reject('.target is no index');
		if (!this._isValidPath(target.path)) return reject('.target.path invalid');

		var tn = this._reflect(time, target.path);
		if (!isString(tn)) return reject('.target.path does not point to a string');

		var tidx = this._transformIS(time, target);

		try {
			alter(this.repository, origin, tidx);
		} catch(err) {
			if (err.ok !== false) throw err; else return err;
		}
		this.history.push({cmd: 'alter', origin: origin, target: tidx});
		return {ok: true, time: time};
	} else if (target === null) {
		if (!isSpan(origin)) reject('.origin is no span');
		if (!this._isValidPath(origin.path)) return reject('.origin.path invalid');

		var tn = this._reflect(time, origin.path);
		if (!isString(tn)) return reject('.origin.path does not point to a string');

		var aorg = this._transformIS(time, origin);
		var atrg = {};

		try {
			alter(this.repository, aorg, atrg);
		} catch(err) {
			if (err.ok !== false) throw err; else return err;
		}
		this.history.push({cmd: 'alter', origin: aorg, target: atrg});
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
	log('mm', 'get', time, path);
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
	log('mm', 'set', time, path, value);
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
	log('mm', 'update', time);
	if (!this._isValidTime(time)) return reject('invalid time');
	var update = [];
	for(var ti = time; ti < this.history.length; ti++) {
		update.push((this.history[ti]));
	}
	log('mm', 'ok', this.history.length, update);
	return {ok: true, time: this.history.length, update: update };
}

module.exports = MeshMashine;
