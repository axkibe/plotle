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


 +++ Server +++
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
| Imports
*/
var util        = require('util');
var http        = require('http');
var url         = require('url');
var fs          = require('fs');

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

	this.registerFile('/',               'html', './meshcraft.html'   );
	this.registerFile('/browser.js',     'js',   './browser.js'       );
	this.registerFile('/emulate.js',     'js',   './emulate.js'       );
	this.registerFile('/fabric.js',      'js',   './fabric.js'        );
	this.registerFile('/index.html',     'js',   './meshcraft.html'   );
	this.registerFile('/favicon.ico',    'ico',  './icons/hexicon.ico');
	this.registerFile('/jools.js',       'js',   './jools.js'         );
	this.registerFile('/meshcraft.html', 'html', './meshcraft.html'   );
	this.registerFile('/meshmashine.js', 'js',   './meshmashine.js'   );
	this.registerFile('/path.js',        'js',   './path.js'          );
	this.registerFile('/patterns.js',    'js',   './patterns.js'      );
	this.registerFile('/peer.js',        'js',   './peer.js'          );
	this.registerFile('/shell.js',       'js',   './shell.js'         );
	this.registerFile('/testpad.html',   'html', './testpad.html'     );
	this.registerFile('/testpad.js',     'js',   './testpad.js'       );
	this.registerFile('/tree.js',        'js',   './tree.js'          );

	this.tree    = new Tree({ type : 'Nexus' }, Patterns.mUniverse);
	this.history = [];

	// startup init
	var asw = this.alter({
		time : 0,
		src  : Emulate.src,
		trg  : { path : new Path(Emulate.path) }
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
Server.prototype.alter = function(cmd) {
	if (!is(cmd.time)) { throw reject('time missing'); }
	if (!is(cmd.src))  { throw reject('src missing');  }
	if (!is(cmd.trg))  { throw reject('trg missing');  }

	var time = cmd.time;
	if (time === -1) { time = this.history.length; }
	if (!(time >= 0 && time <= this.history.length)) { throw reject('invalid time'); }

	var chgX;
	try {
		if (cmd.src.path) { cmd.src.path = new Path(cmd.src.path); }
		if (cmd.trg.path) { cmd.trg.path = new Path(cmd.trg.path); }
		chgX = new Change( new Signature(cmd.src), new Signature(cmd.trg) );
	} catch(e) {
		throw reject('invalid cmd: '+e.message);
	}

	if (time < this.history.length - 1) {
		chgX = MeshMashine.tfxChange(chgX, this.history, time, this.history.length);
	}

	var r = MeshMashine.changeTree(this.tree, chgX);
	this.tree = r.tree;

	chgX      = r.chgX;
	for(var a = 0, aZ = chgX.length; a < aZ; a++) {
		this.history.push(chgX[a]);
	}

	return { ok: true, chgX: chgX };
};

/**
| Executes a get command.
*/
Server.prototype.get = function(cmd) {
	if (!is(cmd.time)) { throw reject('time missing'); }
	if (!is(cmd.path)) { throw reject('path missing'); }

	var time = cmd.time;
	if (time === -1) { time = this.history.length; }
	if (!(time >= 0 && time <= this.history.length)) { throw reject('invalid time'); }

	debug('GET', time, this.history.length);
	var tree = this.tree;
	for (var t = this.history.length - 1; t >= time; t--) {
		var r = MeshMashine.changeTree(tree, this.history[t].reverse());
		tree = r.tree;
	}
	debug('TREEE', tree);

	var node;
	try {
		var path = new Path(cmd.path);
		node = tree.getPath(path);
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
		var asw;
		try {
			switch (cmd.cmd) {
			case 'alter':  asw = self.alter(cmd); break;
			case 'get':    asw = self.get(cmd);   break;
			case 'update': throw new Error('TODO');
			default:
				self.webError(res, 400, 'unknown command "'+cmd.cmd+'"');
				return;
			}
		} catch (e) {
			console.log(util.inspect(e));
			if (e.ok !== false) throw e; else asw = e;
		}

		log('ajax', '->', asw);
		res.writeHead(200, {'Content-Type': 'application/json'});
		res.end(JSON.stringify(asw));
	});
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
