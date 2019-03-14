/*
| Linkloom connector using the mongodb driver
| to access an plotle repository.
*/
'use strict';


tim.define( module, ( def, database_repository ) => {


const dbVersion = 17;


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


const log = tim.require( '../server/log' );

const config = tim.require( '../config/intf' );

const ref_space = tim.require( '../ref/space' );

const mongodb = require( 'mongodb' );

const resume = require( 'suspend' ).resume;


/*
| Initializes a new repository.
*/
const initRepository =
	function*(
		connection
	)
{
	const spaces = yield connection.collection( 'spaces', resume( ) );

	log.log( 'found no repository, initializing a new one' );

	const initSpaces =
		[
			ref_space.create( 'username', 'plotle', 'tag', 'home' ),
			ref_space.create( 'username', 'plotle', 'tag', 'sandbox' )
		];

	for( let s = 0, sl = initSpaces.length; s < sl; s++ )
	{
		const sr = initSpaces[ s ];

		log.log( '  initializing space ' + sr.fullname );

		yield spaces.insert(
			{
				_id : sr.fullname,
				username : sr.username,
				tag : sr.tag
			},
			resume( )
		);
	}

	log.log( '  initializing global.version' );

	const global = yield connection.collection( 'global', resume( ) );

	yield global.insert(
		{
			_id : 'version',
			version : dbVersion,
		},
		resume( )
	);
};


/*
| Ensures the repository schema version fits this server.
*/
const checkRepository =
	function*(
		connection
	)
{
	log.log( 'checking repository schema version' );

	const global = yield connection.collection( 'global', resume( ) );

	const version = yield global.findOne( { _id : 'version' }, resume( ) );

	if( version )
	{
		if( version.version !== dbVersion )
		{
			throw new Error(
				'Wrong repository schema version, expected '
				+ dbVersion + ', but got ' + version.version
			);
		}
	}
	else
	{
		// otherwise initializes the database repository

		yield* initRepository( connection );
	}
};


/*
| Returns a repository object with
| an active connection.
*/
def.static.connect =
	function*( )
{
	const host = config.get( 'database', 'host' );

	const port = config.get( 'database', 'port' );

	const name = config.get( 'database', 'name' );

	log.log( 'connecting database ' + host + ':' + port + ' ' + name );

	const server = new mongodb.Server( host, port, { } );

	const connector = new mongodb.Db( name, server, { w : 1 } );

	const connection = yield connector.open( resume( ) );

	const users = yield connection.collection( 'users', resume( ) );

	const spaces = yield connection.collection( 'spaces', resume( ) );

	// checking repo version:

	yield* checkRepository( connection );

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
def.proto.collection =
	function*(
		name
	)
{
	return yield this._connection.collection( name, resume( ) );
};


/*
| Closes the connection.
*/
def.proto.close =
	function( )
{
	this._connection.close( );
};


} );
