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

                               ,-,-,-.        ,
                               `,| | |   ,-.  )   . . ,-. . ,
                                 | ; | . |   /    | | | |  X
                                 '   `-' `-' `--' `-| ' ' ' `
                                                   /|
                                                  `-'
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

 A terminal based interface.

 Authors: Axel Kittenberger
 License: GNU Affero AGPLv3

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
/**
| A command line shell to interact with a meshcraft repository.
|
| Authors: Axel Kittenberger
| License: GNU Affero AGPLv3
*/

var fs       = require('fs');
var http     = require('http');
var util     = require('util');
var tty      = require('tty');
var sequence = require('futures').sequence;

/**
| Use by default the settings of server configuration
*/
try {
	config = require('./config');
} catch(err) {
	util.log('no config found, defaulting to localhost:8833');
	config = {
		ip   : '127.0.0.1',
		port : 8833,
	};
}

var root;
try {
	root = JSON.parse(process.argv[2]);
} catch(err) {
	console.log('"'+process.argv[2]+'" not a valid root');
	process.exit(1);
}
if (!(root instanceof Array)) root = [root];

var tin  = process.stdin;
var tout = process.stdout;
var tsize;
process.on('SIGWINCH',
function() {
	tsize = tout.getWindowSize();
});
tsize = tout.getWindowSize();

var messages = [];
var text = 'foobar';
var time = 0;
var cursor = 0;

function drawScreen() {
	tout.write('\033[2J');
	var th = Math.round(tsize[1] / 2);
	var bh = tsize[1] - th - 1;
	tout.cursorTo(0, th);
	for(var i = 0; i < tsize[0]; i++) {
		tout.write('-');
	}
	var im = messages.length - bh;
	if (im < 0) im = 0;
	for(var ic = th + 1; im < messages.length; ic++, im++) {
		tout.cursorTo(0, ic);
		tout.write(messages[im]);
	}
	tout.cursorTo(0, 0);
	tout.write(text);
	tout.cursorTo(cursor, 0);
}

function message(s) {
	if (s instanceof Array) s = s.join('');
	var slines = s.split('\n');
	for (sline in slines) {
		messages.push(slines[sline]);
	}
	drawScreen();
}

/**
| Options to connect to meshmashine
*/
var mmops = {
	host: config.ip,
	port: config.port,
	path: '/mm',
	method: 'POST'
};

/**
| Issues an ajax request.
*/
function ajax(cmd, callback) {
	var req = http.request(mmops, function(res) {
		if (res.statusCode !== 200) {
			callback(new Error('Status code: '+res.statusCode));
			return;
		}
		res.setEncoding('utf8');
		var data = [];
		res.on('data', function(chunk) {
			data.push(chunk);
		});
		res.on('end', function() {
			var asw = data.join('');
			var ao;
			try {
				ao = JSON.parse(asw);
			} catch (err) {
				console.log('received invalid JSON: '+asw+' | '+err.message);
				callback(err);
				return;
			}
			callback(null, ao);
		});
	});
	req.on('error', function(e) {
		console.log('problem with request: '+e.message);
		callback(e);
	});
	req.write(JSON.stringify(cmd));
	req.end();
}

function request(cmd, callback) {
	cmd.time = time;
	message('-> '+util.inspect(cmd));
	tin.pause();
	ajax(cmd, function(err, asw) {
		tin.resume();
		if (err || !asw.ok) {
			message('<§ '+(asw && asw.message) || (err && err.message));
		} else {
			message('<- '+util.inspect(asw));
		}
		callback(err, asw);
	});
}

function update(callback) {
	request({cmd: 'update'}, function(err, asw) {
		if (!err && asw.ok) {
			time = asw.time;
		}
		callback(err || (!asw.ok && asw.message));
	});
}

function set(path, value, callback) {
	request({cmd: 'set', path: path, value: value}, function(err, asw) {
		callback(err || (!asw.ok && asw.message));
	});
}

function get(path, callback) {
	request({cmd: 'get', path: path}, function(err, asw) {
		callback(err || (!asw.ok && asw.message), asw && asw.node);
	});
}

function init() {
	sequence().then(function(next) {
		tin.resume();
		tty.setRawMode(true);
		// screen buffer
		tout.write('\033[?1049h');
		drawScreen();
		tin.pause();
		set(root, text, next);
	}).then(function(next) {
		refresh();
	});
}
init();

function refresh() {
	sequence().then(function(next) {
		tin.pause();
		update(next);
	}).then(function(next) {
		get(root, next);
	}).then(function(next, err, node) {
		text = node;
		tin.resume();
		drawScreen();
	});
}

function exit(code) {
	// original screen
	tout.write('\033[?1049l');
	tty.setRawMode(false);
	process.exit(1);
}


tin.on('keypress',
function(s, key) {
	if (key && key.ctrl) {
		if (key.name === 'c') {
			exit(0);
		}
		if (key.name === 'u') {
			refresh();
		}
	}
});

