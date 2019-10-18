/*
| Couchdb tests
*/
'use strict';


//Error.stackTraceLimit = Infinity;

const database =
{
	name : 'plotle-22',
	url : 'http://127.0.0.1:5984',
};

global.CHECK = true;
global.NODE = true;

// registers with tim.js
{
	require( 'tim.js' );
	const ending = 'src/couchtest.js';
	const filename = module.filename;
	if( !filename.endsWith( ending ) ) throw new Error( );
	const rootPath = filename.substr( 0, filename.length - ending.length );
	const timcodePath = rootPath.substr( 0, rootPath.lastIndexOf( '/' ) ) + '/timcode/';
	tim.catalog.addRootDir( rootPath, 'convert', timcodePath );
}


const nano = require( 'nano' );


/*
| The main runner.
*/
const run =
	async function( )
{
	console.log( '* connecting to database' );
	const connection = await nano( database.url );
	const db = await connection.db.use( database.name );

	let r = await db.view( 'spaces:plotle:home', 'seq' );
	console.inspect( r );

	console.log( '* done' );
};


run( ).catch( ( error ) => { console.error( error ); } );
