/**                                                      _.._
                                                      .-'_.._''.
 __  __   ___       _....._              .          .' .'     '.\
|  |/  `.'   `.   .'       '.          .'|         / .'                                _.._
|   .-.  .-.   ' /   .-'"'.  \        (  |        . '            .-,.-~.             .' .._|    .|
|  |  |  |  |  |/   /______\  |        | |        | |            |  .-. |    __      | '      .' |_
|  |  |  |  |  ||   __________|    _   | | .'''-. | |            | |  | | .:-`.'.  __| |__  .'     |
|  |  |  |  |  |\  (          '  .' |  | |/.'''. \. '            | |  | |/ |   \ ||__   __|'-..  .-'
|  |  |  |  |  | \  '-.___..-~. .   | /|  /    | | \ '.         .| |  '- `" __ | |   | |      |  |
|__|  |__|  |__|  `         .'.'.'| |//| |     | |  '. `.____.-'/| |      .'.''| |   | |      |  |
                   `'-.....-.'.'.-'  / | |     | |    `-._____ / | |     / /   | |_  | |      |  '.
                                 \_.'  | '.    | '.           `  |_|     \ \._,\ '/  | |      |   /
                                       '___)   '___)                      `~~'  `"   |_|      `--'

  +++ Meshpeer +++
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

 A networked node item editor.

 A peer to a meshcraft repository. Utilizes its own meshmashine.

 Authors: Axel Kittenberger
 License: MIT(Expat), see accompanying 'License'-file

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

/**
| Imports
*/
var MeshMashine;
var Path;
var Patterns;
var Tree;
var Jools;
var Emulate;

/**
| Exports
*/
var Peer;

