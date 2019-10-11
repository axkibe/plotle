/*
| The root of the server.
*/
'use strict';


tim.define( module, ( def ) => {


if( TIM )
{
	def.attributes =
	{
		// file path of the bundle
		bundleFilePath : { type : [ 'undefined', 'string' ] },

		// the servers inventory of resources
		inventory : { type : './inventory' },

		// ID for next upsleep
		nextSleepID : { type : 'integer' },

		// next visitors ID
		nextVisitor : { type : 'integer' },

		// the database backend
		repository : { type : '../database/repository' },

		// all spaces
		spaces : { type : './spaceNexus' },

		// manages users
		userNexus : { type : './userNexus' },

		// a table of all clients waiting for an update
		upSleeps : { type : './upSleepGroup' }
	};

	def.global = 'root';
}


// used for debugging the change engine
//const DELAY_ALTER = 5000;
//const DELAY_ACQUIRE = 5000;
const DELAY_ALTER = false;
const DELAY_ACQUIRE = false;

// TODO still some dependency conflict in tim.js
tim.require( '../trace/base' );

const fs = tim.require( 'fs' );
const terser = tim.require( 'terser' );
const url = tim.require( 'url' );
const util = tim.require( 'util' );

const config = tim.require( '../config/intf' );
const hash_sha1 = tim.require( '../hash/sha1' );
const log = tim.require( './log' );
const ref_space = tim.require( '../ref/space' );
const ref_userSpaceList = tim.require( '../ref/userSpaceList' );
const server_maxAge = tim.require( './maxAge' );
const server_postProcessor = tim.require( './postProcessor' );
const server_requestHandler = tim.require( './requestHandler' );
const server_roster = tim.require( './roster' );
const server_resource = tim.require( './resource' );
const server_spaceBox = tim.require( './spaceBox' );
const timspec_twig = tim.require( 'tim.js/timspecTwig' );
const tim_path = tim.require( 'tim.js/path' );

const fsStat = util.promisify( fs.stat );


/*
| Waits for 'time' milliseconds.
*/
const wait = ( time ) =>
	new Promise( ( resolve ) => { setTimeout( ( ) => resolve( ), time ); } );


/*
| loads all spaces and playbacks all changes from the database.
*/
def.proto.loadSpaces =
	async function( )
{
	log.log( 'loading and replaying all spaces' );

	const spaceIDs = await root.repository.getSpaceIDs( );

	for( let sRow of spaceIDs )
	{
/**/	if( CHECK && sRow.id !== sRow.key ) throw new Error( );

		const id = sRow.id;
		const o = await root.repository.getSpaceMeta( id );
		const spaceRef = ref_space.create( 'username', o.username, 'tag', o.tag );

		log.log( 'loading and replaying "' + spaceRef.fullname + '"' );

		root.create(
			'spaces',
				root.spaces.create(
					'group:set',
					spaceRef.fullname,
					await server_spaceBox.loadSpace( spaceRef )
				)
		);
	}
};


/*
| The shell's globals.
*/
def.proto.shellGlobals =
	function(
		mode,
		target
	)
{
/**/if( CHECK )
/**/{
/**/	if( mode !== 'bundle' && mode !== 'devel' ) throw new Error( );
/**/	if( target !== 'shell' && target !== 'testpad' ) throw new Error( );
/**/}

	return(
		Object.freeze( {
			CHECK: config.get( 'shell', mode, 'check' ),
			NODE : false,
			TIM : false,
			FAILSCREEN : config.get( 'shell', mode, 'failScreen' ),
			VISUAL : target === 'shell'
		} )
	);
};


/*
| The shell's globals as resource.
*/
def.proto.shellGlobalsResource =
	function(
		target   // 'shell' or 'testpad'
	)
{
	let text = '';

	const globals = this.shellGlobals( 'devel', target );

	for( let key of Object.keys( globals ).sort( ) )
	{
		text += 'var ' + key + ' = ' + globals[ key ] + ';\n';
	}

	return(
		server_resource.create(
			'data', text,
			'filePath', 'global-' + target + '.js',
			'inBundle', true,  // FIXME only when shell target?
			'inTestPad', target === 'testpad'
		)
	);
};


/*
| The shell config as resource.
*/
def.proto.shellConfigResource =
	function(
		target   // 'shell' or 'testpad'
	)
{
	let t = [ ];
	t.push(
		'"use strict"',
		'var config = Object.freeze( { ',
		'  animation : Object.freeze( {',
		'    enable : ' + config.get( 'shell', 'animation', 'enable' ) + ',',
		'    zoomAllHomeTime : ' + config.get( 'shell', 'animation', 'zoomAllHomeTime' ) + ',',
		'    zoomStepTime : ' + config.get( 'shell', 'animation', 'zoomStepTime' ) + ',',
		'  } ),',
		'  dragBox : ' + config.get( 'shell', 'dragBox' ) + ',',
		'  dragTime : ' + config.get( 'shell', 'dragTime' ) + ',',
		'  glintCacheLimit : ' + config.get( 'shell', 'glintCacheLimit' ) + ',',
		'  glyphCacheLimit : ' + config.get( 'shell', 'glyphCacheLimit' ) + ',',
		'  textWheelSpeed : ' + config.get( 'shell', 'textWheelSpeed' ) + ',',
		'  maxUndo : ' + config.get( 'shell', 'maxUndo' ) + ',',
		'  zoomMax : ' + config.get( 'shell', 'zoomMax' ) + ',',
		'  zoomMin : ' + config.get( 'shell', 'zoomMin' ) + ',',
		'} );',
	);

	return(
		server_resource.create(
			'data', t.join( '\n' ),
			'filePath', 'config-' + target + '.js',
			'inBundle', target === 'shell',
			'inTestPad', target === 'testpad'
		)
	);
};


/*
| Builds the bundle.
*/
def.proto.buildBundle =
	function( )
{
	log.log( 'building bundle' );

	if( config.get( 'shell', 'bundle', 'minify' ) )
	{
		log.log( 'minifying bundle' );

		const code = { };

		for( let resource of root.inventory )
		{
			if( !resource.inBundle ) continue;
			if( resource.filePath === 'global-shell.js' ) continue;
			if( resource.filePath === 'global-testpad.js' ) continue;

			code[ resource.aliases.get( 0 ) ] = resource.data + '';
		}

		const globals = this.shellGlobals( 'bundle', 'shell' );

		const options =
		{
			compress : { ecma : 6, global_defs : globals, },
			output : { beautify : config.get( 'shell', 'bundle', 'beautify' ) },
		};

		if( config.get( 'shell', 'bundle', 'sourceMap' ) )
		{
			options.sourceMap = { filename : 'source.map' };
		}

		const result = terser.minify( code, options );

		if( config.get( 'server', 'report' )
			&& config.get( 'shell', 'bundle', 'sourceMap' )
		)
		{
			fs.writeFileSync( 'report/source.map', result.map );
		}

		if( result.error ) throw new Error( 'minify error: ' + result.error );

		// forcing strict mode
		const usestrict = '"use strict";';

		if( result.code.substr( 0, usestrict.length ) !== usestrict )
		{
			throw new Error( 'generated bundle code not in strict mode.' );
		}

		return result;
	}
	else
	{
		log.log( 'concating bundle' );

		let code = '';

		for( let resource of root.inventory )
		{
			if( !resource.inBundle ) continue;

			code += resource.data + '';
		}

		return { code: code };
	}
};


/*
| Registers and prepares the inventory.
| Also builds the bundle.
*/
def.proto.prepareInventory =
	async function( )
{
	log.log( 'preparing inventory' );

	const devel = config.get( 'shell', 'devel', 'enable' );

	root.create(
		'inventory',
		root.inventory
		.updateResource( root.shellGlobalsResource( 'shell' ) )
		.updateResource( root.shellGlobalsResource( 'testpad' ) )
		.updateResource( root.shellConfigResource( 'shell' ) )
	);

	// prepares resources from the roster
	for( let resource of server_roster.roster )
	{
		if( resource.devel && !devel ) continue;

		await root.inventory.prepareResource( resource );
	}

	// prepares resources form the the shell
	{
		const entry = '../shell/start';

		require( entry );

		const srts =
			tim.catalog.getByRelativePath(
				module.filename,
				tim_path.createFromString( entry )
			);

		const walk = timspec_twig.createByDependencyWalk( srts );

		for( let filename of walk.keys )
		{
			const ts = tim.catalog.getByRealpath( filename );

			const resource =
				server_resource.create(
					'filePath', ts.path.chop.filepath,
					'realpath', filename,
					'hasTim', true,
					'inBundle', true
				);

			await root.inventory.prepareResource( resource );
		}
	}

	// prepares resources for the testpad
	{
		const entry = '../testpad/root';

		require( entry );

		const srts =
			tim.catalog.getByRelativePath(
				module.filename,
				tim_path.createFromString( entry )
			);

		const walk = timspec_twig.createByDependencyWalk( srts );

		for( let filename of walk.keys )
		{
			const ts = tim.catalog.getByRealpath( filename );
			const filePath = ts.path.chop.filepath;
			let resource = root.inventory.get( server_resource.filePathAlias( filePath ) );

			if( resource )
			{
				resource = resource.create( 'inTestPad', true );
			}
			else
			{
				resource =
					server_resource.create(
						'filePath', ts.path.chop.filepath,
						'realpath', filename,
						'hasTim', true,
						'inTestPad', true
					);
			}

			await root.inventory.prepareResource( resource );
		}
	}

	// adds the tim catalog init
	root.create(
		'inventory',
			root.inventory.updateResource(
				root.inventory.get( 'tim-catalog-init.js' )
				.create( 'data', tim.catalog.getBrowserInitCode( ) )
			)
	);

	let bundleFilePath;

	if( config.get( 'shell', 'bundle', 'enable' ) )
	{
		const bundle = this.buildBundle( );
		const hash = hash_sha1.calc( bundle.code );

		// calculates the hash for the bundle
		bundleFilePath = 'plotle-' + hash + '.js';

		root.create( 'bundleFilePath', bundleFilePath );

		let bundleResource =
			server_resource.create(
				'filePath', bundleFilePath,
				'maxage', 'long',
				'data', bundle.code
			);

		let mapResource;

		if( config.get( 'shell', 'bundle', 'sourceMap' ) )
		{
			const sourceMapPath = 'source-' + hash + '.map';

			mapResource =
				server_resource.create(
					'filePath', sourceMapPath,
					'maxage', 'long',
					'data', bundle.map
				);

			bundleResource = bundleResource.create( 'sourceMap', mapResource );
		}

		// registers the bundle as resource
		let inventory = root.inventory.updateResource( bundleResource );

		if( mapResource ) inventory = inventory.updateResource( mapResource );

		root.create( 'inventory', inventory );

		log.log( 'bundle:', bundleFilePath );
	}

	// post processing
	let inv = root.inventory;

	let opentypeHash, opentypeMinHash;

	for( let a = 0, al = inv.length; a < al; a++ )
	{
		const resource = inv.atRank( a );

		const pp = resource.postProcessor;

		if( !pp || !resource.data ) continue;

		if( !server_postProcessor[ pp ] ) throw new Error( 'invalid postProcessor: ' + pp );

		const r =
			server_postProcessor[ pp ](
				resource,
				bundleFilePath,
				opentypeHash,
				opentypeMinHash
			);

		switch( pp )
		{
			case 'opentype' : opentypeHash = r; break;
			case 'opentypeMin' : opentypeMinHash = r; break;
		}
	}

	inv = root.inventory;

	if( config.get( 'shell', 'bundle', 'enable' ) )
	{
		const bundle = root.inventory.get( bundleFilePath );
		const gzip = await bundle.gzip( );

		log.log( 'uncompressed bundle size is ', bundle.data.length );
		log.log( '  compressed bundle size is ', gzip.length );
	}
};


/*
| Creates a new space.
*/
def.proto.createSpace =
	async function(
		spaceRef
	)
{
/**/if( CHECK )
/**/{
/**/	if( spaceRef.timtype !== ref_space ) throw new Error( );
/**/}

	const spaceBox = await server_spaceBox.createSpace( spaceRef );

	root.create( 'spaces', root.spaces.create( 'group:set', spaceRef.fullname, spaceBox ) );

	root.userNexus.addUserSpaceRef( spaceRef );

	await root.wake( ref_userSpaceList.create( 'username', spaceRef.username ) );

	return spaceBox;
};


/*
| A sleeping update closed prematurely.
*/
def.proto.closeSleep =
	function(
		sleepID
	)
{
	const sleep = root.upSleeps.get( sleepID );

	// maybe it just had expired at the same time
	if( !sleep ) return;

	clearTimeout( sleep.timer );

	root.create(
		'upSleeps', root.upSleeps.remove( sleepID )
	);
};


/*
| Wakes up any sleeping updates and gives them data if applicatable.
*/
def.proto.wake =
	async function(
		ref // reference to wake for
	)
{
	const upSleeps = root.upSleeps;

	// TODO cache change lists
	// to answer the same to multiple clients.
	for( let key of upSleeps.keys )
	{
		const sleep = upSleeps.get( key );

		const moments = sleep.moments;

		let b, blen;
		for( b = 0, blen = sleep.length; b < blen; b++ )
		{
			if( ref.equals( moments.get( b ).dynRef ) ) break;
		}

		// none of the moments matched
		if( b >= blen ) continue;

		// this sleep needs to be waked
		const asw = await server_requestHandler.conveyUpdate( sleep.moments );

		if( !asw ) continue;

		clearTimeout( sleep.timer );

		root.create( 'upSleeps', root.upSleeps.remove( key ) );

		const result = sleep.result;

		result.writeHead(
			200,
			{
				'content-type' : 'application/json',
				'cache-control' : 'no-cache',
				'date' : new Date().toUTCString()
			}
		);

		result.end( JSON.stringify( asw ) );
	}
};


/*
| Logs and returns a web error
*/
def.proto.webError =
	function(
		result,
		code,
		message
	)
{
	result.writeHead(
		code,
		{
			'content-type' : 'text/plain',
			'cache-control' : 'no-cache',
			'date' : new Date().toUTCString()
		}
	);

	message = code + ' ' + message;

	log.log( 'web error', code, message );

	result.end( message );
};


/*
| Listens to http requests
*/
def.proto.requestListener =
	async function(
		request,
		result
	)
{
	const red = url.parse( request.url );

	log.log( request.connection.remoteAddress, red.href );

	const pathname = red.pathname.replace( /^[/]+/g, '' );

	if( pathname === 'x' ) return root.webAjax( request, red, result );

	let resource = root.inventory.get( pathname );

	if( !resource )
	{
		root.webError( result, 404, 'Bad Request' );
		return;
	}

	const devel = config.get( 'shell', 'devel', 'enable' );

	if( resource.inBundle && !devel )
	{
		root.webError( result, 404, 'Bad Request' );
		return;
	}

	// this should not happen
	if( !resource.data ) throw new Error( 'resource misses data' );

	// if updates enabled, check if the resource cache
	// has been invalidated
	if( config.get( 'server', 'update' ) )
	{
		let stat;

		try
		{
			stat = await fsStat( resource.realpath );
		}
		catch( e ) { /* ignore */ }

		if( stat && stat.mtime > resource.timestamp )
		{
			// when this is a tim its holder is prepared instead.
			let uResource = resource.timHolder || resource;

			log.log( 'updating', uResource.aliases.get( 0 ) );

			uResource = await root.inventory.prepareResource( uResource );

			if( uResource.postProcessor )
			{
				const pp = server_postProcessor[ uResource.postProcessor ];

				if( !pp ) throw new Error( );

				pp( uResource, root.bundleFilePath );
			}

			resource = root.inventory.get( pathname );
		}
	}

	// delivers the resource
	let aenc = request.headers[ 'accept-encoding' ];

	const header =
	{
		'content-type' : resource.mime,
		'cache-control' :
			config.get( 'server', 'cache' )
			? server_maxAge.map( resource.maxage )
			: 'no-cache',
		'date' : new Date().toUTCString()
	};

	if( resource.sourceMap ) header.SourceMap = resource.sourceMap.aliases.get( 0 );

	if( aenc && aenc.indexOf( 'gzip' ) >= 0 )
	{
		// delivers compressed
		header[ 'content-encoding' ] = 'gzip';

		result.writeHead( 200, header );

		const gzip = await resource.gzip( );

		result.end( gzip, 'binary' );
	}
	else
	{
		// delivers uncompressed
		result.writeHead( 200, header );

		result.end( resource.data, resource.coding );
	}
};


/*
| Handles ajax requests.
*/
def.proto.webAjax =
	function(
		request,
		red,
		result
	)
{
	const data = [ ];

	if( request.method !== 'POST' )
	{
		root.webError( result, 400, 'Must use POST' );

		return;
	}

	request.on(
		'close', ( ) => { if( result.sleepID ) root.closeSleep( result.sleepID ); }
	);

	request.on(
		'data', ( chunk ) => { data.push( chunk ); }
	);

	const handler =
		async function( )
	{
		const query = data.join( '' );

		let cmd;

		try
		{
			cmd = JSON.parse( query );
		}
		catch( err )
		{
			root.webError( result, 400, 'Not valid JSON' );

			return;
		}

		if( DELAY_ALTER && cmd.type === 'request_alter' )
		{
			log.log( 'DELAYING ALTER');
			await wait( DELAY_ALTER );
		}

		if( DELAY_ACQUIRE && cmd.type === 'request_acquire' )
		{
			log.log( 'DELAYING ACQUIRE');
			await wait( DELAY_ACQUIRE );
		}

		const asw = await server_requestHandler.serve( cmd, result );

		if( !asw ) return;

		result.writeHead(
			200,
			{
				'content-type' : 'application/json',
				'cache-control' : 'no-cache',
				'date' : new Date().toUTCString()
			}
		);

		result.end( JSON.stringify( asw ) );
	};

	request.on( 'end',
		( ) => handler( ).catch( ( error ) => { console.error( error ); process.exit( -1 ); } )
	);
};

} );
