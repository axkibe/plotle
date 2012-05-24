#!/usr/local/bin/_node -lp
/**
| This ticker will write in short sequences to a note.
| Used for debugging
|
| Authors: Axel Kittenberger
| License: MIT(Expat), see accompanying 'License'-file
*/

var fs       = require('fs');
var http     = require('http');
var mongodb  = require('mongodb');
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
	host   : config.ip,
	port   : config.port,
	path   : '/mm',
	method : 'POST'
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
			callback(null, {
				code : res.statusCode,
				asw  : asw
			});
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
var jsonRequest = function(cmd, _) {
	var s = JSON.stringify(cmd);
	console.log('> '+s);
	var r = request(s, _);
	var asw = r.asw;
	try {
		if (asw) { asw = JSON.parse(asw); }
	} catch (err) { throw new Error('# ('+r.code+') answer not JSON: '+asw); }

	console.log('< ', r.asw);
	return asw;
};

/**
| Main program.
*/
console.log('Talking to ' + ops.host + ':' + ops.port + ops.path);

var init = function(_) {

	var db = {};
	db.server    = new mongodb.Server(
		config.database.host,
		config.database.port,
		{}
	);
	db.connector = new mongodb.Db(
		config.database.name,
		db.server,
		{}
	);

	db.connection = db.connector.open(_);
	console.log('Connected to database');
	db.users   = db.connection.collection('users', _);

	var root = db.users.findOne({ _id: 'root'}, _);
	db.connection.close();

	if (!root) {
		console.log('Cannot find root user.');
		return;
	}

	var asw = jsonRequest({
		cmd: 'alter',
		cid  : uid(),
		user: 'root',
		pass: root.pass,
		time: -1,

		chgX : {
			src : { val: { type: 'Space', cope: {}, ranks: [] } },
			trg : { path : [ spaceName ] }
		}
	}, _);

	if (asw.ok) {
		console.log('Initialized changes collection!');
	} else {
		console.log('Server not OK: '+asw.message);
	}
};

init(function(e, r) {
	if (e) { throw e; }
});

})();
