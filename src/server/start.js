/*
| Starts the server
*/
'use strict';


//Error.stackTraceLimit = 15;
Error.stackTraceLimit = Infinity;


const config = require( '../../config' );

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
*/
global.root = undefined;


require( 'tim.js' );


tim.catalog.addRootDir(
	( function( ) {
		let path = module.filename.split( '/' );
		path.pop( );
		path.pop( );
		return path.join( '/' ) + '/';
	} )( ),
	'linkloom'
);

const database_repository = require( '../database/repository' );

const http = require( 'http' );

const log = require( '../log/root' );

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

	log.start(
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

	log.start( 'server running' );
};


suspend(
	function*( )
{
	yield* startup( );
}
)( );


