/*
| Converts a v21 repository to v22.
| This converts from mongodb to couchdb.
*/
'use strict';


//Error.stackTraceLimit = Infinity;


/*
| If false doesn't do anything to the target.
*/
let wet = false;

const fromVersion = 21;
const toVersion = fromVersion + 1;

const config =
{
	src :
	{
		name : 'plotle-' + fromVersion,
		host : '127.0.0.1',
		port : 27017,
	},
	trg :
	{
		name : 'plotle-' + toVersion,
		passfile : './dbadminpass',
		url : 'http://admin:PASSWORD@127.0.0.1:5984',
	},
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
const nano = require( 'nano' );
const ref_space = require( '../ref/space' );
const fs = require( 'fs' );
const util = require( 'util' );

const readFile = util.promisify( fs.readFile );


/*
| Reads a password file.
*/
const readPassFile =
	async function(
		filepath
	)
{
	let pass;

	try { pass = '' + await readFile( filepath ); }
	catch( e ) { throw new Error( 'Cannot read "' + filepath + '"' ); }

	// removes newline if present
	if( pass[ pass.length - 1 ] === '\n' ) pass = pass.substr( 0, pass.length - 1 );

	if( pass.indexOf( '\n' ) >= 0 )
	{
		throw new Error( 'too many lines in "' + filepath + '"' );
	}

	return pass;
};


/*
| Creates a connection to the source.
*/
const connectToSource =
	async function( )
{
	const server = new mongodb.Server( config.src.host, config.src.port, { } );
	const connector = new mongodb.Db( config.src.name, server, { w : 1 } );

	return await connector.open( );
};


/*
| Creates a connection to the target.
*/
const connectToTarget =
	async function( )
{
	const passfile = config.trg.passfile;
	let url = config.trg.url;

	if( passfile )
	{
		let dbadminpass = await readPassFile( passfile );
		if( url.indexOf( 'PASSWORD' ) < 0 )
		{
			throw new Error( 'passfile given but no PASSWORD in url' );
		}
		url = url.replace( 'PASSWORD', dbadminpass );
	}

	return await nano( url );
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
| Converts a space.
*/
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
		o.seq = o._id;
		o.table = table;
		o._id = o.table + ':' + o._id;

		if( wet ) { await target.insert( o ); }
	}
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
		case 'dry' : wet = false; break;
		case 'wet' : wet = true; break;
		default : usage( ); return;
	}

	if( wet ) console.log( '-- WET RUN! --' );
	else console.log( '-- dry run --' );

	console.log( '* connecting to src' );

	const srcConnection = await connectToSource( );
	const srcGlobal = await srcConnection.collection( 'global' );

	let o = await srcGlobal.findOne( { _id : 'version' } );

	if( o.version !== fromVersion )
	{
		throw new Error( 'src is not a v' + fromVersion + ' repository' );
	}

	console.log( '* connecting to target' );
	const targetConnection = await connectToTarget( );

	console.log( '* destroying & creating target' );

	let target;
	if( wet )
	{
		const name = config.trg.name;
		try{ await targetConnection.db.destroy( name ); } catch( e ) { }
		await targetConnection.db.create( name );
		target = await targetConnection.db.use( name );
	}

	const srcUsers = await srcConnection.collection( 'users' );
	const srcSpaces = await srcConnection.collection( 'spaces' );

	console.log( '* creating target global' );

	if( wet ) await target.insert( { _id : 'version', version : toVersion } );

	console.log( '* converting src.users -> trg.users' );
	{
		const view =
		{
			'_id': '_design/users',
			'views' :
			{
				'name' :
				{
					'map' :
						'function( doc )'
						+ ' {'
						+   ' if( doc.table === "users" )'
						+     ' emit( doc.name );'
						+ ' }'
				}
			},
			'language' : 'javascript'
		};
		if( wet ) await target.insert( view );
	}

	let cursor = await srcUsers.find( );
	for(
		o = await cursor.nextObject( );
		o !== null;
		o = await cursor.nextObject( )
	)
	{
		console.log( ' * ' + o._id );
		o.name = o._id;
		o.table = 'users';
		o._id = 'users:' + o._id;

		if( wet ) await target.insert( o );
	}

	console.log( '* copying src.spaces -> trg.spaces' );

	cursor = await srcSpaces.find( { }, { sort: '_id' } );

	{
		const view =
		{
			'_id': '_design/spaces',
			'views' :
			{
				'id' :
				{
					'map' :
						'function( doc )'
						+ ' {'
						+   ' if( doc.table === "spaces" )'
						+     ' emit( doc._id );'
						+ ' }'
				}
			},
			'language' : 'javascript'
		};
		if( wet ) await target.insert( view );
	}

	for(
		o = await cursor.nextObject( );
		o !== null;
		o = await cursor.nextObject( )
	)
	{
		o.table = 'spaces';
		const name = o.username + ':' + o.tag;
		o._id = 'spaces:' + name;

		if( wet ) await target.insert( o );

		const view =
		{
			'_id': '_design/spaces:' + name,
			'views' :
			{
				'seq' :
				{
					'map' :
						'function( doc )'
						+ ' {'
						+   ' if( doc.table === "changes:' + name + '" )'
						+     ' emit( doc.seq );'
						+ ' }'
				}
			},
			'language' : 'javascript'
		};

		if( wet ) await target.insert( view );

		const spaceRef = ref_space.createUsernameTag( o.username, o.tag );
		await convertSpace( srcConnection, target, spaceRef );
	}

	console.log( '* closing connections' );
	srcConnection.close( );
	console.log( '* done' );
};


run( ).catch( ( error ) => { console.error( error ); } );
