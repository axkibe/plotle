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

const fabric_doc = require( '../fabric/doc' );

const fabric_label = require( '../fabric/label' );

const fabric_note = require( '../fabric/note' );

const fabric_para = require( '../fabric/para' );

const fabric_portal = require( '../fabric/portal' );

const fabric_relation = require( '../fabric/relation' );

const fabric_space = require( '../fabric/space' );

const gleam_font_root = require( '../gleam/font/root' );

const mongodb = require( 'mongodb' );

const priorfabric_doc = require( '../priorfabric/doc' );

const priorfabric_label = require( '../priorfabric/label' );

const priorfabric_note = require( '../priorfabric/note' );

const priorfabric_portal = require( '../priorfabric/portal' );

const priorfabric_relation = require( '../priorfabric/relation' );

const priorfabric_space = require( '../priorfabric/space' );

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


const JsonMap =
	Object.freeze( {
		'space'        : 'prior-space',
		'note'         : 'prior-note',
		'label'        : 'prior-label',
		'portal'       : 'prior-portal',
		'arrow'        : 'prior-stroke',
		'relation'     : 'prior-relation',
		'fabric_doc'   : 'prior-doc',
		'fabric_para'  : 'prior-para',
	} );


/*
| Converts the JSON types in an object.
*/
const convertJsonTypes =
	function(
		obj
	)
{
	for( let key in obj )
	{
		const o = obj[ key ];

		if( key === 'type' )
		{
			const mapped = JsonMap[ o ];

			if( mapped ) obj.type = mapped;

			continue;
		}

		if( typeof( o ) === 'object' ) convertJsonTypes( o );
	}
};


/*
| Converts a priorfabric doc.
*/
const convertDoc =
	function(
		pdoc
	)
{
	if( pdoc.timtype !== priorfabric_doc ) throw new Error( );

	let doc = fabric_doc.create( );

	for( let a = 0, aZ = pdoc.length; a < aZ; a++ )
	{
		const key = pdoc.getKey( a );

		const ppara = pdoc.get( key );

		const para = fabric_para.create( 'text', ppara.text );

		doc = doc.create( 'twig:add', key, para );
	}

	return doc;
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

	let pspace = priorfabric_space.create( );

	for(
		let o = yield cursor.nextObject( resume( ) );
		o;
		o = yield cursor.nextObject( resume( ) )
	)
	{
		convertJsonTypes( o );

		const changeSkid = database_changeSkid.createFromJSON( o );

		if( changeSkid._id !== seqZ ) throw new Error( 'sequence mismatch' );

		seqZ++;

		pspace = changeSkid.changeTree( pspace );
	}

	let space = fabric_space.create( );

	// converts the fabric items and sets zones for labels/relations

	for( let a = 0, al = pspace.length; a < al; a++ )
	{
		const key = pspace.getKey( a );

		const pitem = pspace.get( key );

		let item;

		switch( pitem.timtype )
		{
			case priorfabric_label :

				item =
					fabric_label.create(
						'doc', convertDoc( pitem.doc ),
						'fontsize', pitem.fontsize,
						'zone', pitem.zone
					);

				break;

			case priorfabric_note :

				item =
					fabric_note.create(
						'doc', convertDoc( pitem.doc ),
						'fontsize', pitem.fontsize,
						'zone', pitem.zone
					);

				break;

			case priorfabric_portal :

				item =
					fabric_portal.create(
						'spaceTag', pitem.spaceTag,
						'spaceUser', pitem.spaceUser,
						'zone', pitem.zone
					);

				break;

			case priorfabric_relation :
			{
				item =
					fabric_relation.create(
						'doc', convertDoc( pitem.doc ),
						'fontsize', pitem.fontsize,
						'item1key', pitem.item1key,
						'item2key', pitem.item2key,
						'zone', pitem.zone
					);

				break;
			}

			default: throw new Error( );
		}

		space = space.create( 'twig:add', key, item );
	}

	// next iteration sets from/to points for relations
	pspace = space;

	for( let a = 0, al = pspace.length; a < al; a++ )
	{
		const key = pspace.getKey( a );

		let item = pspace.get( key );

		if( item.timtype !== fabric_relation ) continue;

		const item1 = pspace.get( item.item1key );

		const item2 = pspace.get( item.item2key );

		if( item1 ) item = item.create( 'from', item.ancillaryFrom( item1 ) );

		if( item2 ) item = item.create( 'to', item.ancillaryTo( item2 ) );

		space = space.create( 'twig:set', key, item );
	}

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
	console.log( '* loading fonts' );

	yield gleam_font_root.load( 'DejaVuSans-Regular', resume( ) );

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
