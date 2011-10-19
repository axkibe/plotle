/*                     _..._                   .-'''-.
                    .-'_..._''.               '   _    \ _______
 __  __   ___     .' .'      '.\   _..._    /   /` '.   \\  ___ `'.         __.....__
|  |/  `.'   `.  / .'            .'     '. .   |     \  ' ' |--.\  \    .-''         '.
|   .-.  .-.   '. '             .   .-.   .|   '      |  '| |    \  '  /     .-''"'-.  `.
|  |  |  |  |  || |             |  '   '  |\    \     / / | |     |  '/     /________\   \
|  |  |  |  |  || |             |  |   |  | `.   ` ..' /  | |     |  ||                  |
|  |  |  |  |  |. '             |  |   |  |    '-...-'`   | |     ' .'\    .-------------'
|  |  |  |  |  | \ '.          .|  |   |  |               | |___.' /'  \    '-.____...---.
|__|  |__|  |__|  '. `._____.-'/|  |   |  |              /_______.'/    `.             .'
                    `-.______ / |  |   |  |              \_______|/       `''-...... -'
                             `  |  |   |  |
                                '--'   '-*/
/**
| A network item editor.
|
| This is the server-side repository.
|
| Authors: Axel Kittenberger
| License: GNU Affero AGPLv3
*/

var config;
var util = require('util');
var http = require('http');
var url  = require('url');
var fs   = require('fs');
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
	util.log('no config found, defaulting to localhost:8833');
	config = {
		ip   : '127.0.0.1',
		port : 8833,
	};
}

var mm = new MeshMashine(function(err) {
	util.log(util.inspect(err));
	throw err;
});

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
	messge = code+' '+message;
	util.log(message);
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
		util.log('mm-query: '+query);
		var cmd;
		try {
			cmd = JSON.parse(query);
		} catch (err) {
			webError(res, 400, 'Not valid JSON');
			return;
		}
		var asw;
		switch (cmd.cmd) {
		case 'get' :
			asw = mm.get(cmd.time, cmd.path);
			break;
		case 'reflect' :
			asw = mm.reflect(cmd.time);
			break;
		case 'set' :
			asw = mm.set(cmd.time, cmd.path, cmd.value);
			break;
		case 'update' :
			asw = mm.update(cmd.time);
			break;
		default:
			webError(res, 400, 'unknown command "'+cmd.cmd+'"');
			return;
		}
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
util.log('Starting server @ http://'+(config.ip || '*')+'/:'+config.port);
http.createServer(
function (req, res) {
	var red = url.parse(req.url);
	util.log(req.connection.remoteAddress+': '+red.href);
	dispatch(req, red, res);
}).listen(config.port, config.ip, function() {
	util.log('Server running');
});

