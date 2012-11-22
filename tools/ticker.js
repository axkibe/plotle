#!/usr/local/bin/node

/*
| This ticker will write in short sequences to a note.
| Used for debugging
|
| Authors: Axel Kittenberger
*/

var http     = require('http');
var util     = require('util');
var Jools    = require('../shared/jools');
var config   = require('../config');

/**
| Capsule
*/
(function() {
"use strict";

var args   = process.argv;
var user   = args[2];
var pass   = args[3];
var itemid = args[4];
if (!Jools.is(user) || !Jools.is(pass) || !Jools.is(itemid)) {
	console.log('Usage: ' + args[1] + ' USER PASSWORD ITEMID');
	process.exit(1);
}
pass = Jools.passhash('-meshcraft-8833');

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
	console.log('> ', util.inspect(cmd, false, null));
	var s = JSON.stringify(cmd);
	request(s, function(err, code, asw) {
		if (err) { throw new Error('# '+ util.inspect(err, false, null)); }
		try {
			if (asw) {
				asw = JSON.parse(asw);
			}
		} catch (err) {
			throw new Error('# ('+code+') answer not JSON: '+asw);
		}
		console.log('< ', util.inspect(asw, false, null));
		callback(asw);
	});
}

/**
| Main program.
*/
console.log('Talking to '+ops.host+':'+ops.port+ops.path);

var p      =  -1;
var ralpha = 'zyxwvutsrpqonmlkjihgfedcba';
var rtime  = -1;

var fget = function() {
	jsonRequest(
		{
			cmd: 'get',
			user: user,
			pass: pass,
			path: ['meshcraft:home'],
			time: -1
		},
		function(asw) {
			rtime = parseInt(asw.time, 10);
			var text = asw.node.copse[itemid].doc.copse['1'].text;
			console.log('text:', text);
			flet(text);
		}
	);
};

var fletasw = function(asw) {
	p++;
	setTimeout(fget, 1000);
};

var flet = function(text) {
	if (p >= ralpha.length) { p = -1; }

	if (p < 0) {
		// delete line
		jsonRequest(
			{
				cmd:  'alter',
				user:  user,
				pass:  pass,
				time:  rtime,
				cid:   Jools.uid(),
				chgX: {
					src : {
						path: ['meshcraft:home', itemid, 'doc', '1', 'text'],
						at1:   0,
						at2:   text.length
					},
					trg : {
						val: null
					}
				}
			},
			fletasw
		);
	} else {
		jsonRequest(
			{
				cmd:  'alter',
				user:  user,
				pass:  pass,
				time:  rtime,
				cid:   Jools.uid(),
				chgX: {
					src : {
						val: ralpha[p]
					},
					trg : {
						path: ['meshcraft:home', itemid, 'doc', '1', 'text'],
						at1:   0
					}
				}
			},
			fletasw
		);
	}
};

fget();



})();
