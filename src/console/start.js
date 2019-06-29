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


global.util = require( 'util' );

global.trace_root = require( '../trace/root' );

// loads as console.inspect
require( 'tim.js/src/inspect' );


const histFileName = '.console-history';

const maxHistory = 1000;

const fs = require( 'fs' );

let repl = require( 'repl' );

let hist;

try
{
	hist = fs.readFileSync( histFileName ) + '';

	hist = hist.split( '\n' );
}
catch( err )
{
	hist = [ ];
}

repl = repl.start( '.> ' );

repl.rli.history = hist.reverse( );

const defaultEval = repl.eval;

repl.eval =
	function( cmd, context, filename, callback )
{
	const c = cmd.trim( );

	if( c !== '' )
	{
		hist.push( c );

		if( hist.length > maxHistory ) hist.shift( );
	}

	defaultEval.call( repl, cmd, context, filename, callback );
};

repl.on( 'exit', ( ) => fs.writeFileSync( histFileName, hist.join( '\n' ) ) );

