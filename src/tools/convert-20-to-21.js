/*
| Converts a v20 repository to v21.
*/
'use strict';


//Error.stackTraceLimit = Infinity;


/*
| If true doesn't do anything to the target.
*/
let dry = true;

const fromVersion = 20;
const toVersion = fromVersion + 1;

const config =
{
	src :
	{
		host : '127.0.0.1',
		port : 27017,
		name : 'plotle-' + fromVersion,
	},
	trg :
	{
		host : '127.0.0.1',
		port : 27017,
		name : 'plotle-' + toVersion,
	}
};

global.CHECK = true;

global.NODE = true;

// registers with tim.js
{
	require( 'tim.js' );
	const ending = 'src/tools/convert-' + fromVersion + '-to-' + toVersion + '.js';
	const filename = module.filename;
	if( !filename.endsWith( ending ) ) throw new Error( );
	const rootPath = filename.substr( 0, filename.length - ending.length );
	const timcodePath = rootPath.substr( 0, rootPath.lastIndexOf( '/' ) ) + '/timcode/';
	tim.catalog.addRootDir( rootPath, 'convert', timcodePath );
}


const mongodb = require( 'mongodb' );
//const ref_space = require( '../ref/space' );


/*
| Creates a connection to the target.
*/
const connectToSource =
	async function( )
{
	const server = new mongodb.Server( config.src.host, config.src.port, { } );
	const connector = new mongodb.Db( config.src.name, server, { w : 1 } );

	return await connector.open( );
};


/*
| Creates a connection to the source.
*/
const connectToTarget =
	async function( )
{
	const server = new mongodb.Server( config.trg.host, config.trg.port, { } );
	const connector = new mongodb.Db( config.trg.name, server, { w : 1 } );

	return await connector.open( );
};


/*
| Prints out usage info.
*/
const usage =
	function( )
{
	console.log( 'USAGE node : ' + module.filename + ' [dry or wet]' );
};


/*
| The main runner.
*/
const run =
	async function( )
{
	if( process.argv.length !== 3 ) { usage( ); return; }

	const arg = process.argv[ 2 ];

	switch( arg )
	{
		case 'dry' : dry = true; break;
		case 'wet' : dry = false; break;
		default : usage( ); return;
	}

	if( dry ) console.log( '-- dry run --' );
	else console.log( '-- WET RUN! --' );

	console.log( '* connecting to src' );

	const srcConnection = await connectToSource( );
	const srcGlobal = await srcConnection.collection( 'global' );

	let o = await srcGlobal.findOne( { _id : 'version' } );

	if( o.version !== fromVersion )
	{
		throw new Error( 'src is not a v' + fromVersion + ' repository' );
	}

	console.log( '* connecting to trg' );

	const trgConnection = await connectToTarget( );

	console.log( '* dropping trg' );

	if( !dry ) await trgConnection.dropDatabase( );

	const srcUsers = await srcConnection.collection( 'users' );
	const srcSpaces = await srcConnection.collection( 'spaces' );
	const trgGlobal = await trgConnection.collection( 'global' );
	const trgUsers = await trgConnection.collection( 'users' );
	const trgSpaces = await trgConnection.collection( 'spaces' );

	console.log( '* creating trg.global' );

	if( !dry ) await trgGlobal.insert( { _id : 'version', version : toVersion } );

	console.log( '* converting src.users -> trg.users' );

	let cursor = await srcUsers.find( );

	for(
		o = await cursor.nextObject( );
		o !== null;
		o = await cursor.nextObject( )
	)
	{
		console.log( ' * ' + o._id );

		o.type = 'userInfoSkid';
		delete o.code;
		delete o.icom;
		if( o.news === 'init' ) o.news = false;

		if( !dry ) await trgUsers.insert( o );
	}

	console.log( '* copying src.spaces -> trg.spaces' );

	cursor = await srcSpaces.find( { }, { sort: '_id' } );

	for(
		o = await cursor.nextObject( );
		o !== null;
		o = await cursor.nextObject( )
	)
	{
		if( !dry ) await trgSpaces.insert( o );

		//const spaceRef = ref_space.createUsernameTag( o.username, o.tag );
		//await convertSpace( srcConnection, trgConnection, spaceRef );
	}

	console.log( '* closing connections' );
	srcConnection.close( );
	trgConnection.close( );
	console.log( '* done' );
};


run( ).catch( ( error ) => { console.error( error ); } );
