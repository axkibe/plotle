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

/*if (config.proxy) {
	var httpProxy = require('http-proxy');
	var proxy = new httpProxy.RoutingProxy();
}*/

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
	this.$files = {};
	this.$packList = [];

	this.registerFiles();

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
		if (err) { debug(err); throw err; }
	});
};

/**
| Connects to the database.
*/
Server.prototype.startup = function(_) {
	this.prepareFiles(_);

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
	return cconfig.join('');
};
	
/**
| Register a files to be REST served.
|
| opts :
'   p ... include in pack
|   m ... keep in memory
|   c ... serve as cached
*/
Server.prototype.registerFile = function(filename, opts) {
	var path = filename.split('/');
	path.shift();
	path = '/' + path.join('/');
	
	var f = {
		filename : filename,
		cache    : opts.indexOf('c') >= 0,
		code     : null,
		gzip     : null,
		mime     : null,
		memory   : opts.indexOf('m') >= 0,
		pack     : opts.indexOf('p') >= 0,
		raw      : null
	};

	var type = filename.split('.')[1];
	switch (type) {
	case 'html' : f.code = 'utf-8';  f.mime = 'text/html';               break;
	case 'js'   : f.code = 'utf-8';  f.mime = 'text/javascript';         break;
	case 'ico'  : f.code = 'binary'; f.mime = 'image/x-icon';            break;
	case 'css'  : f.code = 'utf-8';  f.mime = 'text/css';                break;
	case 'eot'  : f.code = 'binary'; f.mime = 'font/eot';                break;
	case 'svg'  : f.code = 'utf-8';  f.mime = 'image/svg+xml';           break;
	case 'ttf'  : f.code = 'binary'; f.mime = 'font/ttf';                break;
	case 'otf'  : f.code = 'binary'; f.mime = 'font/otf';                break;
	case 'woff' : f.code = 'binary'; f.mime = 'application/x-font-woff'; break;
	default : throw new Error('unknown file type: '+type);
	}

	if (f.pack) { this.$packList.push({file: f, path: path}); }

	this.$files[path] = f;
};

