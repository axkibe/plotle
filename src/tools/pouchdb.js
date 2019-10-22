/*
| Just runs the pouchdb server with current config.js.
*/
'use strict';


Error.stackTraceLimit = Infinity;
process.on( 'unhandledRejection', err => { throw err; } );


global.CHECK = true;
global.NODE = true;

// registers with tim.js
{
	require( 'tim.js' );
	const ending = 'src/tools/pouchdb.js';
	const filename = module.filename;
	if( !filename.endsWith( ending ) ) throw new Error( );
	const rootPath = filename.substr( 0, filename.length - ending.length );
	const timcodePath = rootPath.substr( 0, rootPath.lastIndexOf( '/' ) ) + '/timcode/';
	tim.catalog.addRootDir( rootPath, 'dump', timcodePath );
}

const config = require( '../config/intf' );
const database_pouchdb = require( '../database/pouchdb' );
const log = require( '../server/log' );


/*
| Prints out usage info.
*/
const usage =
	function( )
{
	console.error( 'USAGE: node ' + module.filename );
};


/*
| The main runner.
*/
const run =
	async function( )
{
	if( process.argv.length !== 2 ) { usage( ); return; }
	require( '../../config' )( config.set );

	if( !config.get( 'database', 'pouchdb', 'enable' ) )
	{
		console.error( 'pouchdb is not enabled!' );
		return;
	}

	await database_pouchdb.start( );
	log.log( 'running...' );
};

run( );