/**
| Capsule
*/
(function () {
"use strict";
if (typeof (window) === 'undefined') throw new Error('Peer nees a browser!');

var debug = Jools.debug;
var log   = Jools.log;
var is    = Jools.is;

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 .-,--.
  '|__/ ,-. ,-. ,-.
  ,|    |-' |-' |
  `'    `-' `-' '
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

 Communicates with the server, holds caches.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
/**
| Constructor
*/
Peer = function(mode) {
	this._mode = mode;
	var tree;

	switch(mode) {
	case 'async' :
		tree = new Tree({ type : 'Nexus' }, Patterns.mUniverse);
		this.mm = new MeshMashine(tree);
		break;
	case 'sync' :
		break;
	case 'emulate' :
		tree = new Tree({ type : 'Nexus' }, Patterns.mUniverse);
		this.mm = new MeshMashine(tree);

		var src = Emulate.src;
		var trg = { path: new Path(Emulate.path) };
		var asw = this.mm.alter(0, src, trg);
		if (asw.ok !== true) throw new Error('Cannot emulate Repository');
		break;
	default :
		throw new Error('unknown mode: '+mode);
	}
	this.time = -1;  // @@ See if this is permanently needed
};

/**
| Gets a twig
|
| time: to get twig for (-1 means now)
| path: path to twig
*/
Peer.prototype.get = function(time, path) {
	var asw;

	switch(this._mode) {
	case 'async'   :
	case 'emulate' :
		asw = this.mm.get(-1, path);
		if (asw.ok !== true) throw new Error('Meshmashine not ok: '+asw.message);
		return asw.node;
	case 'sync' :
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
		return is(asw.node) ? new Tree(asw.node, Patterns.mUniverse).root : null;
	default :
		throw new Error('unknown mode: '+this._mode);
	}
};

/**
| Issues an alter request
*/
Peer.prototype._alter = function(src, trg) {
	var asw;

	switch (this._mode) {
	case 'async'   :
	case 'emulate' :
		asw = this.mm.alter(-1, src, trg);
		if (asw.ok !== true) throw new Error('Meshmashine not OK: '+asw.message);
		return asw;
	case 'sync' :
		var ajax = new XMLHttpRequest();
		ajax.open('POST', '/mm', false);
		ajax.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
		var request = JSON.stringify({
			time : this.time,
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
		return asw;
	default :
		throw new Error('unknown mode: '+this._mode);
	}
};

/**
| Sets the listener
*/
Peer.prototype.setReport = function(report) {
	switch (this._mode) {
	case 'async'   :
	case 'emulate' :
		this.mm.setReport(report);
		break;
	case 'sync' :
		throw new Error('No reporting on sync operation');
	default :
		throw new Error('unknown mode: '+this._mode);
	}
};

/**
| Creates a new note.
*/
Peer.prototype.newNote = function(spacePath, zone) {
	var path = new Path(spacePath, '++', '$vacant');

	var asw = this._alter(
		{
			val : {
				type : 'Note',
				fontsize : 13,
				zone : zone,
				doc  : {
					type  : 'Doc',
					copse : { '1' : { type: 'Para', text: '' } },
					alley : [ '1' ]
				}
			}
		},
		{ path: path, rank: 0 }
	);

	return asw.alts.trg.path.get(-1);
};

/**
| Sets the zone for item.
*/
Peer.prototype.setZone = function(itemPath, zone) {
	this._alter(
		{ val  : zone },
		{ path : new Path(itemPath, '++', 'zone') }
	);
};

/**
| Sets an items fontsize
*/
Peer.prototype.setFontSize = function(itemPath, fontsize) {
	this._alter(
		{ val  : fontsize },
		{ path : new Path(itemPath, '++', 'fontsize') }
	);
};

/**
| Sets an items PNW. (point in north-west)
*/
Peer.prototype.setPNW = function(itemPath, pnw) {
	this._alter(
		{ val  : pnw },
		{ path : new Path(itemPath, '++', 'pnw') }
	);
};

/**
| Creates a new label.
*/
Peer.prototype.newLabel = function(spacePath, pnw, text, fontsize) {
	var path = new Path(spacePath, '++', '$vacant');
	var asw = this._alter(
		{
			val : {
				type : 'Label',
				fontsize : fontsize,
				pnw  : pnw,
				doc  : {
					type  : 'Doc',
					copse : { '1' : { type: 'Para', text: 'text' } },
					alley : [ '1' ]
				}
			}
		},
		{ path: path, rank: 0 }
	);
};

/**
| Creates a new relation.
*/
Peer.prototype.newRelation = function(space, pnw, text, fontsize, vitem1, vitem2) {
	throw new Error('TODO');
	/*
	var path = new Path(space, 'items', '$new');

	var asw = this.mm.alter(-1,
		{
			val: {
				'type': 'Relation',
				'item1key': vitem1.key,
				'item2key': vitem2.key,
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
		}, {
			path: path,
		}
	);

	var apath = asw.alts.trg.path;
	if (!(apath instanceof Path)) throw new Error('Cannot re-get new Item');

	this.mm.alter(-1,
		{
			proc: 'arrange',
			val: apath.get(-1),
		},
		{
			at1 : 0,
			path: new Path([space.key, 'z']),
		}
	);

	var k = apath.get(-1);
	return space.items.get(k);
	*/
};

/**
| Moves an item up to the z-index
*/
Peer.prototype.moveToTop = function(path) {
	this._alter(
		{ path: path },
		{ rank: 0    }
	);
};

/**
| Inserts some text.
*/
Peer.prototype.insertText = function(path, offset, text) {
	this._alter(
		{ val  : text },
		{ path : path, at1  : offset }
	);
};

/**
| Removes some text within one node
*/
Peer.prototype.removeText = function(path, offset, len) {
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
Peer.prototype.removeSpan = function(path1, offset1, path2, offset2) {
	if (path1.equals(path2)) {
		return this.removeText(path1, offset1, offset2 - offset1);
	}

	throw new Error('TODO');
	/*
	var k1 = node1.key;
	var k2 = node2.key;
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
Peer.prototype.split = function(path, offset) {
	this._alter(
		{ path: path, at1: offset },
		{ proc: 'splice' }
	);
};

/**
| Joins a text node with its next one
*/
Peer.prototype.join = function(path, at1) {
	this._alter(
		{ proc: 'splice' },
		{ path: path, at1 : at1 }
	);
};

/**
| Removes an item.
*/
Peer.prototype.removeItem = function(path) {
	this._alter(
		{ val  : null  },
		{ path : path, rank : null  }
	);
};

})();
