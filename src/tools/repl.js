/*
| Runs the node Read-Eval-Print-Loop for debugging
| in a ideoloom environment supporting JIONs etc.
|
| Authors: Axel Kittenberger
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

GLOBAL.astTools = require( '../ast/tools' );

GLOBAL.parser = require( '../js-parser/parser' );

GLOBAL.formatter = require( '../format/formatter' );

GLOBAL.util = require( 'util' );

var
	repl;

repl = require( 'repl' );

repl.start( 'ideoloom> ' );

} )( );
