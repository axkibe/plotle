/*
| Runs the node console for debugging.
*/
'use strict';


Error.stackTraceLimit = Infinity;

// running node normaly, TIM is false.
global.TIM = false;

// this is node.
global.NODE = true;

// do all checking
global.CHECK = true;

// isn't a visual
global.VISUAL = false;


// Registers with tim.js
{
	require( 'tim.js' );

	const ending = 'src/console/start.js';

	const filename = module.filename;

	if( !filename.endsWith( ending ) ) throw new Error( );

	const rootPath = filename.substr( 0, filename.length - ending.length );

	// timcode path is one level up
	const timcodePath = rootPath.substr( 0, rootPath.lastIndexOf( '/' ) ) + '/timcode/';

	tim.catalog.addRootDir( rootPath, 'plotle', timcodePath );
}

// loads as console.inspect
require( 'tim.js/src/inspect' );

require( './root' ).singleton.start( );
