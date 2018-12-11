/*
| The root of the server.
*/
'use strict';


tim.define( module, ( def ) => {


/*::::::::::::::::::::::::::::.
:: Typed immutable attributes
':::::::::::::::::::::::::::::*/


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

		// server directory
		serverDir : { type : 'string' },

		// all spaces
		spaces : { type : './spaceNexus' },

		// manages users
		userNexus : { type : './userNexus' },

		// a table of all clients waiting for an update
		upSleeps : { type : './upSleepGroup' }
	};

	def.global = 'root';
}


// FUTURE remove
//const DELAY_ALTER = 5000;
//const DELAY_ACQUIRE = 5000;
const DELAY_ALTER = false;
const DELAY_ACQUIRE = false;

const config = require( '../../config' );

const fs = require( 'fs' );

const log = require( './log' );

const server_maxAge = require( './maxAge' );

const server_postProcessor = require( './postProcessor' );

const ref_userSpaceList = require( '../ref/userSpaceList' );

const server_requestHandler = require( './requestHandler' );

const server_roster = require( './roster' );

const server_resource = require( './resource' );

const server_spaceBox = require( './spaceBox' );

const server_tools = require( './tools' );

const hash_sha1 = require( '../hash/sha1' );

const suspend = require( 'suspend' );

const resume = suspend.resume;

const uglify = require( 'uglify-es' );

const url = require( 'url' );

const util = require( 'util' );

const ref_space = require( '../ref/space' );

const zlib = require( 'zlib' );


/*
| loads all spaces and playbacks all changes from the database.
*/
def.func.loadSpaces =
	function*( )
{
	log( 'loading and replaying all spaces' );

	const cursor =
		yield root.repository.spaces.find(
			{ },
			{ sort: '_id' },
			resume( )
		);

	for(
		let o = yield cursor.nextObject( resume( ) );
		o;
		o = yield cursor.nextObject( resume( ) )
	)
	{
		const spaceRef =
			ref_space.create(
				'username', o.username,
				'tag', o.tag
			);

		log( 'loading and replaying "' + spaceRef.fullname + '"' );

		root.create(
			'spaces',
				root.spaces.create(
					'group:set',
					spaceRef.fullname,
					yield* server_spaceBox.loadSpace( spaceRef )
				)
		);
	}
};


/*
| The shell's globals.
*/
def.lazy.shellGlobals =
	function( )
{
	const g =
		{
			CHECK: config.shell_check,
			FREEZE : config.shell_freeze,
			NODE : false,
			TIM : false,
			DEVEL : config.shell_devel,
			WEINRE : config.weinre
		};

	if( FREEZE ) Object.freeze( g );

	return g;
};


/*
| The shell's globals as ressource.
*/
def.lazy.shellGlobalsRessource =
	function( )
{
	let text = '';

	const globals = this.shellGlobals;

	const keys = Object.keys( globals ).sort( );

	for( let a = 0, al = keys.length; a < al; a++ )
	{
		const key = keys[ a ];

		text += 'var ' + key + ' = ' + globals[ key ] + ';\n';
	}

	return(
		server_resource.create(
			'data', text,
			'filePath', 'global.js',
			'inBundle', true,
			'inTestPad', true
		)
	);
};


