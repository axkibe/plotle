#!/usr/local/bin/node
/**
| A shell to interact json commands.
| Used to debug the meshmashine.
|
| Authors: Axel Kittenberger
| License: GNU Affero AGPLv3
*/

var fs         = require('fs');
var http       = require('http');
var readline   = require('readline');
var util       = require('util');
var config     = require('./config');

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
| Stream-writes the command history.
*/
var cmdhistory = fs.createWriteStream('./cmdhistory.txt', {'flags': 'a'});

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
| Main program.
*/
console.log('Talking to '+ops.host+':'+ops.port+ops.path);

var shell = readline.createInterface(process.stdin, process.stdout, null);
shell.history = chist;
shell.prompt();

shell.on('line', function (line) {
	cmdhistory.write(line+'\n');
	var o;
	try {
		// o = JSON.parse(line); <- strict JSON
		// instead eval relaxed JSON, insecure but this is for testing anyway.N
		var o;
		eval('o='+line);
	} catch (err) {
		console.log('# invalid input: '+err.message);
		shell.prompt();
		return;
	}
	var s = JSON.stringify(o);
	console.log('» '+s);
	console.log();
	
	request(s, function(err, code, asw) {
		try {
			if (asw) {
				asw = util.inspect(JSON.parse(asw), false, null);
			}
		} catch (err) {
			console.log('# ('+code+') answer not JSON: '+asw);
			shell.prompt();
			return;
		}
		console.log('* '+code);
		console.log(': '+asw);
		shell.prompt();
	});
});

shell.on('close', function() {
	process.stdout.write('\n');
	process.stdin.destroy();
});

