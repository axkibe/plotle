/*
| Starts the server
*/
'use strict';


Error.stackTraceLimit = 15;
//Error.stackTraceLimit = Infinity;
process.on( 'unhandledRejection', err => { throw err; } );


/*
| Sets root as global variable.
| Works around to hide node.js unnessary warning.
*/
Object.defineProperty(
	global, 'root',
	{ configureable: true, writable: true, enumerable: true, value: undefined }
);


// running node normaly, TIM is false.
global.TIM = false;

// this is node.
global.NODE = true;

// server checking (first true, later override by config)
global.CHECK = true;

// server isn't a visual
global.VISUAL = false;


// Registers with tim.js
{
	require( 'tim.js' );

	const ending = 'src/server/start.js';

	const filename = module.filename;

	// if this filename is not bootstrap.js something is seriously amiss.
	if( !filename.endsWith( ending ) ) throw new Error( );

	const rootPath = filename.substr( 0, filename.length - ending.length );

	// timcode path is one level up
	const timcodePath = rootPath.substr( 0, rootPath.lastIndexOf( '/' ) ) + '/timcode/';

	tim.catalog.addRootDir( rootPath, 'plotle', timcodePath );
}

const constants = require( 'constants' );
const util = require( 'util' );

const config = require( '../config/intf' );
require( '../../config' )( config.set );

// Server checking.
global.CHECK = config.get( 'server', 'check' );

require( '../trace/base' ); // TODO working around cycle issues
const log = require( './log' );
const database_repository = require( '../database/repository' );
const fs = require( 'fs' );
const gleam_font_root = require( '../gleam/font/root' );
const http = require( 'http' );
const https = require( 'https' );
const server_root = require( './root' );
const server_inventory = require( './inventory' );
const server_spaceNexus = require( './spaceNexus' );
const server_upSleepGroup = require( './upSleepGroup' );
const server_userNexus = require( './userNexus' );


/*
| Starts the main server.
*/
const startMainServer =
	async function( )
{
	const protocol = config.get( 'network', 'main', 'protocol' );

	let port = config.get( 'network', 'main', 'port' );

	const listen = config.get( 'network', 'listen' );

	if( port === 0 ) port = protocol === 'http' ? 8833 : 443;

	const handler =
		( request, result ) =>
	{
		root.requestListener( request, result )
		.catch( ( error ) => { console.error( error ); process.exit( -1 ); } );
	};

	switch( protocol )
	{
		case 'https' :
		{
			log.log( 'starting server @ https://' + ( listen || '*' ) + '/:' + port );

			const cert = ( fs.readFileSync( config.get( 'https', 'cert' ) ) ) + '';
			const key = ( fs.readFileSync( config.get( 'https', 'key' ) ) ) + '';
			const options =
			{
				secureOptions: constants.SSL_OP_NO_SSLv3 | constants.SSL_OP_NO_SSLv2,
				cert: cert,
				key: key
			};
			const server = https.createServer( options, handler );
			const promise = util.promisify( server.listen.bind( server ) );
			await promise( port, listen );
			return;
		}

		case 'http' :
		{
			log.log( 'starting server @ http://' + ( listen || '*' ) + '/:' + port );
			const server = http.createServer( handler );
			const promise = util.promisify( server.listen.bind( server ) );
			await promise( port, listen );
			return;
		}

		default : throw new Error( );
	}
};


/*
| Starts the redirect server.
*/
const startRedirectServer =
	async function( )
{
	const protocol = config.get( 'network', 'redirect', 'protocol' );
	if( protocol === '' ) return;
	if( protocol !== 'http' ) throw new Error( );
	const port = config.get( 'network', 'redirect', 'port' );
	const destination = config.get( 'network', 'redirect', 'destination' );
	const listen = config.get( 'network', 'listen' );
	log.log( 'starting redirect @ http://' + ( listen || '*' ) + '/:' + port );

	const handler =
		( request, result ) =>
	{
		result.writeHead(
			307, { Location: destination + request.headers.host + request.url }
		);

		result.end( 'go use https' );
	};

	const server = http.createServer( handler );
	const promise = util.promisify( server.listen.bind( server ) );
	await promise( port, listen );
};


/*
| Sets up the server.
|*/
const startup =
	async function( )
{
	{
		// TODO have gleam_font_root use async
		const promise = util.promisify( gleam_font_root.load );
		await promise( 'DejaVuSans-Regular' );
	}

	const repository = await database_repository.connect( );
	const userNexus = await server_userNexus.createFromRepository( repository );

	server_root.create(
		'inventory', server_inventory.create( ),
		'nextSleepID', 1,
		'repository', repository,
		'spaces', server_spaceNexus.create( ),
		'upSleeps', server_upSleepGroup.create( ),
		'nextVisitor', 1000,
		'userNexus', userNexus
	);

	await root.prepareInventory( );
	await root.loadSpaces( );
	await startMainServer( );
	await startRedirectServer( );

	log.log( 'server running' );
};


startup( )
.catch( ( error ) => { console.error( error ); process.exit( -1 ); } );
