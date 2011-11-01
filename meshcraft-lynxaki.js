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

                                        ,
                                        )   . . ,-. . ,
                                       /    | | | |  X
                                       `--' `-| ' ' ' `
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~/| ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
                                            `-'
 A terminal based interface.

 Authors: Axel Kittenberger
 License: GNU Affero AGPLv3

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

function isString(o) {
	return typeof(o) === 'string' || o instanceof String;
}

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
process.on('SIGWINCH', function() {
	tsize = tout.getWindowSize();
	drawScreen();
});
tsize = tout.getWindowSize();

var messages = [];
var tree  = null;
var change = {cmd: null, at1: null, at2: null, val: null};
var time = 0;
var cx = 0, cy = 0;

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
	if (!(tree instanceof Array)) {
		tout.write('\033[31;47;1m');
		tout.write('Invalid tree:\n');
		tout.write(util.inspect(tree));
		tout.write('\033[0m');
		return;
	}
	for(var i = 0; i < tree.length; i++) {
		if (change.line !== i) {
			if (tree[1].text) {
				tout.write(tree[i].text);
			} else {
				tout.write('\033[31;47;1mPara has no text!\033[0m');
			}
		} else {
			var line = tree[i].text;

			switch (change.cmd) {
			case 'join':
				tout.write('\033[37;46;1m');
				tout.write('↰');
				tout.write('\033[0m');
				tout.write(line);
				break;
			case 'newline':
				tout.write(line.substring(0, change.at1));
				tout.write('\033[37;46;1m');
				tout.write('⤶');
				tout.write('\033[0m');
				tout.write(line.substring(change.at1));
				break;
			case 'remove':
				tout.write(line.substring(0, change.at1));
				tout.write('\033[37;41;1m');
				tout.write(line.substring(change.at1, change.at2));
				tout.write('\033[0m');
				tout.write(line.substring(change.at2));
				break;
			case 'insert':
				tout.write(line.substring(0, change.at1));
				tout.write('\033[37;42;1m');
				tout.write(change.val);
				tout.write('\033[0m');
				tout.write(line.substring(change.at1));
				break;
			default :
				tout.write(line);
				break;
			}
		}
		tout.write('\n');
	}
	tout.cursorTo(cx, cy);
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

function set(path, val, callback) {
	request({
		cmd: 'set',
		time: time,
		path: path,
		val:  val}, callback);
}

function send() {
	switch (change.cmd) {
	case 'join' :
		var sign = root.slice();
		sign.push(change.line);
		request({
			cmd: 'alter',
			src: 'splice',
			trg: sign,
		}, function(err, asw) {
			for(k in change) change[k] = null;
			refresh();
		});
		break;
	case 'newline' :
		var sign = root.slice();
		sign.push(change.line);
		sign.push('text');
		sign.push({at1: change.at1});
		request({
			cmd: 'alter',
			src: sign,
			trg: 'splice',
		}, function(err, asw) {
			for(k in change) change[k] = null;
			refresh();
		});
		break;
	case 'insert' :
		var path = root.slice();
		path.push(change.line);
		path.push('text');
		path.push({at1: change.at1});
		request({
			cmd: 'alter',
			src: {val: change.val},
			trg: path,
		}, function(err, asw) {
			for(k in change) change[k] = null;
			refresh();
		});
		break;
	case 'remove' :
		var path = root.slice();
		path.push(change.line);
		path.push('text');
		path.push({at1: change.at1, at2: change.at2});
		request({
			cmd: 'alter',
			src: path,
			trg: null,
		}, function(err, asw) {
			for(k in change) change[k] = null;
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
	tout.write('\033[2J');
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
			tree = asw.node;
			tin.resume();
			drawScreen();
		})
	});
}

function exit(message) {
	tout.cursorTo(0, 0);
	tout.write('\033[2J');
	tty.setRawMode(false);
	if (message) {
		console.log(message);
	}
	process.exit(1);
}


tin.on('keypress', function(ch, key) {
	// message(ch+' | '+util.inspect(key));
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
		if (cx > 0) cx--;
		break;
	case 'right' :
		var max = tree[cy].text.length;
		if (change.line === cy && change.cmd === 'insert') max += change.val.length;
		if (cx < max) cx++;
		break;
	case 'up' :
		if (cy <= 0) break;
		cy--;
		break;
	case 'down' :
		if (cy >= tree.length - 1) break;
		cy++;
		break;
	case 'enter' :
		if (change.cmd !== null) {
			message('-- another change in buffer!');
			break;
		}
		change.cmd = 'newline';
		change.line = cy;
		change.at1  = cx++;
		break;
	case 'delete' :
		switch (change.cmd) {
		case 'remove' :
			if (cy !== change.line) {
				message('-- another change in buffer!');
				break;
			}
			if (cx >= tree[cy].text.length) break;
			if (change.at2 === cx) {
				change.at2++;
				cx++;
				break;
			}
			if (change.at1 === cx + 1) {
				change.at1--;
				break;
			}
			message('-- another change in buffer!');
			break;
		case 'insert' :
		case 'join' :
		case 'newline' :
			message('-- another change in buffer!');
			break;
		case null:
			if (cx >= tree[cy].text.length) break;
			change.cmd  = 'remove';
			change.line = cy;
			change.at1  = cx;
			change.at2  = ++cx;
			break;
		default :
			exit('unknown command state');
			break;
		}
		break;
	case 'backspace' :
		switch (change.cmd) {
		case 'remove' :
			if (cx === 0) break;
			if (cy !== change.line) {
				message('-- another change in buffer!');
				break;
			}
			if (change.at1 === cx) {
				change.at1--;
				cx--;
				break;
			}
			if (change.at2 + 1 === cx) {
				change.at2++;
				cx--;
				break;
			}
			message('-- another change in buffer!');
			break;
		case 'newline' :
		case 'insert' :
		case 'join' :
			message('-- another change in buffer!');
			break;
		case null:
			if (cx === 0) {
				change.cmd = 'join';
				change.line = cy;
				break;
			}
			change.cmd  = 'remove';
			change.line = cy;
			change.at2  = cx;
			change.at1  = --cx;
			break;
		default :
			exit('unknown command state');
			break;
		}
		break;
	case undefined :
	case 'space':
	case (ch) :
	case (ch && ch.toLowerCase()) :
		switch (change.cmd) {
		case 'join' :
		case 'remove':
		case 'newline':
			message('-- another change in buffer!');
			break;
		case 'insert':
			var rc = cx - change.at1;
			if (cy === change.line && rc >= 0 && rc <= change.val.length) {
				change.val = change.val.substring(0, rc)+ch+change.val.substring(rc);
				cx++;
			} else {
				message('-- another change in buffer!');
			}
			break;
		case null:
			change.cmd  = 'insert';
			change.line = cy;
			change.at1  = cx++;
			change.val  = ch;
			break;
		default :
			exit('unknown command state');
			break;
		}
		break;
	}
	drawScreen();
});

