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

const fs = require( 'fs' );
const nano = tim.require( 'nano' );
const util = require( 'util' );

const log = tim.require( '../server/log' );
const config = tim.require( '../config/intf' );
const change_wrap = tim.require( '../change/wrap' );
const change_wrapList = tim.require( '../change/wrapList' );
const database_changeSkid = tim.require( '../database/changeSkid' );
const database_changeSkidList = tim.require( '../database/changeSkidList' );
const database_userInfoSkid = tim.require( './userInfoSkid' );
const ref_space = tim.require( '../ref/space' );

const readFile = util.promisify( fs.readFile );


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

	const db = await connection.use( name );
	let version;

	try
	{
		version = await db.get( 'version' );
	}
	catch( e )
	{
		return await database_repository.establishRepository( connection, dbVersion, name );
	}

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
	let url = config.get( 'database', 'url' );
	const name = config.get( 'database', 'name' );
	const passfile = config.get( 'database', 'passfile' );

	let logUrl;

	if( passfile !== '' )
	{
		const dbadminpass = await database_repository.readPassFile( passfile );
		if( url.indexOf( 'PASSWORD' ) < 0 )
		{
			throw new Error( 'passfile configured but no PASSWORD in url' );
		}
		logUrl = url.replace( 'PASSWORD', 'XXXXXX' );
		url = url.replace( 'PASSWORD', dbadminpass );
	}
	else
	{
		if( url.indexOf( 'PASSWORD' ) >= 0 )
		{
			throw new Error( 'PASSWORD in url but no passfile configured' );
		}
		logUrl = url;
	}

	log.log( 'connecting database ' + logUrl + ' ' + name );
	const connection = await nano( url );
	return await database_repository.checkRepository( name, connection );
};


/*
| Initializes a new repository.
*/
def.static.establishRepository =
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
/**/	if( arguments.length > 4 ) throw new Error( );
/**/	if( typeof( version ) !== 'number' ) throw new Error( );
/**/	if( bare !== undefined && bare !== 'bare' ) throw new Error( );
/**/}

	await connection.db.create( name );
	let db = await connection.db.use( name );

	await db.insert( { _id : 'version', version : version } );

	const repository = database_repository.create( '_db', db );
	await repository.establishUsersTable( );
	await repository.establishSpacesTable( );

	if( !bare )
	{
		await repository.establishSpace( ref_space.plotleHome );
		await repository.establishSpace( ref_space.plotleSandbox );
	}

	return repository;
};


/*
| Establishes a space in the database.
*/
def.proto.establishSpace =
	async function(
		spaceRef
	)
{
	const id = 'changes:' + spaceRef.fullname;

	// creates a changes view for this space
	await this._db.insert( {
		_id: '_design/changes:' + spaceRef.fullname,
		views :
		{
			seq :
			{
				map :
					'function( doc )'
					+ ' {'
					+   ' if( doc._id.substr( 0, ' + ( id.length + 1 ) + ' ) === "' + id + ':" )'
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
			tag : spaceRef.tag
	} );
};


/*
| Establishes the spaces table in the database.
*/
def.proto.establishSpacesTable =
	async function(
		spaceRef
	)
{
	await this._db.insert( {
		_id: '_design/spaces',
		views :
		{
			id :
			{
				map :
					'function( doc )'
					+ ' {'
					+   ' if( doc._id.substr( 0, 7 ) === "spaces:" )'
					+     ' emit( doc._id );'
					+ ' }'
			}
		},
		language : 'javascript'
	} );
};


/*
| Establishes the users table.
*/
def.proto.establishUsersTable =
	async function( )
{
	await this._db.insert( {
		_id: '_design/users',
		views :
		{
			name :
			{
				map :
					'function( doc )'
					+ ' {'
					+   ' if( doc._id.substr( 0, 6 ) === "users:" )'
					+     ' emit( doc.name );'
					+ ' }'
			}
		},
		language : 'javascript'
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
/**/	if( !dbChangesKey.startsWith( 'changes:' ) ) throw new Error( );
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
/**/	if( !id.startsWith( 'changes:' ) ) throw new Error( );
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
/**/	if( !id.startsWith( 'spaces:' ) ) throw new Error( );
/**/}

	return await this._db.get( id );
};


/*
| Reads a password file.
*/
def.static.readPassFile =
	async function(
		filepath
	)
{
	let pass;

	try { pass = '' + await readFile( filepath ); }
	catch( e ) { throw new Error( 'Cannot read "' + filepath + '"' ); }

	// removes newline if present
	if( pass[ pass.length - 1 ] === '\n' ) pass = pass.substr( 0, pass.length - 1 );

	if( pass.indexOf( '\n' ) >= 0 )
	{
		throw new Error( 'too many lines in "' + filepath + '"' );
	}

	return pass;
};


/*
| Saves a changeWrap into the database.
|
| Similar to sendChanges, but waits for the database answer
| And saves only one changeWrap.
*/
def.proto.saveChange =
	async function(
		changeWrap,
		spaceRef,
		username,
		seq,
		date
	)
{
/**/if( CHECK )
/**/{
/**/	if( arguments.length !== 5 ) throw new Error( );
/**/	if( changeWrap.timtype !== change_wrap ) throw new Error( );
/**/	if( spaceRef.timtype !== ref_space ) throw new Error( );
/**/	if( typeof( username ) !== 'string' ) throw new Error( );
/**/	if( typeof( seq ) !== 'number' ) throw new Error( );
/**/	if( typeof( date ) !== 'number' ) throw new Error( );
/**/}

	const changeSkid =
		database_changeSkid.createFromChangeWrap(
			changeWrap,
			spaceRef,
			username,
			seq,
			date
		);

	await this._db.insert( JSON.parse( JSON.stringify( changeSkid ) ) );
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

	this._db.bulk( { docs: list } )
	.catch( ( error ) => { if( error ) throw error; } );
};


} );
