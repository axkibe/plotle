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
const repository = require( '../database/repository' );
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
		drain
	)
{
	const users = await drain.retrieve( );
	console.inspect( 'USERS', users );
};

/*
| Loads the spaces.
*/
const loadSpaces =
	async function(
		drain
	)
{
	const spaces = await drain.retrieve( );
	console.inspect( 'SPACES', spaces );
};


/*
| Loads the repository.
*/
const passLoad =
	async function(
		filename
	)
{
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
			case 'users' : await loadUsers( drain ); continue;
			case 'spaces' : await loadSpaces( drain ); continue;
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
	await passLoad( filename );
	console.log( '* done' );
};

run( );
await.defaults( );
