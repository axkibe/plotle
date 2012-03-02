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

  ++ Meshpeer ++
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

 A networked node item editor.

 A peer to a meshcraft repository. Utilizes its own meshmashine.

 Authors: Axel Kittenberger
 License: GNU Affero AGPLv3

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

/**
| Imports
*/
var MeshMashine;
var Path;
var Tree;
var Jools;

/**
| Exports
*/
var Peer; 
/**
| Capsule
*/
(function () {

"use strict";

/**
| Running in node or browser?
*/
if (typeof (window) === 'undefined') throw new Error('Peer nees a browser!');

var Path      = Jools.Path;
var Signature = Jools.Signature;
var debug     = Jools.debug;
var log       = Jools.log;

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 +++ Peer +++
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

 Communicates with the server, holds caches.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
Peer = function(async) {
	this._async = async = async ? true : false;
	if (async) {
		var nexus = Tree.grow( { type: 'Nexus' } );
		this.mm = new MeshMashine(nexus, true, true);
	}
	this.time = -1;  // @@ See if this is permanently needed
};

/**
| Issues a get request
*/
Peer.prototype._get = function(time, path) {
	var asw;

	if (this.async) {
		asw = this.mm.get(-1, path);
		if (asw.ok !== true) throw new Error('Meshmashine not ok: '+asw.message);
		return asw.node;
	} else {
		var ajax = new XMLHttpRequest();
		ajax.open('POST', '/mm', false);
		ajax.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
		var request = JSON.stringify({
			time : time,
			cmd  : 'get',
			path : path
		});
		log('peer', '->', request);
		ajax.send(request);
		asw = ajax.responseText;
		log('peer', '<-', asw);
		try {
			asw = JSON.parse(asw);
		} catch (e) {
			throw new Error('Server answered no JSON!');
		}
		if (asw.ok !== true) throw new Error('AJAX not ok: '+asw.message);
		this.time = asw.time;
		return asw.node;
	}
};

/**
| Issues an alter request
*/
Peer.prototype._alter = function(src, trg) {
	var asw;

	if (this.async) {
		asw = this.mm.alter(-1, new Signature(src), new Signature(trg));
		if (asw.ok !== true) throw new Error('Meshmashine not OK: '+asw.message);
		return asw.node;
	} else {
		var ajax = new XMLHttpRequest();
		ajax.open('POST', '/mm', false);
		ajax.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
		var request = JSON.stringify({
			time : -1,
			cmd  : 'alter',
			src  : src,
			trg  : trg
		});
		log('peer', '->', request);
		ajax.send(request);
		asw = ajax.responseText;
		log('peer', '<-', asw);
		try {
			asw = JSON.parse(asw);
		} catch (e) {
			throw new Error('Server answered no JSON!');
		}
		if (asw.ok !== true) throw new Error('AJAX not ok: '+asw.message);
		return asw.node;
	}
};

/**
| gets a space
*/
Peer.prototype.getSpace = function(time, name) {
	return this._get(time, new Path([name]));
};

/**
| Creates a new note.
*/
Peer.prototype.newNote = function(space, zone) {
	throw new Error('TODO');
	/*
	var path = new Path(space, 'items', '$new');

	var asw = this.mm.alter(-1,
		new Signature({
			val: {
				'type': 'Note',
				'zone': zone,
				'doc': {
					fontsize : 13,
					alley: [
						{
							type: 'Para',
							text: '',
						},
					]
				},
			},
		}), new Signature({
			path: path,
		})
	);

	var apath = asw.alts.trg.path;
	if (!(apath instanceof Path)) throw new Error('Cannot re-get new item');

	this.mm.alter(-1,
		new Signature({
			proc: 'arrange',
			val: apath.get(-1),
		}),
		new Signature({
			at1 : 0,
			path: new Path([space.getOwnKey(), 'z']),
		})
	);

	var k = apath.get(-1);
	return space.items.get(k);
	*/
};

/**
| Sets the zone for item.
*/
Peer.prototype.setZone = function(item, zone) {
	throw new Error('TODO');
	/*
	var path = new Path(item, 'zone');

	this.mm.alter(-1,
		new Signature({
			val: zone,
		}),
		new Signature({
			path: path,
		})
	);*/
};

/**
| Sets an items fontsize
*/
Peer.prototype.setFontSize = function(item, fontsize) {
	throw new Error('TODO');
	/*
	var path = new Path(item, 'doc', 'fontsize');

	this.mm.alter(-1,
		new Signature({
			val: fontsize,
		}),
		new Signature({
			path: path,
		})
	);*/
};

/**
| Sets an items PNW. (point in north-west)
*/
Peer.prototype.setPNW = function(item, pnw) {
	throw new Error('TODO');
	/*
	var path = new Path(item, 'pnw');

	this.mm.alter(-1,
		new Signature({
			val: pnw
		}),
		new Signature({
			path: path,
		})
	);*/
};

/**
| Creates a new label.
*/
Peer.prototype.newLabel = function(space, pnw, text, fontsize) {
	throw new Error('TODO');
	/*
	var path = new Path(space, 'items', '$new');

	var asw = this.mm.alter(-1,
		new Signature({
			val: {
				'type': 'Label',
				'pnw': pnw,
				'doc': {
					fontsize : fontsize,
					alley: [
						{
							type: 'Para',
							text: text,
						}
					]
				}
			}
		}), new Signature({
			path: path,
		})
	);

	var apath = asw.alts.trg.path;
	if (!(apath instanceof Path)) throw new Error('Cannot re-get new item');

	this.mm.alter(-1,
		new Signature({
			proc: 'arrange',
			val: apath.get(-1),
		}),
		new Signature({
			at1 : 0,
			path: new Path([space.getOwnKey(), 'z']),
		})
	);

	var k = apath.get(-1);
	return space.items.get(k);
	*/
};

/**
| Creates a new relation.
*/
Peer.prototype.newRelation = function(space, pnw, text, fontsize, vitem1, vitem2) {
	throw new Error('TODO');
	/*
	var path = new Path(space, 'items', '$new');

	var asw = this.mm.alter(-1,
		new Signature({
			val: {
				'type': 'Relation',
				'item1key': vitem1.getOwnKey(),
				'item2key': vitem2.getOwnKey(),
				'pnw': pnw,
				'doc': {
					fontsize : fontsize,
					alley: [
						{
							type: 'Para',
							text: text
						},
					]
				},
			},
		}), new Signature({
			path: path,
		})
	);

	var apath = asw.alts.trg.path;
	if (!(apath instanceof Path)) throw new Error('Cannot re-get new Item');

	this.mm.alter(-1,
		new Signature({
			proc: 'arrange',
			val: apath.get(-1),
		}),
		new Signature({
			at1 : 0,
			path: new Path([space.getOwnKey(), 'z']),
		})
	);

	var k = apath.get(-1);
	return space.items.get(k);
	*/
};

/**
| Moves an item up to the z-index
*/
Peer.prototype.moveToTop = function(space, item) {
	throw new Error('TODO');
	/*
	var path = new Path(space, 'z');
	var key = item.getOwnKey();
	var at1 = space.z.indexOf(key);

	if (at1 === 0) return;

	this.mm.alter(-1,
		new Signature({
			path: path,
			at1: at1,
		}),
		new Signature({
			proc: 'arrange',
		})
	);

	this.mm.alter(-1,
		new Signature({
			proc: 'arrange',
			val: key,
		}),
		new Signature({
			path: path,
			at1 : 0,
		})
	);
	*/
};

/**
| Inserts some text.
*/
Peer.prototype.insertText = function(path, offset, text) {
	path = new Path(path, '++', 'text');
	this._alter(
		{ val  : text },
		{ path : path, at1  : offset }
	);
};

/**
| Removes some text within one node
*/
Peer.prototype.removeText = function(path, offset, len) {
	path = new Path(path, '++', 'text');
	if (len === 0) return;
	if (len < 0) throw new Error('malformed removeText');

	this._alter(
		{ path: path, at1: offset, at2: offset + len },
		{ val: null }
	);
};

/**
| Removes a text spawning over severa entities
*/
Peer.prototype.removeSpawn = function(path1, offset1, path2, offset2) {
	if (path1.equals(path2)) {
		return this.removeText(path1, offset1, offset2 - offset1);
	}

	throw new Error('TODO');
	/*
	var k1 = node1.getOwnKey();
	var k2 = node2.getOwnKey();
	var len1 = node1.get('text').length;
	for (var a = k1; a < k2 - 1; a++) {
		this.join(node1);
	}
	var len2 = node1.get('text').length;
	this.join(node1);

	this.removeText(node1, o1, len1 - o1 + o2 + len2 - len1);
	*/
};

/**
| Splits a text node.
*/
Peer.prototype.split = function(node, offset) {
	throw new Error('TODO');
	/*var path = new Path(node, 'text');

	this.mm.alter(-1,
		new Signature({
			at1 : offset,
			path: path,
		}),
		new Signature({
			proc: 'splice',
		})
	);
	*/
};

/**
| Joins a text nodes with its next one
*/
Peer.prototype.join = function(node) {
	throw new Error('TODO');
	/*
	var path = new Path(node, 'text');

	this.mm.alter(-1,
		new Signature({
			proc : 'splice',
		}),
		new Signature({
			at1 : '$end',
			path: path,
		})
	);
	*/
};

/**
| Removes an item.
*/
Peer.prototype.removeItem = function(space, item) {

	throw new Error('TODO');
	/*
	var path = new Path(space, 'z');
	var key = item.getOwnKey();
	var at1 = space.z.indexOf(key);

	// remove from z-index
	this.mm.alter(-1,
		new Signature({
			path: path,
			at1: at1,
		}),
		new Signature({
			proc: 'arrange',
		})
	);

	// remove from doc alley
	this.mm.alter(-1,
		new Signature({
			val: null,
		}),
		new Signature({
			path: new Path(item),
		})
	);*/
};

})();
