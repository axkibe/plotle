#!/usr/local/bin/node
/**
| Creates an invitation code.
*/
/**
| Capsule
*/
(function() {
"use strict";

var config   = require('../config');
var mongodb  = require('mongodb');

var args = process.argv;
if (args.length < 3) {
	console.log('Comment missing');
	process.exit(1);
}
var comment = process.argv[2];

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

/**
| Connects to the database.
*/
var connect = function() {
	db.connector.open(function(err, connection) {
		if (err !== null) { throw new Error('Cannot connect to database: '+err); }
		db.connection = connection;
		aquireInvites();
	});
};

var code;

/**
| Creates a new code.
*/
var createCode = function() {
	code = '' + Math.floor(0x100000000 * Math.random()).toString(16);
};

/**
| aquires the invitesCollection
*/
var aquireInvites = function() {
	db.connection.collection('invites', function(err, invites) {
		if (err !== null) { throw new Error('database fail: '+err); }
		db.invites = invites;
		createCode();
		insertCode();
	});
};

var insertCode = function() {
	db.invites.insert({
		_id     : code,
		comment : comment,
		date    : Date.now()
	}, function(err, count) {
		if (err !== null) {
			console.log('Oops invitation code already exists trying another.');
			createCode();
			insertCode();
			return;
		}
		console.log();
		console.log('CODE: ' + code);
		console.log();
		db.connection.close();
	});
};

connect();

})();

