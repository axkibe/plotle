/*
| Converts a v14 repository to v15.
*/

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
		name : 'ideoloom-14'
	},
	trg :
	{
		host : '127.0.0.1',
		port : 27017,
		name : 'ideoloom-15'
	}
};


/*
| Capsule.
*/
(function( ) {
'use strict';


// this is not true albeit
// works as hack.
global.APP = 'server';

global.FORCE_JION_LOADING = false;

global.CHECK = true;

global.FREEZE = false;

global.JION = false;

global.NODE = true;


var
	convertChangeSkid,
	connectToSource,
	connectToTarget,
	ref_space,
	mongodb,
	resume,
	run,
	sus,
	util;


ref_space = require( '../ref/space' );

mongodb = require( 'mongodb' );

sus = require( 'suspend' );

resume = sus.resume;

root = { };

util = require( 'util' );


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
| Converts a change skid.
*/
convertChangeSkid =
	function(
		cs
	)
{
	cs.changeList = cs.changeRay;

	delete cs.changeRay;

	cs.changeList.type = 'change_list';

	cs.changeList.list = cs.changeList.ray;

	delete cs.changeList.ray;

//	convertChangeRay( cs.changeList.list );
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
		cs,
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

	if( o.version !== 14 )
	{
		throw new Error( 'src is not a v14 repository' );
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
			version : 15
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
			ref_space.create(
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
			cs = yield changesCursor.nextObject( resume( ) );
			cs !== null;
			cs = yield changesCursor.nextObject( resume( ) )
		)
		{
			convertChangeSkid( cs );

//			if( false ) console.log( util.inspect( cs, false, null ) );

			yield trgChanges.insert( cs, resume( ) );
		}
	}

	console.log( '* closing connections' );

	srcConnection.close( );

	trgConnection.close( );

	console.log( '* done' );
};

sus( run )( );

} )( );

