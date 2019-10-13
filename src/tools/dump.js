/*
| Dumps a repository into a file.
*/
'use strict';


Error.stackTraceLimit = Infinity;
process.on( 'unhandledRejection', err => { throw err; } );


const dbVersion = 22;
const dbConfig =
{
	name : 'plotle-' + dbVersion,
	url : 'http://127.0.0.1:5984',
};

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

const nano = require( 'nano' );

require( '../trace/base' ); // TODO working around cycle issues
const change_list = require( '../change/list' );
const change_wrap = require( '../change/wrap' );
const ref_space = require( '../ref/space' );
const repository = require( '../database/repository' );
const user_info = require( '../user/info' );

/*
| Prints out usage info.
*/
const usage =
	function( )
{
	console.log( 'USAGE: node ' + module.filename + ' [FILENAME]' );
};


/*
| Converts a space.
*/
/*
const convertSpace =
	async function(
		srcConnection,
		target,
		spaceRef
	)
{
	console.log( 'converting "' + spaceRef.fullname + '"' );

	const table = 'changes:' + spaceRef.fullname;

	const srcChanges = await srcConnection.collection( table );
	const cursor =
		( await srcChanges.find( { }, { sort : '_id' },) )
		.batchSize( 100 );

	for(
		let o = await cursor.nextObject( );
		o;
		o = await cursor.nextObject( )
	)
	{
		const cl = change_list.createFromJSON( o.changeList );
		const cw = change_wrap.create(
			'changeList', cl,
			'cid', o.cid,
			'seq', o._id
		);

		if( wet ) { await target.saveChange( cw, spaceRef, o.user, cw.seq, o.date ); }
	}
};
*/


/*
| The main runner.
*/
const run =
	async function( )
{
	if( process.argv.length !== 3 ) { usage( ); return; }

	const filename = process.argv[ 2 ];
	const connection = await nano( dbConfig.url );
	const db = await repository.checkRepository( dbConfig.name, connection );


	// users
	{
		const rows = await db.getUserNames( );
		for( let r of rows )
		{
			const o = await db.getUser( r.key );
			console.inspect( o );
		}
	}

	/*
	for( o = await cursor.nextObject( ); o !== null; o = await cursor.nextObject( ) )
	{
		const ui =
			user_info.create(
				'mail', o.mail,
				'news', o.news,
				'name', o._id,
				'passhash', o.passhash
			);

		if( wet ) await target.saveUser( ui );
	}

	console.log( '* copying src.spaces -> trg.spaces' );

	cursor = await srcSpaces.find( { }, { sort: '_id' } );

	for(
		o = await cursor.nextObject( );
		o !== null;
		o = await cursor.nextObject( )
	)
	{
		const name = o.username + ':' + o.tag;
		o.table = 'spaces';
		o._id = 'spaces:' + name;

		const spaceRef = ref_space.createUsernameTag( o.username, o.tag );
		if( wet ) await target.establishSpace( spaceRef );

		await convertSpace( srcConnection, target, spaceRef );
	}

	console.log( '* closing connections' );
	srcConnection.close( );
	*/
	console.log( 'done' );
};


run( );
