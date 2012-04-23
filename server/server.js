#!/usr/local/bin/node
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
| Delays in coming ajax requests by n milliseconds.
| Issued for development to simulate slow network connections.
| Normally this should be 0;
*/
var ajaxInDelay = 0;

/**
| Imports
*/
var Emulate     = require('./emulate');
var Jools       = require('../shared/jools');
var MeshMashine = require('../shared/meshmashine');
var Meshverse   = require('../shared/meshverse');
var Path        = require('../shared/path');
var Tree        = require('../shared/tree');
var config      = require('../config');
var fs          = require('fs');
var http        = require('http');
var sha1        = require('../shared/sha1');
var uglify      = config.uglify && require('uglify-js');
var url         = require('url');
var util        = require('util');
var zlib        = require('zlib');

/**
| Shortcuts
*/
var Change      = MeshMashine.Change;
var debug       = Jools.debug;
var is          = Jools.is;
var isArray     = Jools.isArray;
var log         = Jools.log;
var reject      = Jools.reject;

/**
| Server
*/
var Server = function() {
	this.files = {};
	this.packfiles = [ { path: '/config.js', filename: null } ];

	// client config
	var cconfig = [];
	cconfig.push('var config = {\n');
	cconfig.push('\tdevel : '  + Jools.configSwitchClient(config.devel) + ',\n');
	cconfig.push('\tpuffed : ' + Jools.configSwitchClient(config.puffed) + ',\n');
	cconfig.push('\tlog : {\n');
	for(var k in config.log) {
		cconfig.push('\t\t'+k+' : '+Jools.configSwitchClient(config.log[k])+',\n');
	}
	cconfig.push('\t}\n');
	cconfig.push('};\n');
	this.cconfig = cconfig.join('');

	// all other files
	this.registerFile('/favicon.ico',      'ico',  0, 'icons/hexicon.ico'     );
	this.registerFile('/testpad.html',     'html', 0, 'client/testpad.html'   );
	this.registerFile('/testpad.js',       'js',   0, 'client/testpad.js'     );

	this.registerFile('/jools.js',         'js',   1, 'shared/jools.js'       );
	this.registerFile('/fabric.js',        'js',   1, 'client/fabric.js'      );
	this.registerFile('/theme.js'  ,       'js',   1, 'client/theme.js'       );
	this.registerFile('/meshverse.js',     'js',   1, 'shared/meshverse.js'   );
	this.registerFile('/path.js',          'js',   1, 'shared/path.js'        );
	this.registerFile('/tree.js',          'js',   1, 'shared/tree.js'        );
	this.registerFile('/sign.js',          'js',   1, 'shared/sign.js'        );
	this.registerFile('/meshmashine.js',   'js',   1, 'shared/meshmashine.js' );
	this.registerFile('/iface.js',         'js',   1, 'client/iface.js'       );
	this.registerFile('/peer.js',          'js',   1, 'client/peer.js'        );
	this.registerFile('/deverse.js',       'js',   1, 'client/deverse.js'     );
	this.registerFile('/design.js',        'js',   1, 'client/design.js'      );
	this.registerFile('/caccent.js',       'js',   1, 'client/caccent.js'     );
	this.registerFile('/curve.js',         'js',   1, 'client/curve.js'       );
	this.registerFile('/ccustom.js',       'js',   1, 'client/ccustom.js'     );
	this.registerFile('/cinput.js',        'js',   1, 'client/cinput.js'      );
	this.registerFile('/clabel.js',        'js',   1, 'client/clabel.js'      );
	this.registerFile('/cmeth.js',         'js',   1, 'client/cmeth.js'       );
	this.registerFile('/cboard.js',        'js',   1, 'client/cboard.js'      );
	this.registerFile('/cockpit.js',       'js',   1, 'client/cockpit.js'     );
	this.registerFile('/action.js',        'js',   1, 'client/action.js'      );
	this.registerFile('/ovalmenu.js',      'js',   1, 'client/ovalmenu.js'    );
	this.registerFile('/vpara.js',         'js',   1, 'client/vpara.js'       );
	this.registerFile('/scrollbar.js',     'js',   1, 'client/scrollbar.js'   );
	this.registerFile('/vdoc.js',          'js',   1, 'client/vdoc.js'        );
	this.registerFile('/vitem.js',         'js',   1, 'client/vitem.js'       );
	this.registerFile('/vnote.js',         'js',   1, 'client/vnote.js'       );
	this.registerFile('/vlabel.js',        'js',   1, 'client/vlabel.js'      );
	this.registerFile('/vrelation.js',     'js',   1, 'client/vrelation.js'   );
	this.registerFile('/vspace.js',        'js',   1, 'client/vspace.js'      );
	this.registerFile('/browser.js',       'js',   1, 'client/browser.js'     );
	this.registerFile('/caret.js',         'js',   1, 'client/caret.js'       );
	this.registerFile('/selection.js',     'js',   1, 'client/selection.js'   );
	this.registerFile('/shell.js',         'js',   1, 'client/shell.js'       );

	log('start', 'Preparing pack');
	this.pack = [ this.cconfig ];
	var devels = [ '<script src="/config.js" type="text/javascript"></script>' ];

	// position 0 is the generated config file
	for(var a = 1, aZ = this.packfiles.length; a < aZ; a++) {
		var pf = this.packfiles[a];
		devels.push('<script src="' + pf.path + '" type="text/javascript"></script>');
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

	// the devel file
	this.devel = fs.readFileSync('client/devel.html') + '';
	this.devel = this.devel.replace(/<!--DEVELPACK.*>/, devels.join('\n'));

	// the main html file
	this.main = fs.readFileSync('client/meshcraft.html') + '';
	this.main = this.main.replace(
		/<!--COPACK.*>/,
		'<script src="'+this.mepacksha1+'" type="text/javascript"></script>'
	);

	// visitors
	this.nextVisitor = 1001;
	this.visitors = {};

	this.tree      = new Tree({ type : 'Nexus' }, Meshverse);
	this.changes   = [];
	this.upsleep   = {};
	this.nextSleep = 1;

	// startup init
	var asw = this.alter({
		time : 0,
		chgX : new Change(
			{ val: { type: 'Space', cope: {}, ranks: [] } },
			{ path : ['welcome'] }
		),
		cid  : 'startup'
	});

	if (asw.ok !== true) throw new Error('Cannot init Repository');

	var self = this;

	zlib.gzip(this.pack, function(err, packgz) {
		if (err) throw new Error('GZIP of pack failed');
		self.packgz = packgz;
		log('start', 'Compressed pack length is ', packgz.length);

		log('start', 'Starting server @ http://' + (config.ip || '*') + '/:' + config.port);
		http.createServer(function(req, res) {
			self.requestListener(req, res);
		}).listen(config.port, config.ip, function() {
			log('start', 'Server running');
		});
	});
};

/**
| Executes an alter command.
*/
Server.prototype.alter = function(cmd, res) {
	var time = cmd.time;
	var chgX = cmd.chgX;
	var cid  = cmd.cid;

	var changes  = this.changes;
	var changesZ = changes.length;

	// some tests
	if (!is(time)) { throw reject('time missing'); }
	if (!is(chgX)) { throw reject('chgX missing');  }
	if (!is(cid))  { throw reject('cid missing');  }
	if (time === -1)  { time = changesZ; }
	if (!(time >= 0 && time <= changesZ)) { throw reject('invalid time'); }

	// fits the cmd into data structures
	try {
		if (isArray(chgX))  { throw new Error('Array chgX not yet supported'); } // @@
		chgX = new Change(chgX);
	} catch(e) {
		throw reject('invalid cmd: '+e.message);
	}

	// translates the changes if not most recent
	for (var a = time; a < changesZ; a++) {
		chgX = MeshMashine.tfxChgX(chgX, changes[a].chgX);
	}

	// applies the changes
	if (chgX !== null && chgX.length > 0) {
		var r = MeshMashine.changeTree(this.tree, chgX);
		this.tree = r.tree;
		chgX      = r.chgX;
		if (chgX !== null && chgX.length > 0) {
			changes.push({ cid : cmd.cid, chgX : chgX });
		}
	}

	var self = this;
	process.nextTick(function() { self.wakeAll(); });

	return { ok: true, chgX: chgX };
};

/**
| Executes an auth command.
*/
Server.prototype.auth = function(cmd, res) {
	var user = cmd.user;
	var pass = cmd.pass;
	if (!is(user)) { throw reject('user missing'); }
	if (!is(pass)) { throw reject('pass missing');  }

	if (user === 'visitor') {
		while (this.visitors[this.nextVisitor]) { this.nextVisitor++; }
		var nv = this.nextVisitor;
		var v = {
			user    : 'visitor-' + nv,
			pass    : cmd.pass,
			created : Date.now(),
			use     : Date.now()
		};
		this.visitors[nv] = v;
		return { ok: true, user: v.user };
	}

	throw reject('non visitor users yet unsupported');
	//return { ok: true };
};

/**
| Gets new changes or waits for them.
*/
Server.prototype.update = function(cmd, res) {
	var time     = cmd.time;
	var changes  = this.changes;
	var changesZ = changes.length;

	// some tests
	if (!is(time))    { throw reject('time missing'); }
	if (!(time >= 0 && time <= changesZ)) { throw reject('invalid time'); }

	if (time < changesZ) {
		// immediate answer
		var chga = [];
		for (var c = time; c < changesZ; c++) {
			chga.push(changes[c]);
		}

		return { ok : true, time: time, timeZ: changesZ, chgs : chga };
	} else {
		// sleep
		var sleepID = '' + this.nextSleep++;
		var timerID = setTimeout(this.expireSleep, 60000, this, sleepID);
		this.upsleep[sleepID] = {
			timerID : timerID,
			time    : time,
			res     : res
		};
		return null;
	}
};

/**
| A sleeping update expired.
*/
Server.prototype.expireSleep = function(self, sleepID) {
	var changesZ = self.changes.length;
	var sleep = self.upsleep[sleepID];
	delete self.upsleep[sleepID];

	var asw = { ok : true, time: sleep.time, timeZ : changesZ, chgs : null};
	var res = sleep.res;
	log('ajax', '->', asw);
	res.writeHead(200, {'Content-Type': 'application/json'});
	res.end(JSON.stringify(asw));
};

/**
| Wakes up any sleeping updates and gives them data if applicatable.
*/
Server.prototype.wakeAll = function() {
	var sleepKeys = Object.keys(this.upsleep);
	var changes   = this.changes;
	var changesZ  = changes.length;

	// @@ cache change lists to answer the same to multiple clients.
	for(var a = 0, aZ = sleepKeys.length; a < aZ; a++) {
		var sKey = sleepKeys[a];
		var sleep = this.upsleep[sKey];
		clearTimeout(sleep.timerID);

		var chga = [];
		for (var c = sleep.time; c < changesZ; c++) {
			chga.push(changes[c]);
		}

		var asw = { ok : true, time: sleep.time, timeZ: changesZ, chgs : chga };
		var res = sleep.res;
		log('ajax', '->', asw);
		res.writeHead(200, {'Content-Type': 'application/json'});
		res.end(JSON.stringify(asw));
	}

	this.upsleep = {};
};

/**
| Executes a get command.
*/
Server.prototype.get = function(cmd, res) {
	var changes  = this.changes;
	var changesZ = changes.length;
	var time     = cmd.time;

	// checks
	if (!is(cmd.time)) { throw reject('time missing'); }
	if (!is(cmd.path)) { throw reject('path missing'); }
	if (time === -1)   { time = changesZ; }
	if (!(time >= 0 && time <= changesZ)) { throw reject('invalid time'); }

	// if the requested data is in the past go back in time
	var tree = this.tree;
	for (var a = changesZ - 1; a >= time; a--) {
		var chgX = changes[a].chgX;
		for (var b = 0; b < chgX.length; b++) {
			var r = MeshMashine.changeTree(tree, chgX[b].reverse());
			tree = r.tree;
		}
	}

	// returns the path requested
	var node;
	try {
		node = tree.getPath(new Path(cmd.path));
	} catch(e) {
		throw reject('cannot get path: '+e.message);
	}

	return { ok: true, time : time, node: node };
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
| Registers a file for serving.
*/
Server.prototype.registerFile = function(path, type, pack, filename) {
	var e = { filename : filename };

	switch (type) {
	case 'html' : e.code = 'utf-8';  e.mime = 'text/html';       break;
	case 'js'   : e.code = 'utf-8';  e.mime = 'text/javascript'; break;
	case 'ico'  : e.code = 'binary'; e.mime = 'image/x-icon';    break;
	default : throw new Error('unknown file type: '+type);
	}
	this.files[path] = e;
	if (pack) { this.packfiles.push({ path: path, filename: filename }); }
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

	req.on('data', function(chunk) {
		data.push(chunk);
	});

	req.on('end', function() {
		var query = data.join('');
		log('ajax', '<-', query);
		var cmd;
		try {
			cmd = JSON.parse(query);
		} catch (err) {
			self.webError(res, 400, 'Not valid JSON');
			return;
		}

		if (ajaxInDelay === 0) {
			self.ajaxCmd(cmd, res);
		} else {
			setTimeout(
				function(self, cmd, res) { self.ajaxCmd(cmd, res); },
				ajaxInDelay,
				self, cmd, res
			);
		}
	});
};

/**
| Executes an ajaxCmd
*/
Server.prototype.ajaxCmd = function(cmd, res) {
	var asw;
	try {
		switch (cmd.cmd) {
		case 'alter'  : asw = this.alter (cmd, res); break;
		case 'auth'   : asw = this.auth  (cmd, res); break;
		case 'get'    : asw = this.get   (cmd, res); break;
		case 'update' : asw = this.update(cmd, res); break;
		default:
			this.webError(res, 400, 'unknown command "'+cmd.cmd+'"');
			return;
		}
	} catch (e) {
		console.log(util.inspect(e));
		if (e.ok !== false) throw e; else asw = e;
	}

	if (asw !== null) {
		log('ajax', '->', asw);
		res.writeHead(200, {'Content-Type': 'application/json'});
		res.end(JSON.stringify(asw));
	}
	// else assume sleeping call
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
