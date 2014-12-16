/*
| The javascript lexer turns a string into a series of tokens.
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
		// FUTURE make the loop body a sub func.

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

			switch( value )
			{
				case 'false' :
				case 'true' :

					tokens.push(
						token.create( 'type', value )
					);

					continue;

				default :

					tokens.push(
						token.create(
							'type', 'identifier',
							'value', value
						)
					);

					continue;
			}

			continue;
		}

		if( ch.match(/[0-9]/ ) )
		{
			// a name specifier
			value = ch;

			while( c + 1 < cZ && code[ c+ 1 ].match( /0-9/ ) )
			{
				value += code[ ++c ];
			}

			value = parseInt( value, 10 );

			tokens.push( token.create( 'type', 'number', 'value', value ) );

			continue;
		}

		if( ch === '"' )
		{
			// a string literal
			value = '';

			c++;

			if( c >= cZ )
			{
				throw new Error( '" missing' );
			}

			// FUTURE handle \"
			while( code[ c ] !== '"' )
			{
				value += code[ c ];

				c++;

				if( c >= cZ )
				{
					throw new Error( '" missing' );
				}
			}

			tokens.push( token.create( 'type', 'string', 'value', value ) );

			continue;
		}

		switch( ch )
		{
			case '<' :
			case '>' :
			case '.' :
			case ',' :
			case '[' :
			case ']' :
			case '(' :
			case ')' :

				tokens.push( token.create( 'type', ch ) );

				continue;

			case '=' :

				if(
					c + 1 < cZ
					&& code[ c + 1 ] === '='
				)
				{
					if(
						c + 2 < cZ
						&& code[ c + 2 ] === '='
					)
					{
						tokens.push( token.create( 'type', '===' ) );

						c += 2;

						continue;
					}
					else
					{
						throw new Error( 'Use === instead of ==');
					}
				}
				else
				{
					tokens.push( token.create( 'type', '=' ) );
				}

				continue;

			case '!' :

				if(
					c + 1 < cZ
					&& code[ c + 1 ] === '='
				)
				{
					if(
						c + 2 < cZ
						&& code[ c + 2 ] === '='
					)
					{
						tokens.push( token.create( 'type', '!==' ) );

						c += 2;

						continue;
					}
					else
					{
						throw new Error( 'Use !== instead of !=');
					}
				}
				else
				{
					tokens.push( token.create( 'type', '!' ) );
				}

				continue;

			case '+' :

				if(
					c + 1 < cZ
					&& code[ c + 1 ] === '+'
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

			case '|' :

				if(
					c + 1 < cZ
					&& code[ c + 1 ] === '|'
				)
				{
					tokens.push( token.create( 'type', '||' ) );

					c++;
				}
				else
				{
					throw new Error( 'bitwise or not supported' );
				}

				continue;

			case '&' :

				if(
					c + 1 < cZ
					&& code[ c + 1 ] === '&'
				)
				{
					tokens.push( token.create( 'type', '&&' ) );

					c++;
				}
				else
				{
					throw new Error( 'bitwise and not supported' );
				}

				continue;

			default :

				throw new Error( 'lexer error with: "' + code + '"' );
		}
	}

	return tokens;
};


} )( );