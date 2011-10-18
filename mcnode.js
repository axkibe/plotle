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
| Dispatches web request
*/
var dispatch = function(req, red, res) {
	if (red.pathname === '/mm') {
		var data = [];
		if (req.method !== 'POST') {
			res.writeHead(400, {'Content-Type': 'text/plain'});
			res.end('400 Must use POST');
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
			res.writeHead(200, {'Content-Type': 'application/json'});
			res.end(JSON.stringify({foo:'bar'}));
		});
		return;
	}

	var co = content[red.pathname];
	if (!co) {
		res.writeHead(404, {'Content-Type': 'text/plain'});
		res.end('404 Bad Reqeust');
	}

	fs.readFile(co.file,
	function(err, data) {
		if (err) {
			res.writeHead(500, {'Content-Type': 'text/plain'});
			res.end('500 Internal Server Error');
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

