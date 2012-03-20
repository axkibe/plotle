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
| Capsule
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


var debug  = Jools.debug;
var log    = Jools.log;
var reject = Jools.reject;

/**
| Loads the configuration file
|
| To listen for example on all interfaces on port 80 'config.js'
| should look like this:
| ----------------------
| module.exports = {
|     ip   : null,
|     port : 80,
| };
| ----------------------
*/
try {
	config = require('./config');
} catch (e) {
	console.log(true, 'no config found, defaulting to localhost:8833');
	config = {
		ip    : '127.0.0.1',
		port  : 8833,
		log   : {}
	};
}

/**
| Startup
*/
var mm;
(function() {
	var tree = new Tree({ type : 'Nexus' }, Patterns.mUniverse);
	mm = new MeshMashine(tree);

	// startup init
	var src = Emulate.src;
	var trg = { path: new Path(Emulate.path) };
	var asw = mm.alter(0, src, trg);
	if (asw.ok !== true) throw new Error('Cannot init Repository');
})();

/**
| Returns a registery for a file to be served.
*/
var register = function(type, filename) {
	switch (type) {
	case 'html' : return { file: filename, mime: 'text/html',       code: 'utf-8'  };
	case 'js'   : return { file: filename, mime: 'text/javascript', code: 'utf-8'  };
	case 'ico'  : return { file: filename, mime: 'image/x-icon',    code: 'binary' };
	default : throw new Error('unknown file type: '+type);
	}
};

/**
| Files served.
*/
var content = {
	'/'               : register('html', './meshcraft.html'    ),
	'/browser.js'     : register('js',   './browser.js'        ),
	'/emulate.js'     : register('js',   './emulate.js'        ),
	'/fabric.js'      : register('js',   './fabric.js'         ),
	'/index.html'     : register('js',   './meshcraft.html'    ),
	'/favicon.ico'    : register('ico',  './icons/hexicon.ico' ),
	'/jools.js'       : register('js',   './jools.js'          ),
	'/meshcraft.html' : register('html', './meshcraft.html'    ),
	'/meshmashine.js' : register('js',   './meshmashine.js'    ),
	'/path.js'        : register('js',   './path.js'           ),
	'/patterns.js'    : register('js',   './patterns.js'       ),
	'/peer.js'        : register('js',   './peer.js'           ),
	'/shell.js'       : register('js',   './shell.js'          ),
	'/testpad.html'   : register('html', './testpad.html'      ),
	'/testpad.js'     : register('js',   './testpad.js'        ),
	'/tree.js'        : register('js',   './tree.js'           )
};

/**
| Logs and returns a web error
*/
function webError(res, code, message) {
	res.writeHead(code, {'Content-Type': 'text/plain'});
	message = code+' '+message;
	log('web', 'err', message);
	res.end(message);
}

/**
| Handles an Ajax request to the MeshMashine.
*/
var mmAjax = function(req, red, res) {
	var data = [];
	if (req.method !== 'POST') {
		webError(res, 400, 'Must use POST');
		return;
	}
	req.on('data', function(chunk) {
		data.push(chunk);
	});
	req.on('end', function() {
		var query = data.join('');
		log('ajax', 'in ', query);
		var cmd;
		try {
			cmd = JSON.parse(query);
		} catch (err) {
			webError(res, 400, 'Not valid JSON');
			return;
		}
		var asw;
		try {
			switch (cmd.cmd) {
			case 'alter':
				if (!cmd.src) { throw reject('cmd.src missing'); }
				if (!cmd.trg) { throw reject('cmd.trg missing'); }
				if (cmd.src.path) cmd.src.path = new Path(cmd.src.path);
				if (cmd.trg.path) cmd.trg.path = new Path(cmd.trg.path);
				asw = mm.alter(cmd.time, cmd.src, cmd.trg);
				break;
			case 'get':
				if (!cmd.path) {
					webError(res, 400, 'cmd get requires .path');
					break;
				}
				var path = new Path(cmd.path);
				asw = mm.get(cmd.time, path);
				break;
			case 'update':
				asw = mm.update(cmd.time);
				break;
			default:
				webError(res, 400, 'unknown command "'+cmd.cmd+'"');
				return;
			}
		} catch (e) {
			console.log(util.inspect(e));
			if (e.ok !== false) throw e; else asw = e;
		}
		log('ajax', 'out', asw);
		res.writeHead(200, {'Content-Type': 'application/json'});
		res.end(JSON.stringify(asw));
	});
};


/**
| Transmits the config relevant to the client
*/
function webConfig(req, red, res) {
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
}

/**
| Dispatches web request
*/
var dispatch = function(req, red, res) {
	if (red.pathname === '/mm') {
		mmAjax(req, red, res);
		return;
	}

	if (red.pathname === '/config.js') {
		webConfig(req, red, res);
		return;
	}

	var co = content[red.pathname];
	if (!co) {
		res.writeHead(404, {'Content-Type': 'text/plain'});
		webError(res, '404 Bad Reqeust');
		return;
	}

	fs.readFile(co.file, function(err, data) {
		if (err) { webError(res, 500, 'Internal Server Error'); }
		res.writeHead(200, {'Content-Type': co.mime});
		res.end(data, co.code);
	});
};

/**
| Startup.
*/
log('start', 'Starting server @ http://'+(config.ip || '*')+'/:'+config.port);
http.createServer(function (req, res) {
	var red = url.parse(req.url);
	log('web', req.connection.remoteAddress, red.href);
	dispatch(req, red, res);
}).listen(config.port, config.ip, function() {
	log('start', 'Server running');
});

})();
