/*
| Starts the server
*/
'use strict';


//Error.stackTraceLimit = 15;
Error.stackTraceLimit = Infinity;


const config = require( '../../config' );

const log = require( './log' );

config.database_version = 15;


/*
| Running node normally, TIM is false.
*/
global.TIM = false;

/*
| Server checking.
*/
global.CHECK = config.server_check;

/*
| Server object freezing.
*/
global.FREEZE = config.server_freeze;

/*
| This is node.
*/
global.NODE = true;

/*
| Sets root as global variable.
| Works around to hide node.js unnessary warning.
*/
Object.defineProperty(
	global, 'root',
	{ configureable: true, writable: true, enumerable: true, value: undefined }
);

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

const database_repository = require( '../database/repository' );

const fs = require( 'fs' );

const http = require( 'http' );

const https = require( 'https' );

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

	if( !config.https )
	{
		log( 'starting server @ http://' + ( config.ip || '*' ) + '/:' + config.port );

		yield http.createServer(
			( request, result ) =>
			{
				suspend( root.requestListener ).call( root, request, result );
			}
		).listen( config.port, config.ip, resume( ) );
	}
	else
	{
		log( 'starting redirect @ http://' + ( config.ip || '*' ) + '/:' + config.port );

		http.createServer(
		    ( request, result ) =>
			{
			    result.writeHead(
					307,
					{
						Location: 'https://' + request.headers.host + '/' + request.url,
					}
				);

				result.end( 'go use https' );
			}
		).listen( 80 );

		log( 'starting server @ https://' + ( config.ip || '*' ) + '/:' + config.port );

		const options = {
		    cert: fs.readFileSync( config.https_cert ),
			key: fs.readFileSync( config.https_key ),
		};

		yield https.createServer( options,
			( request, result ) =>
			{
				suspend( root.requestListener ).call( root, request, result );
			}
		).listen( config.port, config.ip, resume( ) );
	}

	log( 'server running' );
};


suspend(
	function*( )
{
	yield* startup( );
}
)( );


