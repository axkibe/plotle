/* __  __   ___         __.....__               .
  |  |/  `.'   `.   .-''         '.           .'|
  |   .-.  .-.   ' /     .-''"'-.  `.        <  |
  |  |  |  |  |  |/     /________\   \        | |
  |  |  |  |  |  ||                  |    _   | | .'''-.
  |  |  |  |  |  |\    .-------------'  .' |  | |/.'''. \
  |  |  |  |  |  | \    '-.____...---. .   | /|  /    | |
  |__|  |__|  |__|  `.             .'.'.'| |//| |     | |
                      `''-...... -'.'.'.-'  / | |     | |
                                   .'   \_.'  | '.    | '.
                                              '---'   '---'
                .-'''-.
               '   _    \ _______
    _..._    /   /` '.   \\  ___ `'.         __.....__
  .'     '. .   |     \  ' ' |--.\  \    .-''         '.
 .   .-.   .|   '      |  '| |    \  '  /     .-''"'-.  `.
 |  '   '  |\    \     / / | |     |  '/     /________\   \
 |  |   |  | `.   ` ..' /  | |     |  ||                  |
 |  |   |  |    '-...-'`   | |     ' .'\    .-------------'
 |  |   |  |               | |___.' /'  \    '-.____...---.
 |  |   |  |              /_______.'/    `.             .'
 |  |   |  |              \_______|/       `''-...... -'
 |  |   |  |
 '--'   ''*/
/**
| A network item editor.
|
| This is the server-side repository
|
| Authors: Axel Kittenberger
| License: GNU Affero AGPLv3
*/

var config;
var util = require('util');
var http = require('http');
var url  = require('url');
var fs   = require('fs');

try {
	config = require('./config');
} catch (e) {
	util.log('no config found, defaulting to running local on port 8833');
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
		res.writeHead(code, {'Content-Type': 'application/json'});
		res.end(JSON.stringify({}));
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
	try {
		var red = url.parse(req.url);
		util.log(req.connection.remoteAddress+': '+red.href);
		dispatch(req, red, res);
	} catch (err) {
		util.log(err);
		res.writeHead(500, {'Content-Type': 'text/plain'});
		res.end('500 Internal Server Error');
	}
}).listen(config.port, config.ip, function() {
	util.log('Server running');
});

