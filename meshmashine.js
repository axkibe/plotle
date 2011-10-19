/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ,-,-,-.           .   ,-,-,-.           .
 `,| | |   ,-. ,-. |-. `,| | |   ,-. ,-. |-. . ,-. ,-.
   | ; | . |-' `-. | |   | ; | . ,-| `-. | | | | | |-'
   '   `-' `-' `-' ' '   '   `-' `-^ `-' ' ' ' ' ' `-'
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
/**
| The causal consistency / operation transformation engine for meshcraft.
|
| Authors: Axel Kittenberger
| License: GNU Affero AGPLv3
*/

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

var log = require('./mclog');

/**
| Type check shortcuts
*/
function isString(o) {
	return typeof(o) === 'string' || o instanceof String;
}

function isArray(o)  {
	return o instanceof Array;
}

function isTable(o)  {
	return typeof(o) === 'object' && !(o instanceof Array) && !(o instanceof String);
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
function gpath(node, path) {
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
function spath(node, path, value) {
	if (path.length === 0) return reject('cannot set empty path');
	var pi;
	for(pi = 0; pi < path.length - 1; pi++) {
		if (!node) return reject('path points nowhere');
		node = node[path[i]];
	}
	node[path[pi]] = value;
}

/**
| Constructor.
|
| ifail: function(message), called on internal fail of meshmashine.
*/
function MeshMashine(ifail) {
	this.repository = {};
	this.history    = [];
	this.ifail      = ifail;
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
	if (!isArray(path) || path.length === 0) return false;
	for (var pi = 0; pi < path.length; pi++) {
		var p = path[pi];
		if (!p) return false;
		if (p[0] === '_') return false;
	}
	return true;
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
		case 'create':
			if (!reflect[h.path[0]]) this.ifail('history mismatch, created node not there.');
			reflect[h.path[0]].node = null;
			break;
		case 'remove':
			if (reflect[h.path[0]]) this.ifail('history mismatch, removed node there.');
			reflect[h.path[0]] = clone(h.save);
			break;
		case 'set' :
			spath(reflect, h.path, h.save);
			break;
		default:
			this.ifail('history mismatch, unknown command.');
		}
	}

	try {
		return gpath(reflect, path);
	} catch (err) {
		// returns mm rejections but rethrows on coding errors.
		if (err.code !== false) throw err; else return err; 
	}
}

/**
| Alters a string.
*/
MeshMashine.prototype.alter = function(time, from, to) {
	log('mm', 'alter', from, to);
	if (!this._isValidTime(time)) return reject('invalid time');
	if (!isString(from))          return reject('unimplemented: from must be string');
	if (typeof(to.path) === 'undefined' || typeof(to.offset) === 'undefined') { 
		return reject('.to is no string pointer');
	}
	if (!this._isValidPath(to.path)) return reject('.to.path invalid');

	var tn = this._reflect(time, to.path);
	log(true, tn);
	if (!isString(tn)) return reject('.to does not point to a string');

	// todo transformation
	//for(var hi = time; hi < this.history.length; hi++) {
	//	
	//}

	var s = gpath(this.repository, to.path);
	var too = to.offset;
	if (too > s.length) return reject('.to.offset too large');
	if (too === -1) too = s.length;
	spath(this.repository, to.path, s.substring(0, too) + from + s.substring(too));
	this.history.push({cmd: 'alter', from: from, to: to});
	return {code: true, time: time};
}

/**
| Gets a node (which also can be the complete repository).
*/
MeshMashine.prototype.get = function(time, path) {
	log('mm', 'get', time, path);
	if (!this._isValidTime(time)) return reject('invalid time');

	var reflect = this._reflect(time, path);

	// remove nulls
	for(var key in reflect) {
		if (reflect[key] === null) delete reflect[key];
	}

	log('mm', 'ok', time, reflect);
	return {ok: true, time: time, node: reflect };
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
		if (typeof(node) === 'undefined') return {code: false, message: 'path points nowhere'};
	}

	if (path[pi] === -1) {
		// append to end.
		if (typeof(node) !== 'object' || node instanceof Array) {
			return {code: false, message: 'node not growable'};
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
