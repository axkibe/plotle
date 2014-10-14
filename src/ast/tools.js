/*
| Various tools for abstract syntax use
|
| Authors: Axel Kittenberger
*/


var
	tools;

tools =
module.exports =
	{ };


/*
| Capsule
*/
(function() {
'use strict';


var
	astNumber,
	astVar,
	jools;


astVar = require( './ast-var' );

astNumber = require( './ast-number' );

jools = require( '../jools/jools' );


/*
| Converts an argument to ast usage.
|
| simple strings -> astVar
| simple numbers -> astNumber
*/
tools.convertArg =
	function( arg )
{
	if( jools.isString( arg ) )
	{
		return astVar.create( 'name', arg );
	}

	if( typeof( arg ) === 'number' )
	{
		return astNumber.create( 'number', arg );
	}

	return arg;
};


} )( );
