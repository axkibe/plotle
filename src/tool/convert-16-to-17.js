/*
| Converts a v16 repository to v17.
*/
'use strict';


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
		name : 'plotle-16'
	},
	trg :
	{
		host : '127.0.0.1',
		port : 27017,
		name : 'plotle-17'
	}
};

global.CHECK = true;

global.NODE = true;

// registers with tim.js
{
	require( 'tim.js' );

	const ending = 'src/tool/convert-16-to-17.js';

	const filename = module.filename;

	// if this filename is not bootstrap.js something is seriously amiss.
	if( !filename.endsWith( ending ) ) throw new Error( );

	const rootPath = filename.substr( 0, filename.length - ending.length );

	// timcode path is one level up
	const timcodePath = rootPath.substr( 0, rootPath.lastIndexOf( '/' ) ) + '/timcode/';

	tim.catalog.addRootDir( rootPath, 'convert', timcodePath );
}


const change_list = require( '../change/list' );

const change_set = require( '../change/set' );

const database_changeSkid = require( '../database/changeSkid' );

const fabric_space = require( '../fabric/space' );

const mongodb = require( 'mongodb' );

const ref_space = require( '../ref/space' );

const suspend = require( 'suspend' );

const tim_path = require( 'tim.js/src/path/path' );

const session_uid = require( '../session/uid' );

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
| loads all spaces and playbacks all changes from the database.
*/
const loadSpace =
	function*(
		srcConnection,
		trgConnection,
		spaceRef
	)
{
	console.log( 'loading and replaying "' + spaceRef.fullname + '"' );

	const srcChanges =
		yield srcConnection.collection( 'changes:' + spaceRef.fullname, resume( ) );

	const cursor =
		( yield srcChanges.find(
			{ },
			{ sort : '_id' },
			resume( )
		) ).batchSize( 100 );

	let seqZ = 1;

	let space = fabric_space.create( );

	for(
		let o = yield cursor.nextObject( resume( ) );
		o;
		o = yield cursor.nextObject( resume( ) )
	)
	{
		const changeSkid = database_changeSkid.createFromJSON( o );

		if( changeSkid._id !== seqZ ) throw new Error( 'sequence mismatch' );

		console.inspect( 'change', seqZ, JSON.parse( JSON.stringify( changeSkid ) ) );

		seqZ++;

		space = changeSkid.changeTree( space );
	}

	console.inspect( 'space json', JSON.parse( JSON.stringify( space ) ) );

	const changeSet =
		change_set.create(
			'path', tim_path.empty,
			'val', space,
			'prev', fabric_space.create( )
		);

	const changeList = change_list.create( 'list:init', [ changeSet ] );

	const changeSkid =
		database_changeSkid.create(
			'_id', 1,
			'cid', session_uid.newUid( ),
			'changeList', changeList,
			'user', ':convert',
			'date', Date.now( )
		);

	const trgChanges =
		yield trgConnection.collection( 'changes:' + spaceRef.fullname, resume( ) );

	if( !dry )
	{
		yield trgChanges.insert(
			JSON.parse( JSON.stringify( changeSkid ) ),
			resume( )
		);
	}

	return space;
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

	if( o.version !== 16 ) throw new Error( 'src is not a v16 repository' );

	console.log( '* connecting to trg' );

	const trgConnection = yield* connectToTarget( );

	console.log( '* dropping trg' );

	if( !dry ) yield trgConnection.dropDatabase( resume( ) );

	const srcUsers = yield srcConnection.collection( 'users', resume( ) );

	const srcSpaces = yield srcConnection.collection( 'spaces', resume( ) );

	const trgGlobal = yield trgConnection.collection( 'global', resume( ) );

	const trgUsers = yield trgConnection.collection( 'users', resume( ) );

	const trgSpaces = yield trgConnection.collection( 'spaces', resume( ) );

	console.log( '* creating trg.global' );

	if( !dry ) yield trgGlobal.insert( { _id : 'version', version : 17 }, resume( ) );

	console.log( '* converting src.users -> trg.users' );

	let cursor = yield srcUsers.find( resume( ) );

	for(
		o = yield cursor.nextObject( resume( ) );
		o !== null;
		o = yield cursor.nextObject( resume( ) )
	)
	{
		console.log( ' * ' + o._id );

		if( !dry ) yield trgUsers.insert( o, resume( ) );
	}

	console.log( '* copying src.spaces -> trg.spaces' );

	cursor = yield srcSpaces.find( { }, { sort: '_id' }, resume( ) );

	for(
		o = yield cursor.nextObject( resume( ) );
		o !== null;
		o = yield cursor.nextObject( resume( ) )
	)
	{
		if( !dry ) yield trgSpaces.insert( o, resume( ) );

		const spaceRef = ref_space.createUsernameTag( o.username, o.tag );

		//if( spaceRef.equals( ref_space.plotleHome ) )
		yield * loadSpace( srcConnection, trgConnection, spaceRef );
	}

	console.log( '* closing connections' );

	srcConnection.close( );

	trgConnection.close( );

	console.log( '* done' );
};

suspend( run )( );
