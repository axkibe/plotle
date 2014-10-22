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
	lexer,
	shorthand;


astNull = require( './ast-null' );

astNumber = require( './ast-number' );

astVar = require( './ast-var' );

jools = require( '../jools/jools' );

lexer = require( '../js-lexer/lexer' );

shorthand = require( './shorthand' );


/*
| Parses a code to create an ast of it
*/
tools.parse =
	function( code )
{
	var
		tokens;

	if( !jools.isString( code ) )
	{
		throw new Error( 'cannot parse non-strings' );
	}

	tokens = lexer.tokenize( code );

	if( tokens.length !== 1 )
	{
		throw new Error( );
	}

	return astVar.create( 'name', tokens[ 0 ].value );
};


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
		return tools.parse( arg );
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
