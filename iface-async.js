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
var uid       = Jools.uid;

/**
| Constructor.
*/
IFaceASync = function() {
	// the current tree;
	this.tree    = null;

	// the remote tree.
	// what the client thinks the server has.
	this.rtree   = null;

	// changes to be send to the server
	this._outbox = [];

	// changes that are currently on the way to the server
	this._postbox = [];

	// if set report changes to this object
	this.report  = null;

	// startup
	this.startGet(new Path([ 'welcome' ]));
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
		self.tree = self.rtree = new Tree({
			type  : 'Nexus',
			copse : {
				'welcome' : asw.node
			}
		}, Patterns.mUniverse);

		if (self.report) { self.report.report('start', self.tree, null); }
		self._update();
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

IFaceASync.prototype._update = function() {
	if (this._updateActive) { throw new Error('double update?'); }

	var ajax = new XMLHttpRequest();
	ajax.open('POST', '/mm', true);
	ajax.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

	var self = this;
	ajax.onreadystatechange = function() {
		var asw;
		if (ajax.readyState !== 4) { return; }
		if (ajax.status !== 200) {
			log('peer', 'update.status == ' + ajax.status);
			throw new Error('Update Error');
			// TODO proper error handling
		}

		try {
			asw = JSON.parse(ajax.responseText);
		} catch (e) {
			throw new Error('Server answered no JSON!');
		}

		log('peer', '<-u', asw);
		if (!asw.ok) { throw new Error('update, server not OK!'); }
		var chgs = asw.chgs;

		var report  = [];
		var gotOwnChgs = false;
		if (chgs) {
			// this wasn't an empty timeout?
			var postbox = self._postbox;
			for(var a = 0, aZ = chgs.length; a < aZ; a++) {
				var chgX = new Change(chgs[a].chgX);
				var cid = chgs[a].cid;

				// changes the clients understanding of the server tree
				var r = MeshMashine.changeTree(self.rtree, chgX);
				self.rtree = r.tree;

				if (postbox.length > 0 && postbox[0].cid === cid) {
					self._postbox.splice(0, 1);
					gotOwnChgs = true;
					continue;
				}

				// adapts all queued changes
				report.push(chgX);
				self._outbox = MeshMashine.tfxChgX(self._outbox, chgX);
				r = MeshMashine.changeTree(self.rtree, self._outbox);
				self.tree = r.tree;
			}
		}
		self.remoteTime = asw.timeZ;

		if (report.length > 0 && self.report) {
			self.report.report('update', self.tree, report);
		}

		if (gotOwnChgs) { self.sendChanges(); }

		// issue the following update
		self._update();
	};

	var request = JSON.stringify({
		cmd  : 'update',
		time : this.remoteTime
	});

	log('peer', 'u->', request);
	ajax.send(request);
};

/**
| Alters the tree
*/
IFaceASync.prototype.alter = function(src, trg) {
    var chg = new Change(new Signature(src), new Signature(trg));
    var r = MeshMashine.changeTree(this.tree, chg);
    this.tree = r.tree;
	var chgX  = r.chgX;

	this._outbox.push({ cid: uid(), chgX: chgX });
	this.sendChanges();

    if (this.report) { this.report.report('update', r.tree, chgX); }
    return chgX;
};

/**
| Sends the stored changes to remote meshmashine
*/
IFaceASync.prototype.sendChanges = function() {
	if (this._postbox.length > 0) {
		debug('postbox active');
		return;
	}

	if (this._outbox.length === 0) {
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
			log('peer', 'sendChanges.status == ' + ajax.status);
			throw new Error('Cannot send changes to server');
			// TODO proper error handling
		}

		try {
			asw = JSON.parse(ajax.responseText);
		} catch (e) {
			throw new Error('Server answered no JSON!');
		}

		log('peer', '<-sc', asw);
		if (!asw.ok) { throw new Error('send changes, server not OK!'); }
	};

	var c = this._outbox[0];
	this._outbox.splice(0, 1);
	this._postbox.push(c);

	var request = JSON.stringify({
		cmd  : 'alter',
		cid  : c.cid,
		time : this.remoteTime,
		chgX : c.chgX
	});

	log('peer', 'sc->', request);
	ajax.send(request);
};

})();
