/**                                                      _.._
                                                      .-'_.._''.
 __  __   ___       _....._              .          .' .'     '.\
|  |/  `.'   `.   .´       '.          .'|         / .'                                _.._
|   .-.  .-.   ' /   .-'"'.  \        (  |        . '            .-,.-~.             .' .._|    .|
|  |  |  |  |  |/   /______\  |        | |        | |            |  .-. |    __      | '      .' |_
|  |  |  |  |  ||   __________|    _   | | .'''-. | |            | |  | | .:-`.'.  __| |__  .'     |
|  |  |  |  |  |\  (          '  .' |  | |/.'''. \. '            | |  | |/ |   \ ||__   __|'-..  .-'
|  |  |  |  |  | \  '-.___..-~. .   | /|  /    | | \ '.         .| |  '- `" __ | |   | |      |  |
|__|  |__|  |__|  `         .'.'.'| |//| |     | |  '. `.____.-'/| |      .'.''| |   | |      |  |
                   `'-.....-.'.'.-'  / | |     | |    `-._____ / | |     / /   | |_  | |      |  '.'
                                 \_.'  | '.    | '.           `  |_|     \ \._,\ '/  | |      |   /
                                       '___)   '___)                      `~~'  `"   |_|      `--´

                                .---.
                                \___  ,-. ,-. .  , ,-. ,-.
                                    \ |-' |   | /  |-' |
                                `---' `-' '   `'   `-' '
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

 The server-side repository.

 Authors: Axel Kittenberger
 License: MIT(Expat), see accompanying 'License'-file

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

/**
| Capsule (just to make jshint happy)
*/
(function(){
"use strict";
if (typeof(window) !== 'undefined') { throw new Error('server.js needs node!'); }

/**
| Imports
*/
var Jools       = require('../shared/jools');
var MeshMashine = require('../shared/meshmashine');
var Meshverse   = require('../shared/meshverse');
var Path        = require('../shared/path');
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
	this.packfiles = [ ];

	this.buildClientConfig();
	this.registerFiles();
	this.buildPack();
	this.buildHTMLs();
	
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
		if (err) { throw err; }
	});
};

/**
| Connects to the database.
*/
Server.prototype.startup = function(_) {
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
	
	log('start', 'Uncompressed pack length is ', this.pack.length);
	this.packgz = zlib.gzip(this.pack, _);
	log('start', 'Compressed pack length is ', this.packgz.length);
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
		return;
	}

	// if not create one
	root = {
		_id  : 'root',
		pass : uid(),
		mail : '',
		code : '',
		icom : 'root'
	};

	this.db.users.insert(root);
	log('start', 'created root pass:', root.pass);
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
| @@ rename this and others to cmdMessage
*/
Server.prototype.message = function(cmd, _) {
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
| Builds the clients config.js file.
*/
Server.prototype.buildClientConfig = function() {
	var k;

	var cconfig = [];
	cconfig.push('var config = {\n');
	cconfig.push('\tdevel   : '  + configSwitch(config.devel, 'client') + ',\n');
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
		cconfig.push('\t\t' + k + ' : ' + configSwitch(config.log[k], 'client'));
	}
	cconfig.push('\n\t}\n');
	cconfig.push('};\n');
	this.cconfig = cconfig.join('');
};

