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

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

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
var util        = require('util');
var http        = require('http');
var url         = require('url');
var fs          = require('fs');
//var sleep       = require('sleep'); // TODO remove

var config      = require('./config');

var Jools       = require('./jools');
var MeshMashine = require('./meshmashine');
var Path        = require('./path');
var Patterns    = require('./patterns');
var Tree        = require('./tree');
var Emulate     = require('./emulate');

var Change      = MeshMashine.Change;
var Signature   = MeshMashine.Signature;

var debug       = Jools.debug;
var is          = Jools.is;
var log         = Jools.log;
var reject      = Jools.reject;
var isArray     = Jools.isArray;

/**
| Loads the configuration file
*/
try {
	config = require('./config');
} catch (e) {
	throw new Error('no config.js file found!');
}

/**
| Server
*/
var Server = function() {
	this.files = {};

	this.registerFile('/',                 'html', './meshcraft.html'    );
	this.registerFile('/browser.js',       'js',   './browser.js'        );
	this.registerFile('/emulate.js',       'js',   './emulate.js'        );
	this.registerFile('/fabric.js',        'js',   './fabric.js'         );
	this.registerFile('/index.html',       'html', './meshcraft.html'    );
	this.registerFile('/iface-async.js',   'js',   './iface-async.js'    );
	this.registerFile('/iface-emulate.js', 'js',   './iface-emulate.js'  );
	this.registerFile('/iface-sync.js',    'js',   './iface-sync.js'     );
	this.registerFile('/favicon.ico',      'ico',  './icons/hexicon.ico' );
	this.registerFile('/jools.js',         'js',   './jools.js'          );
	this.registerFile('/meshcraft.html',   'html', './meshcraft.html'    );
	this.registerFile('/meshmashine.js',   'js',   './meshmashine.js'    );
	this.registerFile('/path.js',          'js',   './path.js'           );
	this.registerFile('/patterns.js',      'js',   './patterns.js'       );
	this.registerFile('/peer.js',          'js',   './peer.js'           );
	this.registerFile('/shell.js',         'js',   './shell.js'          );
	this.registerFile('/testpad.html',     'html', './testpad.html'      );
	this.registerFile('/testpad.js',       'js',   './testpad.js'        );
	this.registerFile('/tree.js',          'js',   './tree.js'           );

	this.tree      = new Tree({ type : 'Nexus' }, Patterns.mUniverse);
	this.changes   = [];
	this.upsleep   = {};
	this.nextSleep = 1;

	// startup init
	var asw = this.alter({
		time : 0,
		chgX : new Change(Emulate.src, { path : Emulate.path }),
		cid  : 'startup'
	});

	if (asw.ok !== true) throw new Error('Cannot init Repository');

	var self = this;
	log('start', 'Starting server @ http://' + (config.ip || '*') + '/:' + config.port);
	http.createServer(function(req, res) {
		self.requestListener(req, res);
	}).listen(config.port, config.ip, function() {
		log('start', 'Server running');
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
		if (isArray(chgX))  { throw new Error('TODO Array chgX not yet supported'); } // TODO
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
Server.prototype.registerFile = function(path, type, filename) {
	var e = { filename : filename };

	switch (type) {
	case 'html' : e.code = 'utf-8';  e.mime = 'text/html';       break;
	case 'js'   : e.code = 'utf-8';  e.mime = 'text/javascript'; break;
	case 'ico'  : e.code = 'binary'; e.mime = 'image/x-icon';    break;
	default : throw new Error('unknown file type: '+type);
	}
	this.files[path] = e;
};

/**
| Listens to http requests
*/
Server.prototype.requestListener = function(req, res) {
	var red = url.parse(req.url);
	log('web', req.connection.remoteAddress, red.href);

	if (red.pathname === '/mm') {
		this.ajax(req, red, res);
		return;
	}

	if (red.pathname === '/config.js') {
		this.webConfig(req, red, res);
		return;
	}

	var f = this.files[red.pathname];
	if (!f) {
		res.writeHead(404, {'Content-Type': 'text/plain'});
		this.webError(res, '404 Bad Reqeust');
		return;
	}

	fs.readFile(f.filename, function(err, data) {
		if (err) { this.webError(res, 500, 'Internal Server Error'); }
		res.writeHead(200, {'Content-Type': f.mime});
		res.end(data, f.code);
	});
};


/**
| Handles ajax requests to the MeshMashine.
*/
Server.prototype.ajax = function(req, red, res) {
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
		case 'alter':  asw = this.alter (cmd, res); break;
		case 'get':    asw = this.get   (cmd, res); break;
		case 'update': asw = this.update(cmd, res); break;
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
	res.write('var config = {\n');
	res.write('\tdevel : '+ Jools.configSwitchClient(config.devel) + ',\n');
	res.write('\tpuffed : ' + Jools.configSwitchClient(config.puffed) + ',\n');
	res.write('\tlog : {\n');
	for(var k in config.log) {
		res.write('\t\t'+k+' : '+Jools.configSwitchClient(config.log[k])+',\n');
	}
	res.write('\t}\n');
	res.end('};\n');
};

var server = new Server();

})();
