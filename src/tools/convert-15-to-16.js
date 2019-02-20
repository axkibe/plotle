/*
| Converts a v15 repository to v16.
*/
'use strict';

const config =
{
	src :
	{
		host : '127.0.0.1',
		port : 27017,
		name : 'plotle-15'
	},
	trg :
	{
		host : '127.0.0.1',
		port : 27017,
		name : 'plotle-16'
	}
};

global.TIM = false;

global.CHECK = true;

global.FREEZE = false;

global.NODE = true;

// registers with tim.js
{
	require( 'tim.js' );

	const ending = 'src/tools/convert-15-to-16.js';

	const filename = module.filename;

	// if this filename is not bootstrap.js something is seriously amiss.
	if( !filename.endsWith( ending ) ) throw new Error( );

	const rootPath = filename.substr( 0, filename.length - ending.length );

	// timcode path is one level up
	const timcodePath = rootPath.substr( 0, rootPath.lastIndexOf( '/' ) ) + '/timcode/';

	tim.catalog.addRootDir( rootPath, 'convert', timcodePath );
}

//const tim_oldPath = require( '../oldPath' );

//const tim_path = require( '../path' );

const ref_space = require( '../ref/space' );

const mongodb = require( 'mongodb' );

const suspend = require( 'suspend' );

const resume = suspend.resume;


/*
| Creates a connection to the target.
*/
const connectToSource =
	function*( )
{
	const server = new mongodb.Server( config.src.host, config.src.port, { } );

	const connector = new mongodb.Db( config.src.name, server, { w : 1 } );

	return yield connector.open( resume( ) );
};


/*
| Creates a connection to the source.
*/
const connectToTarget =
	function*( )
{
	const server = new mongodb.Server( config.trg.host, config.trg.port, { } );

	const connector = new mongodb.Db( config.trg.name, server, { w : 1 } );

	return yield connector.open( resume( ) );
};


/*
| Changes paths from oldstyle to newstyle.
*/
const convertPath =
	function( obj )
{
	for( let key in obj )
	{
		if( key === 'path' || key === 'path2' )
		{
			obj[ key ] = { type : 'path', list : obj[ key ] };

			continue;
		}

		if( typeof( obj ) === 'object' || typeof( obj ) === 'array' ) convertPath( obj[ key ] );
	}
};


/*
| The main runner.
*/
const run =
	function*( )
{
	console.log( '* connecting to src' );

	const srcConnection = yield* connectToSource( );

	const srcGlobal = yield srcConnection.collection( 'global', resume( ) );

	let o =
		yield srcGlobal.findOne(
			{ _id : 'version' },
			resume( )
		);

	if( o.version !== 15 ) throw new Error( 'src is not a v15 repository' );

	console.log( '* connecting to trg' );

	const trgConnection = yield* connectToTarget( );

	console.log( '* dropping trg' );

	yield trgConnection.dropDatabase( resume( ) );

	const srcUsers = yield srcConnection.collection( 'users', resume( ) );

	const srcSpaces = yield srcConnection.collection( 'spaces', resume( ) );

	const trgGlobal = yield trgConnection.collection( 'global', resume( ) );

	const trgUsers = yield trgConnection.collection( 'users', resume( ) );

	const trgSpaces = yield trgConnection.collection( 'spaces', resume( ) );

	console.log( '* creating trg.global' );

	yield trgGlobal.insert( { _id : 'version', version : 16 }, resume( ) );

	console.log( '* converting src.users -> trg.users' );

	let cursor = yield srcUsers.find( resume( ) );

	for(
		o = yield cursor.nextObject( resume( ) );
		o !== null;
		o = yield cursor.nextObject( resume( ) )
	)
	{
		console.log( ' * ' + o._id );

		yield trgUsers.insert( o, resume( ) );
	}

	console.log( '* copying src.spaces -> trg.spaces' );

	cursor = yield srcSpaces.find( { }, { sort: '_id' }, resume( ) );

	for(
		o = yield cursor.nextObject( resume( ) );
		o !== null;
		o = yield cursor.nextObject( resume( ) )
	)
	{
		yield trgSpaces.insert( o, resume( ) );

		const spaceRef = ref_space.create( 'username', o.username, 'tag', o.tag );

		console.log( ' * copying changes of "' + spaceRef.fullname + '"' );

		const srcChanges =
			yield srcConnection.collection( 'changes:' + spaceRef.fullname, resume( ) );

		const trgChanges =
			yield trgConnection.collection( 'changes:' + spaceRef.fullname, resume( ) );

		const changesCursor =
			(
				yield srcChanges.find(
					{ },
					{ sort: '_id' },
					resume( )
				)
			).batchSize( 100 );

		for(
			let cs = yield changesCursor.nextObject( resume( ) );
			cs !== null;
			cs = yield changesCursor.nextObject( resume( ) )
		)
		{
			convertPath( cs );

			yield trgChanges.insert( cs, resume( ) );
		}
	}

	console.log( '* closing connections' );

	srcConnection.close( );

	trgConnection.close( );

	console.log( '* done' );
};

suspend( run )( );
