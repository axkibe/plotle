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

function isString(o) {
	return typeof(o) === 'string' || o instanceof String;
}

var switchscreen = true;
var fs       = require('fs');
var http     = require('http');
var util     = require('util');
var tty      = require('tty');
var libemsi  = require('./meshcraft-libclient');

var j2o = libemsi.j2o;
var config = libemsi.config();
if (config.initmessage) {
	console.log(config.initmessage);
}

var root = j2o(process.argv[2]);
if (root === null) {
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
var text = '';
var change = {cmd: null, from: null, value: null};
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
	for(var ic = th + 1, im = messages.length - 1; ic < tsize[1] && im >= 0; ic++, im--) {
		tout.cursorTo(0, ic);
		tout.write(messages[im]);
	}
	tout.cursorTo(0, 0);
	switch (change.cmd) {
	case 'remove':
		tout.write(text.substring(0, change.from));
		tout.write('\033[37;41;1m');
		tout.write(text.substring(change.from, change.to));
		tout.write('\033[0m');
		tout.write(text.substring(change.to));
		break;
	case 'insert':
		tout.write(text.substring(0, change.from));
		tout.write('\033[37;42;1m');
		tout.write(change.value);
		tout.write('\033[0m');
		tout.write(text.substring(change.from));
		break;
	default :
		tout.write(text);
		break;
	}
	tout.cursorTo(cursor, 0);
}

function message(s) {
	if (s instanceof Array) s = s.join('');
	var slines = s.split('\n');
	for (var si = slines.length - 1; si >= 0; si--) {
		messages.push(slines[si]);
	}
	drawScreen();
}

function request(cmd, callback) {
	cmd.time = time;
	message('');
	message('-> '+util.inspect(cmd));
	tin.pause();
	libemsi.request(cmd, function(err, asw) {
		tin.resume();
		if (err) {
			message('<x '+err.message);
		} else {
			message('<- '+util.inspect(asw));
		}
		callback(err, asw);
	});
}

function update(callback) {
	libemsi.request({
		cmd: 'update',
		time: time},
	function(err, asw) {
		if (!err && asw.time) time = asw.time;
		callback(err, asw);
	});
}

function get(path, callback) {
	request({
		cmd: 'get',
		time: time,
		path: path}, callback);
}

function set(path, value, callback) {
	request({
		cmd: 'set',
		time: time,
		path: path,
		value: value}, callback);
}

function send() {
	switch (change.cmd) {
	case 'insert' :
		request({
			cmd: 'alter',
			origin: {text: change.value},
			target: {path: root, from: change.from},
		}, function(err, asw) {
			change.cmd = null;
			change.from = null;
			change.value = null;
			refresh();
		});
		break;
	case 'remove' :
		request({
			cmd: 'alter',
			origin: {path: root, from: change.from, to: change.to},
			target: null,
		}, function(err, asw) {
			change.cmd = null;
			change.from = null;
			change.value = null;
			refresh();
		});
		break;
	default :
		message('nothing to send');
	}
}


function init() {
	tin.resume();
	tty.setRawMode(true);
	if (switchscreen) tout.write('\033[?1049h');
	tin.pause();
	refresh();
	drawScreen();
}
init();

function refresh() {
	tin.pause();
	update(function(err, asw) {
		if (err) exit(err.message);
		get(root, function(err, asw) {
			if (err) exit(err.message);
			text = asw.node;
			if (!isString(text)) exit('Root does not point to string.');
			tin.resume();
			drawScreen();
		})
	});
}

function exit(message) {
	if (switchscreen) tout.write('\033[?1049l');
	tty.setRawMode(false);
	if (message) {
		console.log(message);
	}
	process.exit(1);
}


tin.on('keypress', function(ch, key) {
	if (key && key.ctrl) {
		switch (key.name) {
		case 'c' : exit();    break;
		case 'u' : refresh(); break;
		case 's' : send();    break;
		}
		return;
	}

	switch (key && key.name) {
	case 'left' :
		if (cursor > 0) cursor--;
		break;
	case 'right' :
		var max = text.length;
		if (change.cmd === 'insert') max += change.value.length;
		if (cursor < text.length +
			(change.cmd === 'insert' ? change.value.length : 0)
		) {
			cursor++;
		}
		break;
	case 'delete' :
		switch (change.cmd) {
		case 'remove' :
			if (cursor === text.length) break;
			if (change.to === cursor) {
				change.to++;
				cursor++;
				break;
			}
			if (change.from === cursor + 1) {
				change.from--;
				break;
			}
			message('-- another change in buffer!');
			break;
		case 'insert' :
			message('-- another change in buffer!');
			break;
		case null:
			if (cursor >= text.length) break;
			change.cmd  = 'remove';
			change.from = cursor;
			change.to   = cursor + 1;
			cursor++;
			break;
		default :
			exit('unknown command state');
			break;
		}
		break;
	case 'backspace' :
		switch (change.cmd) {
		case 'remove' :
			if (cursor === 0) break;
			if (change.from === cursor) {
				change.from--;
				cursor--;
				break;
			}
			if (change.to + 1 === cursor) {
				change.to++;
				cursor--;
				break;
			}
			message('-- another change in buffer!');
			break;
		case 'insert' :
			message('-- another change in buffer!');
			break;
		case null:
			if (cursor === 0) break;
			change.cmd = 'remove';
			change.from = cursor - 1;
			change.to   = cursor;
			cursor--;
			break;
		default :
			exit('unknown command state');
			break;
		}
		break;
	case undefined :
	case (ch) :
		switch (change.cmd) {
		case 'remove':
			message('-- another change in buffer!');
			break;
		case 'insert':
			var rc = cursor - change.from;
			if (rc >= 0 && rc <= change.value.length) {
				change.value = change.value.substring(0, rc)+ch+change.value.substring(rc);
				cursor++;
			} else {
				message('-- another change in buffer!');
			}
			break;
		case null:
			change.cmd  = 'insert';
			change.from = cursor;
			change.value = ch;
			cursor++;
			break;
		default :
			exit('unknown command state');
			break;
		}
		break;
	}
	drawScreen();
});

