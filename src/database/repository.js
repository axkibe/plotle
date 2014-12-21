/*
| Ideoloom connector using the mongodb driver
| to access an ideoloom repository.
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
			'server_repository',
		attributes :
			{
				'_connection' :
					{
						comment :
							'the mongoDB connection',
						type :
							'Object'
					},
				'users' :
					{
						comment :
							'the users collection',
						type :
							'Object' // FUTURE
					},
				'spaces' :
					{
						comment :
							'the spaces collection',
						type :
							'Object' // FUTURE
					}
			}
	};
}


var
	config,
	db_version,
	fabric_spaceRef,
	jools,
	mongodb,
	repository,
	sus,
	_initRepository,
	_checkRepository;

db_version = 8;

repository = require( '../jion/this' )( module );

config = require( '../../config' );

jools = require( '../jools/jools' );

mongodb = require( 'mongodb' );

sus = require( 'suspend' ); // FIXME just give resume

fabric_spaceRef = require( '../fabric/spaceRef' );

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
		server,
		spaces,
		users;

	jools.log(
		'start',
		'connecting to database',
		config.database_host
		+ ':'
		+ config.database_port,
		config.database_name
	);

	server =
		new mongodb.Server(
			config.database_host,
			config.database_port,
			{ }
		);

	connector =
		new mongodb.Db(
			config.database_name,
			server,
			{ w : 1 }
		);

	connection = yield connector.open( sus.resume( ) );

	users = yield connection.collection( 'users', sus.resume( ) );

	spaces = yield connection.collection( 'spaces', sus.resume( ) );

	// checking repo version:

	yield* _checkRepository( connection );

	return(
		repository.create(
			'_connection', connection,
			'users', users,
			'spaces', spaces
		)
	);
};


/*
| Returns a collection.
|
| FIXME let it return a jion.
*/
repository.prototype.collection =
	function*(
		name
	)
{
	return yield this._connection.collection( name, sus.resume( ) );
};


/*
| Ensures the repository schema version fits this server.
*/
_checkRepository =
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
			fabric_spaceRef.create(
				'username', 'ideoloom',
				'tag', 'home'
			),
			fabric_spaceRef.create(
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
