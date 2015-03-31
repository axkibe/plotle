/*
| Converts a v8 repository to v9.
*/

// deactivated
if( true ) return false;


/*
| This tool is configered directly here
*/
var
	config;

var WRITE = true;

config =
{
	src :
	{
		host : '127.0.0.1',
		port : 27017,
		name : 'ideoloom-9'
	},
	trg :
	{
		host : '127.0.0.1',
		port : 27017,
		name : 'ideoloom-10'
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


var
	change_insert,
	change_join,
	change_remove,
	change_set,
	change_split,
	change_ray,
	connectToTarget,
	database9_repository,
	database10_changeSkid,
	fabric_space,
	fabric_spaceRef,
	jools,
	mongodb,
	resume,
	run,
	server_spaceBox9,
	sus,
	translateChange,
	translateChangeRay;

jools = require( '../jools/jools' );

change_ray = require( '../change/ray' );

change_insert = require( '../change/insert' );

change_join = require( '../change/join' );

change_remove = require( '../change/remove' );

change_set = require( '../change/set' );

change_split = require( '../change/split' );

database9_repository = require( '../database9/repository' );

database10_changeSkid = require( '../database/changeSkid' );

fabric_space = require( '../fabric/space' );

fabric_spaceRef = require( '../fabric/spaceRef' );

mongodb = require( 'mongodb' );

server_spaceBox9 = require( '../server/spaceBox9' );

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


translateChange =
	function(
		c9,
		space
	)
{
	switch( c9.type )
	{
		case 'insert' :

			return(
				change_insert.create(
					'path', c9.trg.path,
					'at1', c9.trg.at1,
					'at2', c9.trg.at1 + c9.src.val.length,
					'val', c9.src.val
				)
			);

		case 'join' :

			return(
				change_join.create(
					'path', c9.trg.path,
					'path2', c9.src.path,
					'at1', space.getPath( c9.trg.path ).length
				)
			);

		case 'rank' :

			return null;

		case 'remove' :

			return(
				change_remove.create(
					'path', c9.src.path,
					'at1', c9.src.at1,
					'at2', c9.src.at1 + c9.trg.val.length,
					'val', c9.trg.val
				)
			);

		case 'set' :

			if( c9.trg.path.length === 2 )
			{
				if( c9.src.val === null )
				{
					// deletes an item
					return(
						change_set.create(
							'path', c9.trg.path,
							'val', c9.src.val,
							'prev', c9.trg.val,
							'rank', space.rankOf( c9.trg.path.get( -1 ) )
						)
					);
				}
				else
				{
					// creates an item
					return(
						change_set.create(
							'path', c9.trg.path,
							'val', c9.src.val,
							'prev', c9.trg.val,
							'rank', space.length
						)
					);
				}
			}
			else
			{
				// some PNW/Zone set
				return(
					change_set.create(
						'path', c9.trg.path,
						'val', c9.src.val,
						'prev', c9.trg.val
					)
				);
			}

			break;

		case 'split' :

			return(
				change_split.create(
					'path', c9.src.path,
					'path2', c9.trg.path,
					'at1', c9.src.at1
				)
			);

		default :

			throw new Error( c9.type );
	}
};


/*
| Translates a changeray from 9 to 10.
*/
translateChangeRay =
	function(
		cr9,
		space
	)
{
	var
		a,
		aZ,
		a10,
		c10;

	a10 = [ ];

	for(
		a = 0, aZ = cr9.ray.length;
		a < aZ;
		a++
	)
	{
		c10 = translateChange( cr9.ray[ a ], space );

		if( c10 !== null )
		{
			space = c10.changeTree( space, 'combined' ).tree;

			a10.push( c10 );
		}
	}

	return{
		changeRay : change_ray.create( 'ray:init', a10 ),
		space : space
	};
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
		cs9,
		cs10,
		o,
		result,
		space,
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
		database_version : 9
	};

	console.log( '* connecting to src' );

	srcDatabase = yield* database9_repository.connect( srcConfig );

	// spaceBox is using this global
	root.repository = srcDatabase;

	if( WRITE )
	{
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
				version : 10
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
			yield* server_spaceBox9.loadSpace( spaceRef );

		if( WRITE )
		{
			console.log( ' * writing "' + spaceRef.fullname + '"' );

			yield trgSpaces.insert( o, resume( ) );

			trgChanges =
				trgConnection.collection( 'changes:' + spaceRef.fullname );
		}

		space = fabric_space.create( );

		for(
			a = 1, aZ = spaceBox._changeSkids.length;
			a < aZ;
			a++
		)
		{
			cs9 = spaceBox._changeSkids.get( a );

			result = translateChangeRay( cs9.changeRay, space );

			space = result.space;

			cs10 =
				database10_changeSkid.create(
					'_id', cs9._id,
					'cid', cs9.cid,
					'changeRay', result.changeRay,
					'user', cs9.user,
					'date', cs9.date
				);

			if( WRITE )
			{
				yield trgChanges.insert(
					JSON.parse( JSON.stringify( cs10 ) ),
					resume( )
				);
			}
		}
	}

	console.log( '* closing connections' );

	srcDatabase.close( );

	if( WRITE )
	{
		trgConnection.close( );
	}

	console.log( '* done' );
};

sus( run )( );

} )( );

