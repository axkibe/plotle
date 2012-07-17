/**           _....._          .----.     .----  _....._    .
            .´       '.         \    \   /    /.´       '.  .
           /   .-'"'.  \ .-,.--. '   '. /'   //   .-'"'.  \  .-,.--.
          /   /______\  ||  .-. ||    |'    //   /______\  | |  .-. |
       _  |   __________|| |  | ||    ||    ||   __________| | |  | |
     .' | \  (          '| |  | |'.   `'   .'\  (          ' | |  | |
    .   | /\  '-.___..-~.| |  '-  \        /  \  '-.___..-~. | |  '-
  .'.'| |// `         .'.| |       \      /    `         .'.`| |
.'.'.-'  /   `'-.....-.'.| |        '----'      `'-.....-.'. | |
.'   \_.'                |_|                                 |_|


~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

 The server-side repository.

 Authors: Axel Kittenberger
 License: MIT(Expat), see accompanying 'License'-file

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

/**
| Capsule
| (just to make jshint happy)
*/
(function(){
"use strict";
if (typeof(require) === 'undefined') { throw new Error('this file needs node!'); }

/**
| Imports
*/
var Jools       = require('../shared/jools');
var MeshMashine = require('../shared/meshmashine');
var Meshverse   = require('../shared/meshverse');
var Path        = require('../shared/path');
var Resource    = require('./resource');
var Tree        = require('../shared/tree');
var config      = require('../config');
var fs          = require('fs');
var http        = require('http');
var sha1        = require('../shared/sha1');
var mongodb     = require('mongodb');
var uglify      = config.uglify && require('uglify-js');
var url         = require('url');
var util        = require('util');
var zlib        = require('zlib');

/**
| Shortcuts
*/
var Change       = MeshMashine.Change;
var configSwitch = Jools.configSwitch;
var debug        = Jools.debug;
var is           = Jools.is;
var isArray      = Jools.isArray;
var log          = Jools.log;
var reject       = Jools.reject;
var uid          = Jools.uid;

/**
| Server
*/
var Server = function() {

	// files served
	this.$resources = {};
	this.$bundle = [];

	this.addResources();

	// init database
	this.db = {};
	this.db.server    = new mongodb.Server(
		config.database.host,
		config.database.port,
		{}
	);
	this.db.connector = new mongodb.Db(
		config.database.name,
		this.db.server,
		{}
	);

	// all messages
	this.messages = [];

	// the whole tree
	this.tree      = new Tree({ type : 'Nexus' }, Meshverse);

	// all changes
	this.changes   = [];

	// a table of all clients waiting for an update
	this.upsleep   = {};

	// next upsleepID
	this.nextSleep = 1;

	// next visitors ID
	this.nextVisitor = 1000;

	// table of all cached user credentials
	this.$users = {};

	// the list where a user is present
	// user for 'entered' and 'left' messages
	this.$presences = {};

	// all other steps of the startup sequence are done in
	// async waterfall model from here.

	this.startup(function(err, asw) {
		if (err) {
			console.log('Error: ' + err.message);
			process.exit(1);
		}
	});
};

/**
| Connects to the database.
*/
Server.prototype.startup = function(_) {
	this.prepareResources(_);

	var db = this.db;
	db.connection = db.connector.open(_);
	log('start', 'Connected to database');
	db.changes = db.connection.collection('changes', _);
	db.invites = db.connection.collection('invites', _);
	db.users   = db.connection.collection('users', _);
	this.ensureRootUser(_);

	var cursor = db.changes.find(_);
	for(var o = cursor.nextObject(_); o !== null; o = cursor.nextObject(_)) {
		this.playbackOne(o);
	}

	log('start', 'Starting server @ http://' + (config.ip || '*') + '/:' + config.port);

	var self = this;
	http.createServer(function(req, res) {
		self.requestListener(req, res);
	}).listen(config.port, config.ip, _);

	log('start', 'Server running');
};

/**
| Ensures there is a root user
*/
Server.prototype.ensureRootUser = function(_) {
	var db = this.db;
	var root = this.db.users.findOne({ _id : 'root'}, _);

	if (root) {
		log('start', 'root pass:', root.pass);
	} else {
		// if not create one
		root = {
			_id  : 'root',
			pass : uid(),
			mail : '',
			code : '',
			icom : 'root'
		};

		this.db.users.insert(root, _);
		log('start', 'created root pass:', root.pass);
	}

	this.$users.root = root;
};

/**
| Playbacks one change.
*/
Server.prototype.playbackOne = function(o) {
	var c = {
		cid  : o.cid,
		chgX : null
	};

	if (!isArray(o.chgX)) {
		c.chgX = new Change(o.chgX);
	} else {
		c.chgX = [];
		for(var a = 0, aZ = o.chgX.length; a < aZ; a++) {
			c.chgX.push(new Change(o.chgX[a]));
		}
	}

	this.changes.push(c);
	var r = MeshMashine.changeTree(this.tree, c.chgX);
	this.tree = r.tree;
};

/**
| sends a message
*/
Server.prototype.sendMessage = function(space, user, message) {
	this.messages.push({ space: space, user: user, message: message });
	var spaces = [];
	spaces[space] = true;
	var self = this;
	process.nextTick(function() { self.wake(spaces); });
};

/**
| Creates a message for a space
*/
Server.prototype.cmdMessage = function(cmd, _) {
	var space   = cmd.space;
	var message = cmd.message;
	var user    = cmd.user;
	var pass    = cmd.pass;

	if (!is(user))    { throw reject('user missing');    }
	if (!is(pass))    { throw reject('pass missing');    }
	if (!is(space))   { throw reject('space missing');   }
	if (!is(message)) { throw reject('message missing'); }


	if (this.$users[user].pass !== pass)
		{ throw reject('invalid pass'); }

	this.sendMessage(space, user, message);

	return { ok : true };
};

/**
| Builds the shells config.js file.
*/
Server.prototype.buildShellConfig = function() {
	var k;

	var cconfig = [];
	cconfig.push('var config = {\n');
	cconfig.push('\tdevel   : '  + configSwitch(config.devel, 'shell') + ',\n');
	cconfig.push('\tmaxUndo : '  + config.maxUndo + ',\n');
	cconfig.push('\tdebug   : {\n');
	var first = true;
	for(k in config.debug) {
		if (!first) { cconfig.push(',\n'); } else { first = false; }
		cconfig.push('\t\t' + k + ' : ' + config.debug[k]);
	}
	cconfig.push('\n\t},\n');
	cconfig.push('\tlog : {\n');
	first = true;
	for(k in config.log) {
		if (!first) { cconfig.push(',\n'); } else { first = false; }
		cconfig.push('\t\t' + k + ' : ' + configSwitch(config.log[k], 'shell'));
	}
	cconfig.push('\n\t}\n');
	cconfig.push('};\n');
	return cconfig.join('');
};

/**
| Defines the resource to be REST served.
*/
Server.prototype.addResources = function() {
	var rlist = [
		'media/favicon.ico',                                'mc',
		'shell/testpad.html',                               'f',
		'shell/testpad.js',                                 'f',
		'shell/fonts/webfont.js',                           'mc',

		'shared/jools.js',                                  'fb',
		'shared/sha1.js',                                   'fb',
		'shared/euclid/compass.js',                         'fb',
		'shared/euclid/point.js',                           'fb',
		'shared/euclid/rect.js',                            'fb',
		'shared/euclid/margin.js',                          'fb',
		'shell/euclid/fabric.js',                           'fb',
		'shell/euclid/measure.js',                          'fb',
		'shell/euclid/rect.js',                             'fb',
		'shell/euclid/bezirect.js',                         'fb',
		'shell/euclid/ovalslice.js',                        'fb',
		'shell/euclid/ovalflower.js',                       'fb',
		'shell/euclid/line.js',                             'fb',
		'shell/font.js',                                    'fb',
		'shell/theme.js',                                   'fb',
		'shell/euclid/view.js',                             'fb',
		'shared/meshverse.js',                              'fb',
		'shared/path.js',                                   'fb',
		'shared/tree.js',                                   'fb',
		'shared/sign.js',                                   'fb',
		'shared/change.js',                                 'fb',
		'shared/changex.js',                                'fb',
		'shared/meshmashine.js',                            'fb',
		'shell/iface.js',                                   'fb',
		'shell/peer.js',                                    'fb',
		'shell/design/pattern.js',                          'fb',
		'shell/design/fontstyles.js',                       'fb',
		'shell/design/mainpanel.js',                        'fb',
		'shell/design/loginpanel.js',                       'fb',
		'shell/design/regpanel.js',                         'fb',
		'shell/design/helppanel.js',                        'fb',
		'shell/dash/accent.js',                             'fb',
		'shell/curve.js',                                   'fb',
		'shell/dash/button.js',                             'fb',
		'shell/dash/input.js',                              'fb',
		'shell/dash/label.js',                              'fb',
		'shell/dash/chat.js',                               'fb',
		'shell/dash/panel.js',                              'fb',
		'shell/proc/util.js',                               'fb',
		'shell/proc/mainpanel.js',                          'fb',
		'shell/proc/helppanel.js',                          'fb',
		'shell/proc/mbleftb.js',                            'fb',
		'shell/proc/mbleft2b.js',                           'fb',
		'shell/proc/mbswitchb.js',                          'fb',
		'shell/proc/mbrightb.js',                           'fb',
		'shell/proc/mbzoomplusb.js',                        'fb',
		'shell/proc/mbzoomnullb.js',                        'fb',
		'shell/proc/mbzoomminusb.js',                       'fb',
		'shell/proc/lbloginb.js',                           'fb',
		'shell/proc/lbcloseb.js',                           'fb',
		'shell/proc/lbpassi.js',                            'fb',
		'shell/proc/rbcloseb.js',                           'fb',
		'shell/proc/rbregb.js',                             'fb',
		'shell/proc/hbhideb.js',                            'fb',
		'shell/dash/switchpanel.js',                        'fb',
		'shell/dash/board.js',                              'fb',
		'shell/action.js',                                  'fb',
		'shell/ovalmenu.js',                                'fb',
		'shell/visual/para.js',                             'fb',
		'shell/visual/scrollbar.js',                        'fb',
		'shell/visual/base.js',                             'fb',
		'shell/visual/doc.js',                              'fb',
		'shell/visual/item.js',                             'fb',
		'shell/visual/note.js',                             'fb',
		'shell/visual/label.js',                            'fb',
		'shell/visual/relation.js',                         'fb',
		'shell/visual/space.js',                            'fb',
		'shell/system.js',                                  'fb',
		'shell/caret.js',                                   'fb',
		'shell/selection.js',                               'fb',
		'shell/shell.js',                                   'fb',
		'shell/fontloader.js',                              'fb',

		'shell/fonts/dejavu.css',                           'mc',
		'shell/fonts/dejavusans-boldoblique-webfont.eot',   'mc',
		'shell/fonts/dejavusans-boldoblique-webfont.svg',   'mc',
		'shell/fonts/dejavusans-boldoblique-webfont.ttf',   'mc',
		'shell/fonts/dejavusans-boldoblique-webfont.woff',  'mc',
		'shell/fonts/dejavusans-bold-webfont.eot',          'mc',
		'shell/fonts/dejavusans-bold-webfont.svg',          'mc',
		'shell/fonts/dejavusans-bold-webfont.ttf',          'mc',
		'shell/fonts/dejavusans-bold-webfont.woff',         'mc',
		'shell/fonts/dejavusans-oblique-webfont.eot',       'mc',
		'shell/fonts/dejavusans-oblique-webfont.svg',       'mc',
		'shell/fonts/dejavusans-oblique-webfont.ttf',       'mc',
		'shell/fonts/dejavusans-oblique-webfont.woff',      'mc',
		'shell/fonts/dejavusans-webfont.eot',               'mc',
		'shell/fonts/dejavusans-webfont.svg',               'mc',
		'shell/fonts/dejavusans-webfont.ttf',               'mc',
		'shell/fonts/dejavusans-webfont.woff',              'mc'
	];

	for (var a = 0, aZ = rlist.length; a < aZ; a += 2) {
		var r = new Resource(rlist[a], rlist[a + 1]);
		if (r.opts.bundle) { this.$bundle.push(r); }
		this.$resources[r.path] = r;
	}
};

/**
| Prepares the resource, also build the bundle for fast-loading.
*/
Server.prototype.prepareResources = function(_) {
	var path, r;
	log('start', 'Preparing resources');

	for(path in this.$resources) {
		r = this.$resources[path];

		if (r.data !== null || !r.opts.memory)
			{ continue; }

		r.data = fs.readFile(r.path, _);
	}

	this.$resources['favicon.ico'] = this.$resources['media/favicon.ico'];

	var cconfig = new Resource('shell/config.js', 'mb');
	this.$bundle.unshift(cconfig);
	this.$resources[cconfig.path] = cconfig;
	cconfig.data = this.buildShellConfig();

	var bundle = [];
	var devels = [];

	for(var a = 0, aZ = this.$bundle.length; a < aZ; a++) {
		r = this.$bundle[a];
		devels.push('<script src="' + r.path + '" type="text/javascript"></script>');
		if (r.data === null) {
			bundle.push(fs.readFile(r.path, _));
		} else {
			bundle.push(r.data);
		}
	}
	bundle = bundle.join('\n');

	// uglify the bundle
	if (config.uglify) {
		var ast;
		ast    = uglify.parser.parse(bundle);
		ast    = uglify.uglify.ast_mangle(ast, {toplevel: true});
		ast    = uglify.uglify.ast_lift_variables(ast);
		ast    = uglify.uglify.ast_squeeze(ast);
		bundle = uglify.uglify.gen_code(ast);
	}

	var bsha1 = sha1.sha1hex(bundle);
	var br = new Resource('meshcraft-' + bsha1 + '.js', 'mc');
	br.data = bundle;
	this.$resources[br.path] = br;
	log('start', 'bundle:', bsha1);

	// the devel file
	var devel = new Resource('shell/devel.html', 'm');
	devel.data = fs.readFile('shell/devel.html', _) + '';
	devel.data = devel.data.replace(/<!--DEVELPACK.*>/, devels.join('\n'));
	this.$resources['devel.html'] = devel;

	var main = new Resource('shell/meshcraft.html', 'm');
	main.data = fs.readFile('shell/meshcraft.html', _) + '';
	main.data = main.data.replace(
		/<!--COPACK.*>/,
		'<script src="' + br.path + '" type="text/javascript"></script>'
	);
	this.$resources['meshcraft.html'] =
	this.$resources['index.html'] =
	this.$resources[''] = main;

	for(path in this.$resources) {
		r = this.$resources[path];
		if (!r.opts.memory) { continue; }
		r.gzip = zlib.gzip(r.data, _);
	}

	log('start', 'uncompressed bundle size is ', br.data.length);
	log('start', '  compressed bundle size is ', br.gzip.length);
};

/**
| Executes an alter command.
*/
Server.prototype.cmdAlter = function(cmd, _) {
	var time = cmd.time;
	var chgX = cmd.chgX;
	var cid  = cmd.cid;

	var changes = this.changes;
	var cZ      = changes.length;

	// some tests
	if (!is(time)) { throw reject('time missing'); }
	if (!is(chgX)) { throw reject('chgX missing');  }
	if (!is(cid))  { throw reject('cid missing');  }
	if (time === -1)  { time = cZ; }
	if (!(time >= 0 && time <= cZ)) { throw reject('invalid time'); }

	// fits the cmd into data structures
	try {
		if (isArray(chgX))  { throw new Error('Array chgX not yet supported'); } // TODO
		chgX = new Change(chgX);
	} catch(e) {
		throw reject('invalid cmd: '+e.message);
	}

	var spaces = {};
	MeshMashine.listSpaces(chgX, spaces);
	for (var s in spaces) {
		if (this.testAccess(cmd.user, s) !== 'rw') {
			throw reject('no access');
		}
	}

	// translates the changes if not most recent
	for (var a = time; a < cZ; a++) {
		chgX = MeshMashine.tfxChgX(chgX, changes[a].chgX);
	}

	if (chgX === null || chgX.length === 0) {
		return { ok: true, chgX: chgX };
	}

	// applies the changes
	var r = MeshMashine.changeTree(this.tree, chgX);
	this.tree = r.tree;
	chgX      = r.chgX;
	if (chgX === null || chgX.length === 0) {
		return { ok: true, chgX: chgX };
	}

	changes.push({ cid : cmd.cid, chgX : chgX });

	// saves the change in the database
	this.db.changes.insert({
		_id  : changes.length,
		cid  : cmd.cid,
		chgX : JSON.parse(JSON.stringify(chgX)),
		user : cmd.user,
		date : Date.now()
	}, function(error, count) {
		if (error !== null) { throw new Error('Database fail!'); }
	});

	var self = this;
	process.nextTick(function() { self.wake(spaces); });
	return { ok: true, chgX: chgX };
};

/**
| Executes an auth command.
*/
Server.prototype.cmdAuth = function(cmd, _) {
	if (!is(cmd.user)) { throw reject('user missing'); }
	if (!is(cmd.pass)) { throw reject('pass missing');  }
	var $users = this.$users;

	if (cmd.user === 'visitor') {
		var uid;
		do {
			this.nextVisitor++;
			uid = 'visitor-' + this.nextVisitor;
		}
		while ($users[uid]);
		$users[uid] = {
			user    : uid,
			pass    : cmd.pass,
			created : Date.now(),
			use     : Date.now()
		};
		return { ok: true, user: uid };
	}

	if (!$users[cmd.user]) {
		var val = this.db.users.findOne({ _id : cmd.user}, _);
		if (val === null) { return reject('Username unknown'); }
		$users[cmd.user] = val;
	}

	if ($users[cmd.user].pass !== cmd.pass) { return reject('Invalid password'); }
	return { ok : true, user: cmd.user };
};

/**
| Executes an register command.
*/
Server.prototype.cmdRegister = function(cmd, _) {
	if (!is(cmd.user)) { return reject('user missing'); }
	if (!is(cmd.pass)) { return reject('pass missing'); }
	if (!is(cmd.mail)) { return reject('mail missing'); }
	if (!is(cmd.code)) { return reject('code missing'); }

	if (cmd.user.substr(0, 7) === 'visitor')
		{ return reject('Username must not start with "visitor"'); }

	if (cmd.user.length < 4)
		{ throw reject('Username too short, min. 4 characters'); }

	var user = this.db.users.findOne({ _id : cmd.user}, _);
	if (user !== null) { return reject('Username already taken'); }

	// aquires an inivitation code and invalidates it if found.
	var code = this.db.invites.findAndModify(
		{ _id : cmd.code },
		{  },
		null,
		{ remove: true },
	_);

	if (code === null) {
		return reject('Unknown invitation code');
	}

	user = {
		_id  : cmd.user,
		pass : cmd.pass,
		mail : cmd.mail,
		code : cmd.code,
		icom : code.comment
	};

	this.db.users.insert(user, _);
	this.$users[cmd.user] = user;

	// everything OK so far, creates the user home space
	var asw = this.cmdAlter({
		time : 0,
		user : 'root',
		pass : this.$users.root.pass,
		chgX : new Change(
			{ val: { type: 'Space', cope: {}, ranks: [] } },
			{ path : [cmd.user + ':home'] }
		),
		cid  : uid()
	}, _);

	if (asw.ok !== true) { throw new Error('Cannot create users home space'); }

	return { ok: true, user: cmd.user };
};

/**
| Refreshes a users presence timeout.
*/
Server.prototype.refreshPresence = function(user, space) {
	var pres = this.$presences;
	var pu = pres[user];

	if (!pu) { pu = pres[user] = { spaces : { } }; }

	var pus = pu.spaces[space];
	if (!pus) {
		pus = pu.spaces[space] = { establish : 0, timerID : null  };
		pus.timerID = setTimeout(this.expirePresence, 5000, this, user, space);
		this.sendMessage(space, null, user + ' entered "' + space + '"');
	} else {
		if (pus.timerID !== null) { clearTimeout(pus.timerID); pus.timerID = null; }
		pus.timerID = setTimeout(this.expirePresence, 5000, this, user, space);
	}
};

/**
| Establishes a longer user presence for an update that goes into sleep
*/
Server.prototype.establishPresence = function(user, space, sleepID) {
	var pres = this.$presences;
	var pu = pres[user];

	if (!pu) { pu = pres[user] = { spaces : { } }; }

	var pus = pu.spaces[space];
	if (!pus) {
		pus = pu.spaces[space] = { establish : 1, timerID : null  };
		this.sendMessage(space, null, user + ' entered "' + space + '"');
	} else {
		if (pus.timerID !== null) { clearTimeout(pus.timerID); pus.timerID = null; }
		pus.establish++;
	}
};

/**
| Destablishes a longer user presence for an update that went out of sleep.
*/
Server.prototype.destablishPresence = function(user, space) {
	var pres = this.$presences;
	var pu   = pres[user];
	var pus  = pu.spaces[space];
	pus.establish--;
	if (pus.establish <= 0) {
		if (pus.timerID !== null) { throw new Error("Presence timers mixed up."); }
		pus.timerID = setTimeout(this.expirePresence, 5000, this, user, space);
	}
};

/**
| Expires a user presence with zero establishments after timeout
*/
Server.prototype.expirePresence = function(self, user, space) {
	self.sendMessage(space, null, user + ' left "' + space + '"');
	var pres = self.$presences;
	var pu = pres[user];
	if (pu.spaces[space].establish !== 0) { throw new Error('Something wrong with presences.'); }
	delete pu.spaces[space];
};

/**
| Gets new changes or waits for them.
*/
Server.prototype.cmdUpdate = function(cmd, res, _) {
	if (this.$users[cmd.user].pass !== cmd.pass)
		{ throw reject('invalid password'); }

	if (this.testAccess(cmd.user, cmd.space) === 'no')
		{ throw reject('no access'); }

	// some tests
	if (!is(cmd.time))
		{ throw reject('time missing'); }

	if (!(cmd.time >= 0 && cmd.time <= this.changes.length))
		{ throw reject('invalid time'); }

	if (cmd.mseq < 0)
		{ cmd.mseq = this.messages.length; }

	if (!(cmd.mseq <= this.messages.length))
		{ throw reject('invalid mseq: ' + cmd.mseq); }

	this.refreshPresence(cmd.user, cmd.space);
	var asw = this.conveyUpdate(cmd.time, cmd.mseq, cmd.space);

	// immediate answer?
	if (asw.chgs.length > 0 || asw.msgs.length > 0)
		{ return asw; }

	// if not immediate puts the request to sleep
	var sleepID = '' + this.nextSleep++;
	var timerID = setTimeout(this.expireSleep, 60000, this, sleepID);
	this.upsleep[sleepID] = {
		user     : cmd.user,
		time     : cmd.time,
		mseq     : cmd.mseq,
		timerID  : timerID,
		res      : res,
		space    : cmd.space
	};
	res.sleepID = sleepID;

	this.establishPresence(cmd.user, cmd.space, sleepID);
	return null;
};

/**
| A sleeping update expired.
*/
Server.prototype.expireSleep = function(self, sleepID) {
	var cZ = self.changes.length;
	var sleep = self.upsleep[sleepID];
	delete self.upsleep[sleepID];

	self.destablishPresence(sleep.user, sleep.space);

	var asw = { ok : true, time: sleep.time, timeZ : cZ, chgs : null};
	var res = sleep.res;
	log('ajax', '->', asw);
	res.writeHead(200, {
		'Content-Type'  : 'application/json',
		'Cache-Control' : 'no-cache',
		'Date'          : new Date().toUTCString()
	});
	res.end(JSON.stringify(asw));
};

/**
| A sleeping update closed prematurely.
*/
Server.prototype.closeSleep = function(sleepID) {
	var sleep = this.upsleep[sleepID];
	clearTimeout(sleep.timerID);
	delete this.upsleep[sleepID];
	this.destablishPresence(sleep.user, sleep.space);
};

/**
| Returns a result for an update operation.
*/
Server.prototype.conveyUpdate = function(time, mseq, space) {
	var changes  = this.changes;
	var messages = this.messages;
	var cZ       = changes.length;
	var mZ       = messages.length;
	var chga     = [];
	var msga     = [];
	for (var c = time; c < cZ; c++) {
		MeshMashine.filter(changes[c], space, chga);
	}
	for (var m = mseq; m < mZ; m++) {
		if (messages[m].space !== space) { continue; }
		msga.push(messages[m]);
	}

	return {
		ok    : true,
		time  : time,
		timeZ : cZ,
		chgs  : chga,
		msgs  : msga,
		mseq  : mseq,
		mseqZ : mZ
	};
};

/**
| Wakes up any sleeping updates and gives them data if applicatable.
*/
Server.prototype.wake = function(spaces) {
	var sleepKeys = Object.keys(this.upsleep);
	var changes   = this.changes;
	var cZ  = changes.length;

	// TODO cache change lists to answer the same to multiple clients.
	for(var a = 0, aZ = sleepKeys.length; a < aZ; a++) {
		var sKey = sleepKeys[a];
		var sleep = this.upsleep[sKey];
		if (!spaces[sleep.space]) { continue; }

		clearTimeout(sleep.timerID);
		delete this.upsleep[sKey];
		this.destablishPresence(sleep.user, sleep.space);

		var asw = this.conveyUpdate(sleep.time, sleep.mseq, sleep.space);

		var res = sleep.res;
		log('ajax', '->', asw);
		res.writeHead(200, {
			'Content-Type'  : 'application/json',
			'Cache-Control' : 'no-cache',
			'Date'          : new Date().toUTCString()
		});
		res.end(JSON.stringify(asw));
	}
};

/**
| Tests if the user has access to 'space'.
*/
Server.prototype.testAccess = function(user, space) {
	if (user === 'root') { return 'rw'; }
	switch (space) {
	case 'sandbox' : return 'rw';
	case 'welcome' : return user === config.admin ? 'rw' : 'ro';
	}
	var sp = space.split(':', 2);
	if (sp.length < 2)  { return 'no'; }
	if (user == sp[0]) { return 'rw'; }
	return 'no';
};

/**
| Executes a get command.
*/
Server.prototype.cmdGet = function(cmd, _) {
	var pass    = cmd.pass;
	var time    = cmd.time;
	var user    = cmd.user;
	var changes = this.changes;
	var cZ      = changes.length;

	// checks
	if (!is(this.$users[user]) || this.$users[user].pass !== cmd.pass)
		{ throw reject('wrong user/password'); }

	if (!is(cmd.time))
		{ throw reject('time missing'); }

	if (!is(cmd.path))
		{ throw reject('path missing'); }

	if (time === -1)
		{ time = cZ; }

	if (!(time >= 0 && time <= cZ))
		{ throw reject('invalid time'); }

	var path = new Path(cmd.path);

	var access = this.testAccess(cmd.user, path.get(0));
	if (access == "no")
		{ throw reject("no access"); }

	// if the requested data is in the past go back in time
	var tree = this.tree;
	for (var a = cZ - 1; a >= time; a--) {
		var chgX = changes[a].chgX;
		for (var b = 0; b < chgX.length; b++) {
			var r = MeshMashine.changeTree(tree, chgX[b].reverse());
			tree = r.tree;
		}
	}

	// returns the path requested
	var node;
	try {
		node = tree.getPath(path);
	} catch(e) {
		throw reject('cannot get path: '+e.message);
	}

	return { ok: true, access : access, time : time, node: node };
};


/**
| Logs and returns a web error
*/
Server.prototype.webError = function(res, code, message) {
	res.writeHead(code, {
		'Content-Type'  : 'text/plain',
		'Cache-Control' : 'no-cache',
		'Date'          : new Date().toUTCString()
	});
	message = code+' '+message;
	log('web', 'error', code, message);
	res.end(message);
};


/**
| Checks if the request should be proxied
| Returns true if the proxy applies, false otherwise.
*/
Server.prototype.webRedirect = function(req, res) {
	if (!config.redirect)
		{ return false; }

	var host = req.headers.host;
	var loc  = config.redirect[host];

	if (!loc)
		{ return false; }

	var locp = loc + req.url;
	log('web', 'redirect', '->', locp);

	res.writeHead(307, {
		'Content-Type'  : 'text/plain',
		'Cache-Control' : 'max-age=86400',
		'Date'          : new Date().toUTCString(),
		'Location'      : locp
	});
	res.end();

	return true;
};

/**
| Listens to http requests
*/
Server.prototype.requestListener = function(req, res) {
	var red = url.parse(req.url);

	if (this.webRedirect(req, res))
		{ return; }

	log('web', req.connection.remoteAddress, red.href);

	var pathname = red.pathname.replace(/^[\/]+/g, '');
	if (pathname === 'mm')
		{ return this.webAjax(req, red, res); }

	var r = this.$resources[pathname];
	if (!r) {
		// TODO write two heads? this looks.wrong
		res.writeHead(404, {
			'Content-Type'  : 'text/plain',
			'Cache-Control' : 'no-cache',
			'Date'          : new Date().toUTCString()
		});
		this.webError(res, '404 Bad Reqeust');
		return;
	}

	if (r.data) {
		var aenc = r.gzip && req.headers['accept-encoding'];
		var header = {
			'Content-Type'     : r.mime,
			'Cache-Control'    : r.opts.cache ? 'max-age=7884000' : 'no-cache',
			'Date'             : new Date().toUTCString()
		};
		if (aenc && aenc.indexOf('gzip') >= 0) {
			// delivers compressed
			header['Content-Encoding'] = 'gzip';
			res.writeHead(200, header);
			res.end(r.gzip, 'binary');
		} else {
			// delivers uncompressed
			res.writeHead(200, header);
			res.end(r.data, r.code);
		}
		return;
	}

	var self = this;
	fs.readFile(r.path, function(err, data) {
		if (err) {
			self.webError(res, 500, 'Internal Server Error');
			log('fail', 'Missing file: ' + r.path);
			return;
		}
		res.writeHead(200, {
			'Content-Type'  : r.mime,
			'Cache-Control' : r.opts.cache ? 'max-age=7884000' : 'no-cache',
			'Date'          : new Date().toUTCString()
		});
		res.end(data, r.code);
	});
};


/**
| Handles ajax requests to the MeshMashine.
*/
Server.prototype.webAjax = function(req, red, res) {
	var self = this;
	var data = [];

	if (req.method !== 'POST') {
		this.webError(res, 400, 'Must use POST');
		return;
	}

	req.on('close', function() {
		if (res.sleepID) { self.closeSleep(res.sleepID); }
	});

	req.on('data', function(chunk) {
		data.push(chunk);
	});

	req.on('end', function() {
		var query = data.join('');
		log('ajax', '<-', query);
		var asw, cmd;
		try {
			cmd = JSON.parse(query);
		} catch (err) {
			self.webError(res, 400, 'Not valid JSON');
			return;
		}

		asw = self.ajaxCmd(cmd, res, function(e, asw) {
			if (e) {
				if (e.ok !== false) {
					throw e;
				} else {
					asw = {
						ok : false,
						message : e.message
					};
				}
			}
			if (asw === null) { return; }
			log('ajax', '->', asw);
			res.writeHead(200, {
				'Content-Type'  : 'application/json',
				'Cache-Control' : 'no-cache',
				'Date'          : new Date().toUTCString()
			});
			res.end(JSON.stringify(asw));
		});
	});
};

/**
| Executes an ajaxCmd
*/
Server.prototype.ajaxCmd = function(cmd, res, _) {
	switch (cmd.cmd) {
	case 'alter'    : return this.cmdAlter   (cmd, _);
	case 'auth'     : return this.cmdAuth    (cmd, _);
	case 'get'      : return this.cmdGet     (cmd, _);
	case 'message'  : return this.cmdMessage (cmd, _);
	case 'register' : return this.cmdRegister(cmd, _);
	case 'update'   : return this.cmdUpdate  (cmd, res, _);
	default: return reject('unknown command');
	}
};

var server = new Server();

})();
