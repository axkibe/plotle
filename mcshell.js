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

/**
| Use by default the settings of server configuration
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
| Turns a JSON String to object.
*/
function j2o(json) {
	try {
		return JSON.parse(json);
	} catch(err) {
		j2o.message = err.message;
		return null;
	}
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
| Options to connect to meshmashine
*/
var mmops = {
	host: config.ip,
	port: config.port,
	path: '/mm',
	method: 'POST'
};

/**
| Issues a request to the meshmashine
*/
function mmRequest(cmd, callback) {
	var req = http.request(mmops,
	function(res) {
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
			callback(null, data);
		});
	});
	req.on('error', function(e) {
		console.log('problem with request: '+e.message);
		callback(e);
	});
	req.write(JSON.stringify(cmd));
	req.end();
}

/**
| All commands to the shell
*/
var shell = {
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
		return;
	},

	'reflect' : function(out, context, line, args, callback) {
		mmRequest({cmd: 'reflect', time: context.time}, callback);
	},

	'set' : function(out, context, line, args, callback) {
		var reg = /\s*\S+\s+(\[[^\]]*\]|\S+)\s+(.*)/g.exec(line);
		var path, value;
		if (!reg ||
			(path  = j2o(reg[1])) === null ||
			(value = j2o(reg[2])) === null)
		{
			out.write('syntax: set PATH VALUE.\n');
			return;
		}
		if (!path instanceof Array) {
			path = [path];
		}
		mmRequest({cmd: 'set', time: context.time, path: path, value: value}, callback);
		return;
	},

	'get' : function(out, context, line, args, callback) {
		var reg = /\s*\S+\s+(.*)/g.exec(line);
		var path;
		if (!reg || (path = j2o(reg[1])) === null) {
			out.write('syntax: get PATH.\n');
			return;
		}
		mmRequest({cmd: 'get', time: context.time, path: path}, callback);
		return;
	},

	'update' : function(out, context, line, args, callback) {
		mmRequest({cmd: 'update', time: context.time, path: path},
		function(err, asw) {
			if (!err && asw.code) context.time = asw.time;
			callback(err, asw);
		});
		return;
	},

	'quit' : function(out, context, line, args, callback) {
		callback(null, null, true);
	},
};

/**
| A simple completer for shell commands
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
| Parses the prompt input
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
				out.write('transfer error: '+err.message+'\n');
				callback(quit);
				return;
			}
			if (!quit) out.write(util.inspect(asw, false, null)+'\n');
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
			// evil use of internal structore so the cursor
			// stays where it was
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

