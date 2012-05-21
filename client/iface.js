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
var system;

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
var immute    = Jools.immute;
var is        = Jools.is;
var log       = Jools.log;
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

	// the remote time sequence
	this.$remoteTime = null;

	// the current message sequence number
	this.$mseq = null;

	// changes to be send to the server
	this.$outbox = null;

	// changes that are currently on the way to the server
	this.$postbox = null;

	// if set reports updates to this object.
	// @@ rename updateRCV
	this.update  = null;

	// if set reports messages to this object.
	this.messageRCV = null;

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
			if (callback) {
				callback( { ok: false, message: 'connection' , status: ajax.status } );
			}
			return;
		}

		var asw;
		try {
			asw = JSON.parse(ajax.responseText);
		} catch (e) {
			if (callback) { callback( { ok: false, message: 'nojson' } ); }
		}

		log('iface', '<-', asw);
		if (!asw.ok) {
			log('iface', request.cmd, 'server not ok');
			if (callback) { callback( asw, null); }
			return;
		}

		if (callback) { callback(asw); }
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
| Registers a user.
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
| Sends a message.
*/
IFace.prototype.sendMessage = function(message) {
	var self = this;
	self._ajax({
        cmd     : 'message',
		user    : self.$user,
		pass    : self.$pass,
		space   : self.$spaceName,
		message : message
	}, null);
};

/**
| Aquires a space.
*/
IFace.prototype.aquireSpace = function(spaceName, callback) {
	var self = this;
	// aborts the current running update.
	if (self.$updateAjax) {
		self.$updateAjax.$abort = true;
		self.$updateAjax.abort();
		self.$updateAjax = null;
	}

	self.$spaceName = spaceName;
	self.tree       = null; // @@ $tree
	self.rtree      = null; // @@ $rtree
	self.$outbox    = [];
	self.$postbox   = [];
	self.$mseq      = -1;

	var path = new Path([spaceName]);

    var ajax = self.$aquireAjax = new XMLHttpRequest();
    ajax.open('POST', '/mm', true);
    ajax.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

    ajax.onreadystatechange = function() {
		var asw;
		if (ajax.readyState !== 4) { return; }

		if (ajax.status !== 200) {
			self.$aquireAjax = null;
			log('iface', 'aquireSpace.status == ' + ajax.status);
			callback( { error: 'connection' , status: ajax.status }, null);
			return;
		}

		try {
			asw = JSON.parse(ajax.responseText);
		} catch (e) {
			self.$aquireAjax = null;
			callback( { error: 'nojson' }, null);
			return;
		}

		log('iface', '<-sg', asw);
		if (!asw.ok) {
			self.$aquireAjax = null;
			log('iface', 'aquireSpace, server not ok');
			callback( asw, null);
			return;
		}

		self.aquireSpaceActive = false;

		self.$remoteTime = asw.time;

		var troot = { type : 'Nexus', copse : {} };
		troot.copse[spaceName] = asw.node;
		self.tree = self.rtree = new Tree(troot, Meshverse);

		callback(null, immute({
			tree   : self.tree,
			name   : spaceName,
			access : asw.access
		}));

		// waits a second before going into update cycle, so safari
		// stops its wheely thing.
		system.setTimer(1, function() {
			if (self.$aquireAjax === ajax) {
				self._update();
			}
			self.$aquireAjax = null;
		});
	};

    var request = JSON.stringify({
        cmd  : 'get',
		path : path,
		pass : self.$pass,
        time : -1,
		user : self.$user
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
		if (ajax.readyState !== 4) { return; }
		var a, aZ, asw, b, bZ, chgX;
		// call was willingfull aborted
		if (ajax.$abort) { return; }

		self.$updateAjax = null;

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
		if (chgs && chgs.length > 0) {
			// this wasn't an empty timeout?
			var postbox = self.$postbox;
			for(a = 0, aZ = chgs.length; a < aZ; a++) {
				chgX = new Change(chgs[a].chgX);
				var cid = chgs[a].cid;

				// changes the clients understanding of the server tree
				self.rtree = MeshMashine.changeTree(self.rtree, chgX).tree;

				if (postbox.length > 0 && postbox[0].cid === cid) {
					self.$postbox.splice(0, 1);
					gotOwnChgs = true;
					continue;
				}
				report.push(chgX);
			}

			// adapts all queued changes
			// and rebuilds the clients understanding of its own tree
			var outbox = self.$outbox;
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

		var msgs = asw.msgs;
		if (msgs && self.messageRCV) {
			for(a = 0, aZ = msgs.length; a < aZ; a++) {
				var m = msgs[a];
				self.messageRCV.messageRCV(m.space, m.user, m.message);
			}
		}

		self.$remoteTime = asw.timeZ;
		var mseqZ        = asw.mseqZ;
		if (is(mseqZ)) { self.$mseq = mseqZ; }

		if (report.length > 0 && self.update) {
			self.update.update(self.tree, report);
		}

		if (gotOwnChgs) { self.sendChanges(); }

		// issue the following update
		self._update();
	};

	var request = JSON.stringify({
		cmd   : 'update',
		pass  : self.$pass,
		space : self.$spaceName,
		time  : self.$remoteTime,
		mseq  : self.$mseq,
		user  : self.$user
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

	this.$outbox.push({ cid: uid(), chgX: chgX });
	this.sendChanges();

    if (this.update) { this.update.update(r.tree, chgX); }
    return chgX;
};

/**
| Sends the stored changes to remote meshmashine
*/
IFace.prototype.sendChanges = function() {
	if (this.$postbox.length > 0) {
		return;
	}

	if (this.$outbox.length === 0) {
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
			shell.greenscreen('Cannot send changes, error code ' + ajax.status);
			return;
		}

		try {
			asw = JSON.parse(ajax.responseText);
		} catch (e) {
			shell.greenscreen('Server answered no JSON!');
			return;
		}

		log('iface', '<-sc', asw);
		if (!asw.ok) {
			shell.greenscreen('Server not OK: ' + asw.message);
			return;
		}
	};

	var c = this.$outbox[0];
	this.$outbox.splice(0, 1);
	this.$postbox.push(c);

	var request = JSON.stringify({
		cmd  : 'alter',
		chgX : c.chgX,
		cid  : c.cid,
		pass : this.$pass,
		time : this.$remoteTime,
		user : this.$user
	});

	log('iface', 'sc->', request);
	ajax.send(request);
};

})();
