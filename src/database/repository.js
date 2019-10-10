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
const change_wrapList = tim.require( '../change/wrapList' );
const database_changeSkidList = tim.require( '../database/changeSkidList' );
const database_userInfoSkid = tim.require( './userInfoSkid' );
const ref_space = tim.require( '../ref/space' );


/*
| Ensures the repository schema version fits this server.
| Returns the nano db handle.
*/
def.static.checkRepository =
	async function(
		name,      // name of the database
		connection // nano connection
	)
{
	log.log( 'checking repository schema version' );

	let db;
	try
	{
		db = await connection.use( name );
	}
	catch( e )
	{
		return await database_repository.initRepository( connection, dbVersion, name );
	}

	const version = await db.get( 'version' );

	if( version.version !== dbVersion )
	{
		throw new Error(
			'Wrong repository schema version, expected '
			+ dbVersion + ', but got ' + version.version
		);
	}

	return database_repository.create( '_db', db );
};

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

	return await database_repository.checkRepository( name, connection );
};


/*
| Establishes a space in the database.
*/
def.proto.establishSpace =
	async function(
		spaceRef
	)
{
	// creates a changes view for this space
	await this._db.insert( {
			_id: '_design/changes:' + name,
			views :
			{
				seq :
				{
					map :
						'function( doc )'
						+ ' {'
						+   ' if( doc.table === "changes:' + spaceRef.fullname + '" )'
						+     ' emit( doc.seq );'
						+ ' }'
				}
			},
			language : 'javascript'
	} );

	// inserts the space in the "spaces" table
	await this._db.insert( {
			_id : 'spaces:' + spaceRef.fullname,
			username : spaceRef.username,
			tag : spaceRef.tag,
			table : 'spaces'
	} );
};


/*
| Establishes the users table.
*/
def.proto.establishUsersTable =
	async function( )
{
	await this._db.insert( {
		'_id': '_design/users',
		'views' :
		{
			'name' :
			{
				'map' :
					'function( doc )'
					+ ' {'
					+   ' if( doc.table === "users" )'
					+     ' emit( doc.name );'
					+ ' }'
			}
		},
		'language' : 'javascript'
	} );
};

/*
| Returns all space IDs from the 'spaces/id' view.
*/
def.proto.getSpaceIDs =
	async function( )
{
	const r = await this._db.view( 'spaces', 'id' );
	return r.rows;
};


def.proto.getSpaceChangeSeqs =
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
| Returns the userinfo for a username.
*/
def.proto.getUser =
	async function(
		name
	)
{
/**/if( CHECK )
/**/{
/**/	if( arguments.length !== 1 ) throw new Error( );
/**/}

	return await this._db.get( 'users:' + name );
};


/*
| Returns all space IDs from the 'spaces/id' view.
*/
def.proto.getUserNames =
	async function( )
{
	const r = await this._db.view( 'users', 'name' );
	return r.rows;
};


/*
| Returns the meta data of a space with a given id.
*/
def.proto.getChange =
	async function(
		id
	)
{
/**/if( CHECK )
/**/{
/**/	if( arguments.length !== 1 ) throw new Error( );
/**/	if( id.substr( 0, 8 ) !== 'changes:' ) throw new Error( );
/**/}

	return await this._db.get( id );
};


/*
| Returns the meta data of a space with a given id.
*/
def.proto.getSpaceMeta =
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
| Initializes a new repository.
| FIXME rename establishRepository.
*/
def.static.initRepository =
	async function(
		connection,   // the couchDB nano connection
		version,      // repository version
		name,         // database name to use
		bare          // if "bare" doesn't init default spaces
	)
{
/**/if( CHECK )
/**/{
/**/	if( arguments.length < 3 ) throw new Error( );
/**/	if( arguments.length < 4 ) throw new Error( );
/**/	if( typeof( version ) !== 'number' ) throw new Error( );
/**/	if( bare !== undefined && bare !== 'bare' ) throw new Error( );
/**/}

	await connection.db.create( name );
	let db = await connection.db.use( name );

	await db.insert( { _id : 'version', version : version } );

	const repository = database_repository.create( '_db', db );

	if( !bare )
	{
		repository.establishSpace( ref_space.plotleHome );
		repository.establishSpace( ref_space.plotleSandbox );
	}

	return repository;
};


/*
| Saves a list of changeWraps into the database.
|
| Similar to sendChanges, but waits for the database answer.
*/
def.proto.saveChanges =
	async function(
		changeWrapList,
		spaceRef,
		username,
		seq
	)
{
/**/if( CHECK )
/**/{
/**/	if( arguments.length !== 4 ) throw new Error( );
/**/	if( changeWrapList.timtype !== change_wrapList ) throw new Error( );
/**/	if( spaceRef.timtype !== ref_space ) throw new Error( );
/**/	if( typeof( username ) !== 'string' ) throw new Error( );
/**/	if( typeof( seq ) !== 'number' ) throw new Error( );
/**/}

	const changeSkidList =
		database_changeSkidList.createFromChangeWrapList(
			changeWrapList,
			spaceRef,
			username,
			seq
		);

	const list = JSON.parse( JSON.stringify( changeSkidList ) ).list;

	await this._db.bulk( list );
};


/*
| Saves a user in the database.
*/
def.proto.saveUser =
	async function(
		userInfo
	)
{
	// creates a changes view for this space
	await this._db.insert(
		JSON.parse( JSON.stringify(
			database_userInfoSkid.createFromUserInfo( userInfo )
		) )
	);
};


/*
| Sends a list of changeWraps into the database.
|
| This returns immediately, so for the caller this is send&pray.
*/
def.proto.sendChanges =
	function(
		changeWrapList,
		spaceRef,
		username,
		seq
	)
{
/**/if( CHECK )
/**/{
/**/	if( arguments.length !== 4 ) throw new Error( );
/**/	if( changeWrapList.timtype !== change_wrapList ) throw new Error( );
/**/	if( spaceRef.timtype !== ref_space ) throw new Error( );
/**/	if( typeof( username ) !== 'string' ) throw new Error( );
/**/	if( typeof( seq ) !== 'number' ) throw new Error( );
/**/}

	const changeSkidList =
		database_changeSkidList.createFromChangeWrapList(
			changeWrapList,
			spaceRef,
			username,
			seq
		);

	const list = JSON.parse( JSON.stringify( changeSkidList ) ).list;

	this._db.bulk( list )
	.catch( ( error ) => { if( error ) throw error; } );
};


} );
