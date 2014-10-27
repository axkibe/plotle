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

			tokens.push(
				token.create(
					'type', 'identifier',
					'value', value
				)
			);

			continue;
		}

		if( ch.match(/[0-9]/ ) )
		{
			value = ch;

			// a name specifier
			while( c + 1 < cZ && code[ c+ 1 ].match( /0-9/ ) )
			{
				value += code[ ++c ];
			}

			value = parseInt( value, 10 );

			tokens.push( token.create( 'type', 'number', 'value', value ) );

			continue;
		}

		switch( ch )
		{
			case '<' :
			case '>' :
			case '.' :
			case '[' :
			case ']' :

				tokens.push( token.create( 'type', ch ) );

				continue;

			case '+' :

				if(
					c + 1 < cZ
					&&
					code[ c + 1 ] === '+'
				)
				{
					tokens.push( token.create( 'type', '++' ) );

					c++;
				}
				else
				{
					tokens.push( token.create( 'type', '+' ) );
				}

				continue;

			default :

				throw new Error( 'lexer error with: "' + code + '"' );
		}
	}

	return tokens;
};


} )( );
