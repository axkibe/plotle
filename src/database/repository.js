/*
| Linkloom connector using the mongodb driver
| to access an linkloom repository.
*/
'use strict';


tim.define( module, ( def, database_repository ) => {


if( TIM )
{
	def.attributes =
	{
		// the mongoDB connection
		_connection : { type : 'protean' },

		// the users collection
		users : { type : 'protean' },

		// the spaces collection
		spaces : { type : 'protean' },
	};
}

const log = require( '../server/log' );

const ref_space = require( '../ref/space' );

const mongodb = require( 'mongodb' );

const resume = require( 'suspend' ).resume;


/*
| Initializes a new repository.
*/
const initRepository =
	function*(
		connection,
		config
	)
{
	const spaces = yield connection.collection( 'spaces', resume( ) );

	log( 'found no repository, initializing a new one' );

	const initSpaces =
		[
			ref_space.create(
				'username', 'linkloom',
				'tag', 'home'
			),
			ref_space.create(
				'username', 'linkloom',
				'tag', 'sandbox'
			)
		];

	for( let s = 0, sl = initSpaces.length; s < sl; s++ )
	{
		const sr = initSpaces[ s ];

		log( '  initializing space ' + sr.fullname );

		yield spaces.insert(
			{
				_id : sr.fullname,
				username : sr.username,
				tag : sr.tag
			},
			resume( )
		);
	}

	log( '  initializing global.version' );

	const global = yield connection.collection( 'global', resume( ) );

	yield global.insert(
		{
			_id : 'version',
			version : config.database_version
		},
		resume( )
	);
};


/*
| Ensures the repository schema version fits this server.
*/
const checkRepository =
	function*(
		connection,
		config
	)
{
	log( 'checking repository schema version' );

	const global = yield connection.collection( 'global', resume( ) );

	const version = yield global.findOne( { _id : 'version' }, resume( ) );

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
| Returns a repository object with
| an active connection.
*/
def.static.connect =
	function*(
		config
	)
{
	log(
		'connecting to database',
		config.database_host + ':' + config.database_port,
		config.database_name
	);

	const server =
		new mongodb.Server(
			config.database_host,
			config.database_port,
			{ }
		);

	const connector =
		new mongodb.Db(
			config.database_name,
			server,
			{ w : 1 }
		);

	const connection = yield connector.open( resume( ) );

	const users = yield connection.collection( 'users', resume( ) );

	const spaces = yield connection.collection( 'spaces', resume( ) );

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
| FUTURE let it return a tim.
*/
def.func.collection =
	function*(
		name
	)
{
	return yield this._connection.collection( name, resume( ) );
};


/*
| Closes the connection.
*/
def.func.close =
	function( )
{
	this._connection.close( );
};


} );
