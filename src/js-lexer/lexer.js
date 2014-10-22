/*
| the javascript lexer turns a string into a series of tokens.
|
| Authors: Axel Kittenberger
*/


var
	jsLexer;

jsLexer =
module.exports =
	{ };


/*
| Capsule
*/
(function() {
'use strict';


var
	jools,
	token;


jools = require( '../jools/jools' );

token = require( './token' );


/*
| Tokenizes a javascript string.
|
| Returns an array of tokens.
*/
jsLexer.tokenize =
	function( code )
{
	var
		c,
		ch,
		cZ,
		value,
		tokens;

	if( !jools.isString( code ) )
	{
		throw new Error( 'cannot tokenize non-strings' );
	}

	tokens = [ ];

	for(
		c = 0, cZ = code.length;
		c < cZ;
		c++
	)
	{
		ch = code[ c ];

		if( ch.match( /\s/ ) )
		{
			// skips whitespaces
			continue;
		}

		if( ch.match(/[a-zA-Z_]/ ) )
		{
			value = ch;

			// a name specifier
			while( c + 1 < cZ && code[ c+ 1 ].match( /[a-zA-Z0-9_]/ ) )
			{
				value += code[ ++c ];
			}

			tokens.push( token.create( 'type', 'var', 'value', value ) );

			continue;
		}

		if( ch === '.' )
		{
			tokens.push( token.create( 'type', 'dot' ) );

			continue;
		}

		throw new Error( 'lexer error with: "' + code + '"' );
	}

	return tokens;
};


} )( );