/**
| Registers files to be REST served.
*/
Server.prototype.registerFiles = function() {
	var self = this;
	this.files = {};

	var registerFile = function(path, type, pack, filename) {
		var e = { filename : filename };

		switch (type) {
		case 'html' : e.code = 'utf-8';  e.mime = 'text/html';       break;
		case 'js'   : e.code = 'utf-8';  e.mime = 'text/javascript'; break;
		case 'ico'  : e.code = 'binary'; e.mime = 'image/x-icon';    break;
		default : throw new Error('unknown file type: '+type);
		}
		self.files[path] = e;
		if (pack) { self.packfiles.push({ path: path, filename: filename }); }
	};

	// @@ remove first parameter
	registerFile('/favicon.ico',           'ico',  0, 'icons/hexicon.ico'            );
	registerFile('/testpad.html',          'html', 0, 'client/testpad.html'          );
	registerFile('/testpad.js',            'js',   0, 'client/testpad.js'            );
	registerFile('/jools.js',              'js',   1, 'shared/jools.js'              );
	registerFile('/sha1.js' ,              'js',   1, 'shared/sha1.js'               );
	registerFile('/euclid.js',             'js',   1, 'shared/euclid.js'             );
	registerFile('/fabric.js',             'js',   1, 'client/fabric.js'             );
	registerFile('/theme.js'  ,            'js',   1, 'client/theme.js'              );
	registerFile('/meshverse.js',          'js',   1, 'shared/meshverse.js'          );
	registerFile('/path.js',               'js',   1, 'shared/path.js'               );
	registerFile('/tree.js',               'js',   1, 'shared/tree.js'               );
	registerFile('/sign.js',               'js',   1, 'shared/sign.js'               );
	registerFile('/change.js',             'js',   1, 'shared/change.js'             );
	registerFile('/changex.js',            'js',   1, 'shared/changex.js'            );
	registerFile('/meshmashine.js',        'js',   1, 'shared/meshmashine.js'        );
	registerFile('/iface.js',              'js',   1, 'client/iface.js'              );
	registerFile('/peer.js',               'js',   1, 'client/peer.js'               );
	registerFile('/design/pattern.js',     'js',   1, 'client/design/pattern.js'     );
	registerFile('/design/fontstyles.js',  'js',   1, 'client/design/fontstyles.js'  );
	registerFile('/design/mainboard.js',   'js',   1, 'client/design/mainboard.js'   );
	registerFile('/design/loginboard.js',  'js',   1, 'client/design/loginboard.js'  );
	registerFile('/design/regboard.js',    'js',   1, 'client/design/regboard.js'    );
	registerFile('/design/helpboard.js',   'js',   1, 'client/design/helpboard.js'   );
	registerFile('/caccent.js',            'js',   1, 'client/caccent.js'            );
	registerFile('/curve.js',              'js',   1, 'client/curve.js'              );
	registerFile('/ccustom.js',            'js',   1, 'client/ccustom.js'            );
	registerFile('/cinput.js',             'js',   1, 'client/cinput.js'             );
	registerFile('/clabel.js',             'js',   1, 'client/clabel.js'             );
	registerFile('/cchat.js',              'js',   1, 'client/cchat.js'              );
	registerFile('/cboard.js',             'js',   1, 'client/cboard.js'             );
	registerFile('/ccode/util.js',         'js',   1, 'client/ccode/util.js'         );
	registerFile('/ccode/mainboard.js',    'js',   1, 'client/ccode/mainboard.js'    );
	registerFile('/ccode/helpboard.js',    'js',   1, 'client/ccode/helpboard.js'    );
	registerFile('/ccode/mbleftb.js',      'js',   1, 'client/ccode/mbleftb.js'      );
	registerFile('/ccode/mbleft2b.js',     'js',   1, 'client/ccode/mbleft2b.js'     );
	registerFile('/ccode/mbswitchb.js',    'js',   1, 'client/ccode/mbswitchb.js'    );
	registerFile('/ccode/mbrightb.js',     'js',   1, 'client/ccode/mbrightb.js'     );
	registerFile('/ccode/lbloginb.js',     'js',   1, 'client/ccode/lbloginb.js'     );
	registerFile('/ccode/lbcancelb.js',    'js',   1, 'client/ccode/lbcancelb.js'    );
	registerFile('/ccode/lbpassi.js',      'js',   1, 'client/ccode/lbpassi.js'      );
	registerFile('/ccode/rbcancelb.js',    'js',   1, 'client/ccode/rbcancelb.js'    );
	registerFile('/ccode/rbregb.js',       'js',   1, 'client/ccode/rbregb.js'       );
	registerFile('/ccode/hbhideb.js',      'js',   1, 'client/ccode/hbhideb.js'      );
	registerFile('/switchpanel.js',        'js',   1, 'client/switchpanel.js'        );
	registerFile('/cockpit.js',            'js',   1, 'client/cockpit.js'            );
	registerFile('/action.js',             'js',   1, 'client/action.js'             );
	registerFile('/ovalmenu.js',           'js',   1, 'client/ovalmenu.js'           );
	registerFile('/vpara.js',              'js',   1, 'client/vpara.js'              );
	registerFile('/scrollbar.js',          'js',   1, 'client/scrollbar.js'          );
	registerFile('/vdoc.js',               'js',   1, 'client/vdoc.js'               );
	registerFile('/vitem.js',              'js',   1, 'client/vitem.js'              );
	registerFile('/vnote.js',              'js',   1, 'client/vnote.js'              );
	registerFile('/vlabel.js',             'js',   1, 'client/vlabel.js'             );
	registerFile('/vrelation.js',          'js',   1, 'client/vrelation.js'          );
	registerFile('/vspace.js',             'js',   1, 'client/vspace.js'             );
	registerFile('/browser.js',            'js',   1, 'client/browser.js'            );
	registerFile('/caret.js',              'js',   1, 'client/caret.js'              );
	registerFile('/selection.js',          'js',   1, 'client/selection.js'          );
	registerFile('/shell.js',              'js',   1, 'client/shell.js'              );
};
	

