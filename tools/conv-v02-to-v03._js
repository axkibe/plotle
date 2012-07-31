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
var Jools       = require('../shared/jools');
var mongodb     = require('mongodb');

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

src.global   = src.connection.collection('global', _);
src.changes  = src.connection.collection('changes', _);
src.invites  = src.connection.collection('invites', _);
src.users    = src.connection.collection('users', _);

trg.global   = trg.connection.collection('global', _);
trg.users    = trg.connection.collection('users', _);

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
	var sp = o.chgX.src.path;
	var tp = o.chgX.trg.path;
	var space;

	if (!users[o.user]) {
		console.log('ERROR: user: '+o.user+' not in users table');
		process.exit(1);
	}

	if (sp && tp) {
		if (sp[0] !== tp[0]) {
			console.log('ERROR: paths mismatch at change._id ===' + o._id);
			process.exit(1);
		}
		space = sp[0];
	} else if (sp)
		{ space = sp[0]; }
	else if (tp)
		{ space = tp[0]; }
	else {
		console.log('ERROR: paths mismatch at change._id ===' + o._id);
		process.exit(1);
	}

	var tspace = null;
	switch(space) {
	case 'welcome' : tspace = 'meshcraft:home';    break;
	case 'sandbox' : tspace = 'meshcraft:sandbox'; break;
	}

	if (tspace) {
		space = tspace;
		if (sp) { sp[0] = space; }
		if (tp) { tp[0] = space; }
	}

	if (!is(spaces[space]))
		{ spaces[space] = 0; }

	o._id = ++spaces[space];

	var cname = 'changes:' + space;
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