/*
| Builds the bundle.
*/
def.func.buildBundle =
	function( )
{
	log( 'building bundle' );

	const timIDs = { };

	if( config.uglify )
	{
		log( 'uglifying bundle' );

		const code = { };

		for( let a = 0, al = root.inventory.length; a < al; a++ )
		{
			const resource = root.inventory.atRank( a );

			if( !resource.inBundle ) continue;

			if( resource.filePath === 'global.js' ) continue;

			code[ resource.aliases.get( 0 ) ] = resource.data + '';
		}

		log( '  1st pass' );

		let options =
		{
			compress :
			{
				global_defs : this.shellGlobals,
				evaluate : false,
			},
			mangle: false,
			output :
			{
				ast : true,
				code : false,
			},
		};

		let result = uglify.minify( code, options );

		if( result.error ) throw new Error( 'uglify error: ' + result.error );

		let ast = result.ast;

		// ast is not immutable and changed!
		if( config.extraMangle ) root.extraMangle( ast, timIDs );

		log( '  2nd pass' );

		options =
		{
			compress :
			{
				ecma : 6,
				global_defs : this.shellGlobals,
			},
			output :
			{
				beautify : config.beautify,
			},
			sourceMap :
			{
				filename : 'source.map',
			}
		};

		result = uglify.minify( ast, options );

		if( config.report )
		{
			fs.writeFileSync( 'report/source.map', result.map );
		}

		if( result.error ) throw new Error( 'uglify error: ' + result.error );

		return result;
	}
	else
	{
		log( 'concating bundle' );

		let code = '';

		for( let a = 0, al = root.inventory.length; a < al; a++ )
		{
			const resource = root.inventory.atRank( a );

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
def.func.prepareInventory =
	function*( )
{
	log( 'preparing inventory' );

	root.create(
		'inventory', root.inventory.updateResource( root.shellGlobalsRessource )
	);

	// takes resource from the the roster
	for( let a = 0, al = server_roster.length; a < al; a++ )
	{
		const resource = server_roster.get( a );

		if( resource.devel && !config.shell_devel ) continue;

		yield* root.inventory.prepareResource( resource );
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

	if( config.shell_bundle )
	{
		const bundle = this.buildBundle( );

		const hash = hash_sha1.calc( bundle.code );

		// calculates the hash for the bundle
		bundleFilePath = 'linkloom-' + hash + '.js';

		root.create( 'bundleFilePath', bundleFilePath );

		let bundleResource =
			server_resource.create(
				'filePath', bundleFilePath,
				'maxage', 'long',
				'data', bundle.code
			);

		let mapResource;

		if( bundle.map )
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

		log( 'bundle:', bundleFilePath );
	}

	// post processing
	let inv = root.inventory;

	for( let a = 0, al = inv.length; a < al; a++ )
	{
		const resource = inv.atRank( a );

		if( !resource.postProcessor || !resource.data ) continue;

		if( !server_postProcessor[ resource.postProcessor ] )
		{
			throw new Error( 'invalid postProcessor: ' + resource.postProcessor );
		}

		server_postProcessor[ resource.postProcessor ]( resource, bundleFilePath );
	}

	// FIXME is this necessary to reassign?
	inv = root.inventory;

	// prepares the zipped versions
	for( let a = 0, al = inv.length; a < al; a++ )
	{
		const resource = inv.atRank( a );

		//if( resource.inBundle || resource.devel )
		//{
		//	continue;
		//}

		root.create(
			'inventory',
				root.inventory.updateResource(
					resource.create( 'gzip', yield zlib.gzip( resource.data, resume( ) ) )
				)
		);
	}

	if( config.shell_bundle )
	{
		log(
			'uncompressed bundle size is ',
			root.inventory.get( bundleFilePath ).data.length
		);

		log(
			'  compressed bundle size is ',
			root.inventory.get( bundleFilePath ).gzip.length
		);
	}
};


/*
| Makes additional mangles
*/
def.func.extraMangle =
	function(
		ast,
		timIDs   // FIXME remove
	)
{
	log( '  extra mangling the bundle' );

	// unknown properties / keys
	// that are missed in both lists
	let missed = { };

	// mangle definitions:
	// a file that looks like this
	// ". value"  <-- this will be mangled
	// "> value"  <-- this will not be mangled
	const mangleDefs = ( fs.readFileSync( './mangle.txt') + '' ).split( '\n' );

	// associative of all mangles
	const mangle = { };

	// associative of all no-mangles
	const noMangle = { };

	// no mangles for the tim catalog
	const timNoMangle = tim.catalog.getBrowserNoMangle( );

	// associative of all mangles not used
	let useMangle = { };

	// associative of all no-mangles not used
	let useNoMangle = { };

	// ast properties mangled
	const astProps =
		{
			'property' : 'p',
			'key' : 'p',
			// string values are mangled
			// but do not flag properties missed
			'value' : 's'
		};

	// cuts away empty lines
	while( mangleDefs.indexOf( '' ) >= 0 )
	{
		mangleDefs.splice( mangleDefs.indexOf( '' ), 1 );
	}

	// creates associativs and lists
	for( let a = 0, aZ = mangleDefs.length; a < aZ; a++ )
	{
		const at = mangleDefs[ a ];

		const e = at.substring( 2 );

		if(
			e.length === 0 ||
			e.indexOf( ' ' ) >= 0 ||
			at[ 1 ] !== ' ' ||
			( at[ 0 ] !== '.' && at[ 0 ] !== '>' )
		)
		{
			throw new Error( 'malformed mangle entry "' + at + '"' );
		}

		if( mangle[ e ] || noMangle[ e ] )
		{
			throw new Error( 'double entry: "' + e + '"' );
		}

		switch( at[ 0 ] )
		{
			case '.' : mangle[ e ] = true; break;

			case '>' : noMangle[ e ] = true; break;
		}

	}

	// also mangles the timIDs
	for( let id in timIDs )
	{
		if(
			// only mangle those not used in json
			timIDs[ id ] === false
			&& !noMangle[ id ]
		)
		{
			mangle[ id ] = true;
		}
	}

	// an array of all mangles
	const mangleList = Object.keys( mangle ).sort( );

	// allots all mangles a value
	for( let a = 0, al = mangleList.length; a < al; a++ )
	{
		const at = mangleList[ a ];

		mangle[ at ] = '$' + server_tools.b64Encode( a );
	}

	if( config.report )
	{
		fs.writeFileSync( 'report/manglemap.txt', util.inspect( mangle ) );
	}

	// marks all mangles and no-mangles as unused so far
	for( let a in mangle )
	{
		useMangle[ a ] = true;
	}

	for( let a in noMangle )
	{
		useNoMangle[ a ] = true;
	}

	// walks the syntax tree
	ast.walk( new uglify.TreeWalker(
		function( node )
	{
		let k, p;

		for( k in astProps )
		{
			p = node[ k ];

			if( p !== undefined ) break;
		}

		if( !k ) return false;

		if( typeof( node[ k ] ) !== 'string' ) return false;

		// checks if this property will not be mangled
		if( noMangle[ p ] !== undefined )
		{
			delete useNoMangle[ p ];

			return false;
		}

		// checks
		if( timNoMangle[ p ] !== undefined ) return false;

		// checks if this property will be mangled
		if( mangle[ p ] !== undefined )
		{
			delete useMangle[ p ];

			node[ k ] = mangle[ p ];

			return false;
		}

		// if this is a property it is marked as missed
		if( astProps[ k ] === 'p' )
		{
			missed[ p ] = true;
		}

		return false;
	}
	));

	// turns check lists into arrays and sorts them
	missed = Object.keys( missed ).sort( );

	useMangle = Object.keys( useMangle ).sort( );

	useNoMangle = Object.keys( useNoMangle ).sort( );

	if( missed.length > 0 )
	{
		log( 'extraMangle missed ' + missed.length + ' properties: ', missed );
	}

	if( useMangle.length > 0 )
	{
		log( 'extraMangle not used mangles: ', useMangle );
	}

	if( useNoMangle.length > 0 )
	{
		log( 'extraMangle not used no-mangles: ', useNoMangle );
	}
};


/*
| Creates a new space.
*/
def.func.createSpace =
	function*(
		spaceRef
	)
{

/**/if( CHECK )
/**/{
/**/	if( spaceRef.timtype !== ref_space ) throw new Error( );
/**/}

	const spaceBox = yield* server_spaceBox.createSpace( spaceRef );

	root.create(
		'spaces', root.spaces.create( 'group:set', spaceRef.fullname, spaceBox )
	);

	root.userNexus.addUserSpaceRef( spaceRef );

	root.wake( ref_userSpaceList.create( 'username', spaceRef.username ) );

	return spaceBox;
};


/*
| A sleeping update closed prematurely.
*/
def.func.closeSleep =
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
def.func.wake =
	function(
		ref // reference to wake for
	)
{
	const upSleeps = root.upSleeps;

	const sleepKeys = upSleeps.keys;

	// FUTURE cache change lists
	// to answer the same to multiple clients.
	for( let a = 0, al = sleepKeys.length; a < al; a++ )
	{
		const key = sleepKeys[ a ];

		const sleep = upSleeps.get( key );

		const moments = sleep.moments;

		let b, bZ;
		for( b = 0, bZ = sleep.length; b < bZ; b++ )
		{
			if( ref.equals( moments.get( b ).dynRef ) ) break;
		}

		// none of the moments matched
		if( b >= bZ ) continue;

		// this sleep needs to be waked
		const asw = server_requestHandler.conveyUpdate( sleep.moments );

		if( !asw ) continue;

		clearTimeout( sleep.timer );

		root.create(
			'upSleeps', root.upSleeps.remove( key )
		);

		const result = sleep.result;

		result.writeHead(
			200,
			{
				'Content-Type' : 'application/json',
				'Cache-Control' : 'no-cache',
				'Date' : new Date().toUTCString()
			}
		);

		result.end( JSON.stringify( asw ) );
	}
};


/*
| Logs and returns a web error
*/
def.func.webError =
	function(
		result,
		code,
		message
	)
{
	result.writeHead(
		code,
		{
			'Content-Type' : 'text/plain',
			'Cache-Control' : 'no-cache',
			'Date' : new Date().toUTCString()
		}
	);

	message = code + ' ' + message;

	log( 'web error', code, message );

	result.end( message );
};


/*
| Listens to http requests
*/
def.func.requestListener =
	function*(
		request,
		result
	)
{
	const red = url.parse( request.url );

	log( request.connection.remoteAddress, red.href );

	if( config.whiteList )
	{
		if( !config.whiteList[ request.connection.remoteAddress ] )
		{
			log( request.connection.remoteAddress, 'not in whitelist!' );

			root.webError( result, 403, 'Forbidden' );

			return;
		}
	}

	const pathname = red.pathname.replace( /^[\/]+/g, '' );

	if( pathname === 'mm' ) return root.webAjax( request, red, result );

	let resource = root.inventory.get( pathname );

	if( !resource )
	{
		root.webError( result, 404, 'Bad Request' );

		return;
	}

	if( resource.inBundle && !config.shell_devel )
	{
		root.webError( result, 404, 'Bad Request' );

		return;
	}

	// this should not happen
	if( !resource.data ) throw new Error( 'resource misses data' );

	// if in devel mode, check if the resource cache
	// has been invalidated
	if( config.server_devel )
	{
		let stat;

		try
		{
			stat = yield fs.stat( resource.realpath, resume( ) );
		}
		catch( e ) { }

		if( stat && stat.mtime > resource.timestamp )
		{
			// when this is a tim its holder is prepared instead.
			resource =
				yield* root.inventory.prepareResource(
					resource.timHolder || resource
				);
		}

		if( resource.postProcessor )
		{
			const pp = server_postProcessor[ resource.postProcessor ];

			if( !pp ) throw new Error( );

			pp( resource, root.bundleFilePath );
		}
	}

	// delivers the resource
	let aenc;

	// FIXME how about always?
	if( !config.server_devel && resource.gzip )
	{
		aenc = request.headers[ 'accept-encoding' ];
	}

	const header =
	{
		'Content-Type' : resource.mime,
		'Cache-Control' :
			!config.http_cache
			? server_maxAge.map( resource.maxage )
			: 'no-cache',
		'Date' : new Date().toUTCString()
	};

	if( resource.sourceMap )
	{
		header.SourceMap = resource.sourceMap.aliases.get( 0 );
	}

	if( aenc && aenc.indexOf( 'gzip' ) >= 0 )
	{
		// delivers compressed
		header[ 'Content-Encoding' ] = 'gzip';

		result.writeHead( 200, header );

		result.end( resource.gzip, 'binary' );
	}
	else
	{
		// delivers uncompressed
		result.writeHead( 200, header );

		let data = resource.data;

		// weinre can't cope with strict mode
		// so its disabled when weinre is enabled
		if( config.weinre )
		{
			data =
				( '' + data )
				.replace( /'use strict'/, "'not strict'" )
				.replace( /"use strict"/, '"not strict"' );
		}

		result.end( data, resource.coding );
	}
};


/*
| Handles ajax requests.
*/
def.func.webAjax =
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
		'close',
		function( )
	{
		if( result.sleepID )
		{
			root.closeSleep( result.sleepID );
		}
	}
	);

	request.on(
		'data',
		function( chunk )
	{
		data.push( chunk );
	}
	);

	const handler =
		function*( )
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

		// FUTURE REMOVE
		if( DELAY_ALTER && cmd.type === 'request_alter' )
		{
			log( 'DELAYING ALTER');

			yield setTimeout( resume( ), DELAY_ALTER );
		}

		if( DELAY_ACQUIRE && cmd.type === 'request_acquire' )
		{
			log( 'DELAYING ACQUIRE');

			yield setTimeout( resume( ), DELAY_ACQUIRE );
		}

		const asw = yield* server_requestHandler.serve( cmd, result );

		if( !asw ) return;

		result.writeHead(
			200,
			{
				'Content-Type' : 'application/json',
				'Cache-Control' : 'no-cache',
				'Date' : new Date().toUTCString()
			}
		);

		result.end( JSON.stringify( asw ) );
	};

	request.on(
		'end',
		function( )
	{
		suspend( handler )( );
	}
	);
};

} );
