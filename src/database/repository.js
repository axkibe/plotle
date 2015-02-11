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
			'database_repository',
		attributes :
			{
				'_connection' :
					{
						comment :
							'the mongoDB connection',
						type :
							'protean'
					},
				'users' :
					{
						comment :
							'the users collection',
						type :
							'protean'
					},
				'spaces' :
					{
						comment :
							'the spaces collection',
						type :
							'protean'
					}
			}
	};
}


var
	checkRepository,
	database_repository,
	fabric_spaceRef,
	initRepository,
	jools,
	mongodb,
	resume;

database_repository = require( '../jion/this' )( module );

jools = require( '../jools/jools' );

mongodb = require( 'mongodb' );

resume = require( 'suspend' ).resume;

fabric_spaceRef = require( '../fabric/spaceRef' );

/*
| Returns a repository object with
| an active connection.
*/
database_repository.connect =
	function*(
		config
	)
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
		config.database_host + ':' + config.database_port,
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

	connection = yield connector.open( resume( ) );

	users = yield connection.collection( 'users', resume( ) );

	spaces = yield connection.collection( 'spaces', resume( ) );

	// checking repo version:

	yield* checkRepository( connection, config );

	return(
		database_repository.create(
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
database_repository.prototype.collection =
	function*(
		name
	)
{
	return yield this._connection.collection( name, resume( ) );
};


/*
| Closes the connection.
*/
database_repository.prototype.close =
	function( )
{
	this._connection.close( );
};


/*
| Ensures the repository schema version fits this server.
*/
checkRepository =
	function*(
		connection,
		config
	)
{
	var
		global,
		version;

	jools.log(
		'start',
		'checking repository schema version'
	);

	global = yield connection.collection( 'global', resume( ) ),

	version = yield global.findOne( { _id : 'version' }, resume( ) );

	if( version )
	{
		if( version.version !== config.database_version )
		{
			throw new Error(
				'Wrong repository schema version, expected '
				+ config.database_version +
				', but got ' +
				version.version
			);
		}
	}
	else
	{
		// otherwise initializes the database repository

		yield* initRepository( connection, config );
	}
};


/*
| Initializes a new repository.
*/
initRepository =
	function*(
		connection,
		config
	)
{
	var
		global,
		initSpaces,
		s,
		spaces,
		sr,
		sZ;

	spaces = yield connection.collection( 'spaces', resume( ) );

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
			resume( )
		);
	}

	jools.log( 'start', '  initializing global.version' );

	global = yield connection.collection( 'global', resume( ) );

	yield global.insert(
		{
			_id : 'version',
			version : config.database_version
		},
		resume( )
	);
};


} )( );
