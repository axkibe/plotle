#!/usr/local/bin/node
/**
| A command line shell to interact with a meshcraft repository.
|
| Authors: Axel Kittenberger
| License: GNU Affero AGPLv3
*/

var fs         = require('fs');
var http       = require('http');
var readline   = require('readline');
var util       = require('util');
var libemsi    = require('./lib-meshcraft-client');

var j2o    = libemsi.j2o;
var config = libemsi.config();
if (config.initmessage) {
	console.log(config.initmessage);
}

/**
| Loads command history.
*/
var fhist;
try {
	fhist = fs.readFileSync('./cmdhistory.txt').toString().split('\n');
} catch(error) {
	fhist = [];
}
var chist = [];
for (var fi = fhist.length - 2; fi >= 0; fi--) {
	chist.push(fhist[fi]);
}

/**
| Writes the command history.
*/
var cmdhistory = fs.createWriteStream('./cmdhistory.txt', {'flags': 'a'});

/**
| Issues a request to the meshmashine
*/
function request(cmd, callback) {
	libemsi.request(cmd, function(err, asw) {
		if (err) {
			console.log(err.message);
			callback(err, asw);
		} else {
			callback(null, asw);
		}
	});
};

/**
| All commands to the shell
*/
var shell = {
	'alter' : function(out, context, line, args, callback) {
		var reg = /\s*\S+\s+(\[[^\]]*\]|\S+)\s+(.*)/g.exec(line);
		var origin, target;
		if (!reg ||
			(origin = j2o(reg[1])) === null ||
			(target = j2o(reg[2])) === null)
		{
			out.write('syntax: alter ORIGIN TARGET.\n');
			callback();
			return;
		}
		request({cmd: 'alter', time: context.time, origin: origin, target: target}, callback);
		return;
	},
	'get' : function(out, context, line, args, callback) {
		var reg = /\s*\S+\s*(.*)/g.exec(line);
		var path;
		// no argument defaults to get all.
		if (reg && reg[1] === '') reg[1] = '[]';
		if (!reg || (path = j2o(reg[1])) === null) {
			out.write('syntax: get PATH.\n');
			callback();
			return;
		}
		if (!(path instanceof Array)) path = [path];
		request({cmd: 'get', time: context.time, path: path}, callback);
		return;
	},

	'quit' : function(out, context, line, args, callback) {
		callback(null, null, true);
	},

	'reflect' : function(out, context, line, args, callback) {
		request({cmd: 'reflect', time: context.time}, callback);
	},

	'set' : function(out, context, line, args, callback) {
		var reg = /\s*\S+\s+(\[[^\]]*\]|\S+)\s+(.*)/g.exec(line);
		var path, value;
		if (!reg ||
			(path  = j2o(reg[1])) === null ||
			(value = j2o(reg[2])) === null)
		{
			out.write('syntax: set PATH VALUE.\n');
			callback();
			return;
		}
		if (!(path instanceof Array)) path = [path];
		request({cmd: 'set', time: context.time, path: path, value: value}, callback);
	},

	'time' : function(out, context, line, args, callback) {
		if (typeof(args[1]) === 'undefined') {
			out.write('time: '+context.time+'\n');
			callback();
			return;
		}
		var time = parseInt(args[1]);
		if (time !== time) {
			out.write('"'+args[1]+'" not a number'+'\n');
			callback();
			return;
		}
		context.time = time;
		out.write('time:='+context.time+'\n');
		callback();
	},

	'update' : function(out, context, line, args, callback) {
		request({cmd: 'update', time: context.time},
		function(err, asw) {
			if (!err && asw.ok) context.time = asw.time;
			callback(err, asw);
		});
	},

};

/**
| A simple completer for shell commands.
*/
function completer(sub) {
	var sublist = [];
	for (var s in shell) {
		if (s.substr(0, sub.length) === sub) {
			sublist.push(s+' ');
		}
	}
	return [sublist, sub];
}

/**
| Parses the prompt input.
*/
function parsePrompt(out, context, line, callback) {
	var commandlist = context.commandlist;
	var reg = /\s*(\S+)\s*/g;
	var args = [];
	for(var ca = reg.exec(line); ca != null; ca = reg.exec(line)) {
		args.push(ca[1]);
	}
	if (typeof(args[0]) === 'undefined') {
		callback();
		return;
	}
	cmdhistory.write(line+'\n');
	if (shell[args[0]]) {
		shell[args[0]](out, context, line, args,
		function(err, asw, quit) {
			if (err) {
				callback(quit);
				return;
			}
			if (asw) out.write(util.inspect(asw, false, null)+'\n');
			callback(quit);
		});
		return;
	}
	out.write('unknown command "'+args[0]+'"\n"');
	callback();
	return;
}

/**
| Creates a Shell.
*/
function createShell(input, output, closer) {
	var shell = readline.createInterface(input, output, completer);

	shell.history = chist;

	shell.prompt();
	context = { time : 0 };
	shell.on('line', function (line) {
		parsePrompt(output, context, line, function(quit) {
			if (quit) {
				shell.close();
				input.destroy();
				return;
			}
			// evil use of internal structore so the cursor stays where it was
			shell._refreshLine();
		});
	});
	if (closer) shell.on('close', closer);
	return shell;
}

createShell(process.stdin, process.stdout, function() {
	process.stdout.write('\n');
	process.stdin.destroy();
});

