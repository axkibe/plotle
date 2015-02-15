/*
| Converts a v6 repository to v7
|
| Authors: Axel Kittenberger
*/

// deactivated
if( true ) return false;

/*
| This tool is configered directly here
*/
var
config,

config =
{
	src :
	{
		host : '127.0.0.1',
		port : 27017,
		name : 'ideoloom-1'
	},
	trg :
	{
		host : '127.0.0.1',
		port : 27017,
		name : 'ideoloom-7'
	}
};


/*
| Capsule.
*/
(function( ) {
'use strict';


/*
| Turn on checking on server side by default.
*/
GLOBAL.CHECK = true;

GLOBAL.JION = false;

GLOBAL.SERVER = true;

GLOBAL.SHELL = false;


/*
| Imports
*/
var
mongodb,
sus;

mongodb = require( 'mongodb' );

sus = require( 'suspend' );


/*
| Translates a sign.
*/
var translateSign =
	function(
		sign
	)
{
	sign.type = 'ccot.sign';

	return sign;
};


/*
| Translates a change.
*/
var translateChange =
	function(
		chg
	)
{
	switch( chg.chgX.type )
	{
		case 'jion.change' :

			chg.chgX.type = 'ccot.change';

			break;

		default :

			throw new Error( );
	}

	chg.chgX.src = translateSign( chg.chgX.src );

	chg.chgX.trg = translateSign( chg.chgX.trg );

	return chg;
};


/*
| The main runner.
*/
var run =
	function*( )
{
	var
		cursor,
		o,
		sc,
		spaces,
		src,
		tc,
		trg,
		users;

	src = { };

	trg = { };

	// initializes the mongodb databases access
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
				w : 1
			}
		);

	trg.connector =
		new mongodb.Db(
			config.trg.name,
			trg.server,
			{
				w : 1
			}
		);

	console.log( '* connecting to src' );

	src.connection =
		yield src.connector.open( sus.resume( ) );

	console.log( '* connecting to trg' );

	trg.connection =
		yield trg.connector.open( sus.resume( ) );

	console.log( '* dropping trg' );
		yield trg.connection.dropDatabase( sus.resume( ) );

	src.global =
		yield src.connection.collection( 'global',  sus.resume( ) );

	src.spaces =
		yield src.connection.collection( 'spaces', sus.resume( ) );

	src.users =
		yield src.connection.collection( 'users', sus.resume( ) );

	trg.global =
		yield trg.connection.collection( 'global', sus.resume( ) );

	trg.users =
		yield trg.connection.collection( 'users', sus.resume( ) );

	trg.spaces =
		yield trg.connection.collection( 'spaces', sus.resume( ) );

	if( ( yield src.global.count( sus.resume( ) ) ) === 0 )
	{
		console.log( 'ERROR: src has a no "global" collection' );

		process.exit( 1 );
	}

	o =
		yield src.global.findOne(
			{ _id : 'version' },
			sus.resume( )
		);

	if( o.version !== 6 )
	{
		throw new Error( 'src is not a v6 repository' );
	}

	console.log( '* creating trg.global' );

	yield trg.global.insert(
		{
			_id :
				'version',
			version :
				7
		},
		sus.resume( )
	);

	console.log( '* copying src.users -> trg.users' );

	cursor = yield src.users.find( sus.resume( ) );

	users = { };

	for(
		o = yield cursor.nextObject( sus.resume( ) );
		o !== null;
		o = yield cursor.nextObject( sus.resume( ) )
	)
	{
		users[ o._id ] = o;

		yield trg.users.insert( o, sus.resume( ) );
	}

	console.log( '* copying src.spaces -> trg.spaces' );

	cursor =
		yield src.spaces.find( sus.resume( ) );

	spaces = { };

	for(
		o = yield cursor.nextObject( sus.resume( ) );
		o !== null;
		o = yield cursor.nextObject( sus.resume( ) )
	)
	{
		spaces[ o._id ] = o;

		yield trg.spaces.insert( o, sus.resume( ) );
	}

	console.log( '* copying src.changes.* -> trg.changes.*' );

	for( var spaceName in spaces )
	{
		console.log(
			' * copying src.changes.' + spaceName +
			' -> trg.changes.' + spaceName
		);

		sc =
			yield src.connection.collection(
				'changes:' + spaceName,
				sus.resume( )
			);

		tc =
			yield trg.connection.collection(
				'changes:' + spaceName,
				sus.resume( )
			);

		cursor = yield sc.find( sus.resume( ) );

		for(
			o = yield cursor.nextObject( sus.resume( ) );
			o !== null;
			o = yield cursor.nextObject( sus.resume( ) )
		)
		{
			o =
				translateChange( o );

			yield tc.insert( o, sus.resume( ) );
		}
	}

	console.log( '* closing connections' );

	src.connection.close( );

	trg.connection.close( );

	console.log( '* done' );
};

sus( run )( );

} )( );

