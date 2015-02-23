/*
| Converts a v8 repository to v9.
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
		name : 'ideoloom-8'
	},
	trg :
	{
		host : '127.0.0.1',
		port : 27017,
		name : 'ideoloom-9'
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

GLOBAL.CONVERT = true;

GLOBAL.FREEZE = false;

GLOBAL.JION = false;

// this also not fully true
GLOBAL.SERVER = true;


/*
| Imports
*/
var
	connectToTarget,
	database_repository,
	fabric_spaceRef,
	mongodb,
	resume,
	run,
	server_spaceBox,
	sus;

database_repository = require( '../database/repository' );

fabric_spaceRef = require( '../fabric/spaceRef' );

mongodb = require( 'mongodb' );

server_spaceBox = require( '../server/spaceBox' );

sus = require( 'suspend' );

resume = sus.resume;

root = { };

/*
| creates a connection to target
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


/*
| The main runner.
*/
run =
	function*( )
{
	var
		a,
		aZ,
		cursor,
		o,
		spaces,
		spaceBox,
		spaceRef,
		srcConfig,
		trgChanges,
		srcDatabase,
		trgGlobal,
		trgUsers,
		trgSpaces,
		trgConnection;

	srcConfig = {
		database_name : config.src.name,
		database_host : config.src.host,
		database_port : config.src.port,
		database_version : 8
	};

	console.log( '* connecting to src' );

	srcDatabase = yield* database_repository.connect( srcConfig );

	// spaceBox is using this global
	root.repository = srcDatabase;

	console.log( '* connecting to trg' );

	trgConnection = yield* connectToTarget( );

	console.log( '* dropping trg' );

	yield trgConnection.dropDatabase( resume( ) );

	trgGlobal = yield trgConnection.collection( 'global', resume( ) );

	trgUsers = yield trgConnection.collection( 'users', resume( ) );

	trgSpaces = yield trgConnection.collection( 'spaces', resume( ) );

	console.log( '* creating trg.global' );

	yield trgGlobal.insert(
		{
			_id : 'version',
			version : 9
		},
		resume( )
	);

	console.log( '* copying src.users -> trg.users' );

	cursor = yield srcDatabase.users.find( resume( ) );

	for(
		o = yield cursor.nextObject( resume( ) );
		o !== null;
		o = yield cursor.nextObject( resume( ) )
	)
	{
		console.log( ' * ' + o._id );

		yield trgUsers.insert( o, resume( ) );
	}

	console.log( '* loading and replaying all spaces' );

	spaces = { };

	cursor =
		yield srcDatabase.spaces.find(
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
		spaceRef =
			fabric_spaceRef.create(
				'username', o.username,
				'tag', o.tag
			);

		console.log( ' * loading and replaying "' + spaceRef.fullname + '"' );

		spaces[ spaceRef.fullname ] =
		spaceBox =
			yield* server_spaceBox.loadSpace( spaceRef );

		console.log( ' * writing "' + spaceRef.fullname + '"' );

		yield trgSpaces.insert( o, resume( ) );

		trgChanges =
			trgConnection.collection( 'changes:' + spaceRef.fullname );

		for(
			a = 1, aZ = spaceBox._changeSkids.length;
			a < aZ;
			a++
		)
		{
			yield trgChanges.insert(
				JSON.parse( JSON.stringify( spaceBox._changeSkids.get( a ) ) ),
				resume( )
			);
		}
	}

	console.log( '* closing connections' );

	srcDatabase.close( );

	trgConnection.close( );

	console.log( '* done' );
};

sus( run )( );

} )( );

