/*
| Runs the node Read-Eval-Print-Loop for debugging
| in a ideoloom environment supporting JIONs etc.
*/

/*
| Capsule.
*/
(function( ) {
'use strict';


/*
| Global Constants
*/
GLOBAL.APP = 'server';

GLOBAL.CHECK = true;

// does load jion code if it is out of date.
// as genjion is supposed to update it!
GLOBAL.FORCE_JION_LOADING = false;

GLOBAL.JION = false;

GLOBAL.SERVER = true;

GLOBAL.SHELL = false;

/*
| Preloads some common modules
*/
GLOBAL.jools = require( '../jools/jools' );

GLOBAL.ast_tools = require( '../ast/tools' );

GLOBAL.parser = require( '../jsParser/parser' );

GLOBAL.parse = GLOBAL.parser.parse;

GLOBAL.format_formatter = require( '../format/formatter' );

GLOBAL.util = require( 'util' );

/*
| Comfort function, inspects with infinite depth as default.
*/
GLOBAL.inspect =
	function(
		obj
	)
{
	return GLOBAL.util.inspect( obj, { depth: null } );
};


var
	defaultEval,
	fs,
	history,
	historyFileName,
	maxHistory,
	repl;

historyFileName = 'report/repl-history';

maxHistory = 1000;

fs = require( 'fs' );

repl = require( 'repl' );

try
{
	history = fs.readFileSync( historyFileName );

	history = history + '';

	history = history.split( '\n' );
}
catch( err )
{
	history = [ ];
}

repl = repl.start( 'ideoloom> ' );

repl.rli.history = history;

defaultEval = repl[ '_eval'.substr( 1 ) ]; // strange wording to make jshint happy

repl[ '_eval'.substr( 1 ) ] =
	function( cmd, context, filename, callback )
	{
		history.push( cmd );

		if( history.length > maxHistory )
		{
			history.shift( );
		}

		defaultEval.call( repl, cmd, context, filename, callback );
	};

repl.on(
	'exit',
	function( )
	{
		fs.writeFileSync( historyFileName, history.join( '\n' ) );
	}
);


} )( );
