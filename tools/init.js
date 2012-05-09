#!/usr/local/bin/node
/**
| This ticker will write in short sequences to a note.
| Used for debugging
|
| Authors: Axel Kittenberger
| License: MIT(Expat), see accompanying 'License'-file
*/

var fs       = require('fs');
var http     = require('http');
var readline = require('readline');
var util     = require('util');

var Jools    = require('../shared/jools');
var config   = require('../config');

var args = process.argv;
if (args.length < 3) {
	console.log('Space name missing');
	process.exit(1);
}
var spaceName = process.argv[2];

/**
| Capsule
*/
(function() {
"use strict";

var uid = Jools.uid;

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
	var s = JSON.stringify(cmd);
	console.log('> '+s);
	request(s, function(err, code, asw) {
		if (err) { throw new Error('# '+Jools.inspect(err)); }
		try {
			if (asw) {
				asw = JSON.parse(asw);
			}
		} catch (err) {
			throw new Error('# ('+code+') answer not JSON: '+asw);
		}
		console.log('< ', asw);
		callback(asw);
	});
}

/**
| Main program.
*/
console.log('Talking to '+ops.host+':'+ops.port+ops.path);

var init = function() {
	jsonRequest(
		{
			time: -1,
			cmd: 'alter',
			chgX : {
				src : { val: { type: 'Space', cope: {}, ranks: [] } },
				trg : { path : [ spaceName ] }
			},
			cid  : 'init'
		},
		function(asw) {
			if (asw.ok) {
				console.log('Initialized changes collection!');
			} else {
				console.log('Server not OK: '+asw.message);
			}
		}
	);
};

init();

})();
