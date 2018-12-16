/*
| Starts the server
*/
'use strict';


//Error.stackTraceLimit = 15;
//Error.stackTraceLimit = Infinity;

/*
| Sets root as global variable.
| Works around to hide node.js unnessary warning.
*/
Object.defineProperty(
	global, 'root',
	{ configureable: true, writable: true, enumerable: true, value: undefined }
);

/*
| Running node normaly, TIM is false.
*/
global.TIM = false;

/*
| This is node.
*/
global.NODE = true;

/*
| Server checking.
*/
global.CHECK = true;


// registers with tim.js
{
	require( 'tim.js' );

	const ending = '/server/start.js';

	const filename = module.filename;

	// if this filename is not bootstrap.js something is seriously amiss.
	if( !filename.endsWith( ending ) ) throw new Error( );

	const rootPath = filename.substr( 0, filename.length - ending.length );

	// timcode path is one level up
	const timcodePath = rootPath.substr( 0, rootPath.lastIndexOf( '/' ) ) + '/timcode';

	tim.catalog.addRootDir( rootPath, 'linkloom', timcodePath );
}


const config = require( '../config/intf' );

require( '../../config' )( config.set );


/*
| Server checking.
*/
global.CHECK = config.get( 'server', 'check' );

/*
| Server object freezing.
*/
global.FREEZE = config.get( 'server', 'freeze' );

const log = require( './log' );

const database_repository = require( '../database/repository' );

const fs = require( 'fs' );

const http = require( 'http' );

const https = require( 'https' );

const constants = require( 'constants' );

const server_root = require( './root' );

const server_inventory = require( './inventory' );

const server_spaceNexus = require( './spaceNexus' );

const server_upSleepGroup = require( './upSleepGroup' );

const server_userNexus = require( './userNexus' );

const suspend = require( 'suspend' );

const resume = suspend.resume;


/*
| Calculates the server root directory.
*/
let serverDir;

( function( )
{
	serverDir = module.filename;

	for( let a = 0; a < 3; a++ )
	{
		serverDir = serverDir.substr( 0, serverDir.lastIndexOf( '/' ) );
	}

	serverDir += '/';
}
)( );


/*
| Starts the main server.
*/
const startMainServer =
	function*( )
{
	const protocol = config.get( 'network', 'main', 'protocol' );

	const port = config.get( 'network', 'main', 'port' );

	const listen = config.get( 'network', 'listen' );

	const handler =
		( request, result ) =>
	{
		suspend( root.requestListener ).call( root, request, result );
	};

	switch( protocol )
	{
		case 'https' :

			log( 'starting server @ https://' + ( listen || '*' ) + '/:' + port );

			const cert = fs.readFileSync( config.get( 'https', 'cert' ) ) + '';

			const key = fs.readFileSync( config.get( 'https', 'key' ) ) + '';

			const options =
			{
				secureOptions: constants.SSL_OP_NO_SSLv3 | constants.SSL_OP_NO_SSLv2,
				cert: cert,
				key: key
			};

			yield https
			.createServer( options, handler )
			.listen( port, listen, resume( ) );

			return;

		case 'http' :

			log( 'starting server @ http://' + ( listen || '*' ) + '/:' + port );

			yield http
			.createServer( handler )
			.listen( port, listen, resume( ) );

			return;

		default :

			throw new Error( );
	}
};


/*
| Starts the redirect server.
*/
const startRedirectServer =
	function*( )
{
	const protocol = config.get( 'network', 'redirect', 'protocol' );

	if( protocol === '' ) return;

	if( protocol !== 'http' ) throw new Error( );

	const port = config.get( 'network', 'redirect', 'port' );

	const destination = config.get( 'network', 'redirect', 'destination' );

	const listen = config.get( 'network', 'listen' );

	log( 'starting redirect @ http://' + ( listen || '*' ) + '/:' + port );

	const handler =
	    ( request, result ) =>
	{
	    result.writeHead(
			307,
			{
				Location: destination + request.headers.host + request.url,
			}
		);

		result.end( 'go use https' );
	};

	yield http.createServer( handler ).listen( port, listen, resume( ) );
};


/*
| Sets up the server.
|*/
const startup =
	function*( )
{
	server_root.create(
		'inventory', server_inventory.create( ),
		'nextSleepID', 1,
		'repository', yield* database_repository.connect( ),
		'spaces', server_spaceNexus.create( ),
		'upSleeps', server_upSleepGroup.create( ),
		'nextVisitor', 1000,
		'userNexus', server_userNexus.create( ),
		'serverDir', serverDir
	);

	yield* root.prepareInventory( );

	yield* root.loadSpaces( );

	yield* startMainServer( );

	yield* startRedirectServer( );

	log( 'server running' );
};


suspend(
	function*( )
{
	yield* startup( );
}
)( );