/**
| Registers files to be REST served.
*/
Server.prototype.registerFiles = function() {
	this.registerFile('icons/favicon.ico',           'm' );
	this.registerFile('client/testpad.html',         ''  );
	this.registerFile('client/testpad.js',           ''  );
	this.registerFile('client/fonts/webfont.js',     'm' );

	this.registerFile('shared/jools.js',             'p' );
	this.registerFile('shared/sha1.js',              'p' );
	this.registerFile('shared/euclid/point.js',      'p' );
	this.registerFile('shared/euclid/rect.js',       'p' );
	this.registerFile('shared/euclid/margin.js',     'p' );
	this.registerFile('client/fabric/fabric.js',     'p' );
	this.registerFile('client/fabric/measure.js',    'p' );
	this.registerFile('client/fabric/rect.js',       'p' );
	this.registerFile('client/fabric/bezirect.js',   'p' );
	this.registerFile('client/fabric/ovalslice.js',  'p' );
	this.registerFile('client/fabric/ovalflower.js', 'p' );
	this.registerFile('client/fabric/line.js',       'p' );
	this.registerFile('client/theme.js',             'p' );
	this.registerFile('client/fabric/view.js',       'p' );
	this.registerFile('shared/meshverse.js',         'p' );
	this.registerFile('shared/path.js',              'p' );
	this.registerFile('shared/tree.js',              'p' );
	this.registerFile('shared/sign.js',              'p' );
	this.registerFile('shared/change.js',            'p' );
	this.registerFile('shared/changex.js',           'p' );
	this.registerFile('shared/meshmashine.js',       'p' );
	this.registerFile('client/iface.js',             'p' );
	this.registerFile('client/peer.js',              'p' );
	this.registerFile('client/design/pattern.js',    'p' );
	this.registerFile('client/design/fontstyles.js', 'p' );
	this.registerFile('client/design/mainboard.js',  'p' );
	this.registerFile('client/design/loginboard.js', 'p' );
	this.registerFile('client/design/regboard.js',   'p' );
	this.registerFile('client/design/helpboard.js',  'p' );
	this.registerFile('client/caccent.js',           'p' );
	this.registerFile('client/curve.js',             'p' );
	this.registerFile('client/ccustom.js',           'p' );
	this.registerFile('client/cinput.js',            'p' );
	this.registerFile('client/clabel.js',            'p' );
	this.registerFile('client/cchat.js',             'p' );
	this.registerFile('client/cboard.js',            'p' );
	this.registerFile('client/ccode/util.js',        'p' );
	this.registerFile('client/ccode/mainboard.js',   'p' );
	this.registerFile('client/ccode/helpboard.js',   'p' );
	this.registerFile('client/ccode/mbleftb.js',     'p' );
	this.registerFile('client/ccode/mbleft2b.js',    'p' );
	this.registerFile('client/ccode/mbswitchb.js',   'p' );
	this.registerFile('client/ccode/mbrightb.js',    'p' );
	this.registerFile('client/ccode/mbzoomplusb.js', 'p' );
	this.registerFile('client/ccode/mbzoomnullb.js', 'p' );
	this.registerFile('client/ccode/mbzoomminusb.js','p' );
	this.registerFile('client/ccode/lbloginb.js',    'p' );
	this.registerFile('client/ccode/lbcloseb.js',    'p' );
	this.registerFile('client/ccode/lbpassi.js',     'p' );
	this.registerFile('client/ccode/rbcloseb.js',    'p' );
	this.registerFile('client/ccode/rbregb.js',      'p' );
	this.registerFile('client/ccode/hbhideb.js',     'p' );
	this.registerFile('client/switchpanel.js',       'p' );
	this.registerFile('client/cockpit.js',           'p' );
	this.registerFile('client/action.js',            'p' );
	this.registerFile('client/ovalmenu.js',          'p' );
	this.registerFile('client/vpara.js',             'p' );
	this.registerFile('client/scrollbar.js',         'p' );
	this.registerFile('client/vdoc.js',              'p' );
	this.registerFile('client/vitem.js',             'p' );
	this.registerFile('client/vnote.js',             'p' );
	this.registerFile('client/vlabel.js',            'p' );
	this.registerFile('client/vrelation.js',         'p' );
	this.registerFile('client/vspace.js',            'p' );
	this.registerFile('client/browser.js',           'p' );
	this.registerFile('client/caret.js',             'p' );
	this.registerFile('client/selection.js',         'p' );
	this.registerFile('client/shell.js',             'p' );
	this.registerFile('client/fontloader.js',        'p' );

	this.registerFile('client/fonts/dejavu.css',                          'm' );
	this.registerFile('client/fonts/dejavusans-boldoblique-webfont.eot',  'm' );
	this.registerFile('client/fonts/dejavusans-boldoblique-webfont.svg',  'm' );
	this.registerFile('client/fonts/dejavusans-boldoblique-webfont.ttf',  'm' );
	this.registerFile('client/fonts/dejavusans-boldoblique-webfont.woff', 'm' );
	this.registerFile('client/fonts/dejavusans-bold-webfont.eot',         'm' );
	this.registerFile('client/fonts/dejavusans-bold-webfont.svg',         'm' );
	this.registerFile('client/fonts/dejavusans-bold-webfont.ttf',         'm' );
	this.registerFile('client/fonts/dejavusans-bold-webfont.woff',        'm' );
	this.registerFile('client/fonts/dejavusans-oblique-webfont.eot',      'm' );
	this.registerFile('client/fonts/dejavusans-oblique-webfont.svg',      'm' );
	this.registerFile('client/fonts/dejavusans-oblique-webfont.ttf',      'm' );
	this.registerFile('client/fonts/dejavusans-oblique-webfont.woff',     'm' );
	this.registerFile('client/fonts/dejavusans-webfont.eot',              'm' );
	this.registerFile('client/fonts/dejavusans-webfont.svg',              'm' );
	this.registerFile('client/fonts/dejavusans-webfont.ttf',              'm' );
	this.registerFile('client/fonts/dejavusans-webfont.woff',             'm' );
};

