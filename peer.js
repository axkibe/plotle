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
var Emulate;
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

var Change    = MeshMashine.Change;
var Signature = MeshMashine.Signature;
var debug     = Jools.debug;
var log       = Jools.log;
var is        = Jools.is;

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
	switch(mode) {
	case 'async'   : this._iface = new IFaceASync();   break;
	case 'sync'    : this._iface = new IFaceSync();    break;
	case 'emulate' : this._iface = new IFaceEmulate(); break;
	default : throw new Error('unknown mode: '+mode);
	}
};

/**
| Sets the time
| @@ remove
*/
Peer.prototype.toTime = function(time) {
	return this._iface.toTime(time);
};

/**
| Gets a twig
|
| path: path to twig
*/
Peer.prototype.get = function(path, len) {
	return this._iface.get(path, len);
};

/**
| Sets the listener
*/
Peer.prototype.setReport = function(report) {
	this._iface.report = report;
};

/**
| Creates a new note.
*/
Peer.prototype.newNote = function(spacePath, zone) {
	var chgX = this._iface.alter(
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
	return chgX.trg.path.get(-1);
};

/**
| Sets the zone for item.
*/
Peer.prototype.setZone = function(itemPath, zone) {
	this._iface.alter(
		{ val  : zone },
		{ path : new Path(itemPath, '++', 'zone') }
	);
};

/**
| Sets an items fontsize
*/
Peer.prototype.setFontSize = function(itemPath, fontsize) {
	this._iface.alter(
		{ val  : fontsize },
		{ path : new Path(itemPath, '++', 'fontsize') }
	);
};

/**
| Sets an items PNW. (point in north-west)
*/
Peer.prototype.setPNW = function(itemPath, pnw) {
	this._iface.alter(
		{ val  : pnw },
		{ path : new Path(itemPath, '++', 'pnw') }
	);
};

/**
| Creates a new label.
*/
Peer.prototype.newLabel = function(spacePath, pnw, text, fontsize) {
	var chgX = this._iface.alter(
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

	return chgX.trg.path.get(-1);
};

/**
| Creates a new relation.
*/
Peer.prototype.newRelation = function(spacePath, pnw, text, fontsize, item1key, item2key) {
	var chgX = this._iface.alter(
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

	return chgX.trg.path.get(-1);
};

/**
| Moves an item up to the z-index
*/
Peer.prototype.moveToTop = function(path) {
	this._iface.alter(
		{ path: path },
		{ rank: 0    }
	);
};

/**
| Inserts some text.
*/
Peer.prototype.insertText = function(path, offset, text) {
	this._iface.alter(
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

	this._iface.alter(
		{ path: path, at1: at1, at2: at1 + len },
		{ val: null }
	);
};

/**
| Removes a text spawning over severa entities
*/
Peer.prototype.removeSpan = function(path1, at1, path2, at2) {
	if (path1.get(-1) !== 'text') { throw new Error('removeSpan invalid path'); }
	if (path2.get(-1) !== 'text') { throw new Error('removeSpan invalid path'); }

	if (path1.equals(path2)) {
		return this.removeText(path1, at1, at2 - at1);
	}

	var k1 = path1.get(-2);
	var k2 = path2.get(-2);

	var pivot = this._iface.get(path1, -2);
	var r1 = pivot.rankOf(k1);
	var r2 = pivot.rankOf(k2);

	for (var r = r1; r < r2 - 1; r++) {
		this.join(path1, this._iface.get(path1).length);
	}
	var len2 = this._iface.get(path1).length;
	this.join(path1, len2);

	this.removeText(path1, at1, len2 - at1 + at2);
};

/**
| Splits a text node.
*/
Peer.prototype.split = function(path, offset) {
	this._iface.alter(
		{ path: path, at1: offset },
		{ proc: 'splice' }
	);
};

/**
| Joins a text node with its next one
*/
Peer.prototype.join = function(path, at1) {
	this._iface.alter(
		{ proc: 'splice' },
		{ path: path, at1 : at1 }
	);
};

/**
| Removes an item.
*/
Peer.prototype.removeItem = function(path) {
	this._iface.alter(
		{ val  : null  },
		{ path : path, rank : null  }
	);
};



/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ,-_/ .-,--'                ,.   .---.
 '  |  \|__ ,-. ,-. ,-.    / |   \___  . . ,-. ,-.
 .^ |   |   ,-| |   |-'   /~~|-.     \ | | | | |
 `--'  `'   `-^ `-' `-' ,'   `-' `---' `-| ' ' `-'
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ /|~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
                                       `-'
 Peer interface that talks asynchronously with the server.
 This is the normal way the meshcraft shell operates.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
var IFaceASync = function() {
	//this.tree = new Tree({ type : 'Nexus' }, Patterns.mUniverse);
	this.tree    = null;
	this.history = [];
	this.report  = null;

	var path = new Path([ 'welcome' ]);
	this.startGet(path);
};

/**
| TODO generalize
*/
IFaceASync.prototype.startGet = function(path) {
    if (this.startGetActive) { throw new Error('There is already a startup get'); }
	this.startGetActive = true;

    var ajax = new XMLHttpRequest();
    ajax.open('POST', '/mm', true);
    ajax.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	var self = this;

    ajax.onreadystatechange = function() {
		var asw;
		debug('STARTGETRSC', ajax.status);
		if (ajax.readyState !== 4) { return; }

		if (ajax.status !== 200) {
			self.startGetActive = false;
			log('peer', 'startGet.status == ' + ajax.status);
			if (self.report) { self.report.report('fail', null, null); }
			return;
		}

		try {
			asw = JSON.parse(ajax.responseText);
		} catch (e) {
			self.startGetActive = false;
			throw new Error('Server answered no JSON!');
		}

		log('peer', '<-sg', asw);
		if (!asw.ok) {
			self.startGetActive = false;
			log('peer', 'startGet, server not ok');
			if (self.report) { self.report.report('fail', null, null); }
			return;
		}

		debug('STARTGETOK');
		self.startGetActive = false;

		self.remoteTime = asw.time;
		self.tree = new Tree({
			type  : 'Nexus',
			copse : {
				'welcome' : asw.node
			}
		}, Patterns.mUniverse);

		if (self.report) { self.report.report('start', self.tree, null); }
	};

    var request = JSON.stringify({
        cmd  : 'get',
        time : -1,
		path : path
    });

    log('peer', 'sg->', request);
    ajax.send(request);
};

/**
| Gets a twig
*/
IFaceASync.prototype.get = function(path, len) {
    return this.tree.getPath(path, len);
};

/**
| Alters the tree
*/
IFaceASync.prototype.alter = function(src, trg) {
    var chg = new Change(new Signature(src), new Signature(trg));
    var r = MeshMashine.changeTree(this.tree, chg);
    this.tree = r.tree;
    var chgX = r.chgX;

    for (var a = 0, aZ = chgX.length; a < aZ; a++) {
        this.history.push(chgX[a]);
    }

    if (this.report) { this.report.report('update', r.tree, chgX); }
    return chgX;

	/*
	asw = this.mm.alter(src, trg);
	if (asw.ok !== true) throw new Error('Meshmashine not OK: '+asw.message);
	this._changes.push({ src: asw.src, trg: asw.trg, remoteTime: this.remoteTime });
	this.sendChanges();
	return asw;
	*/
};

/**
| Sends the stored changes to remote meshmashine
*/
IFaceASync.prototype.sendChanges = function() {
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
IFaceASync.prototype._sendChangesRSC = function(ev) {
	var ajax = this._sendChangesAJAX, asw;

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
		this.sendChanges();
	}
};

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ,-_/ .-,--'           .-,--.           .      .
 '  |  \|__ ,-. ,-. ,-. `\__  ,-,-. . . |  ,-. |- ,-.
 .^ |   |   ,-| |   |-'  /    | | | | | |  ,-| |  |-'
 `--'  `'   `-^ `-' `-' '`--' ' ' ' `-^ `' `-^ `' `-'
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

Peer inteface that emulates a server.
 Used for development.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
var IFaceEmulate = function() {
	this.tree = new Tree({ type : 'Nexus' }, Patterns.mUniverse);
	this.history = [];
	this.report = null;
	this.alter(Emulate.src, { path: new Path(Emulate.path) });
};

/**
| Gets a twig
*/
IFaceEmulate.prototype.get = function(path, len) {
	return this.tree.getPath(path, len);
};


IFaceEmulate.prototype.alter = function(src, trg) {
	var chg = new Change(new Signature(src), new Signature(trg));
	var r = MeshMashine.changeTree(this.tree, chg);
	this.tree = r.tree;
	var chgX = r.chgX;

	for (var a = 0, aZ = chgX.length; a < aZ; a++) {
		this.history.push(chgX[a]);
	}

	if (this.report) { this.report.report('ok', r.tree, chgX); }
	return chgX;
};

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ,-_/ .-,--'            .---.
 '  |  \|__ ,-. ,-. ,-. \___  . . ,-. ,-.
 .^ |   |   ,-| |   |-'     \ | | | | |
 `--'  `'   `-^ `-' `-' `---' `-| ' ' `-'
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~/| ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
                              `-'
 Peer interface that talks in a synchronous way with the server.
 Used for debugging (testpad).

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
var IFaceSync = function() {
	this.remoteTime = false;
};

/**
| Gets a twig.
*/
IFaceSync.prototype.get = function(path, len) {
	// shortens the path
	if (is(len)) { path = new Path(path, '--', path.length - len); }

	var r = this._getSync(this.remoteTime, path);
	return {
		node : is(r.node) ? new Tree(r.node, Patterns.mUniverse).root : null,
		time : r.time
	};
};

/**
| Alters the tree.
*/
IFaceSync.prototype.alter = function(src, trg) {
	var ajax = new XMLHttpRequest();
	ajax.open('POST', '/mm', false);
	ajax.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
	var request = JSON.stringify({
		time : this.remoteTime,
		cmd  : 'alter',
		src  : src,
		trg  : trg
	});
	log('peer', '->', request);
	ajax.send(request);

	var asw = ajax.responseText;
	log('peer', '<-', asw);
	try {
		asw = JSON.parse(asw);
	} catch (e) {
		throw new Error('Server answered no JSON!');
	}
	if (asw.ok !== true) throw new Error('AJAX not ok: '+asw.message);
	return asw;
};

/**
| Goes forth/back in time
*/
IFaceSync.prototype.toTime = function(time) {
	this.remoteTime = time;
};

/**
| Issues a synchronous get request.
*/
IFaceSync.prototype._getSync = function(time, path) {
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
