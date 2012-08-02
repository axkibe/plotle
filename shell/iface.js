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
| Export
*/
var IFace;

/**
| Imports
*/
var Change;
var ChangeX;
var MeshMashine;
var Meshverse;
var Path;
var Sign;
var Tree;
var Jools;
var config;
var shell;
var system;

/**
| Capsule
*/
(function () {
"use strict";
if (typeof (window) === 'undefined') throw new Error('this code nees a browser!');

/**
| Constructor.
*/
IFace = function(updateRCV, messageRCV) {
	// the current space;
	this.$cSpace  = null;

	// the remote tree.
	// what the client thinks the server thinks.
	this.$rSpace  = null;

	// the remote time sequence
	this.$remoteTime = null;

	// the current message sequence number
	this.$mseq = null;

	// changes to be send to the server
	this.$outbox = null;

	// changes that are currently on the way to the server
	this.$postbox = null;

	// reports updates to this object.
	this._updateRCV  = updateRCV;

	// reports messages to this object.
	this._messageRCV = messageRCV;

	// current update request
	this.$updateAjax = null;
};


/**
| General purpose AJAX.
*/
IFace.prototype._ajax = function(request, callback) {
	if (!request.cmd)
		{ throw new Error('ajax request.cmd missing'); }

    var ajax = new XMLHttpRequest();

    ajax.open('POST', '/mm', true);

    ajax.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

    ajax.onreadystatechange = function() {
		if (ajax.readyState !== 4) { return; }

		if (ajax.status !== 200) {
			Jools.log('iface', request.cmd, 'status: ', ajax.status);
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

		Jools.log('iface', '<-', asw);
		if (!asw.ok) {
			Jools.log('iface', request.cmd, 'server not ok');
			if (callback) { callback( asw, null); }
			return;
		}

		if (callback) { callback(asw); }
	};

    var rs = JSON.stringify(request);

    Jools.log('iface', '->', rs);

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
		space   : self.$spacename,
		message : message
	}, null);
};

/**
| Aquires a space.
*/
IFace.prototype.aquireSpace = function(spacename, callback) {

	var self = this;

	// aborts the current running update.
	if (self.$updateAjax) {
		self.$updateAjax.$abort = true;
		self.$updateAjax.abort();
		self.$updateAjax = null;
	}

	self.$spacename = spacename;
	self.$cSpace    = null;
	self.$rSpace    = null;
	self.$outbox    = [];
	self.$postbox   = [];
	self.$mseq      = -1;
	self.$undo      = [];
	self.$redo      = [];

	var path = new Path([spacename]);

    var ajax = self.$aquireAjax = new XMLHttpRequest();

    ajax.open('POST', '/mm', true);

    ajax.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

    ajax.onreadystatechange = function() {
		var asw;
		if (ajax.readyState !== 4) { return; }

		if (ajax.status !== 200) {
			self.$aquireAjax = null;
			Jools.log('iface', 'aquireSpace.status == ' + ajax.status);
			callback(
				{
					error  : 'connection' ,
					status : ajax.status
				},
				null
			);
			return;
		}

		try {
			asw = JSON.parse(ajax.responseText);
		} catch (e) {
			self.$aquireAjax = null;
			callback(
				{ error: 'nojson' },
				null
			);
			return;
		}

		Jools.log('iface', '<-sg', asw);
		if (!asw.ok) {
			self.$aquireAjax = null;
			Jools.log('iface', 'aquireSpace, server not ok');
			callback( asw, null);
			return;
		}

		self.aquireSpaceActive = false;

		self.$remoteTime = asw.time;

		if (asw.node.type !== 'Space') {
			callback(
				{ error : 'nospace' },
				null
			);
			return;
		}

		self.$cSpace = self.$rSpace = new Tree(asw.node, Meshverse);

		callback(null, Jools.immute({
			tree   : self.$cSpace,
			name   : spacename,
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
        cmd   : 'get',
		space : spacename,
		path  : new Path([]),
		pass  : self.$pass,
        time  : -1,
		user  : self.$user
    });

    Jools.log('iface', 'sg->', request);
    ajax.send(request);
};

/**
| Gets a twig.
*/
IFace.prototype.get = function(path, len) {
    return this.$cSpace.getPath(path, len);
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
			Jools.log('iface', 'update.status == ' + ajax.status);
			shell.greenscreen('Connection with server failed.', false);
			return;
		}

		try {
			asw = JSON.parse(ajax.responseText);
		} catch (e) {
			throw new Error('Server answered no JSON!');
		}

		Jools.log('iface', '<-u', asw);
		if (!asw.ok) { throw new Error('update, server not OK!'); }
		var chgs = asw.chgs;

		var report  = new ChangeX();
		var gotOwnChgs = false;
		var time = asw.time;

		if (chgs && chgs.length > 0) {

			// this wasn't an empty timeout?
			var postbox = self.$postbox;
			for(a = 0, aZ = chgs.length; a < aZ; a++) {
				chgX = new Change(chgs[a].chgX);
				var cid = chgs[a].cid;

				// changes the clients understanding of the server tree
				self.$rSpace = MeshMashine.changeTree(self.$rSpace, chgX).tree;

				if (postbox.length > 0 && postbox[0].cid === cid) {
					self.$postbox.splice(0, 1);
					gotOwnChgs = true;
					continue;
				}

				// alters undo and redo queues.
				var $undo = self.$undo;
				var u;
				for(b = 0, bZ = $undo.length; b < bZ; b++) {
					u = $undo[b];
					if (u.time < time + a) {
						u.chgX = MeshMashine.tfxChgX(u.chgX, chgX);
					}
				}

				var $redo = self.$redo;
				for(b = 0, bZ = $redo.length; b < bZ; b++) {
					u = $redo[b];
					if (u.time < time + a) {
						u.chgX = MeshMashine.tfxChgX(u.chgX, chgX);
					}
				}

				report.push(chgX);
			}

			// adapts all queued changes
			// and rebuilds the clients understanding of its own tree
			var outbox = self.$outbox;

			for(a = 0, aZ = postbox.length; a < aZ; a++)
				{ self.cSpace = MeshMashine.changeTree(self.cSpace, postbox[a].chgX).tree; }

			for(a = 0, aZ = outbox.length; a < aZ; a++) {
				chgX = outbox[a].chgX;
				for(b = 0, bZ = report.length; b < bZ; b++) {
					chgX = MeshMashine.tfxChgX(chgX, report[b]);
				}
				outbox[a].chgX = chgX;
				self.cSpace = MeshMashine.changeTree(self.cSpace, chgX).tree;
			}
		}

		var msgs = asw.msgs;
		if (msgs && self._messageRCV) {
			for(a = 0, aZ = msgs.length; a < aZ; a++) {
				var m = msgs[a];
				self._messageRCV.messageRCV(m.space, m.user, m.message);
			}
		}

		self.$remoteTime = asw.timeZ;
		var mseqZ        = asw.mseqZ;
		if (Jools.is(mseqZ))
			{ self.$mseq = mseqZ; }

		if (report.length > 0 && self._updateRCV)
			{ self._updateRCV.update(self.$cSpace, report); }

		if (gotOwnChgs) { self.sendChanges(); }

		// issue the following update
		self._update();
	};

	var request = JSON.stringify({
		cmd   : 'update',
		pass  : self.$pass,
		space : self.$spacename,
		time  : self.$remoteTime,
		mseq  : self.$mseq,
		user  : self.$user
	});

	Jools.log('iface', 'u->', request);
	ajax.send(request);
};

/**
| Alters the tree
*/
IFace.prototype.alter = function(src, trg) {
    var chg = new Change(new Sign(src), new Sign(trg));
    var r = MeshMashine.changeTree(this.$cSpace, chg);
    this.$cSpace = r.tree;
	var chgX     = r.chgX;

	var c = {
		cid  : Jools.uid(),
		chgX : chgX,
		time : this.$remoteTime
	};

	this.$outbox.push(c);

	this.$redo = [];
	var $undo = this.$undo;
	$undo.push(c);
	if ($undo.length > config.maxUndo) { $undo.shift(); }

	this.sendChanges();

    if (this._updateRCV)
		{ this._updateRCV.update(r.tree, chgX); }

    return chgX;
};

/**
| Sends the stored changes to remote meshmashine
*/
IFace.prototype.sendChanges = function() {

	// already sending?
	if (this.$postbox.length > 0)  { return; }

	// nothing to send?
	if (this.$outbox.length === 0) { return; }

	var ajax = new XMLHttpRequest();
	ajax.open('POST', '/mm', true);
	ajax.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

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

		Jools.log('iface', '<-sc', asw);
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

	Jools.log('iface', 'sc->', request);
	ajax.send(request);
};


/**
| Sends the stored changes to remote meshmashine
*/
IFace.prototype.undo = function() {
	if (this.$undo.length === 0) { return; }

	var chgX      = this.$undo.pop().chgX.invert();
    var r         = MeshMashine.changeTree(this.$cSpace, chgX);
    this.$cSpacec = r.tree;
	chgX          = r.chgX;

	if (chgX === null) { return; }

	var c = Jools.immute({
		cid  : Jools.uid(),
		chgX : chgX,
		time : this.$remoteTime
	});

	this.$outbox.push(c);
	this.$redo.push(c);
	this.sendChanges();

    if (this._updateRCV) { this._updateRCV.update(r.tree, chgX); }

    return chgX;
};

/**
| Sends the stored changes to remote meshmashine
*/
IFace.prototype.redo = function() {
	if (this.$redo.length === 0)
		{ return; }

	var chgX   = this.$redo.pop().chgX.invert();
    var r      = MeshMashine.changeTree(this.$cSpace, chgX);
    this.$tree = r.tree;
	chgX       = r.chgX;

	if (chgX === null) { return; }

	var c = Jools.immute({
		cid  : Jools.uid(),
		chgX : chgX,
		time : this.$remoteTime
	});

	this.$outbox.push(c);
	this.$undo.push(c);
	this.sendChanges();

    if (this._updateRCV) { this._updateRCV.update(this.$cSpace, chgX); }

    return chgX;
};

})();
