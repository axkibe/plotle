/*
| Ideoloom connector using the mongodb driver
| to access an ideoloom repository.
|
| Authors: Axel Kittenberger
*/


/*
| Capsule.
*/
( function( ) {
'use strict';


/*
| The jion definition.
*/
if( JION )
{
	return {
		id :
			'server.repository',
		attributes :
			{
				'_connect' :
					{
						comment :
							'the mongoDB connection',
						type :
							'Object'
					},
			},
		node :
			true
	};
}



var
	config,
	db_version,
	fabric,
	jools,
	mongodb,
	repository,
	sus,
	_initRepository,
	_checkRepositoryVersion;

db_version = 8;

repository = require( '../jion/this' )( module );

config = require( '../../config' );

jools = require( '../jools/jools' );

mongodb = require( 'mongodb' );

sus = require( 'suspend' );

fabric =
	{
		spaceRef : require( '../fabric/space-ref' )
	};

/*
| Returns a repository object with
| an active connection.
*/
repository.connect =
	function*( )
{
	var
		connection,
		connector,
		db,
		server,
		spaces,
		users;

	jools.log(
		'start',
		'connecting to database',
		config.database.host + ':' + config.database.port,
		config.database.name
	);

	server =
		new mongodb.Server(
			config.database.host,
			config.database.port,
			{ }
		);

	connector =
		new mongodb.Db(
			config.database.name,
			server,
			{ w : 1 }
		);

	connection = yield db.connector.open( sus.resume( ) );

	users =
		yield db.connection.collection( 'users', sus.resume( ) );

	spaces =
		yield db.connection.collection( 'spaces', sus.resume( ) );

	// checking repo version:

	yield* _checkRepositoryVersion( );

	return(
		repository.create(
			'_connection', connection,
			'users', users,
			'spaces', spaces
		)
	);
};


/*
| Ensures the repository schema version fits this server.
*/
_checkRepositoryVersion =
	function*(
		connection
	)
{
	var
		global,
		version;

	jools.log(
		'start',
		'checking repository schema version'
	);

	global = yield connection.collection( 'global', sus.resume( ) ),

	version = yield global.findOne( { _id : 'version' }, sus.resume( ) );

	if( version )
	{
		if( version.version !== db_version )
		{
			throw new Error(
				'Wrong repository schema version, expected '
				+ db_version +
				', got ' +
				version.version
			);
		}
	}
	else
	{
		// otherwise initializes the database repository

		yield* _initRepository( connection );
	}
};


/*
| Initializes a new repository.
*/
_initRepository =
	function*(
		connection
	)
{
	var
		global,
		initSpaces,
		s,
		spaces,
		sr,
		sZ;

	spaces =
		yield connection.collection( 'spaces', sus.resume( ) );

	jools.log(
		'start',
		'found no repository, initializing a new one'
	);

	initSpaces =
		[
			fabric.spaceRef.create(
				'username', 'ideoloom',
				'tag', 'home'
			),
			fabric.spaceRef.create(
				'username', 'ideoloom',
				'tag', 'sandbox'
			)
		];

	for(
		s = 0, sZ = initSpaces.length;
		s < sZ;
		s++
	)
	{
		sr = initSpaces[ s ];

		jools.log( 'start', '  initializing space ' + sr.fullname );

		yield spaces.insert(
			{
				_id : sr.fullname,
				username : sr.username,
				tag : sr.tag
			},
			sus.resume( )
		);
	}

	jools.log( 'start', '  initializing global.version' );

	global =
		yield connection.collection(
			'global',
			sus.resume( )
		);

	yield global.insert(
		{
			_id : 'version',
			version : db_version
		},
		sus.resume( )
	);
};



} )( );
