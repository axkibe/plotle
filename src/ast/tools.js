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
	astNull,
	astVar,
	jools;


astVar = require( './ast-var' );

astNumber = require( './ast-number' );

astNull = require( './ast-null' );

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
	if( arg === null )
	{
		return astNull.create( );
	}

	if( arg === undefined )
	{
		return astUndefined.create( );
	}

	if( arg === true )
	{
		return astBoolean.create( 'boolean', true );
	}

	if( arg === false )
	{
		return astBoolean.create( 'boolean', false );
	}

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
