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


                                         .-,--.
                                          '|__/ ,-. ,-. ,-.
                                          ,|    |-' |-' |
                                          `'    `-' `-' '

~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

 A networked node item editor.

 A peer to a meshcraft repository. Utilizes its own meshmashine.

 TODO remove all mm

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
	this._mode = mode; // TODO

	switch(mode) {
	case 'async'   : this._player = new PLayerAsync();   break;
	case 'sync'    : this._player = new PLayerSync();    break;
	case 'emulate' : this._player = new PLayerEmulate(); break;
	default : throw new Error('unknown mode: '+mode);
	}
};

/**
| Sets the time
| @@ remove
*/
Peer.prototype.toTime = function(time) {
	return this._player.toTime(time);
}

/**
| Gets a twig
|
| path: path to twig
*/
Peer.prototype.get = function(path) {
	return this._player.get(path);
};

/**
| Issues an alter request
*/
Peer.prototype._alter = function(src, trg) {
	return this._player.alter(src, trg);

	switch (this._mode) {
	case 'async'   :
	case 'emulate' :
	case 'sync' :
		var ajax = new XMLHttpRequest();
		ajax.open('POST', '/mm', false);
		ajax.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
		var request = JSON.stringify({
			time : this._remoteTime,
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
| Sends the stored changes to remote meshmashine
*/
Peer.prototype._sendChanges = function() {
	if (this._mode !== 'async') { throw new Error('_sendChanges requires mode === async'); }
	if (this._sendChangesAJAX) {
		// already one ajax active
		debug('already one ajax active');
		return;
	}

	if (this._changes.length === 0) {
		// nothing to send
		debug('nothing to send');
		return;
	}

	var ajax = this._sendChangesAJAX = new XMLHttpRequest();
	ajax.open('POST', '/mm', true);
	ajax.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	ajax.onreadystatechange = this._sendChangesRSC;

	var chg = this._changes[0];

	var request = JSON.stringify({
		cmd  : 'alter',
		time : chg.remoteTime,
		src  : chg.src,
		trg  : chg.trg
	});

	log('peer', 'sc->', request);
	ajax.send(request);
};

/**
| ready state changed for the sendChanges request
| TODO encapsulate error catcher
*/
Peer.prototype._sendChangesRSC = function(ev) {
	var ajax = this._sendChangesAJAX;
	var asw;
	if (!ajax) { throw new Error('_sendChangesRSC: ajax missing'); }
	if (ajax.readyState !== 4) { return; }
	if (ajax.status !== 200) {
		this._sendChangesAJAX = null;
		throw new Error('Cannot send changed to server');
		// TODO proper error handling
	}
	try {
		asw = JSON.parse(ajax.responseText);
	} catch (e) {
		this._sendChangesAJAX = null;
		throw new Error('Server answered no JSON!');
	}
	log('peer', '<-sc', asw);
	if (!asw.ok) {
		this._sendChangesAJAX = null;
		throw new Error('send changes, server not OK!');
	}

	// TODO list..
	this._changes.unshift();

	this._sendChangesAJAX = null;
	if (this._changes.length > 0) {
		this._sendChanges();
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
	var asw = this._alter(
		{
			val : {
				type : 'Note',
				fontsize : 13,
				zone : zone,
				doc  : {
					type  : 'Doc',
					copse : { '1' : { type: 'Para', text: '' } },
					ranks : [ '1' ]
				}
			}
		},
		{ path: new Path(spacePath, '++', '$new'), rank: 0 }
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
	var asw = this._alter(
		{
			val           : {
				type      : 'Label',
				fontsize  : fontsize,
				pnw       : pnw,
				doc       : {
					type  : 'Doc',
					copse : { '1' : { type: 'Para', text: text } },
					ranks : [ '1' ]
				}
			}
		},
		{ path: new Path(spacePath, '++', '$new'), rank: 0 }
	);

	return asw.alts.trg.path.get(-1);
};

/**
| Creates a new relation.
*/
Peer.prototype.newRelation = function(spacePath, pnw, text, fontsize, item1key, item2key) {
	var asw = this._alter(
		{
			val           : {
				type      : 'Relation',
				item1key  : item1key,
				item2key  : item2key,
				pnw       : pnw,
				fontsize  : fontsize,
				doc       : {
					type  : 'Doc',
					copse : { '1' : { type: 'Para', text: text } },
					ranks : [ '1' ]
				}
			}
		},
		{ path: new Path(spacePath, '++', '$new'), rank: 0 }
	);

	return asw.alts.trg.path.get(-1);
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
Peer.prototype.removeText = function(path, at1, len) {
	if (len === 0) return;
	if (len < 0) throw new Error('malformed removeText');

	this._alter(
		{ path: path, at1: at1, at2: at1 + len },
		{ val: null }
	);
};

/**
| Removes a text spawning over severa entities
*/
Peer.prototype.removeSpan = function(path1, at1, path2, at2) {
	if (this._mode === 'sync')    { throw new Error('cannot removeSpan in sync mode'); }
	if (path1.get(-1) !== 'text') { throw new Error('removeSpan invalid path'); }
	if (path2.get(-1) !== 'text') { throw new Error('removeSpan invalid path'); }

	if (path1.equals(path2)) {
		return this.removeText(path1, at1, at2 - at1);
	}

	var k1 = path1.get(-2);
	var k2 = path2.get(-2);

	var pivot = this.mm.tree.getPath(path1, -2);
	var r1 = pivot.rankOf(k1);
	var r2 = pivot.rankOf(k2);

	for (var r = r1; r < r2 - 1; r++) {
		this.join(path1, this.mm.tree.getPath(path1).length);
	}
	var len2 = this.mm.tree.getPath(path1).length;
	this.join(path1, len2);

	this.removeText(path1, at1, len2 - at1 + at2);
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



/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 .-,--. ,                      ,.   .---.
  '|__/ )   ,-. . . ,-. ,-.   / |   \___  . . ,-. ,-.
  ,|   /    ,-| | | |-' |    /~~|-.     \ | | | | |
  `'   `--' `-^ `-| `-' '  ,'   `-' `---' `-| ' ' `-'
                 /|                        /|
                `-'                       `-'
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

 Peer layer that talks asynchronously with the server.
 This is the normal way the meshcraft shell operates.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
var PLayerASync = function() {
	this.tree = new Tree({ type : 'Nexus' }, Patterns.mUniverse);
	this._changes = [];
	var path = new Path([ 'welcome' ]);
	var gets = this._getSync(-1, path);
	this._remoteTime = gets.time;
	src = { val  : gets.node };
	trg = { path : path      };
	asw = this.mm.alter(0, src, trg);
	if (asw.ok !== true) throw new Error('Cannot load space "welcome"');
	break;
}

/**
| Gets a twig
*/
PLayerEmulate.prototype.get = function() {
	// TODO
}


PLayerEmulate.prototype.alter = function(src, trg) {
	asw = this.mm.alter(src, trg);
	if (asw.ok !== true) throw new Error('Meshmashine not OK: '+asw.message);
	this._changes.push({ src: asw.src, trg: asw.trg, remoteTime: this._remoteTime });
	this._sendChanges();
	return asw;
}


/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 .-,--. ,                  .-,--.           .      .
  '|__/ )   ,-. . . ,-. ,-. `\__  ,-,-. . . |  ,-. |- ,-.
  ,|   /    ,-| | | |-' |    /    | | | | | |  ,-| |  |-'
  `'   `--' `-^ `-| `-' '   '`--' ' ' ' `-^ `' `-^ `' `-'
                 /|
                `-'
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

 Peer layer that emulates a server
 Used for development.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
var PLayerEmulate = function() {
	this.tree = new Tree({ type : 'Nexus' }, Patterns.mUniverse);
	this.history = [];

	src = Emulate.src;
	trg = { path: new Path(Emulate.path) };
	this._alter(src, trg);
	if (asw.ok !== true) throw new Error('Cannot emulate Repository');
}

/**
| Gets a twig
*/
PLayerEmulate.prototype.get = function(path) {
	// TODO
	res = this.mm.get(-1, path);
	if (res.ok !== true) throw new Error('Meshmashine not ok: '+res.message);
	return res.node;
}


PLayerEmulate.prototype.alter = function(src, trg) {
	var r = MeshMashine.changeTree(this.tree, new Change(src, trg));
	asw = this.mm.alter(-1, src, trg);
	if (asw.ok !== true) throw new Error('Meshmashine not OK: '+asw.message);
	return asw;
}

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 .-,--. ,                   .---.
  '|__/ )   ,-. . . ,-. ,-. \___  . . ,-. ,-.
  ,|   /    ,-| | | |-' |       \ | | | | |
  `'   `--' `-^ `-| `-' '   `---' `-| ' ' `-'
                 /|                /|
                `-'               `-'
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

 Peer layer that talks in a synchronous way with the server.
 Used for debugging (testpad).

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
var PLayerSync = function() {
	this._remoteTime = false;
}

/**
| Gets a twig.
*/
PLayerSync.prototype.get = function() {
	res = this._getSync(this._remoteTime, path);
	return {
		node : is(res.node) ? new Tree(res.node, Patterns.mUniverse).root : null,
		time : res.time
	};
};


PLayerSync.prototype.alter = function() {
	// TODO
};

PLayerSync.prototype.toTime = function(time) {
	this._remoteTime = time;
};

/**
| Issues a synchronous get request.
*/
PLayerSync.prototype._getSync = function(time, path) {
	var ajax = new XMLHttpRequest();
	ajax.open('POST', '/mm', false);
	ajax.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
	var request = JSON.stringify({
		time : time,
		cmd  : 'get',
		path : path
	});
	log('peer', 'gs->', request);
	ajax.send(request);
	var asw = ajax.responseText;
	log('peer', '<-gs', asw);
	try {
		asw = JSON.parse(asw);
	} catch (e) {
		throw new Error('Server answered no JSON!');
	}
	if (asw.ok !== true) throw new Error('AJAX not ok: '+asw.message);
	return asw;
};



})();
