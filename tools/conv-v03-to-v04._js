#!/usr/local/bin/_node -lp

this is not usable
exit(1);

/*
| Converts a v03 repository to v04
|
| Authors: Axel Kittenberger
*/

/*
| This tool is configered directly here
*/
var config = {
	src : {
		host    : '127.0.0.1',
		port    : 27017,
		name    : 'meshcraft03'
	},

	trg : {
		host    : '127.0.0.1',
		port    : 27017,
		name    : 'meshcraft04'
	}
};


/*
| Capsule
*/
( function(_) {
"use strict";

if( typeof( require ) === 'undefined')
{
	throw new Error( 'this code needs node!' );
}

/**
| Imports
*/
var
	Jools =
		require( '../shared/jools' ),

	mongodb =
		require( 'mongodb' );

// Shortcuts
var is =
	Jools.is;

// initializes the mongodb databases access
var src = { };
var trg = { };

src.server =
	new mongodb.Server(
		config.src.host,
		config.src.port,
		{ }
	);

trg.server =
	new mongodb.Server(
		config.trg.host,
		config.trg.port,
		{ }
	);

src.connector =
	new mongodb.Db(
		config.src.name,
		src.server,
		{
			w :
				1
		}
	);

trg.connector =
	new mongodb.Db(
		config.trg.name,
		trg.server,
		{
			w :
				1
		}
	);

var
	o,
	cursor;

console.log( '* connecting to src' );
src.connection =
	src.connector.open(_);

console.log( '* connecting to trg' );
trg.connection =
	trg.connector.open(_);

console.log( '* dropping trg' );
	trg.connection.dropDatabase(_);

src.global = src.connection.collection('global',  _);
src.spaces = src.connection.collection('spaces',  _);
src.users  = src.connection.collection('users',   _);

trg.global = trg.connection.collection('global',  _);
trg.users  = trg.connection.collection('users',   _);
trg.spaces = trg.connection.collection('spaces',  _);

if( src.global.count(_) == 0 ) {
	console.log('ERROR: src has a no "global" collection');
	process.exit(1);
}

o =
	src.global.findOne(
		{ _id : 'version' },
	_);

if( o.version !== 3 )
{
	throw new Error( 'src is not a v3 repository ' );
}

console.log('* creating trg.global');

trg.global.insert(
	{
		_id     : 'version',
		version : 4
	},
_);

console.log('* copying src.users -> trg.users');

cursor =
	src.users.find(_);

var
	users =
		{ };

for(
	o = cursor.nextObject(_);
	o !== null;
	o = cursor.nextObject(_)
)
{
	users[o._id] =
	 o;

	trg.users.insert( o, _);
}

console.log( '* copying src.spaces -> trg.spaces' );

cursor =
	src.spaces.find(_);

var
	spaces =
		{ },

	a, aZ;

for(
	o = cursor.nextObject(_);
	o !== null;
	o = cursor.nextObject(_)
)
{
	spaces[ o._id ] =
		o;

	trg.spaces.insert( o, _);
}

console.log( '* copying src.changes.* -> trg.changes.*' );

var translatePath =
	function(path)
{
	for(
		var a = 0;
		a < path.length;
		a++
	)
	{
		if( path[ a ].length === 18 || path[ a ] === '1' )
		{
			path.splice( a, 0, 'copse' );
			a++;
		}
	}
};


for( var spaceName in spaces )
{
	console.log(
		' * copying src.changes.' + spaceName +
		' -> trg.changes.' + spaceName );

	var sc =
		src.connection.collection( 'changes:' + spaceName, _);

	var tc =
		trg.connection.collection( 'changes:' + spaceName, _);

	cursor = sc.find(_);

	for(
		o = cursor.nextObject(_);
		o !== null;
		o = cursor.nextObject(_)
	)
	{
		var
			s =
				o.chgX.src,

			t =
				o.chgX.trg;

		/*
		if( s.val && typeof( s.val.fontsize ) === 'number' )
		{
			if( !s.val.doc ) {
				throw new Error( 'doc missing for fontsize!' );
			}

			s.val.doc.fontsize =
				s.val.fontsize;

			delete s.val.fontsize;
		}
		*/

		if( s.path )
		{
			translatePath( s.path );
		}

		if( t.path )
		{
			translatePath( t.path );
		}


		// s.path[ s.path.length - 1 ] === 'fontsize' )
		// {
		//	s.path[ s.path.length - 1 ] = 'doc';
		//	s.path[ s.path.length - 1 ] = 'fontsize';
		// }

		/*
		if( t.val && typeof( t.val.fontsize ) === 'number' )
		{
			if( !t.val.doc ) {
				throw new Error( 'doc missing for fontsize!' );
			}

			t.val.doc.fontsize =
				t.val.fontsize;

			delete t.val.fontsize;
		}

		if( t.path && t.path[ t.path.length - 1 ] === 'fontsize' )
		{
			t.path[ t.path.length - 1 ] = 'doc';
			t.path[ t.path.length - 1 ] = 'fontsize';
		}
		*/



		tc.insert( o, _)
	}
}


/*
cursor = src.changes.find(_);

	if (!users[o.user] && o.user.substr(0,5) !== 'visit' ) {
		console.log('ERROR: user: '+o.user+' not in users table');
		process.exit(1);
	}

	var cSrc = o.chgX.src;
	var cTrg = o.chgX.trg;

	if (cSrc.path) {
		cSrc.space = translateSpaceName(cSrc.path[0]);
		cSrc.path.shift();
	}

	if (cTrg.path) {
		cTrg.space = translateSpaceName(cTrg.path[0]);
		cTrg.path.shift();
	}

	var space;
	if (cSrc.space && cTrg.space) {
		if (cSrc.space !== cTrg.space) {
			console.log('ERROR: paths mismatch at change._id ' + o._id);
			process.exit(1);
		}
		space = cSrc.space;
	} else if (cSrc.space)
		{ space = cSrc.space; }
	else if (cTrg.space)
		{ space = cTrg.space; }
	else {
		console.log('ERROR: paths mising at change._id ' + o._id);
		process.exit(1);
	}

	if (!is(spaces[space])) {
		trg.spaces.insert({
			_id : space
		}, _);

		spaces[space] = 0;
	}

	// skips old style space creations
	if (cSrc.val && cSrc.val.type === 'Space')
		{ continue; }

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
*/

console.log( '* closing connections' );
src.connection.close( );
trg.connection.close( );

console.log( '* done' );

} )( function( err, asw ) {
	'use strict';
	if( err )
	{
		throw err;
	}
} );
