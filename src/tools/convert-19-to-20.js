/*
| Converts a v19 repository to v20.
*/
'use strict';


//Error.stackTraceLimit = Infinity;


/*
| If true doesn't do anything to the target.
*/
const dry = false;

const config =
{
	src :
	{
		host : '127.0.0.1',
		port : 27017,
		name : 'plotle-19'
	},
	trg :
	{
		host : '127.0.0.1',
		port : 27017,
		name : 'plotle-20'
	}
};

global.CHECK = true;

global.NODE = true;

// registers with tim.js
{
	require( 'tim.js' );

	const ending = 'src/tools/convert-19-to-20.js';

	const filename = module.filename;

	if( !filename.endsWith( ending ) ) throw new Error( );

	const rootPath = filename.substr( 0, filename.length - ending.length );

	// timcode path is one level up
	const timcodePath = rootPath.substr( 0, rootPath.lastIndexOf( '/' ) ) + '/timcode/';

	tim.catalog.addRootDir( rootPath, 'convert', timcodePath );
}


const mongodb = require( 'mongodb' );

const ref_space = require( '../ref/space' );


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
| Converts these keys.
*/
const convertKeys =
{
	from  : 'jp1',
	to    : 'jp2',
};


/*
| Converts the JSON for a change/list.
*/
const convertJson =
	function(
		obj
	)
{
	const keys = Object.keys( obj );

	for( let key of keys )
	{
		const v = obj[ key ];

		const cto = convertKeys[ key ];

		if( cto )
		{
			obj[ cto ] = v;

			delete obj[ key ];

			continue;
		}

		if( key === 'trace' || key === 'trace2' )
		{
			const trace = v.trace || v;

			for( let step = 0, tl = trace.length; step < tl; step++ )
			{
				const sv = trace[ step ];

				switch( sv )
				{
					case '(o)from' : trace[ step ] = '(o)jp1'; break;

					case '(o)to' : trace[ step ] = '(o)jp2'; break;

					case '(o)field' :

						// Fixing something that should never
						// have happened

						if( trace[ step + 1 ] === 'from' )
						{
							trace[ step ] = '(o)jp1';
							trace.splice( step + 1, 1 );
						}
						else if( trace[ step + 1 ] === 'to' )
						{
							trace[ step ] = '(o)jp2';
							trace.splice( step + 1, 1 );
						}

						tl--;

						break;
				}
			}

			continue;
		}

		if( typeof( v ) === 'object' ) convertJson( obj[ key ] );
	}
};


/*
| Converts a space.
*/
const convertSpace =
	async function(
		srcConnection,
		trgConnection,
		spaceRef
	)
{
	console.log( 'loading and replaying "' + spaceRef.fullname + '"' );

	const srcChanges = await srcConnection.collection( 'changes:' + spaceRef.fullname );

	const cursor =
		( await srcChanges.find( { }, { sort : '_id' },) )
		.batchSize( 100 );

	const trgChanges =
		await trgConnection.collection( 'changes:' + spaceRef.fullname );

	for(
		let o = await cursor.nextObject( );
		o;
		o = await cursor.nextObject( )
	)
	{
		convertJson( o );

		if( !dry ) { await trgChanges.insert( o ); }
	}
};


/*
| The main runner.
*/
const run =
	async function( )
{
	console.log( '* connecting to src' );

	const srcConnection = await connectToSource( );

	const srcGlobal = await srcConnection.collection( 'global' );

	let o = await srcGlobal.findOne( { _id : 'version' } );

	if( o.version !== 19 ) throw new Error( 'src is not a v19 repository' );

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

	if( !dry ) await trgGlobal.insert( { _id : 'version', version : 20 } );

	console.log( '* converting src.users -> trg.users' );

	let cursor = await srcUsers.find( );

	for(
		o = await cursor.nextObject( );
		o !== null;
		o = await cursor.nextObject( )
	)
	{
		console.log( ' * ' + o._id );

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

		const spaceRef = ref_space.createUsernameTag( o.username, o.tag );

		await convertSpace( srcConnection, trgConnection, spaceRef );
	}

	console.log( '* closing connections' );

	srcConnection.close( );

	trgConnection.close( );

	console.log( '* done' );
};


run( ).catch( ( error ) => { console.error( error ); } );
