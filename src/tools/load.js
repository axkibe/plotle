/*
| Loads a repository from a file.
*/
'use strict';


Error.stackTraceLimit = Infinity;
process.on( 'unhandledRejection', err => { throw err; } );


// Versions of dump files expected
const dumpVersion = 1;
global.CHECK = true;
global.NODE = true;

//const wait =
//	( time ) => new Promise( ( resolve ) => { setTimeout( ( ) => resolve( ), time ); } );


// registers with tim.js
{
	require( 'tim.js' );
	const ending = 'src/tools/load.js';
	const filename = module.filename;
	if( !filename.endsWith( ending ) ) throw new Error( );
	const rootPath = filename.substr( 0, filename.length - ending.length );
	const timcodePath = rootPath.substr( 0, rootPath.lastIndexOf( '/' ) ) + '/timcode/';
	tim.catalog.addRootDir( rootPath, 'dump', timcodePath );
}

const fs = require( 'fs' );
const nano = require( 'nano' );
const JsonDrain = require( '../stream/JsonDrain' );

require( '../trace/base' ); // TODO working around cycle issues
const config = require( '../config/intf' );
const change_list = require( '../change/list' );
const change_wrap = require( '../change/wrap' );
const ref_space = require( '../ref/space' );
const userInfo = require( '../user/info' );
const repository = require( '../database/repository' );
const database_pouchdb = require( '../database/pouchdb' );


/*
| Prints out usage info.
*/
const usage =
	function( )
{
	console.error( 'USAGE: node ' + module.filename + ' [FILENAME] [--destroy]' );
};


/*
| Parses the JSON stream checking dbVersion and dumpVersion
*/
const passCheckVersion =
	async function(
		filename
	)
{
	const drain = new JsonDrain( fs.createReadStream( filename ) );
	{
		const start = await drain.next( );
		if( start.object !== 'start' ) throw new Error( );
	}
	let _dbVersion, _dumpVersion;
	for(;;)
	{
		const chunk = await drain.next( );
		if( chunk.object === 'end' ) break;
		const attr = chunk.attribute;
		switch( attr )
		{
			case 'dbVersion' : _dbVersion = chunk.value; continue;
			case 'dumpVersion' : _dumpVersion = chunk.value; continue;
		}
		if( chunk.object === 'start' ) { await drain.skip( ); continue; }
		if( chunk.array === 'start' ) { await drain.skip( ); continue; }
	}
	if( _dbVersion !== repository.dbVersion )
	{
		throw new Error(
			'invalid dbVersion, expected '
			+ repository.dbVersion
			+ ' got '
			+ _dbVersion
		);
	}
	if( _dumpVersion !== dumpVersion )
	{
		throw new Error(
			'invalid dumpVersion, expected '
			+ dumpVersion
			+ ' got '
			+ _dumpVersion
		);
	}
};


/*
| Loads the users.
*/
const loadUsers =
	async function(
		drain,
		db
	)
{
/**/if( CHECK )
/**/{
/**/	if( arguments.length !== 2 ) throw new Error( );
/**/	if( db.timtype !== repository ) throw new Error( );
/**/}

	const users = await drain.retrieve( );
	for( let name in users )
	{
		const o = users[ name ];
		const ui = userInfo.create(
			'name', name,
			'passhash', o.passhash,
			'mail', o.mail,
			'news', o.news
		);
		await db.saveUser( ui );
	}
};

/*
| Loads the spaces.
*/
const loadSpaces =
	async function(
		drain,
		db
	)
{
	for(;;)
	{
		const chunk = await drain.next( );
		if( chunk.object === 'end' ) break;
		const name = chunk.attribute;
		const ni = name.split( ':' );
		const rs = ref_space.createUsernameTag( ni[ 0 ], ni[ 1 ] );
		console.log( '* loading ' + rs.fullname );
		await db.establishSpace( rs );
		for( let seq = 1 ;; seq++ )
		{
			const chunk = await drain.next( );
			if( chunk.array === 'end' ) break;
			const co = await drain.retrieve( );
			const cl = change_list.createFromJSON( co.changeList );
			const cw =
				change_wrap.create(
					'changeList', cl,
					'cid', co.cid,
					'seq', seq
				);
			await db.saveChange( cw, rs, co.user, seq, co.date );
			if( seq % 100 === 0 ) console.log( seq );
		}
	}
};


/*
| Loads the repository.
*/
const passLoad =
	async function(
		filename,   // filename to load from
		db          // database to load to
	)
{
/**/if( CHECK )
/**/{
/**/	if( arguments.length !== 2 ) throw new Error( );
/**/	if( typeof( filename ) !== 'string' ) throw new Error( );
/**/	if( db.timtype !== repository ) throw new Error( );
/**/}

	const drain = new JsonDrain( fs.createReadStream( filename ) );
	{
		const start = await drain.next( );
		if( start.object !== 'start' ) throw new Error( );
	}
	// handles the root object
	for(;;)
	{
		const chunk = await drain.next( );
		if( chunk.object === 'end' ) break;
		const attr = chunk.attribute;
		switch( attr )
		{
			case 'dbVersion' : continue;
			case 'dumpVersion' : continue;
			case 'users' : await loadUsers( drain, db ); continue;
			case 'spaces' : await loadSpaces( drain, db ); continue;
		}
	}
};


/*
| The main runner.
*/
const run =
	async function( )
{
	let destroy;
	let filename;
	require( '../../config' )( config.set );
	{
		const argv = process.argv;
		if( argv.length < 3 || argv.length > 4 ) { usage( ); return; }
		for( let a = 2; a < argv.length; a++ )
		{
			const arg = argv[ a ];
			if( arg === '--destroy' )
			{
				if( destroy ) { usage( ); return; }
				destroy = true;
				continue;
			}

			if( arg[ 0 ] === '-' ) { usage( ); return; }
			if( filename ) { usage( ); return; }
			filename = arg;
		}
	}

	let pouchdb;
	if( config.get( 'database', 'pouchdb', 'enable' ) ) pouchdb = await database_pouchdb.start( );

	await passCheckVersion( filename );
	let url = config.get( 'database', 'url' );
	const dbName = config.get( 'database', 'name' );
	const passfile = config.get( 'database', 'passfile' );

	const builtUrl = await repository.buildUrl( url, passfile );
	url = builtUrl.url;
	console.log( 'Connecting to ' + builtUrl.logUrl );

	const connection = await nano( url );
	let db = await repository.checkRepository( connection, dbName );
	if( db.error !== 'not_found' )
	{
		if( !destroy )
		{
			console.log( 'Repository found, would need to be destroyed for loading!' );
			if( pouchdb ) pouchdb.shutdown( );
			return;
		}

		console.log( '* destroying repository' );
		await connection.db.destroy( dbName );
		db = await repository.checkRepository( connection, dbName );
		if( db.error !== 'not_found' )
		{
			console.log( 'Repository destroyed, but it is still there?!' );
			if( pouchdb ) pouchdb.shutdown( );
			return;
		}
	}

	db =
		await repository.establishRepository(
			connection,
			dbName,
			repository.dbVersion,
			'bare'
		);

	await passLoad( filename, db );
	if( pouchdb ) pouchdb.shutdown( );
	console.log( '* done' );
};

run( );
