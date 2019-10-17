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
const streamJson = require( 'stream-json' );
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

	const rs = fs.createReadStream( filename );
	const parser = streamJson.parser( );

	let handlers = [ ];
	let rootHandler;
	let objectHandler;
	let key;
	let readDbVersion;
	let readDumpVersion;
	let resolve;

	const promise = new Promise( ( r ) => { resolve = r; } );

	// handling for start/end of json stream
	const startHandler =
		async function( data )
	{
		const name = data.name;
		switch( name )
		{
			case 'startObject' : handlers.push( rootHandler ); return;
			default : throw new Error( );
		}
	};

	// handles a key
	const rootKeyHandler =
		function( key, value )
	{
		switch( key )
		{
			case 'dbVersion' :

				if( readDbVersion !== undefined ) throw new Error( );
				if( value !== repository.dbVersion )
				{
					console.error(
						'Expected dbVersion: '
						+ repository.dbVersion
						+ ' got: '
						+ value
					);
					process.exit( 1 );
				}
				readDbVersion = value;
				return;

			case 'dumpVersion' :

				if( readDumpVersion !== undefined ) throw new Error( );
				if( value !== dumpVersion )
				{
					console.error(
						'Expected dumpVersion: '
						+ dumpVersion
						+ ' got:  '
						+ value
					);
					process.exit( 1 );
				}
				readDumpVersion = value;
				return;
		}
	};

	// handling the root object
	rootHandler =
		async function( data )
	{
		const name = data.name;
		const value = data.value;
		switch( name )
		{
			case 'startObject' :
				handlers.push( objectHandler );
				key = undefined;
				return;

			case 'keyValue' :
				key = value;
				return;

			case 'stringValue' :
				rootKeyHandler( key, value );
				key = undefined;
				return;

			case 'numberValue' :
				rootKeyHandler( key, parseInt( value, 10 ) );
				key = undefined;
				return;

			case 'nullValue' :
				rootKeyHandler( key, null );
				key = undefined;
				return;

			case 'trueValue' :
				rootKeyHandler( key, true );
				key = undefined;
				return;

			case 'falseValue' :
				rootKeyHandler( key, false );
				key = undefined;
				return;

			case 'endObject' :
				if( readDbVersion === undefined )
				{
					console.error( 'dbVersion missing' );
					process.exit( 1 );
				}
				if( readDumpVersion === undefined )
				{
					console.error( 'dumpVersion missing' );
					process.exit( 1 );
				}
				if( resolve ) resolve( );
				return;
		}
	};

	// handling a generic object to ignore
	objectHandler =
		async function( data )
	{
		const name = data.name;
		switch( name )
		{
			case 'startObject' : handlers.push( objectHandler ); return;
			case 'endObject' : handlers.pop( ); return;
		}
	};

	handlers.push( startHandler );

	parser.on( 'data',
		( data ) =>
	{
		parser.pause( );
		handlers[ handlers.length - 1 ]( data ).then( ( ) => parser.resume( ) );
	} );

	rs.pipe( parser );
	if( resolve ) await promise;
};


/*
| Parses the JSON stream checking dbVersion and dumpVersion
*/
const passLoad =
	async function(
		filename
	)
{

	const rs = fs.createReadStream( filename );
	const parser = streamJson.parser( );

	let handlers = [ ];
	let rootHandler;
	let objectHandler;
	let usersHandler;
	let usersStartHandler;
	let resolve;

	const promise = new Promise( ( r ) => { resolve = r; } );

	// handling for start/end of json stream
	const startHandler =
		async function( data )
	{
		const name = data.name;
		switch( name )
		{
			case 'startObject' : handlers.push( rootHandler ); return;
			default : throw new Error( );
		}
	};

	// handling the root object
	rootHandler =
		async function( data )
	{
		const name = data.name;
		const value = data.value;
		switch( name )
		{
			case 'startObject' :
				handlers.push( objectHandler );
				return;

			case 'keyValue' :
				if( value === 'users' )
				handlers.push( usersStartHandler );
				return;

			case 'endObject' :
				if( resolve ) resolve( );
				return;
		}
	};

	// handling the start of the users table.
	usersStartHandler =
		async function( data )
	{
		const name = data.name;
		switch( name )
		{
			case 'startObject' :
				handlers.pop( );
				handlers.push( usersHandler );
				return;
		}
	};

	// handling the users table.
	usersHandler =
		async function( data )
	{
		console.log( 'USERS', data );
		const name = data.name;
		switch( name )
		{
			case 'startObject' : handlers.push( objectHandler ); return;
			case 'endObject' : handlers.pop( ); return;
		}
	};

	// handling a generic object to ignore
	objectHandler =
		async function( data )
	{
		const name = data.name;
		switch( name )
		{
			case 'startObject' : handlers.push( objectHandler ); return;
			case 'endObject' : handlers.pop( ); return;
		}
	};

	handlers.push( startHandler );

	parser.on( 'data',
		( data ) =>
	{
		parser.pause( );
		handlers[ handlers.length - 1 ]( data ).then( ( ) => parser.resume( ) );
	} );

	rs.pipe( parser );
	if( resolve ) await promise;
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
