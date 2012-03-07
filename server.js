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
 License: GNU Affero AGPLv3
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

var util = require('util');
var http = require('http');
var url  = require('url');
var fs   = require('fs');

var config = require('./config');
var Jools  = require('./jools');
var Tree   = require('./tree');
var MeshMashine = require('./meshmashine');

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
	var nexus = Tree.grow( { type : 'Nexus' } );
	mm = new MeshMashine(nexus, false, false);

	// startup init
	var spacepath = new Tree.Path(['welcome']);
	var src = {
		val: {
			type: 'Space',
			copse: {
				'1' : {
					type: 'Note',
					fontsize : 13,
					zone: {
						type : 'Rect',
						pnw : { type: 'Point', 'x':  10, 'y':  10 },
						pse : { type: 'Point', 'x': 378, 'y': 140 }
					},
					doc: {
						type: 'Doc',
						copse : {
							'3': {
								type: 'Para',
								text: 'If you can dream---and not make dreams your master;'
							},
							'1': {
								type: 'Para',
								text: 'If you can think---and not make thoughts your aim,'
							},
							'2': {
								type: 'Para',
								text: 'If you can meet with Triumph and Disaster'
							},
							'4': {
								type: 'Para',
								text: 'And treat those two impostors just the same'
							},
							/*
							'5': {
								type: 'Para',
								text: 'If you can bear to hear the truth you\'ve spoken'
							},
							'6': {
								type: 'Para',
								text: 'Twisted by knaves to make a trap for fools,'
							},
							'7': {
								type: 'Para',
								text: 'Or watch the things you gave your life to broken,'
							},
							'8': {
								type: 'Para',
								text: 'And stoop and build \'em up with wornout tools;'
							},
							'9': {
								type: 'Para',
								text: 'If you can make one heap of all your winnings'
							},
							'10': {
								type: 'Para',
								text: 'And risk it on one turn of pitch-and-toss,'
							},
							'11': {
								type: 'Para',
								text: 'And lose, and start again at your beginnings'
							},
							'12': {
								type: 'Para',
								text: 'And never breath a word about your loss;'
							},
							'13': {
								type: 'Para',
								text: 'If you can force your heart and nerve and sinew'
							},
							'14': {
								type: 'Para',
								text: 'To serve your turn long after they are gone,'
							},
							'15': {
								type: 'Para',
								text: 'And so hold on when there is nothing in you'
							},
							'16': {
								type: 'Para',
								text: 'Except the Will which says to them: "Hold on";'
							}
							*/
						},
						alley : [
							'3', '1', '2', '4' /*, '5',
							'6', '7', '8', '9', '10',
							'11', '12', '13', '14', '15',
							'16' */
						]
					}
				}
//				'2' : {
//					type: 'Label',
//					pnw: { 'x': 200, 'y': 250 },
//					doc: {
//						fontsize : 90,
//						paras : {
//							'0' : {
//								type: 'Para',
//								text: 'FooBar',
//							},
//						},
//					},
//				},
//				'3' : {
//					type: 'Relation',
//					pnw: { 'x': 600, 'y': 150 },
//					item1key : '0',
//					item2key : '1',
//					doc: {
//						fontsize : 20,
//						paras : {
//							'0': {
//								type: 'Para',
//								text: 'relates to',
//							},
//						},
//					},
//				},
			},
			alley : [ '1' ]
		}
	};
	var trg = { path: spacepath };
	var asw = mm.alter(0, src, trg);
	debug('TREE', mm.tree);
	if (asw.ok !== true) throw new Error('Cannot init Repository');
})();

/**
| Files served.
*/
var mime = {
	ht : 'text/html',
	js : 'text/javascript',
	xi : 'image/x-icon'
};

var content = {
	'/'               : { file: './meshcraft.html',    mime: mime.ht, code: 'utf-8'  },
	'/index.html'     : { file: './meshcraft.html',    mime: mime.ht, code: 'utf-8'  },
	'/meshcraft.html' : { file: './meshcraft.html',    mime: mime.ht, code: 'utf-8'  },
	'/browser.js'     : { file: './browser.js',        mime: mime.js, code: 'utf-8'  },
	'/fabric.js'      : { file: './fabric.js',         mime: mime.js, code: 'utf-8'  },
	'/jools.js'       : { file: './jools.js',          mime: mime.js, code: 'utf-8'  },
	'/tree.js'        : { file: './tree.js',           mime: mime.js, code: 'utf-8'  },
	'/shell.js'       : { file: './shell.js',          mime: mime.js, code: 'utf-8'  },
	'/meshmashine.js' : { file: './meshmashine.js',    mime: mime.js, code: 'utf-8'  },
	'/peer.js'        : { file: './peer.js',           mime: mime.js, code: 'utf-8'  },
	'/favicon.ico'    : { file: './icons/hexicon.ico', mime: mime.xi, code: 'binary' },
	'/testpad.html'   : { file: './testpad.html',      mime: mime.ht, code: 'utf-8'  },
	'/testpad.js'     : { file: './testpad.js',        mime: mime.js, code: 'utf-8'  },
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
				if (cmd.src.path) cmd.src.path = new Tree.Path(cmd.src.path);
				if (cmd.trg.path) cmd.trg.path = new Tree.Path(cmd.trg.path);
				asw = mm.alter(cmd.time, cmd.src, cmd.trg);
				break;
			case 'get':
				if (!cmd.path) {
					webError(res, 400, 'cmd get requires .path');
					break;
				}
				var path = new Tree.Path(cmd.path);
				asw = mm.get(cmd.time, path);
				break;
			case 'now':
				asw = mm.now();
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

