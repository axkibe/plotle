#!/usr/local/bin/_node -lp

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

src.global = src.connection.collection( 'global',  _);
src.spaces = src.connection.collection( 'spaces',  _);
src.users  = src.connection.collection( 'users',   _);

trg.global = trg.connection.collection( 'global',  _);
trg.users  = trg.connection.collection( 'users',   _);
trg.spaces = trg.connection.collection( 'spaces',  _);

if( src.global.count(_) == 0 )
{
	console.log( 'ERROR: src has a no "global" collection' );
	process.exit( 1 );
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

var
	translateChange =
		function( o )
{
	if(
		Jools.isString( o ) ||
		typeof( o ) === 'number' ||
		o === null
	)
	{
		return o;
	}

	var
		t =
			o instanceof Array ?
			[ ] :
			{ };

	for( var k in o )
	{
		t[ k === 'copse' ? 'twig' : k ] =
			translateChange( o[ k ] );
	}

	if( t.type === 'Point' && t.twig )
	{
		if( t.x )
		{
			if( t.x !== t.twig.x )
			{
				throw new Error( 'x mismatch' );
			}
		}
		else
		{
			t.x =
				t.twig.x;
		}

		if( t.y )
		{
			if( t.y !== t.twig.y )
			{
				throw new Error( 'y mismatch' );
			}
		}
		else
		{
			t.y =
				t.twig.y;
		}

		delete t.twig;
	}

	return t;
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
		o = translateChange( o );

		tc.insert( o, _)
	}
}

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