/**
| Builds the javascript pack,
| so the client loads way faster in release mode.
*/
Server.prototype.buildPack = function() {
	log('start', 'Preparing pack');
	this.pack = [ this.cconfig ];
	this.devels = [ '<script src="/config.js" type="text/javascript"></script>' ];

	for(var a = 0, aZ = this.packfiles.length; a < aZ; a++) {
		var pf = this.packfiles[a];
		this.devels.push('<script src="' + pf.path + '" type="text/javascript"></script>');
		this.pack.push(fs.readFileSync(pf.filename));
	}
	this.pack = this.pack.join('\n');

	// uglify
	if (config.uglify) {
		var ast;
		ast = uglify.parser.parse(this.pack);
		ast = uglify.uglify.ast_mangle(ast, {toplevel: true});
		ast = uglify.uglify.ast_lift_variables(ast);
		ast = uglify.uglify.ast_squeeze(ast);
		this.pack = uglify.uglify.gen_code(ast);
	}

	this.packsha1 = sha1.sha1hex(this.pack);
	this.mepacksha1 = '/meshcraft-' + this.packsha1 + '.js';
	log('start', 'pack:', this.mepacksha1);
};


/**
| Builds HTML files
*/
Server.prototype.buildHTMLs = function() {
	// the devel file
	this.devel = fs.readFileSync('client/devel.html') + '';
	this.devel = this.devel.replace(/<!--DEVELPACK.*>/, this.devels.join('\n'));

	// the main html file
	this.main = fs.readFileSync('client/meshcraft.html') + '';
	this.main = this.main.replace(
		/<!--COPACK.*>/,
		'<script src="'+this.mepacksha1+'" type="text/javascript"></script>'
	);
};

