/*
| Converts a v05 repository to v06
|
| Authors: Axel Kittenberger
*/

/*
| This tool is configered directly here
*/
var
config,

config =
{
src :
{
	host :
		'127.0.0.1',
	port :
		27017,
	name :
		'meshcraft05'
},
trg :
{
	host :
		'127.0.0.1',
	port :
		27017,
	name :
		'ideoloom-1'
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
	sign.type = 'sign';

	if( !sign.val )
	{
		return sign;
	}

	if( sign.val.type === 'Point' )
	{
		sign.val.type = 'point';

		return sign;
	}

	if( sign.val.type === 'Label' )
	{
		sign.val.type = 'label';
	}

	if( sign.val.type === 'Note' )
	{
		sign.val.type = 'note';
	}

	if( sign.val.type === 'Relation' )
	{
		sign.val.type = 'relation';
	}

	if( sign.val.type === 'Rect' )
	{
		sign.val.type = 'rect';
	}

	if( sign.val.pnw && sign.val.pnw.type === 'Point' )
	{
		sign.val.pnw.type = 'point';
	}

	if( sign.val.pse && sign.val.pse.type === 'Point' )
	{
		sign.val.pse.type = 'point';
	}

	if( sign.val.zone && sign.val.zone.type === 'Rect' )
	{
		sign.val.zone.type = 'rect';
	}

	if( sign.val.zone && sign.val.zone.pnw.type === 'Point' )
	{
		sign.val.zone.pnw.type = 'point';
	}

	if( sign.val.zone && sign.val.zone.pse.type === 'Point' )
	{
		sign.val.zone.pse.type = 'point';
	}

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
		case 'Change' :
		case undefined :

			chg.chgX.type = 'change';
			break;

		default :
			throw new Error( );
	}

	chg.chgX.src = translateSign( chg.chgX.src );

	chg.chgX.trg = translateSign( chg.chgX.trg );

/*
	switch( chg.chgX.src.type )
	{
		case 'Sign' :

//			chg.chgX.src.type = 'sign';

			break;

		case undefined :

//			chg.chgX.src.type = 'sign';

			break;

		default :
			console.log( chg.chgX.src.type );

			throw new Error( chg.chgX.src.type );
	}

	switch( chg.chgX.trg.type )
	{
		case 'Sign' :
		case undefined :

//			chg.chgX.trg.type = 'sign';

			break;

		default :
			throw new Error( chg.chgX.trg.type );
	}
*/

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
		sourceSpaceName,
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

	if( o.version !== 5 )
	{
		throw new Error( 'src is not a v5 repository' );
	}

	console.log( '* creating trg.global' );

	yield trg.global.insert(
		{
			_id :
				'version',
			version :
				6
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
		switch( o._id )
		{
			case 'meshcraft:home' :

				o._id = 'ideoloom:home';

				break;

			case 'meshcraft:sandbox' :

				o._id = 'ideoloom:sandbox';

				break;
		}
		spaces[ o._id ] = o;

		yield trg.spaces.insert( o, sus.resume( ) );
	}

	console.log( '* copying src.changes.* -> trg.changes.*' );

	for( var spaceName in spaces )
	{
		switch( spaceName )
		{
			case 'ideoloom:home' :

				sourceSpaceName = 'meshcraft:home';

				break;

			case 'ideoloom:sandbox' :

				sourceSpaceName = 'meshcraft:sandbox';

				break;

			default :

				sourceSpaceName = spaceName;

				break;
		}

		console.log(
			' * copying src.changes.' + sourceSpaceName +
			' -> trg.changes.' + spaceName
		);

		sc =
			yield src.connection.collection(
				'changes:' + sourceSpaceName,
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

