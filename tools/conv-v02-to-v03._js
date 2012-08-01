#!/usr/local/bin/_node -lp
/**                                                      _.._
                                                      .-'_.._''.
 __  __   ___       _....._              .          .' .'     '.\
|  |/  `.'   `.   .'       '.          .'|         / .'                                _.._
|   .-.  .-.   ' /   .-'"'.  \        (  |        . '            .-,.-~.             .' .._|    .|
|  |  |  |  |  |/   /______\  |        | |        | |            |  .-. |    __      | '      .' |_
|  |  |  |  |  ||   __________|    _   | | .'''-. | |            | |  | | .:-`.'.  __| |__  .'     |
|  |  |  |  |  |\  (          '  .' |  | |/.'''. \. '            | |  | |/ |   \ ||__   __|'-..  .-'
|  |  |  |  |  | \  '-.___..-~. .   | /|  /    | | \ '.         .| |  '- `" __ | |   | |      |  |
|__|  |__|  |__|  `         .'.'.'| |//| |     | |  '. `.____.-'/| |      .'.''| |   | |      |  |
                   `'-.....-.'.'.-'  / | |     | |    `-._____ / | |     / /   | |_  | |      |  '.'
                                 \_.'  | '.    | '.           `  |_|     \ \._,\ '/  | |      |   /
                                       '___)   '___)                      `~~'  `"   |_|      `--'

~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

 Converts a v02 repository to v03

 Authors: Axel Kittenberger
 License: MIT(Expat), see accompanying 'License'-file

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

/**
| This tool is configered directly here
*/
var config = {
	src : {
		host    : '127.0.0.1',
		port    : 27017,
		name    : 'meshcraft02'
	},

	trg : {
		host    : '127.0.0.1',
		port    : 27017,
		name    : 'meshcraft03'
	}
};

/**
| Capsule
*/
(function(_){
"use strict";
if (typeof(require) === 'undefined') { throw new Error('this code needs node!'); }

/**
| Imports
*/
var Jools    = require('../shared/jools');
var mongodb  = require('mongodb');

// Shortcuts
var is           = Jools.is;

// initializes the mongodb databases access
var src = {};
var trg = {};

src.server  = new mongodb.Server(
	config.src.host,
	config.src.port,
	{}
);

trg.server  = new mongodb.Server(
	config.trg.host,
	config.trg.port,
	{}
);

src.connector = new mongodb.Db(
	config.src.name,
	src.server,
	{}
);

trg.connector = new mongodb.Db(
	config.trg.name,
	trg.server,
	{}
);

var o, cursor;

console.log('* connecting to src');
src.connection = src.connector.open(_);
console.log('* connecting to trg');
trg.connection = trg.connector.open(_);

console.log('* dropping trg');
trg.connection.dropDatabase(_);

src.global   = src.connection.collection('global',  _);
src.changes  = src.connection.collection('changes', _);
src.invites  = src.connection.collection('invites', _);
src.users    = src.connection.collection('users',   _);

trg.global   = trg.connection.collection('global',  _);
trg.users    = trg.connection.collection('users',   _);
trg.spaces   = trg.connection.collection('spaces',  _);

if (src.global.count(_) > 0) {
	console.log('ERROR: src has a "global" collection, but v02 had not!');
	process.exit(1);
}


console.log('* creating trg.global');
trg.global.insert({
	_id     : 'version',
	version : 3
});

console.log('* copying src.users -> trg.users');
cursor = src.users.find(_);
var users = {};
for(o = cursor.nextObject(_); o !== null; o = cursor.nextObject(_)) {
	users[o._id] = o;
	trg.users.insert(o, _);
}

if (!users.meshcraft) {
	console.log('* adding the "meshcraft" user');
	var meshcraftUserPass = Jools.randomPassword(12);
	console.log('* meshcraft user\'s password: ' + meshcraftUserPass);

	trg.users.insert({
		_id       : 'meshcraft',
		pass      : Jools.passhash(meshcraftUserPass),
		clearPass : meshcraftUserPass,
		mail      : ''
	});
}

// counts for all spaces
var spaces = {};

console.log('* converting src.changes to trg.space:*');
cursor = src.changes.find(_);
for (o = cursor.nextObject(_); o !== null; o = cursor.nextObject(_)) {

	if (!users[o.user] && o.user.substr(0,5) !== 'visit' ) {
		console.log('ERROR: user: '+o.user+' not in users table');
		process.exit(1);
	}

	var sp = o.chgX.src.path;
	var tp = o.chgX.trg.path;
	var spacename;

	if (sp && tp) {
		if (sp[0] !== tp[0]) {
			console.log('ERROR: paths mismatch at change._id ===' + o._id);
			process.exit(1);
		}
		spacename = sp[0];
	} else if (sp)
		{ spacename = sp[0]; }
	else if (tp)
		{ spacename = tp[0]; }
	else {
		console.log('ERROR: paths mismatch at change._id ===' + o._id);
		process.exit(1);
	}

	if (!Jools.isString(spacename)) {
		console.log('ERROR: spacename not a string');
		process.exit(1);
	}

	var tspace = null;
	switch(spacename) {
	case 'welcome' : tspace = 'meshcraft:home';    break;
	case 'sandbox' : tspace = 'meshcraft:sandbox'; break;
	}

	if (tspace) {
		spacename = tspace;
		if (sp) { sp[0] = spacename; }
		if (tp) { tp[0] = spacename; }
	}

	if (!is(spaces[spacename])) {
		trg.spaces.insert({
			_id : spacename
		}, _);
		spaces[spacename] = 0;
	}

	o._id = ++spaces[spacename];

	var cname = 'changes:' + spacename;
	if (!trg[cname])
		{ trg[cname] = trg.connection.collection(cname, _); }

	trg[cname].insert(o, _);
}

console.log('* created:');
for(var a in spaces) {
	console.log('  changes:'+a+'  '+spaces[a]);
}

console.log('* closing connections');
src.connection.close();
trg.connection.close();

console.log('* done');

})(function(err, asw) {
	'use strict';
	if (err) {
		console.log('Error: ' + err.message);
		process.exit(1);
	}
});
