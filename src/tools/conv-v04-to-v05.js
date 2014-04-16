/*
| Converts a v04 repository to v05
|
| Authors: Axel Kittenberger
*/

/*
| This tool is configered directly here
*/
var
	config =
		{
			src :
			{
				host :
					'127.0.0.1',
				port :
					27017,
				name :
					'meshcraft04'
			},
			trg :
			{
				host :
					'127.0.0.1',
				port :
					27017,
				name :
					'meshcraft05'
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
GLOBAL.CHECK =
	true;
GLOBAL.JOOBJ =
	false;
GLOBAL.SERVER =
	true;
GLOBAL.SHELL =
	false;


/*
| Imports
*/
var
	mongodb =
		require( 'mongodb' ),
	sus =
		require( 'suspend' );


/*
| Change translation.
*/
var translateChange =
	function(
		chg
	)
{
	var
		src =
			chg.chgX.src,
		trg =
			chg.chgX.trg;

	if( src.path )
	{
		if( src.path[ 1 ] === 'doc' )
		{
			src.path.splice( 2, 0, 'twig' );
		}

		src.path.splice( 0, 0, 'twig' );
	}

	if( trg.path )
	{
		if( trg.path[ 1 ] === 'doc' )
		{
			trg.path.splice( 2, 0, 'twig' );
		}

		trg.path.splice( 0, 0, 'twig' );
	}

	if(
		src.val
		&&
		src.val.type === 'Note'
		&&
		src.val.twig
	)
	{
		console.log( 'Fixing malformed ' + src.val.type + ' src' );

		if( src.val.twig.type !== src.val.type )
		{
			throw new Error( 'what the ?' );
		}

		for( var k in src.val.twig )
		{
			src.val[ k ] =
				src.val.twig[ k ];
		}

		delete src.val.twig;
	}

	return chg;
};


/*
| The main runner.
*/
var run =
	function*( )
{

	var
		src =
			{ },
		trg =
			{ };

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

	if( o.version !== 4 )
	{
		throw new Error( 'src is not a v4 repository' );
	}

	console.log( '* creating trg.global' );

	yield trg.global.insert(
		{
			_id :
				'version',
			version :
				5
		},
		sus.resume( )
	);

	console.log( '* copying src.users -> trg.users' );

	cursor =
		yield src.users.find( sus.resume( ) );

	var
		users =
			{ };

	for(
		o = yield cursor.nextObject( sus.resume( ) );
		o !== null;
		o = yield cursor.nextObject( sus.resume( ) )
	)
	{
		users[ o._id ] =
			o;

		yield trg.users.insert( o, sus.resume( ) );
	}

	console.log( '* copying src.spaces -> trg.spaces' );

	cursor =
		yield src.spaces.find( sus.resume( ) );

	var
		spaces =
			{ };

	for(
		o = yield cursor.nextObject( sus.resume( ) );
		o !== null;
		o = yield cursor.nextObject( sus.resume( ) )
	)
	{
		spaces[ o._id ] =
			o;

		yield trg.spaces.insert( o, sus.resume( ) );
	}

	console.log( '* copying src.changes.* -> trg.changes.*' );

	for( var spaceName in spaces )
	{
		console.log(
			' * copying src.changes.' + spaceName +
			' -> trg.changes.' + spaceName );

		var
			sc =
				yield src.connection.collection(
					'changes:' + spaceName,
					sus.resume( )
				),
			tc =
				yield trg.connection.collection(
					'changes:' + spaceName,
					sus.resume( )
				);

		cursor =
			yield sc.find( sus.resume( ) );

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

