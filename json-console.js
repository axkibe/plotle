#!/usr/local/bin/node
/**
| A shell to interact json commands.
| Used to debug the meshmashine.
|
| Authors: Axel Kittenberger
| License: MIT(Expat), see accompanying 'License'-file
*/

var fs       = require('fs');
var http     = require('http');
var readline = require('readline');
var util     = require('util');

var Jools    = require('./jools');
var config   = require('./config');

/**
| Capsule
*/
(function() {
"use strict";

/**
| Loads command history.
*/
var loadHistory = function() {
	var lines;
	var history = [];
	try {
		lines = fs.readFileSync('./cmdhistory.txt').toString().split('\n');
	} catch(error) {
		lines = [];
	}
	// turn the history around
	for (var i = lines.length - 2; i >= 0; i--) {
		history.push(lines[i]);
	}
	return history;
};

/**
| Options to connect.
*/
var ops = {
	host: config.ip,
	port: config.port,
	path: '/mm',
	method: 'POST'
};

/**
| Issue on request and builds its answer.
*/
function request(cmd, callback) {
    var req = http.request(ops, function(res) {
        res.setEncoding('utf8');

        var data = [];

        res.on('data', function(chunk) {
            data.push(chunk);
        });

        res.on('end', function() {
            var asw = data.join('');
			callback(null, res.statusCode, asw);
        });
    });

    req.on('error', function(err) {
        callback(err);
    });

    req.write(cmd);
    req.end();
}


/**
| Parses and runs one json request, parses and pretty-prints the json answer.
*/
function jsonRequest(cmd, callback) {
	var o;
	try {
		// o = JSON.parse(line); <- strict JSON
		// instead eval relaxed JSON, insecure but this is for testing anyway.N
		eval('o='+cmd);
	} catch (err) {
		console.log('# invalid input: '+err.message);
		shell.prompt();
		callback();
		return;
	}
	var s = JSON.stringify(o);
	console.log('» '+s);
	console.log();

	request(s, function(err, code, asw) {
		if (err) {
			console.log('# '+Jools.inspect(err));
			callback();
			return;
		}
		try {
			if (asw) {
				asw = Jools.inspect(JSON.parse(asw));
			}
		} catch (err) {
			console.log('# ('+code+') answer not JSON: '+asw);
			callback();
			return;
		}
		console.log('* '+code);
		console.log(': '+asw);
		callback();
	});
}

/**
| Main program.
*/
console.log('Talking to '+ops.host+':'+ops.port+ops.path);

if (process.argv.length <= 2) {
	var shell = readline.createInterface(process.stdin, process.stdout, null);
	shell.history = loadHistory();

	// Stream-writes the command history.
	var cmdhistory = fs.createWriteStream('./cmdhistory.txt', {'flags': 'a'});

	shell.prompt();

	shell.on('line', function (line) {
		cmdhistory.write(line+'\n');
		jsonRequest(line, function() {
			shell.prompt();
		});
	});

	shell.on('close', function() {
		console.log();
		process.stdin.destroy();
	});
} else {
	var loop = function(a) {
		if (a >= process.argv.length) { return; }
		var cmd;
		try {
			cmd = fs.readFileSync(process.argv[a]);
		} catch(error) {
			console.log('# cannot read "'+process.argv[a]+'"');
			loop(a + 1);
			return;
		}
		jsonRequest(cmd, function() { loop(a + 1);} );
	};

	loop(2);
}

})();
