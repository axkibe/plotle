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

                                         ,-_/ .-,--'
                                         '  |  \|__ ,-. ,-. ,-.
                                         .^ |   |   ,-| |   |-'
                                         `--'  `'   `-^ `-' `-'
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

 The interface that talks asynchronously with the server.
 This is the normal way the meshcraft shell operates.

 Authors: Axel Kittenberger
 License: MIT(Expat), see accompanying 'License'-file

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

/**
| Imports
*/
var Change;
var MeshMashine;
var Meshverse;
var Path;
var Sign;
var Tree;
var Jools;
var shell;

/**
| Exports
*/
var IFace;

/**
| Capsule
*/
(function () {
"use strict";
if (typeof (window) === 'undefined') throw new Error('Peer nees a browser!');

var debug     = Jools.debug;
var log       = Jools.log;
var is        = Jools.is;
var uid       = Jools.uid;

/**
| Constructor.
*/
IFace = function() {
	// the current tree;
	this.tree    = null;

	// the remote tree.
	// what the client thinks the server has.
	this.rtree   = null;

	// changes to be send to the server
	this._outbox = [];

	// changes that are currently on the way to the server
	this._postbox = [];

	// if set report updates to this object
	this.update  = null;
};

/**
| Authentication
*/
IFace.prototype.auth = function(user, pass, callback) {
    if (this.authActive) { throw new Error('Already authenticating'); }
	this.authActive = true;
	
    var ajax = new XMLHttpRequest();
    ajax.open('POST', '/mm', true);
    ajax.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	var self = this;

    ajax.onreadystatechange = function() {
		var asw;
		if (ajax.readyState !== 4) { return; }

		if (ajax.status !== 200) {
			self.authActive = false;
			log('iface', 'auth.status == ' + ajax.status);

			callback( { error: 'connection' , status: ajax.status }, null);
			return;
		}

		try {
			asw = JSON.parse(ajax.responseText);
		} catch (e) {
			self.authActive = false;
			callback( { error: 'nojson' }, null);
		}

		log('iface', '<-sg', asw);
		if (!asw.ok) {
			self.authActive = false;
			log('iface', 'euth, server not ok');
			callback( asw, null);
			return;
		}

		self.authActive = false;
		self.authUser = asw.user;
		self.authPass = asw.pass;
		callback(null, asw);
	};

    var request = JSON.stringify({
        cmd  : 'auth',
        user : user,
		pass : pass
    });

    log('iface', 'auth->', request);
    ajax.send(request);
};

/**
| Aquires a space
*/
IFace.prototype.aquireSpace = function(name, callback) {
    if (this.aquireSpaceActive) { throw new Error('Already aquiring a space'); }
	this.aquireSpaceActive = true;
	
	var path = new Path([name]);

    var ajax = new XMLHttpRequest();
    ajax.open('POST', '/mm', true);
    ajax.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	var self = this;

    ajax.onreadystatechange = function() {
		var asw;
		if (ajax.readyState !== 4) { return; }

		if (ajax.status !== 200) {
			self.aquireSpaceActive = false;
			log('iface', 'aquireSpace.status == ' + ajax.status);
			callback( { error: 'connection' , status: ajax.status }, null);
			return;
		}

		try {
			asw = JSON.parse(ajax.responseText);
		} catch (e) {
			self.aquireSpaceActive = false;
			callback( { error: 'nojson' }, null);
			return;
		}

		log('iface', '<-sg', asw);
		if (!asw.ok) {
			self.aquireSpaceActive = false;
			log('iface', 'aquireSpace, server not ok');
			callback( asw, null);
			return;
		}

		self.aquireSpaceActive = false;

		self.remoteTime = asw.time;
		self.tree = self.rtree = new Tree(
			{
				type  : 'Nexus',
				copse : {
					'welcome' : asw.node  // TODO
				}
			},
			Meshverse
		);

		callback(null, { tree: self.tree, name: name });

		// waits a second before going into update cycle, so safari
		// stops its wheely thing.
		// TODO make proper wrapping through browser.js
		window.setTimeout(function() {self._update(); }, 1000);
	};

    var request = JSON.stringify({
        cmd  : 'get',
        time : -1,
		path : path
    });

    log('iface', 'sg->', request);
    ajax.send(request);
};

/**
| Gets a twig.
*/
IFace.prototype.get = function(path, len) {
    return this.tree.getPath(path, len);
};


/**
| Sends an update request to the server and computes its answer.
*/
IFace.prototype._update = function() {
	if (this._updateActive) { throw new Error('double update?'); }

	var ajax = new XMLHttpRequest();
	ajax.open('POST', '/mm', true);
	ajax.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

	var self = this;
	ajax.onreadystatechange = function() {
		var a, aZ, asw, b, bZ, chgX;
		if (ajax.readyState !== 4) { return; }
		if (ajax.status !== 200) {
			log('iface', 'update.status == ' + ajax.status);
			shell.greenscreen('Connection with server failed.', false);
			return;
		}

		try {
			asw = JSON.parse(ajax.responseText);
		} catch (e) {
			throw new Error('Server answered no JSON!');
		}

		log('iface', '<-u', asw);
		if (!asw.ok) { throw new Error('update, server not OK!'); }
		var chgs = asw.chgs;

		var report  = [];
		var gotOwnChgs = false;
		if (chgs) {
			// this wasn't an empty timeout?
			var postbox = self._postbox;
			for(a = 0, aZ = chgs.length; a < aZ; a++) {
				chgX = new Change(chgs[a].chgX);
				var cid = chgs[a].cid;

				// changes the clients understanding of the server tree
				self.rtree = MeshMashine.changeTree(self.rtree, chgX).tree;

				if (postbox.length > 0 && postbox[0].cid === cid) {
					self._postbox.splice(0, 1);
					gotOwnChgs = true;
					continue;
				}
				report.push(chgX);
			}

			// adapts all queued changes
			// and rebuilds the clients understanding of its own tree
			var outbox = self._outbox;
			var tree = self.rtree;

			for(a = 0, aZ = postbox.length; a < aZ; a++) {
				tree = MeshMashine.changeTree(tree, postbox[a].chgX).tree;
			}

			for(a = 0, aZ = outbox.length; a < aZ; a++) {
				chgX = outbox[a].chgX;
				for(b = 0, bZ = report.length; b < bZ; b++) {
					chgX = MeshMashine.tfxChgX(chgX, report[b]);
				}
				outbox[a].chgX = chgX;
				tree = MeshMashine.changeTree(tree, chgX).tree;
			}
			self.tree = tree;
		}
		self.remoteTime = asw.timeZ;

		if (report.length > 0 && self.update) {
			self.update.update(self.tree, report);
		}

		if (gotOwnChgs) { self.sendChanges(); }

		// issue the following update
		self._update();
	};

	var request = JSON.stringify({
		cmd  : 'update',
		time : this.remoteTime
	});

	log('iface', 'u->', request);
	ajax.send(request);
};

/**
| Alters the tree
*/
IFace.prototype.alter = function(src, trg) {
    var chg = new Change(new Sign(src), new Sign(trg));
    var r = MeshMashine.changeTree(this.tree, chg);
    this.tree = r.tree;
	var chgX  = r.chgX;

	this._outbox.push({ cid: uid(), chgX: chgX });
	this.sendChanges();

    if (this.update) { this.update.update(r.tree, chgX); }
    return chgX;
};

/**
| Sends the stored changes to remote meshmashine
*/
IFace.prototype.sendChanges = function() {
	if (this._postbox.length > 0) {
		return;
	}

	if (this._outbox.length === 0) {
		// nothing to send
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
			log('iface', 'sendChanges.status == ' + ajax.status);
			throw new Error('Cannot send changes to server');
			// TODO proper error handling
		}

		try {
			asw = JSON.parse(ajax.responseText);
		} catch (e) {
			throw new Error('Server answered no JSON!');
		}

		log('iface', '<-sc', asw);
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

	log('iface', 'sc->', request);
	ajax.send(request);
};

})();
