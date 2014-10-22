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
	jools,
	parser,
	shorthand;


astNull = require( './ast-null' );

astNumber = require( './ast-number' );

astVar = require( './ast-var' );

jools = require( '../jools/jools' );

parser = require( '../js-parser/parser' );

shorthand = require( './shorthand' );


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
		return shorthand.astTrue;
	}

	if( arg === false )
	{
		return shorthand.astFalse;
	}

	if( arg === undefined )
	{
		return shorthand.astUndefined;
	}

	if( jools.isString( arg ) )
	{
		return parser.parse( arg );
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
