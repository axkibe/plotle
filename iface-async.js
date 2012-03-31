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

                        ,-_/ .-,--'                ,.   .---.
                        '  |  \|__ ,-. ,-. ,-.    / |   \___  . . ,-. ,-.
                        .^ |   |   ,-| |   |-'   /~~|-.     \ | | | | |
                        `--'  `'   `-^ `-' `-' ,'   `-' `---' `-| ' ' `-'
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~/| ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
                                                              `-'
 Peer interface that talks asynchronously with the server.
 This is the normal way the meshcraft shell operates.

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
var IFaceASync;

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

/**
| Constructor.
*/
IFaceASync = function() {
	this.tree    = null;
	this.changes = [];
	this.report  = null;
	var path     = new Path([ 'welcome' ]);
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

	for(var a = 0, aZ = chgX.length; a < aZ; a++) {
	    this.changes.push(chgX[a]);
	}

	this.sendChanges();

    if (this.report) { this.report.report('update', r.tree, chgX); }
    return chgX;
};

/**
| Sends the stored changes to remote meshmashine
*/
IFaceASync.prototype.sendChanges = function() {
	if (this.sendChangesActive) {
		debug('already one sendChanges active');
		return;
	}
	this.sendChangesActive = true;

	if (this.changes.length === 0) {
		// nothing to send
		debug('nothing to send');
		return;
	}

	var ajax = new XMLHttpRequest();
	ajax.open('POST', '/mm', true);
	ajax.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

	var self = this;

	ajax.onreadystatechange = function() {
		var asw;
		if (ajax.readyState !== 4) { return; }

		if (ajax.status !== 200) {
			self.sendChangesActive = false;
			log('peer', 'sendChanges.status == ' + ajax.status);
			throw new Error('Cannot send changed to server');
			// TODO proper error handling
		}

		try {
			asw = JSON.parse(ajax.responseText);
		} catch (e) {
			self.sendChangesActive = false;
			throw new Error('Server answered no JSON!');
		}

		log('peer', '<-sc', asw);
		if (!asw.ok) {
			self.sendChangesActive = false;
			throw new Error('send changes, server not OK!');
		}

		self.sendChangesActive = false;

		// TODO do a proper list.
		self.remoteTime++; // TODO
		self.changes.splice(0, 1);

		if (self.changes.length > 0) {
			self.sendChanges();
		}
	};

	var c = this.changes[0];

	var request = JSON.stringify({
		cmd  : 'alter',
		time : this.remoteTime,
		src  : c.src,
		trg  : c.trg
	});

	log('peer', 'sc->', request);
	ajax.send(request);
};

})();
