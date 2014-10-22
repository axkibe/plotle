/*
| A partial parser for javascript.
|
| This parser must not use ast-shorthands,
| because these are using the parser.
|
| Authors: Axel Kittenberger
*/


var
	parser;

parser =
module.exports =
	{ };


/*
| Capsule
*/
(function() {
'use strict';


var
	astVar,
	jools,
	lexer,
	shorthand;


astVar = require( '../ast/ast-var' );

jools = require( '../jools/jools' );

lexer = require( '../js-lexer/lexer' );


/*
| Parses a code to create an ast of it
*/
parser.parse =
	function( code )
{
	var
//		ast,
		tokens;

	if( !jools.isString( code ) )
	{
		throw new Error( 'cannot parse non-strings' );
	}

	tokens = lexer.tokenize( code );

	/*
	for(
		var t = 0, tZ = tokens.length;
		t < tZ;
		t++
	)
	{

	}
	*/

	if( tokens.length !== 1 )
	{
		throw new Error( );
	}

	return astVar.create( 'name', tokens[ 0 ].value );
};


} )( );
