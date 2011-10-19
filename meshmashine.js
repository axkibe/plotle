/**     __  __   ___         __.....__               .
       |  |/  `.'   `.   .-''         '.           .'|
       |   .-.  .-.   ' /     .-''"'-.  `.        <  |
       |  |  |  |  |  |/     /________\   \        | |         .----------.
       |  |  |  |  |  ||                  |    _   | | .'''-. /            \
       |  |  |  |  |  |\    .-------------'  .' |  | |/.'''. \\            /
       |  |  |  |  |  | \    '-.____...---. .   | /|  /    | | '----------'
       |__|  |__|  |__|  `.             .'.'.'| |//| |     | |
                           `''-...... -'.'.'.-'  / | |     | |
                                        .'   \_.'  | '.    | '.
                                                   '---'   '---'
  __  __   ___                          .        .--.   _..._         __.....__
 |  |/  `.'   `.                      .'|        |__| .'     '.   .-''         '.
 |   .-.  .-.   '                    <  |        .--..   .-.   . /     .-''"'-.  `.
 |  |  |  |  |  |    __               | |        |  ||  '   '  |/     /________\   \
 |  |  |  |  |  | .:--.'.         _   | | .'''-. |  ||  |   |  ||                  |
 |  |  |  |  |  |/ |   \ |      .' |  | |/.'''. \|  ||  |   |  |\    .-------------'
 |  |  |  |  |  |`" __ | |     .   | /|  /    | ||  ||  |   |  | \    '-.____...---.
 |__|  |__|  |__| .'.''| |   .'.'| |//| |     | ||__||  |   |  |  `.             .'
                 / /   | |_.'.'.-'  / | |     | |    |  |   |  |    `''-...... -'
                 \ \._,\ '/.'   \_.'  | '.    | '.   |  |   |  |
                  `--'  `"            '---'   '---'  '--'   ''*/
/**
| The causal consistency / operation transformation engine for meshcraft.
|
| Authors: Axel Kittenberger
| License: GNU Affero AGPLv3
*/

var util = require('util'); // todo remove

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


/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ,-,-,-.           .   ,-,-,-.           .
 `,| | |   ,-. ,-. |-. `,| | |   ,-. ,-. |-. . ,-. ,-.
   | ; | . |-' `-. | |   | ; | . ,-| `-. | | | | | |-'
   '   `-' `-' `-' ' '   '   `-' `-^ `-' ' ' ' ' ' `-'
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

/**
| Sets the value of a node.
| This functions makes no checks anymore.
| Returns node (possibly changed)
|
| node:  the repo or part of
| path:  path to the value (relative to node)
| value: the new value to set
| save:  if not null sets here the old value as .save
*/
function mmSet(node, path, value, save) {
	if (path.length === 0) {
		if (save) save.save = node;
		return value;
	}

	var subnode = node;
	for(var i = 0; i < path.length - 1; i++) {
		subnode = subnode[path[i]];
	}

	var last = path[path.length -1];
	var save = subnode[last];
	subnode[last] = value;
	return node;
}

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
| Returns true if the root node of path exists at time.
*/
MeshMashine.prototype._isRootThere = function(time, path) {
	var there = !!this.repository[ida[0]];
	for(var hi = this.history.length - 1; hi >= time; hi--) {
		var h = this.history[hi];
		switch(h.cmd) {
		case 'create' :
			if (h.path[0] === path[0]) there = false;
			break;
		case 'remove' :
			if (h.path[0] === path[0]) there = true;
			break;
		}
	}
	return there;
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
| If ida is not null it cares only to rebuild what is necessary to see the ida.
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
			mmSet(reflect, h.path, h.save);
			break;
		default:
			this.ifail('history mismatch, unknown command.');
		}
	}
	return reflect;
}

/**
| Alters a string.
*/
MeshMashine.prototype.alter = function(time, from, to) {
	if (!this._isValidTime(time)) return {code: false, message: 'invalid time'};
	if (!isString(from)) return {code: false, message: 'unimplemented: from must be string'};

	/*
	if (!this._isValidPath(path)) return {code: false, message: 'invalid path'};

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
	return {code: true, time: time, path: path, save: save};*/
	return {code: false, message: 'unimplemented'};
}

/**
| Gets a node (which also can be the complete repository).
*/
MeshMashine.prototype.get = function(time, path) {
	if (!this._isValidTime(time)) return {code: false, message: 'invalid time'};

	var reflect = this._reflect(time, path);

	// remove nulls
	for(var key in reflect) {
		if (reflect[key] === null) delete reflect[key];
	}

	var node = reflect;
	for (var i = 0; i < path.length; i++) {
		if (node === null) {
			return {code: true, message: 'path points nowhere.' };
		}
		node = node[path[i]];
	}

	return {code: true, time: time, node: node };
}

/**
| Sets a node.
*/
MeshMashine.prototype.set = function(time, path, value) {
	if (!this._isValidTime(time)) return {code: false, message: 'invalid time'};
	if (!this._isValidPath(path)) return {code: false, message: 'invalid path'};

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
	return {code: true, time: time, path: path, save: save};
}

/**
| Returns all changes from time to now.
*/
MeshMashine.prototype.update = function(time) {
	if (!this._isValidTime(time))   return {code: false, message: 'invalid time'};
	var update = [];
	for(var ti = time; ti < this.history.length; ti++) {
		update.push((this.history[ti]));
	}
	return {code: true, time: this.history.length, update: update };
}

module.exports = MeshMashine;
