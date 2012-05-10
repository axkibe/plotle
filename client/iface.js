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
	this._outbox = null;

	// changes that are currently on the way to the server
	this._postbox = null;

	// if set report updates to this object
	this.update  = null;

	// current update request
	this.$updateAjax = null;
};


/**
| General ajax.
*/
IFace.prototype._ajax = function(request, callback) {
	if (!request.cmd) { throw new Error('ajax request.cmd missing'); }

    var ajax = new XMLHttpRequest();
    ajax.open('POST', '/mm', true);
    ajax.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	var self = this;

    ajax.onreadystatechange = function() {
		if (ajax.readyState !== 4) { return; }

		if (ajax.status !== 200) {
			log('iface', request.cmd, 'status: ', ajax.status);
			callback( { ok: false, message: 'connection' , status: ajax.status } );
			return;
		}

		var asw;
		try {
			asw = JSON.parse(ajax.responseText);
		} catch (e) {
			callback( { ok: false, message: 'nojson' } );
		}

		log('iface', '<-', asw);
		if (!asw.ok) {
			log('iface', request.cmd, 'server not ok');
			callback( asw, null);
			return;
		}

		callback(asw);
	};

    var rs = JSON.stringify(request);
    log('iface', '->', rs);
    ajax.send(rs);
};

/**
| Sets the current user
*/
IFace.prototype.setUser = function(user, pass) {
	this.$user = user;
	this.$pass = pass;
};

/**
| Authentication
*/
IFace.prototype.auth = function(user, pass, callback) {
	var self = this;
    if (self.$authActive) { throw new Error('Auth already active'); }
	self.$authActive = true;
	self._ajax({
        cmd  : 'auth',
        user : user,
		pass : pass
	}, function(asw) {
		self.$authActive = false;
		if (asw.ok) {
			callback({ ok: true, user: asw.user, pass: pass });
		} else {
			callback(asw);
		}
	});
};

/**
| Register a user
*/
IFace.prototype.register = function(user, mail, pass, code, callback) {
	var self = this;
    if (self.$regActive) { throw new Error('Auth already active'); }
	self.$regActive = true;
	self._ajax({
        cmd   : 'register',
        user  : user,
		mail  : mail,
		pass  : pass,
		code  : code
	}, function(asw) {
		self.$regActive = false;
		callback(asw);
	});
};

/**
| Aquires a space
*/
IFace.prototype.aquireSpace = function(name, callback) {
    if (this.aquireSpaceActive) { throw new Error('Already aquiring a space'); }
	this.aquireSpaceActive = true;

	// aborts the current running update.
	if (this.$updateAjax) {
		this.$updateAjax.$abort = true;
		this.$updateAjax.abort();
		this.$updateAjax = null;
	}
	
	this.tree    = null;
	this.rtree   = null;
	this._outbox = [];
	this._postbox = [];


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

		var troot = { type : 'Nexus', copse : {} };
		troot.copse[name] = asw.node;
		self.tree = self.rtree = new Tree(troot, Meshverse);

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
	var self = this;
	if (self.$updateAjax) { throw new Error('double update?'); }

	var ajax = self.$updateAjax = new XMLHttpRequest();
	ajax.open('POST', '/mm', true);
	ajax.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

	ajax.onreadystatechange = function() {
		var a, aZ, asw, b, bZ, chgX;
		if (ajax.readyState !== 4) { return; }
		self.$updateAjax = null;

		if (ajax.status !== 200) {
			// if not a willing complain to greenscreen
			if (!ajax.$abort) {
				log('iface', 'update.status == ' + ajax.status);
				shell.greenscreen('Connection with server failed.', false);
			}
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
		time : self.remoteTime
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
