/*
| Loads a repository from a file.
*/
'use strict';


Error.stackTraceLimit = Infinity;
process.on( 'unhandledRejection', err => { throw err; } );


// Versions of dump files expected
//const dumpVersion = 1;
global.CHECK = true;
global.NODE = true;


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
const JsonDrain = require( '../stream/JsonDrain' );
const await = require( '../hack/await' );

require( '../trace/base' ); // TODO working around cycle issues
//const ref_space = require( '../ref/space' );
//const repository = require( '../database/repository' );
//const user_info = require( '../user/info' );


/*
const dbConfig =
{
	name : 'plotle-' + repository.dbVersion,
	url : 'http://127.0.0.1:5984',
};
*/


/*
| Prints out usage info.
*/
const usage =
	function( )
{
	console.error( 'USAGE: node ' + module.filename + ' [FILENAME] [--DESTROY]' );
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
	for( ;; )
	{
		console.log( 'data', await drain.next( ) );
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
	{
		const argv = process.argv;
		if( argv.length < 3 || argv.length > 4 ) { usage( ); return; }
		for( let a = 2; a < argv.length; a++ )
		{
			const arg = argv[ a ];
			if( arg === '--DESTROY' )
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

	await passCheckVersion( filename );
	//await passLoad( filename );
	console.log( '* done' );
};

run( );
await.defaults( );