/**
| Builds the file memory
| Also builds the javascript pack,
| so the client loads way faster in release mode.
*/
Server.prototype.prepareFiles = function(_) {
	var f;
	log('start', 'Preparing files');

	for(f in this.$files) {
		if (f.filename === null) { continue; }
		if (!f.memory && !f.pack) { continue; }
		f.raw = fs.readFile(f.filename, _);
	}
	
	var cconfig = this.buildClientConfig();
	this.$files['/config.js'] = {
		filename : null,
		cache    : false,
		code     : 'utf-8',
		mime     : 'text/javascript',
		memory   : true,
		raw      : cconfig,
		gzip     : null,
		pack     : false
	};

	var pack = [ cconfig ];
	var packgz = null;
	var devels = [ '<script src="/config.js" type="text/javascript"></script>' ];

	for(var a = 0, aZ = this.$packList.length; a < aZ; a++) {
		f = this.$packList[a];
		devels.push('<script src="' + f.path + '" type="text/javascript"></script>');
		pack.push(fs.readFile(f.file.filename, _));
	}
	pack = pack.join('\n');

	// uglify pack
	if (config.uglify) {
		var ast;
		ast = uglify.parser.parse(pack);
		ast = uglify.uglify.ast_mangle(ast, {toplevel: true});
		ast = uglify.uglify.ast_lift_variables(ast);
		ast = uglify.uglify.ast_squeeze(ast);
		pack = uglify.uglify.gen_code(ast);
	}

	var packsha1 = sha1.sha1hex(pack);
	var mepacksha1 = '/meshcraft-' + packsha1 + '.js';
	log('start', 'pack:', this.mepacksha1);

	this.$files[mepacksha1] = {
		filename :  null,
		cache    :  true,
		code     : 'utf-8',
		mime     : 'text/javascript',
		memory   :  true,
		raw      :  pack,
		gzip     :  null,
		pack     :  false
	};
	
	// the devel file
	var devel = fs.readFile('client/devel.html', _) + '';
	devel = devel.replace(/<!--DEVELPACK.*>/, devels.join('\n'));
	
	this.$files['/devel.html'] = {
		filename :  null,
		cache    :  false,
		code     : 'utf-8',
		mime     : 'text/html',
		memory   :  false,
		raw      :  devel,
		gzip     :  null,
		pack     :  false
	};

	// the main html file
	var main = fs.readFile('client/meshcraft.html', _) + '';
	main = main.replace(
		/<!--COPACK.*>/,
		'<script src="'+mepacksha1+'" type="text/javascript"></script>'
	);
	
	this.$files['/meshcraft.html'] =
	this.$files['/index.html'] =
	this.$files['/'] = {
		filename :  null,
		cache    :  false,
		code     : 'utf-8',
		memory   :  false, // TODO
		mime     : 'text/html',
		raw      :  main,
		gzip     :  null,
		pack     :  false
	};

	for(var path in this.$files) {
		f = this.$files[path];
		if (!f.memory) { continue; }
		f.gzip = zlib.gzip(f.raw, _);
	}
	
	log('start', 'Uncompressed pack length is ', this.$files[mepacksha1].raw.length);
	log('start', 'Compressed pack length is ', this.$files[mepacksha1].gzip.length);
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
	if (!is(cmd.user)) { throw reject('user missing'); } // TODO return reject
	if (!is(cmd.pass)) { throw reject('pass missing'); }
	if (!is(cmd.mail)) { throw reject('mail missing'); }
	if (!is(cmd.code)) { throw reject('code missing'); }

	if (cmd.user.substr(0, 7) === 'visitor') {
		throw reject('Username must not start with "visitor"');
	}
	if (cmd.user.length < 4) {
		throw reject('Username too short, min. 4 characters');
	}

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
/*
Server.prototype.webProxy = function(req, res) {
	var host    = req.headers.host;
	if (!config.proxy)
		{ return false; }

	var p = config.proxy[host];
	debug(p);
	if (!p)
		{ return false; }

	log('web', 'proxy', p.host, '.', p.port, req.url);

	proxy.proxyRequest(req, res, {
		host: p.host,
		port: p.port
	});

	return true;
};
*/

/**
| Listens to http requests
*/
Server.prototype.requestListener = function(req, res) {
	var red = url.parse(req.url);

	//if (this.webProxy(req, res)) { return; }

	log('web', req.connection.remoteAddress, red.href);

	if (red.pathname === '/mm')
		{ return this.webAjax(req, red, res); }

	var f = this.$files[red.pathname];
	if (!f) {
		res.writeHead(404, {
			'Content-Type'  : 'text/plain',
			'Cache-Control' : 'no-cache',
			'Date'          : new Date().toUTCString()
		});
		this.webError(res, '404 Bad Reqeust');
		return;
	}

	if (f.raw) {
		var aenc = f.gzip && req.headers['accept-encoding'];
		var header = {
			'Content-Type'     : f.mime,
			'Cache-Control'    : f.cache ? 'max-age=31536000' : 'no-cache',
			'Date'             : new Date().toUTCString()
		};
		if (aenc && aenc.indexOf('gzip') >= 0) {
			// deliver compressed
			header['Content-Encoding'] = 'gzip';
			res.writeHead(200, header);
			res.end(f.gzip, 'binary');
		} else {
			// deliver uncompressed
			res.writeHead(200, header);
			res.end(f.raw, f.code);
		}
		return;
	}

	var self = this;
	fs.readFile(f.filename, function(err, data) {
		if (err) {
			self.webError(res, 500, 'Internal Server Error');
			console.log('Missing client file: '+f.filename);
			return;
		}
		res.writeHead(200, {
			'Content-Type'  : f.mime,
			'Date'          : new Date().toUTCString()
		});
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

/**
| Transmits the uglified js package.
*/
/*
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
};*/

var server = new Server();

})();
