/*
| Dumps a repository into a file.
*/
'use strict';


Error.stackTraceLimit = Infinity;
process.on( 'unhandledRejection', err => { throw err; } );


// Versions of dump files created
const dumpVersion = 1;
//const indent = ' ';
const indent = false;
global.CHECK = true;
global.NODE = true;

// registers with tim.js
{
	require( 'tim.js' );
	const ending = 'src/tools/dump.js';
	const filename = module.filename;
	if( !filename.endsWith( ending ) ) throw new Error( );
	const rootPath = filename.substr( 0, filename.length - ending.length );
	const timcodePath = rootPath.substr( 0, rootPath.lastIndexOf( '/' ) ) + '/timcode/';
	tim.catalog.addRootDir( rootPath, 'dump', timcodePath );
}

const config = require( '../config/intf' );
const fs = require( 'fs' );
const nano = require( 'nano' );
const util = require( 'util' );
const JsonFaucet = require( '../stream/JsonFaucet' );
const database_pouchdb = require( '../database/pouchdb' );

require( '../trace/base' ); // TODO working around cycle issues
//const change_list = require( '../change/list' );
//const change_wrap = require( '../change/wrap' );
const ref_space = require( '../ref/space' );
const repository = require( '../database/repository' );
//const user_info = require( '../user/info' );

const access = util.promisify( fs.access );

/*
| Prints out usage info.
*/
const usage =
	function( )
{
	console.error( 'USAGE: node ' + module.filename + ' [FILENAME] [--overwrite]' );
};


/*
| The main runner.
*/
const run =
	async function( )
{
	let overwrite;
	let filename;
	require( '../../config' )( config.set );
	{
		const argv = process.argv;
		if( argv.length < 3 || argv.length > 4 ) { usage( ); return; }
		for( let a = 2; a < argv.length; a++ )
		{
			const arg = argv[ a ];
			if( arg === '--overwrite' )
			{
				if( overwrite ) { usage( ); return; }
				overwrite = true;
				continue;
			}

			if( arg[ 0 ] === '-' ) { usage( ); return; }
			if( filename ) { usage( ); return; }
			filename = arg;
		}
	}

	let pouchdb;
	if( config.get( 'database', 'pouchdb', 'enable' ) ) pouchdb = await database_pouchdb.start( );

	const faucet = new JsonFaucet( { indent : indent } );
	if( filename === '-' ) faucet.pipe( process.stdout );
	else
	{
		if( !overwrite )
		{
			let notthere;
			try { await access( filename, fs.constants.F_OK ); }
			catch( e ) { notthere = true; }

			if( !notthere )
			{
				console.error( 'Error: File exists and no overwrite requested.' );
				if( pouchdb ) pouchdb.shutdown( );
				return;
			}
		}

		faucet.pipe( fs.createWriteStream( filename ) );
	}

	await faucet.beginDocument( );
	await faucet.attribute( 'dbVersion', repository.dbVersion  );
	await faucet.attribute( 'dumpVersion', dumpVersion );

	let url = config.get( 'database', 'url' );
	const name = config.get( 'database', 'name' );
	const passfile = config.get( 'database', 'passfile' );
	const builtUrl = await repository.buildUrl( url, passfile );
	url = builtUrl.url;
	const connection = await nano( url );
	const db = await repository.checkRepository( connection, name );

	// users
	{
		await faucet.attribute( 'users' );
		await faucet.beginObject( );
		const rows = await db.getUserNames( );
		for( let r of rows )
		{
			const o = await db.getUser( r.key );
			await faucet.attribute( o.name );
			await faucet.beginObject( );
			await faucet.attribute( 'news', o.news );
			await faucet.attribute( 'mail', o.mail );
			await faucet.attribute( 'passhash', o.passhash );
			await faucet.endObject( );
		}
		await faucet.endObject( );
	}

	// spaces
	{
		const rows = await db.getSpaceIds( );
		await faucet.attribute( 'spaces' );
		await faucet.beginObject( );
		for( let r of rows )
		{
			const ref = ref_space.createFromDbId( r.id );
			await faucet.attribute( ref.fullname );
			await faucet.beginArray( );

			const seqs = await db.getSpaceChangeSeqs( ref.dbChangesKey );
			let cs = 1;
			for( let s of seqs )
			{
				const key = s.key;
				if( key !== cs ) throw new Error( );
				const id = s.id;
				const o = await db.getChange( id );
				await faucet.beginObject( );
				await faucet.attribute( 'cid', o.cid );
				await faucet.attribute( 'date', o.date );
				await faucet.attribute( 'user', o.user );
				await faucet.attribute( 'changeList', o.changeList );
				await faucet.endObject( );
				cs++;
			}


			await faucet.endArray( );
		}
		await faucet.endObject( );
	}
	await faucet.endDocument( '\n' );

	if( pouchdb ) pouchdb.shutdown( );
};


run( );
