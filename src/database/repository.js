/*
| Connector using the nano driver
| to access a plotle repository on couchDB.
*/
'use strict';


tim.define( module, ( def, database_repository ) => {


const dbVersion = 22;


if( TIM )
{
	def.attributes =
	{
		// the nano connection
		_db : { type : 'protean' },
	};
}

const nano = tim.require( 'nano' );

const log = tim.require( '../server/log' );
const config = tim.require( '../config/intf' );


/*
| Returns a repository object with
| an active connection.
*/
def.static.connect =
	async function( )
{
	const url = config.get( 'database', 'url' );
	const name = config.get( 'database', 'name' );

	log.log( 'connecting database ' + url + ' ' + name );

	const connection = await nano( url );
	const db = await database_repository._checkRepository( name, connection );

	return database_repository.create( '_db', db );
};


/*
| Returns all space IDs from the 'spaces/id' view.
*/
def.proto.spaceIDs =
	async function( )
{
	const r = await this._db.view( 'spaces', 'id' );
	return r.rows;
};


def.proto.spaceChangeSeqs =
	async function(
		dbChangesKey
	)
{
/**/if( CHECK )
/**/{
/**/	if( arguments.length !== 1 ) throw new Error( );
/**/	if( dbChangesKey.substr( 0, 8 ) !== 'changes:' ) throw new Error( );
/**/}

	const r = await this._db.view( dbChangesKey, 'seq' );
	return r.rows;
};


/*
| Returns the meta data of a space with a given id.
*/
def.proto.spaceMeta =
	async function(
		id
	)
{
/**/if( CHECK )
/**/{
/**/	if( arguments.length !== 1 ) throw new Error( );
/**/	if( id.substr( 0, 7 ) !== 'spaces:' ) throw new Error( );
/**/}

	return await this._db.get( id );
};


/*
| Ensures the repository schema version fits this server.
| Returns the nano db handle.
*/
def.static._checkRepository =
	async function(
		name,      // name of the database
		connection // nano connection
	)
{
	log.log( 'checking repository schema version' );

	let db;
	try{ db = await connection.use( name ); }
	catch( e ) { return await database_repository.initRepository( connection ); }

	const version = await db.get( 'version' );

	if( version.version !== dbVersion )
	{
		throw new Error(
			'Wrong repository schema version, expected '
			+ dbVersion + ', but got ' + version.version
		);
	}

	return db;
};


/*
| Initializes a new repository.
*/
def.static._initRepository =
	async function(
		connection
	)
{
	throw new Error( 'XXX FIXME!' );
	/*
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
	*/
};


} );
