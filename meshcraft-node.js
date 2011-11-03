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

var config;
var util = require('util');
var http = require('http');
var url  = require('url');
var fs   = require('fs');

var log  = require('./meshcraft-log');
var MeshMashine = require('./meshmashine');

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
	log(true, 'no config found, defaulting to localhost:8833');
	config = {
		ip   : '127.0.0.1',
		port : 8833,
		log  : {},
	};
}

/**
| Sets enabled logging categories from config
*/
(function() {
	if (!config.log) return;
	for (var c in config.log) {
		log.enable[c] = config.log[c];
	}
}());

var mm = new MeshMashine();

/**
| Files served.
*/
var meshcraft_html = {
	file: './meshcraft.html',
	mime: 'text/html',
	code: 'utf-8',
};

var content = {
	'/':
		meshcraft_html,
	'/index.html':
		meshcraft_html,
	'/meshcraft.html':
		meshcraft_html,
	'/canvas2d.js': {
		file: './canvas2d.js',
		mime: 'text/javascript',
		code: 'utf-8',
	},
	'/meshcraft.js': {
		file: './meshcraft.js',
		mime: 'text/javascript',
		code: 'utf-8',
	},
	'/favicon.ico': {
		file: './favicon.ico',
		mime: 'image/x-icon',
		code: 'binary',
	},
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
	req.on('data',
	function(chunk) {
		data.push(chunk);
	});
	req.on('end',
	function() {
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
		switch (cmd.cmd) {
		case 'alter':  asw = mm.alter(cmd.time, cmd.src, cmd.trg);    break;
		case 'get':    asw = mm.get(cmd.time, cmd.path);              break;
		case 'now':    asw = mm.now();                                break;
		case 'update': asw = mm.update(cmd.time);                     break;
		default: webError(res, 400, 'unknown command "'+cmd.cmd+'"'); return;
		}
		log('ajax', 'out', asw);
		res.writeHead(200, {'Content-Type': 'application/json'});
		res.end(JSON.stringify(asw));
	});
}

/**
| Dispatches web request
*/
var dispatch = function(req, red, res) {
	if (red.pathname === '/mm') {
		mmAjax(req, red, res);
		return;
	}

	var co = content[red.pathname];
	if (!co) {
		res.writeHead(404, {'Content-Type': 'text/plain'});
		webErro(res, '404 Bad Reqeust');
	}

	fs.readFile(co.file,
	function(err, data) {
		if (err) {
			webError(res, 500, 'Internal Server Error');
		}
		res.writeHead(200, co.mime);
		res.end(data, co.code);
	});
}

/**
| Startup.
*/
log('start', 'Starting server @ http://'+(config.ip || '*')+'/:'+config.port);
http.createServer(
function (req, res) {
	var red = url.parse(req.url);
	log('web', req.connection.remoteAddress, red.href);
	dispatch(req, red, res);
}).listen(config.port, config.ip, function() {
	log('start', 'Server running');
});

