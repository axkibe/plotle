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
	astBoolean,
	astNumber,
	astNull,
	astVar,
	jools;


astBoolean = require( './ast-boolean' );

astNull = require( './ast-null' );

astNumber = require( './ast-number' );

astVar = require( './ast-var' );

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
/**/if( CHECK )
/**/{
/**/	if( arguments.length !== 1 )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	if( arg === null )
	{
		return astNull.create( );
	}

	if( arg === undefined )
	{
		return astVar.create( 'name', 'undefined' );
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

/**/if( CHECK )
/**/{
/**/	if( arg.reflect.substr( 0, 4 ) !== 'ast.' )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	return arg;
};


} )( );
