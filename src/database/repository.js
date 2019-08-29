/*
| Linkloom connector using the mongodb driver
| to access an plotle repository.
*/
'use strict';


tim.define( module, ( def, database_repository ) => {


const dbVersion = 19;


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

const mongodb = tim.require( 'mongodb' );

const log = tim.require( '../server/log' );
const config = tim.require( '../config/intf' );
const ref_space = tim.require( '../ref/space' );


/*
| Initializes a new repository.
*/
const initRepository =
	async function(
		connection
	)
{
	const spaces = await connection.collection( 'spaces' );

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

		await spaces.insert(
			{
				_id : sr.fullname,
				username : sr.username,
				tag : sr.tag
			}
		);
	}

	log.log( '  initializing global.version' );

	const global = await connection.collection( 'global' );

	await global.insert(
		{
			_id : 'version',
			version : dbVersion,
		}
	);
};


/*
| Ensures the repository schema version fits this server.
*/
const checkRepository =
	async function(
		connection
	)
{
	log.log( 'checking repository schema version' );

	const global = await connection.collection( 'global' );

	const version = await global.findOne( { _id : 'version' } );

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
		await initRepository( connection );
	}
};


/*
| Returns a repository object with
| an active connection.
*/
def.static.connect =
	async function( )
{
	const host = config.get( 'database', 'host' );

	const port = config.get( 'database', 'port' );

	const name = config.get( 'database', 'name' );

	log.log( 'connecting database ' + host + ':' + port + ' ' + name );

	const server = new mongodb.Server( host, port, { } );

	const connector = new mongodb.Db( name, server, { w : 1 } );

	const connection = await connector.open( );

	const users = await connection.collection( 'users' );

	const spaces = await connection.collection( 'spaces' );

	// checking repo version:

	await checkRepository( connection );

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
	async function(
		name
	)
{
	return await this._connection.collection( name );
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
