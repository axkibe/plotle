/*
| The root of the server.
*/


/*
| Running node normally, JION is false.
*/
global.JION = false;


/*
| The jion definition.
*/
if( JION )
{
	throw{
		id : 'server_root',
		attributes :
		{
			bundleFilePath :
			{
				comment : 'file path of the bundle',
				type : [ 'undefined', 'string' ]
			},
			inventory :
			{
				comment : 'the servers inventory of resources',
				type : 'server_inventory'
			},
			nextSleepID :
			{
				comment : 'ID for next upsleep',
				type : 'integer'
			},
			nextVisitor :
			{
				comment : 'next visitors ID',
				type : 'integer'
			},
			repository :
			{
				comment : 'the database backend',
				type : 'database_repository'
			},
			serverDir :
			{
				comment : 'server directory',
				type : 'string'
			},
			spaces :
			{
				comment : 'all spaces',
				type : 'server_spaceNexus'
			},
			userNexus :
			{
				comment : 'manages users',
				type : 'server_userNexus'
			},
			upSleeps :
			{
				comment : 'a table of all clients waiting for an update',
				type : 'server_upSleepGroup'
			}
		},
		init : [ ]
	};
}


/*
| Capsule.
*/
( function( ) {
'use strict';


// FUTURE remove
//const DELAY_ALTER = 5000;
//const DELAY_ACQUIRE = 5000;
const DELAY_ALTER = false;
const DELAY_ACQUIRE = false;

const config = require( '../../config' );

config.database_version = 15;

/*
| Globals.
*/

/*
| Server checking.
*/
global.CHECK = config.server_check;

/*
| Server object freezing.
*/
global.FREEZE = config.server_freeze;

/*
| This is not a jion creation call.
*/
global.JION = false;

/*
| This is node.
*/
global.NODE = true;

/*
| Sets root as global variable.
*/
global.root = undefined;


/*
| Root directory of server.
*/
let serverDir;

GLOBAL.tim = require( 'tim.js' );

// FIXME?
require( 'jion' );

const fs = require( 'fs' );

const http = require( 'http' );

const isString = tim.isString;

const log_ajax = require( '../log/ajax' );

const log_start = require( '../log/start' );

const log_web = require( '../log/web' );

const server_maxAge = require( './maxAge' );

const server_postProcessor = require( './postProcessor' );

const database_repository = require( '../database/repository' );

const ref_userSpaceList = require( '../ref/userSpaceList' );

const server_requestHandler = require( './requestHandler' );

const server_roster = require( './roster' );

const server_inventory = require( './inventory' );

const server_resource = require( './resource' );

const server_spaceBox = require( './spaceBox' );

const server_spaceNexus = require( './spaceNexus' );

const server_userNexus = require( './userNexus' );

const server_tools = require( './tools' );

const server_upSleepGroup = require( './upSleepGroup' );

const hash_sha1 = require( '../hash/sha1' );

const suspend = require( 'suspend' );

const resume = suspend.resume;

const uglify = require( 'uglify-js' );

const url = require( 'url' );

const util = require( 'util' );

const ref_space = require( '../ref/space' );

const zlib = require( 'zlib' );

const server_root = require( 'jion' ).this( module );

const prototype = server_root.prototype;

/*
| Calculates the server root directory.
*/
( function( )
{
	var
		a;

	serverDir = module.filename;

	for( a = 0; a < 3; a++ )
	{
		serverDir = serverDir.substr( 0, serverDir.lastIndexOf( '/' ) );
	}

	serverDir += '/';
}
)( );


/*
| Initializer.
*/
prototype._init =
	function( )
{
	root = this;
};


/*
| Sets up the server.
|*/
const startup = function*( )
{

	server_root.create(
		'inventory', server_inventory.create( ),
		'nextSleepID', 1,
		'repository', yield* database_repository.connect( config ),
		'spaces', server_spaceNexus.create( ),
		'upSleeps', server_upSleepGroup.create( ),
		'nextVisitor', 1000,
		'userNexus', server_userNexus.create( ),
		'serverDir', serverDir
	);

	yield* root.prepareInventory( );

	yield* root.loadSpaces( );

	log_start(
		'starting server @ http://' +
			( config.ip || '*' ) + '/:' + config.port
	);

	yield http.createServer(
		function(
			request,
			result
		)
	{
		suspend( root.requestListener ).call( root, request, result );
	}
	).listen( config.port, config.ip, resume( ) );

	log_start( 'server running' );
};


/*
| loads all spaces and playbacks all changes from the database.
*/
prototype.loadSpaces =
	function*( )
{
	var
		cursor,
		o,
		spaceRef;

	log_start( 'loading and replaying all spaces' );

	cursor =
		yield root.repository.spaces.find(
			{ },
			{ sort: '_id' },
			resume( )
		);

	for(
		o = yield cursor.nextObject( resume( ) );
		o;
		o = yield cursor.nextObject( resume( ) )
	)
	{
		spaceRef =
			ref_space.create(
				'username', o.username,
				'tag', o.tag
			);

		log_start( 'loading and replaying "' + spaceRef.fullname + '"' );

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
| Create the shell's config.js resource.
*/
prototype.createShellConfig =
	function( )
{
	var
		cconfig,
		first,
		k,
		val;

	cconfig = [ ];

	cconfig.push(
		'var config = {\n',
		'\tdevel   : ', config.devel, ',\n',
		'\tdebug   : {\n'
	);

	first = true;

	for( k in config.debug )
	{
		val = config.debug[ k ];

		if( !first ) cconfig.push( ',\n' );
		else first = false;

		cconfig.push(
			'\t\t',
			k,
			' : ',
			isString( val ) ? "'" : '',
			val,
			isString( val ) ? "'" : ''
		);
	}

	cconfig.push(
		'\n\t},\n',
		'\tlog : {\n'
	);

	first = true;

	for( k in config.log )
	{
		if( !first ) cconfig.push( ',\n' );
		else first = false;

		cconfig.push( '\t\t', k, ' : ', config.log[ k ] );
	}

	cconfig.push(
		'\n\t}\n',
		'};\n'
	);

	return(
		server_resource.create(
			'data', cconfig.join( '' ),
			'filePath', 'config.js',
			'inBundle', true,
			'inTestPad', true
		)
	);
};


/*
| Registers and prepares the inventory.
| Also builds the bundle.
*/
prototype.prepareInventory =
	function*( )
{
	var
		a,
		ast,
		aZ,
		bundle,
		bundleFilePath,
		cconfig,
		code,
		codes,
		compressor,
		inv,
		jionIDs,
		resource,
		sourceMap,
		stream;

	log_start( 'preparing inventory' );

	// autogenerates the shell config as resource
	cconfig = root.createShellConfig( );

	root.create( 'inventory', root.inventory.updateResource( cconfig ) );

	// takes resource from the the roster
	for( a = 0, aZ = server_roster.length; a < aZ; a++ )
	{
		resource = server_roster.get( a );

		if( resource.devel && !config.shell_devel ) continue;

		yield* root.inventory.prepareResource( resource );
	}

	// the bundle itself
	bundle = [ ];

	// if uglify is turned off
	// the flags are added before bundle
	// creation, otherwise afterwards
	if( !config.uglify ) root.prependConfigFlags( );

	log_start( 'building bundle' );

	jionIDs = { };

	codes = [ ];

	// loads the files to be bundled
	for( a = 0, aZ = root.inventory.length; a < aZ; a++ )
	{
		resource = root.inventory.atRank( a );

		if( !resource.inBundle ) continue;

		if( resource.jionHolder )
		{
			jionIDs[ resource.jionId ] = resource.hasJson;

			code = resource.data;
		}
		else
		{
			if( !resource.data )
			{
				code = yield fs.readFile( resource.filePath, resume( ) );
			}
			else
			{
				code = resource.data;
			}
		}

		code += '';

		codes[ a ] = code;
	}

	if( config.shell_bundle )
	{
		log_start( 'parsing bundle' );

		for( a = 0, aZ = root.inventory.length; a < aZ; a++ )
		{
			resource = root.inventory.atRank( a );

			if( !resource.inBundle ) continue;

			try{
				ast =
					uglify.parse(
						codes[ a ],
						{
							filename :
								resource.filePath
								|| resource.aliases.get( 0 ),
							toplevel : ast
						}
					);
			}
			catch ( e )
			{
				console.log(
					'parse error',
					resource.filePath,
					'line',
					e.line
				);

				throw e;
			}
		}

		if( config.extraMangle ) root.extraMangle( ast, jionIDs );

		if( config.uglify )
		{
			log_start( 'uglifying bundle' );

			ast.figure_out_scope( );

			compressor =
				uglify.Compressor(
					{
						dead_code : true,
						hoist_vars : true,
						warnings : false,
						negate_iife : true,
						global_defs :
						{
							'CHECK' : config.shell_check,
							'FREEZE' : config.shell_freeze,
							'JION' : false,
							'NODE' : false
						}
					}
				);

			ast = ast.transform( compressor );

			ast.figure_out_scope( );

			ast.compute_char_frequency( );

			ast.mangle_names(
				{
					toplevel : true,
					except : [ 'WebFont', 'opentype' ]
				}
			);
		}

		sourceMap = uglify.SourceMap( { } );

		stream =
			uglify.OutputStream(
				{
					beautify : config.beautify,
					source_map: sourceMap
				}
			);

		ast.print( stream );

		bundle = stream.toString( );

		if( !config.noWrite )
		{
			yield fs.writeFile(
				'report/source.map',
				sourceMap.toString( ),
				resume( )
			);
		}

		// calculates the hash for the bundle
		bundleFilePath = 'ideoloom-' + hash_sha1( bundle ) + '.js';

		root.create( 'bundleFilePath', bundleFilePath );

		// registers the bundle as resource
		root.create(
			'inventory',
				root.inventory.updateResource(
					server_resource.create(
						'filePath', bundleFilePath,
						'maxage', 'long',
						'data', bundle
					)
				)
		);

		log_start( 'bundle:', bundleFilePath );

		// if uglify is turned on
		// the flags are added after bundle
		// creation, otherwise before
		if( config.uglify ) root.prependConfigFlags( );
	}

	// post processing
	inv = root.inventory;

	for( a = 0, aZ = inv.length; a < aZ; a++ )
	{
		resource = inv.atRank( a );

		if( !resource.postProcessor || !resource.data ) continue;

		if( !server_postProcessor[ resource.postProcessor ] )
		{
			throw new Error(
				'invalid postProcessor: ' + resource.postProcessor
			);
		}

		server_postProcessor[ resource.postProcessor ](
			resource,
			bundleFilePath
		);
	}

	inv = root.inventory;

	// prepares the zipped versions
	for( a = 0, aZ = inv.length; a < aZ; a++ )
	{
		resource = inv.atRank( a );

		//if( resource.inBundle || resource.devel )
		//{
		//	continue;
		//}

		root.create(
			'inventory',
				root.inventory.updateResource(
					resource.create(
						'gzip',
							yield zlib.gzip( resource.data, resume( ) )
					)
				)
		);
	}

	if( config.shell_bundle )
	{
		log_start(
			'uncompressed bundle size is ',
			root.inventory.get( bundleFilePath ).data.length
		);

		log_start(
			'  compressed bundle size is ',
			root.inventory.get( bundleFilePath ).gzip.length
		);
	}
};


/*
| Prepends the flags to cconfig
|
| Used by development.
*/
prototype.prependConfigFlags =
	function( )
{
	var
		resource;

	resource = root.inventory.get( 'config.js' );

	root.create(
		'inventory',
			root.inventory.updateResource(
				resource.create(
					'data',
						'var JION = false;\n'
						+ 'var CHECK = ' + config.shell_check + ';\n'
						+ 'var FREEZE = ' + config.shell_freeze + ';\n'
						+ 'var NODE = false;\n'
						+ resource.data
				)
			)
	);
};



/*
| Makes additional mangles
*/
prototype.extraMangle =
	function(
		ast,
		jionIDs
	)
{
	var
		a,
		// ast properties mangled
		astProps,
		aZ,
		at,
		e,
		jionID,
		// associative of all mangles
		mangle,
		// mangle definitions:
		// a file that looks like this
		// ". value"  <-- this will be mangled
		// "> value"  <-- this will not be mangled
		mangleDefs,
		// an array of all mangles
		mangleList,
		// unknown properties / keys
		// that are missed in both lists
		missed,
		// associative of all no-mangles
		noMangle,
		// associative of all mangles not used
		useMangle,
		// associative of all no-mangles not used
		useNoMangle;

	missed = { };

	mangleDefs =
		(
			fs.readFileSync(
				'./mangle.txt'
			) + ''
		).split( '\n' );

	mangle = { };

	noMangle = { };

	useMangle = { };

	useNoMangle = { };

	astProps =
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
	for( a = 0, aZ = mangleDefs.length; a < aZ; a++ )
	{
		at = mangleDefs[ a ];

		e = at.substring( 2 );

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

	// also mangles the jionIDs
	for( jionID in jionIDs )
	{
		if(
			// only mangle those not used in json
			jionIDs[ jionID ] === false
			&& !noMangle[ jionID ]
		)
		{
			mangle[ jionID ] = true;
		}
	}

	mangleList = Object.keys( mangle ).sort( );

	// allots all mangles a value
	for( a = 0, aZ = mangleList.length; a < aZ; a++ )
	{
		at = mangleList[ a ];

		mangle[ at ] = '$' + server_tools.b64Encode( a );
	}

	if( !config.noWrite )
	{
		fs.writeFileSync( 'report/manglemap.txt', util.inspect( mangle ) );
	}

	// marks all mangles and no-mangles as unused so far
	for( a in mangle )
	{
		useMangle[ a ] = true;
	}

	for( a in noMangle )
	{
		useNoMangle[ a ] = true;
	}

	// walks the syntax tree
	ast.walk( new uglify.TreeWalker(
		function( node )
	{
		var k, p;

		for( k in astProps )
		{
			p = node[ k ];

			if( p !== undefined ) break;
		}

		if( !k ) return false;

		if( !isString( node[ k ] ) ) return false;

		// checks if this property will not be mangled
		if( noMangle[ p ] !== undefined )
		{
			delete useNoMangle[ p ];

			return false;
		}

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
		console.log(
			'extraMangle missed '
			+ missed.length
			+ ' properties: ',
			missed
		);
	}

	if( useMangle.length > 0 )
	{
		console.log(
			'extraMangle not used mangles: ',
			useMangle
		);
	}

	if( useNoMangle.length > 0 )
	{
		console.log(
			'extraMangle not used no-mangles: ',
			useNoMangle
		);
	}
};


/*
| Creates a new space.
*/
prototype.createSpace =
	function*(
		spaceRef
	)
{
	var
		spaceBox;

/**/if( CHECK )
/**/{
/**/	if( spaceRef.reflect !== 'ref_space' ) throw new Error( );
/**/}

	spaceBox = yield* server_spaceBox.createSpace( spaceRef );

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
prototype.closeSleep =
	function(
		sleepID
	)
{
	var sleep;

	sleep = root.upSleeps.get( sleepID );

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
prototype.wake =
	function(
		ref // reference to wake for
	)
{
	var
		a,
		asw,
		aZ,
		b,
		bZ,
		modified,
		moments,
		result,
		key,
		sleep,
		sleepKeys,
		upSleeps;

	upSleeps = root.upSleeps;

	sleepKeys = upSleeps.keys;

	modified = false;

	// FUTURE cache change lists
	// to answer the same to multiple clients.
	for( a = 0, aZ = sleepKeys.length; a < aZ; a++ )
	{
		key = sleepKeys[ a ];

		sleep = upSleeps.get( key );

		moments = sleep.moments;

		for( b = 0, bZ = sleep.length; b < bZ; b++ )
		{
			if( ref.equals( moments.get( b ).dynRef ) ) break;
		}

		// none of the moments matched
		if( b >= bZ ) continue;

		// this sleep needs to be waked

		clearTimeout( sleep.timer );

		root.create(
			'upSleeps', root.upSleeps.remove( key )
		);

		asw = server_requestHandler.conveyUpdate( sleep.moments );

		result = sleep.result;

		log_ajax( '->', asw );

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
prototype.webError =
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

	log_web( 'error', code, message );

	result.end( message );
};


/*
| Listens to http requests
*/
prototype.requestListener =
	function*(
		request,
		result
	)
{
	var
		aenc,
		data,
		header,
		pathname,
		resource,
		red,
		stat;

	red = url.parse( request.url );

	log_web( request.connection.remoteAddress, red.href );

	if( config.whiteList )
	{
		if( !config.whiteList[ request.connection.remoteAddress ] )
		{
			log_web(
				request.connection.remoteAddress,
				'not in whitelist!'
			);

			root.webError( result, 403, 'Forbidden' );

			return;
		}
	}

	pathname = red.pathname.replace( /^[\/]+/g, '' );

	if( pathname === 'mm' )
	{
		return root.webAjax( request, red, result );
	}

	resource = root.inventory.get( pathname );

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
	if( config.devel )
	{
		try
		{
			stat = yield fs.stat( resource.realpath, resume( ) );
		}
		catch( e )
		{
			stat = undefined;
		}

		if( stat && stat.mtime > resource.timestamp )
		{
			// when this is a jion its holder is prepared instead.
			yield* root.inventory.prepareResource(
				resource.jionHolder || resource
			);

			resource = root.inventory.get( pathname );
		}

		if( resource.postProcessor )
		{
			if( !server_postProcessor[ resource.postProcessor ] )
			{
				throw new Error( 'invalid postProcessor' );
			}

			data =
				server_postProcessor[ resource.postProcessor ](
					resource,
					root.bundleFilePath
				);
		}
	}

	// delivers the resource

	if( !config.devel && resource.gzip )
	{
		aenc = request.headers[ 'accept-encoding' ];
	}

	header =
	{
		'Content-Type' : resource.mime,
		'Cache-Control' :
			!config.devel
			? server_maxAge.map( resource.maxage )
			: 'no-cache',
		'Date' : new Date().toUTCString()
	};

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

		data = resource.data;

		// weinre can't cope with strict mode
		// so its disabled when weinre is enabled
		if( config.debug.weinre )
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
prototype.webAjax =
	function(
		request,
		red,
		result
	)
{
	var
		handler,
		data;

	data = [ ];

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

	handler =
		function*( )
	{
		var
			asw,
			cmd,
			query;

		query = data.join( '' );

		try
		{
			cmd = JSON.parse( query );

			log_ajax( '<-', cmd );
		}
		catch( err )
		{
			root.webError( result, 400, 'Not valid JSON' );

			return;
		}

		// FUTURE REMOVE
		if( DELAY_ALTER && cmd.type === 'request_alter' )
		{
			console.log( 'DELAYING ALTER');

			yield setTimeout( resume( ), DELAY_ALTER );
		}

		if( DELAY_ACQUIRE && cmd.type === 'request_acquire' )
		{
			console.log( 'DELAYING ACQUIRE');

			yield setTimeout( resume( ), DELAY_ACQUIRE );
		}

		asw = yield* server_requestHandler.serve( cmd, result );

		if( !asw ) return;

		log_ajax( '->', asw );

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


suspend(
	function*( )
{
	yield* startup( );
}
)( );


} )( );
