/*
| Various tools for abstract syntax use
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
	ast_number,
	ast_null,
	astVar,
	jools,
	parser,
	shorthand;


ast_null = require( './null' );

ast_number = require( './number' );

astVar = require( './ast-var' );

jools = require( '../jools/jools' );

parser = require( '../jsParser/parser' );

shorthand = require( './shorthand' );


/*
| Converts an argument to ast usage.
|
| simple strings -> astVar
| simple numbers -> ast_number
*/
tools.convert =
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
		return ast_null.create( );
	}

	if( arg === undefined )
	{
		return astVar.create( 'name', 'undefined' );
	}

	if( arg === true )
	{
		return shorthand.$true;
	}

	if( arg === false )
	{
		return shorthand.$false;
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
		return ast_number.create( 'number', arg );
	}

/**/if( CHECK )
/**/{
/**/	if( arg.reflect.substr( 0, 4 ) !== 'ast_' )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	return arg;
};


} )( );
