/*
| The root of the console.
| Runs the node console for debugging.
*/
'use strict';


tim.define( module, ( def ) => {


def.singleton = true;


global.util = tim.require( 'util' );

global.gleam_point = tim.require( '../gleam/point' );
global.trace_base = tim.require( '../trace/base' );
global.trace_root = tim.require( '../trace/root' );
global.trace_space = tim.require( '../trace/space' );
global.change_set = tim.require( '../change/set' );


def.proto.start =
	function( )
{
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

	repl = repl.start( '(o) ' );

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
};

} );
