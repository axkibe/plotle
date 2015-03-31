/*
| Converts a v10 repository to v11.
*/

// deactivated
if( true ) return false;


/*
| This tool is configered directly here
*/
var
	config;

config =
{
	src :
	{
		host : '127.0.0.1',
		port : 27017,
		name : 'ideoloom-10'
	},
	trg :
	{
		host : '127.0.0.1',
		port : 27017,
		name : 'ideoloom-11'
	}
};


/*
| Capsule.
*/
(function( ) {
'use strict';


// this is not true albeit
// works as hack.
GLOBAL.APP = 'server';

GLOBAL.FORCE_JION_LOADING = false;

GLOBAL.CHECK = true;

GLOBAL.FREEZE = false;

GLOBAL.JION = false;

// this also not fully true
GLOBAL.SERVER = true;


var
	connectToSource,
	connectToTarget,
	fabric_spaceRef,
	jools,
	mongodb,
	resume,
	run,
	sus,
	translateChange,
	translateChangeRay;

jools = require( '../jools/jools' );

fabric_spaceRef = require( '../fabric/spaceRef' );

mongodb = require( 'mongodb' );

sus = require( 'suspend' );

resume = sus.resume;

root = { };


/*
| Creates a connection to the target.
*/
connectToSource =
	function*( )
{
	var
		connector,
		server;

	server =
		new mongodb.Server(
			config.src.host,
			config.src.port,
			{ }
		);

	connector =
		new mongodb.Db(
			config.src.name,
			server,
			{ w : 1 }
		);

	return yield connector.open( resume( ) );
};


/*
| Creates a connection to the source.
*/
connectToTarget =
	function*( )
{
	var
		connector,
		server;

	server =
		new mongodb.Server(
			config.trg.host,
			config.trg.port,
			{ }
		);

	connector =
		new mongodb.Db(
			config.trg.name,
			server,
			{ w : 1 }
		);

	return yield connector.open( resume( ) );
};


translateChange =
	function(
		c10
	)
{
	if( c10.type !== 'change_set' )
	{
		return c10;
	}

	if( c10.val === null )
	{
		c10.type = 'change_shrink';

		delete c10.val;

		return c10;
	}

	if( c10.prev === null )
	{
		c10.type = 'change_grow';

		delete c10.prev;

		return c10;
	}

	delete c10.rank;

	return c10;
};


translateChangeRay =
	function(
		cr10
	)
{
	var
		a, aZ;

	for(
		a = 0, aZ = cr10.changeRay.ray.length;
		a < aZ;
		a++
	)
	{
		translateChange( cr10.changeRay.ray[ a ] );
	}

	return cr10;
};


/*
| The main runner.
*/
run =
	function*( )
{
	var
		changesCursor,
		cursor,
		c,
		o,
		spaces,
		spaceRef,
		srcChanges,
		srcConnection,
		srcSpaces,
		srcUsers,
		trgConnection,
		trgChanges,
		trgGlobal,
		trgSpaces,
		trgUsers;

	console.log( '* connecting to src' );

	srcConnection = yield* connectToSource( );

	console.log( '* connecting to trg' );

	trgConnection = yield* connectToTarget( );

	console.log( '* dropping trg' );

	yield trgConnection.dropDatabase( resume( ) );

	srcUsers = yield srcConnection.collection( 'users', resume( ) );

	srcSpaces = yield srcConnection.collection( 'spaces', resume( ) );

	trgGlobal = yield trgConnection.collection( 'global', resume( ) );

	trgUsers = yield trgConnection.collection( 'users', resume( ) );

	trgSpaces = yield trgConnection.collection( 'spaces', resume( ) );

	console.log( '* creating trg.global' );

	yield trgGlobal.insert(
		{
			_id : 'version',
			version : 11
		},
		resume( )
	);

	console.log( '* copying src.users -> trg.users' );

	cursor = yield srcUsers.find( resume( ) );

	for(
		o = yield cursor.nextObject( resume( ) );
		o !== null;
		o = yield cursor.nextObject( resume( ) )
	)
	{
		console.log( ' * ' + o._id );

		yield trgUsers.insert( o, resume( ) );
	}

	console.log( '* copying src.spaces -> trg.spaces' );

	spaces = { };

	cursor =
		yield srcSpaces.find(
			{ },
			{ sort: '_id' },
			sus.resume( )
		);

	for(
		o = yield cursor.nextObject( resume( ) );
		o !== null;
		o = yield cursor.nextObject( resume( ) )
	)
	{
		yield trgSpaces.insert( o, resume( ) );

		spaceRef =
			fabric_spaceRef.create(
				'username', o.username,
				'tag', o.tag
			);

		console.log( ' * translating changes of "' + spaceRef.fullname + '"' );

		srcChanges = yield srcConnection.collection( 'changes:' + spaceRef.fullname, resume( ) );

		trgChanges = yield trgConnection.collection( 'changes:' + spaceRef.fullname, resume( ) );

		changesCursor =
			(
				yield srcChanges.find(
					{ },
					{ sort: '_id' },
					sus.resume( )
				)
			).batchSize( 100 );

		for(
			c = yield changesCursor.nextObject( resume( ) );
			c !== null;
			c = yield changesCursor.nextObject( resume( ) )
		)
		{
			yield trgChanges.insert( translateChangeRay( c ), resume( ) );
		}
	}

	console.log( '* closing connections' );

	srcConnection.close( );

	trgConnection.close( );

	console.log( '* done' );
};

sus( run )( );

} )( );

