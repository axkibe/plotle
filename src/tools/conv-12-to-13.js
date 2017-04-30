/*
| Converts a v12 repository to v13.
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
		name : 'ideoloom-12'
	},
	trg :
	{
		host : '127.0.0.1',
		port : 27017,
		name : 'ideoloom-13'
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
	convertChange,
	convertChangeRay,
	convertChangeSkid,
	connectToSource,
	connectToTarget,
	fabric_spaceRef,
	mongodb,
	resume,
	run,
	json_typemap,
	sus,
	util;


fabric_spaceRef = require( '../fabric/spaceRef' );

mongodb = require( 'mongodb' );

sus = require( 'suspend' );

resume = sus.resume;

json_typemap = require( '../json/typemap' );

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
| Converts a change
*/
convertChange =
	function(
		c
	)
{
	var
		a,
		aZ,
		keys;

	if( typeof( c ) === 'string' || c instanceof String ) return;

	if( json_typemap[ c.type ] )
	{
		c.type = json_typemap[ c.type ];
	}

	keys = Object.keys( c );

	for( a = 0, aZ = keys.length; a < aZ; a++ )
	{
		convertChange( c[ keys[ a ] ] );
	}
};


/*
| Converts a changeRay of a change
*/
convertChangeRay =
	function(
		cr
	)
{
	var
		a,
		aZ;

	for( a = 0, aZ = cr.length; a < aZ; a++ )
	{
		convertChange( cr[ a ] );
	}
};


/*
| Converts a change skid.
*/
convertChangeSkid =
	function(
		cs
	)
{
	convertChangeRay( cs.changeRay.ray );
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

	if( o.version !== 12 )
	{
		throw new Error( 'src is not a v12 repository' );
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
			version : 13
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
			cs = yield changesCursor.nextObject( resume( ) );
			cs !== null;
			cs = yield changesCursor.nextObject( resume( ) )
		)
		{
			convertChangeSkid( cs );

			if( false ) console.log( util.inspect( cs, false, null ) );

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

