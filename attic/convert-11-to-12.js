/*
| Converts a v11 repository to v12.
*/


// deactivated
return false;


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
		name : 'ideoloom-11'
	},
	trg :
	{
		host : '127.0.0.1',
		port : 27017,
		name : 'ideoloom-12'
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
	convertUser,
	fabric_spaceRef,
	jools,
	mongodb,
	resume,
	run,
	sus;

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


/*
| Converts the user.
*/
convertUser =
	function( o )
{
	o.passhash = o.pass;

	delete o.pass;

	return o;
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
		srcGlobal,
		srcUsers,
		trgConnection,
		trgChanges,
		trgGlobal,
		trgSpaces,
		trgUsers;

	console.log( '* connecting to src' );

	srcConnection = yield* connectToSource( );

	srcGlobal =
		yield srcConnection.collection( 'global', resume( ) );

	o =
		yield srcGlobal.findOne(
			{ _id : 'version' },
			resume( )
		);

	if( o.version !== 11 )
	{
		throw new Error( 'src is not a v11 repository' );
	}

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
			version : 12
		},
		resume( )
	);

	console.log( '* converting src.users -> trg.users' );

	cursor = yield srcUsers.find( resume( ) );

	for(
		o = yield cursor.nextObject( resume( ) );
		o !== null;
		o = yield cursor.nextObject( resume( ) )
	)
	{
		console.log( ' * ' + o._id );

		yield trgUsers.insert( convertUser( o ), resume( ) );
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

		console.log( ' * copying changes of "' + spaceRef.fullname + '"' );

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
			yield trgChanges.insert( c, resume( ) );
		}
	}

	console.log( '* closing connections' );

	srcConnection.close( );

	trgConnection.close( );

	console.log( '* done' );
};

sus( run )( );

} )( );