/**
| Executes an alter command.
*/
Server.prototype.alter = function(cmd, _) {
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
		if (isArray(chgX))  { throw new Error('Array chgX not yet supported'); } // @@
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
Server.prototype.auth = function(cmd, _) {
	if (!is(cmd.user)) { throw reject('user missing'); }
	if (!is(cmd.pass)) { throw reject('pass missing');  }
	var users = this.$users;

	if (cmd.user === 'visitor') {
		var uid;
		do {
			this.nextVisitor++;
			uid = 'visitor-' + this.nextVisitor;
		}
		while (users[uid]);
		users[uid] = {
			user    : uid,
			pass    : cmd.pass,
			created : Date.now(),
			use     : Date.now()
		};
		return { ok: true, user: uid };
	}

	if (!users[cmd.user]) {
		var val = this.db.users.findOne({ _id : cmd.user}, _);
		if (val === null) { return reject('Username unknown'); }
		users[cmd.user] = val;
	}

	if (users[cmd.user].pass !== cmd.pass) { return reject('Invalid password'); }
	return { ok : true, user: cmd.user };
};

/**
| Executes an register command.
*/
Server.prototype.register = function(cmd, _) {
	if (!is(cmd.user)) { throw reject('user missing'); } // @@ return reject
	if (!is(cmd.pass)) { throw reject('pass missing'); }
	if (!is(cmd.mail)) { throw reject('mail missing'); }
	if (!is(cmd.code)) { throw reject('code missing'); }

	if (cmd.user.substr(0, 7) === 'visitor') {
		throw reject('Username must not start with "visitor"');
	}
	if (cmd.user.length < 4) {
		throw reject('Username too short, min. 4 characters');
	}

	var asw;
	// @@ rename val to something else
	var val = this.db.users.findOne({ _id : cmd.user}, _);
	if (val !== null) {
		return reject('Username already taken');
	}
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

	// @@ remove or use count
	var count = this.db.users.insert({
			_id  : cmd.user,
			pass : cmd.pass,
			mail : cmd.mail,
			code : cmd.code,
			icom : code.comment
	}, _);

	// everything OK so far, creates the user home space
	asw = this.alter({
		time : 0,
		chgX : new Change(
			{ val: { type: 'Space', cope: {}, ranks: [] } },
			{ path : [cmd.user + ':home'] }
		),
		cid  : uid()
	}, _);

	if (asw.ok !== true) {
		throw new Error('Cannot create users home space');
	}

	return { ok: true, user: cmd.user };
};

/**
| Refreshes a users presence timeout.
*/
Server.prototype.refreshPresence = function(user, space) {
	var pres = this.$presences;
	var pu = pres[user];

	if (!pu) {
		pu = pres[user] = { spaces : { } };
	}

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

	if (!pu) {
		pu = pres[user] = { spaces : { } };
	}

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
Server.prototype.update = function(cmd, res, _) {
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
	res.writeHead(200, {'Content-Type': 'application/json'});
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

	// @@ cache change lists to answer the same to multiple clients.
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
		res.writeHead(200, {'Content-Type': 'application/json'});
		res.end(JSON.stringify(asw));
	}
};

/**
| Tests if the user has access to 'space'.
*/
Server.prototype.testAccess = function(user, space) {
	if (user === 'root') { return 'rw' };
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
Server.prototype.get = function(cmd, _) {
	var pass    = cmd.pass;
	var time    = cmd.time;
	var user    = cmd.user;
	var changes = this.changes;
	var cZ      = changes.length;
	
	// checks
	if (this.$users[user].pass !== cmd.pass)
		{ throw reject('wrong password'); }

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
	res.writeHead(code, {'Content-Type': 'text/plain'});
	message = code+' '+message;
	log('web', 'error', code, message);
	res.end(message);
};


/**
| Listens to http requests
*/
Server.prototype.requestListener = function(req, res) {
	var red = url.parse(req.url);
	log('web', req.connection.remoteAddress, red.href);

	switch(red.pathname) {
	case '/'               : return this.webMain   (req, red, res);
	case '/index.html'     : return this.webMain   (req, red, res);
	case '/meshcraft.html' : return this.webMain   (req, red, res);
	case '/devel.html'     : return this.webDevel  (req, red, res);
	case '/mm'             : return this.webAjax   (req, red, res);
	case '/config.js'      : return this.webConfig (req, red, res);
	case this.mepacksha1   : return this.webPack   (req, red, res);
	}

	var f = this.files[red.pathname];
	if (!f) {
		res.writeHead(404, {'Content-Type': 'text/plain'});
		this.webError(res, '404 Bad Reqeust');
		return;
	}

	var self = this;
	fs.readFile(f.filename, function(err, data) {
		if (err) {
			self.webError(res, 500, 'Internal Server Error');
			console.log('Missing client file: '+f.filename);
			return;
		}
		res.writeHead(200, {'Content-Type': f.mime});
		res.end(data, f.code);
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
				if (e.ok !== false) throw e; else asw = e;
			}
			if (asw === null) { return; }
			log('ajax', '->', asw);
			res.writeHead(200, {'Content-Type': 'application/json'});
			res.end(JSON.stringify(asw));
		});
	});
};

/**
| Executes an ajaxCmd
*/
Server.prototype.ajaxCmd = function(cmd, res, _) {
	switch (cmd.cmd) {
	case 'alter'    : return this.alter   (cmd, _);
	case 'auth'     : return this.auth    (cmd, _);
	case 'get'      : return this.get     (cmd, _);
	case 'message'  : return this.message (cmd, _);
	case 'register' : return this.register(cmd, _);
	case 'update'   : return this.update  (cmd, res, _);
	default: return reject('unknown command');
	}
};

/**
| Transmits the config relevant to the client
*/
Server.prototype.webConfig = function(req, red, res) {
	res.writeHead(200, {'Content-Type': 'application/json'});
	res.end(this.cconfig);
};

/**
| Transmits the uglified js package.
*/
Server.prototype.webPack = function(req, red, res) {
	var aenc = req.headers['accept-encoding'];

	if (aenc && aenc.indexOf('gzip') >= 0) {
		// deliver compressed
		res.writeHead(200, {
			'Content-Type'     : 'application/json',
			'Content-Encoding' : 'gzip'
		});
		res.end(this.packgz);
	} else {
		// deliver uncompressed
		res.writeHead(200, {'Content-Type': 'application/json'});
		res.end(this.pack);
	}
};

/**
| Transmits the main html file.
*/
Server.prototype.webMain = function(req, red, res) {
	res.writeHead(200, {'Content-Type': 'text/html'});
	res.end(this.main);
};

/**
| Transmits the devel html file.
*/
Server.prototype.webDevel = function(req, red, res) {
	res.writeHead(200, {'Content-Type': 'text/html'});
	res.end(this.devel);
};

var server = new Server();

})();
