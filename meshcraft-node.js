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


                                       ,-,-.         .
                                       ` | |   ,-. ,-| ,-.
                                         | |-. | | | | |-'
                                        ,' `-' `-' `-^ `-'

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
var jools  = require('./meshcraft-jools');
var woods  = require('./meshcraft-woods');
var log    = jools.log;

var woods = require('./meshcraft-woods');
var meshmashine = require('./meshmashine');

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
		debug : false,
		ip    : '127.0.0.1',
		port  : 8833,
		log   : {},
	};
}
var debug = config.debug === true || (config.debug % 4 - config.debug % 2) === 2;

//var mm = new meshmashine.MeshMashine(woods.GenericCopse);
var mm = new meshmashine.MeshMashine(woods.Nexus);

/**
| Files served.
*/
var meshcraft_html = {
	file: './meshcraft.html',
	mime: 'text/html',
	code: 'utf-8',
};

var mime_js = 'text/javascript';
var mime_xi = 'image/x-icon';

var content = {
	'/':               meshcraft_html,
	'/index.html':     meshcraft_html,
	'/meshcraft.html': meshcraft_html,
	'/meshcraft-fabric.js': { file: './meshcraft-fabric.js', mime: mime_js, code: 'utf-8',  },
	'/meshcraft-jools.js':  { file: './meshcraft-jools.js',  mime: mime_js, code: 'utf-8',  },
	'/meshcraft-woods.js':  { file: './meshcraft-woods.js',  mime: mime_js, code: 'utf-8',  },
	'/meshcraft-shell.js':  { file: './meshcraft-shell.js',  mime: mime_js, code: 'utf-8',  },
	'/meshmashine.js':      { file: './meshmashine.js',      mime: mime_js, code: 'utf-8',  },
	'/favicon.ico':         { file: './icons/hexicon.ico',   mime: mime_xi, code: 'binary', },
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
				var src = new jools.Signature(cmd.src);
				var trg = new jools.Signature(cmd.trg);
				log('debug', 'cmd', cmd);
				log('debug', 'src', src);
				log('debug', 'trg', trg);
				asw = mm.alter(cmd.time, src, trg);
				break;
			case 'get':
				var path = new jools.Path(cmd.path);
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
}

/**
| returns true if param is true for the client
*/
function configSwitchClient(param) {
	return param === true || param === 'client' || param === 'both';
}

/**
| Transmits the config relevant to the client
*/
function webConfig(req, red, res) {
	res.writeHead(200, {'Content-Type': 'application/json'});
	res.write('var config = {\n');
	// TODO this is jools job:
	res.write('\tdevel : '+ configSwitchClient(config.devel) + ',\n');
	res.write('\tlog : {\n');
	for(k in config.log) {
		if (configSwitchClient(config.log[k])) {
			res.write('\t\t'+k+' : true,\n');
		}
	}
	res.write('\t}\n');
	res.end('};\n')
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
}

/**
| Startup.
*/
//for(var i = 0; i < 40; i++) {
//	console.log('');
//}
log('start', 'Starting server @ http://'+(config.ip || '*')+'/:'+config.port);
http.createServer(
function (req, res) {
	var red = url.parse(req.url);
	log('web', req.connection.remoteAddress, red.href);
	dispatch(req, red, res);
}).listen(config.port, config.ip, function() {
	log('start', 'Server running');
});

