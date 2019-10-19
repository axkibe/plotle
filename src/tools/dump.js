/*
| Dumps a repository into a file.
*/
'use strict';


Error.stackTraceLimit = Infinity;
process.on( 'unhandledRejection', err => { throw err; } );


// Versions of dump files created
const dumpVersion = 1;
const indent = '__';
//const indent = false;
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

const fs = require( 'fs' );
const nano = require( 'nano' );
const JsonFaucet = require( '../stream/JsonFaucet' );

require( '../trace/base' ); // TODO working around cycle issues
//const change_list = require( '../change/list' );
//const change_wrap = require( '../change/wrap' );
const ref_space = require( '../ref/space' );
const repository = require( '../database/repository' );
//const user_info = require( '../user/info' );


const dbConfig =
{
	name : 'plotle-' + repository.dbVersion,
	url : 'http://127.0.0.1:5984',
};


/*
| Prints out usage info.
*/
const usage =
	function( )
{
	console.error( 'USAGE: node ' + module.filename + ' [FILENAME]' );
};


/*
| The main runner.
*/
const run =
	async function( )
{
	if( process.argv.length !== 3 ) { usage( ); return; }

	const filename = process.argv[ 2 ];
	const faucet = new JsonFaucet( { indent : indent } );

	if( filename === '-' ) faucet.pipe( process.stdout );
	else faucet.pipe( fs.createWriteStream( filename ) );

	await faucet.beginDocument( );
	await faucet.attribute( 'dbVersion', repository.dbVersion  );
	await faucet.attribute( 'dumpVersion', dumpVersion );

	const connection = await nano( dbConfig.url );
	const db = await repository.checkRepository( connection, dbConfig.name );

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
};


run( );
