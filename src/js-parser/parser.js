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
	astDot,
	astVar,
	jools,
	lexer,
	parseToken,
	state;


astDot = require( '../ast/ast-dot' );

astVar = require( '../ast/ast-var' );

jools = require( '../jools/jools' );

lexer = require( '../js-lexer/lexer' );

state = require( './state' );


/*
| Parses a token at pos from a tokenRay.
*/
parseToken =
	function(
		state
	)
{
	var
		ast,
		name,
		pos,
		token;

	pos = state.pos;

	token = state.tokens[ pos ];

	ast = state.ast;

	switch( token.type )
	{
		case 'dot' :

			if( !ast )
			{
				throw new Error( );
			}

			name = state.tokens[ pos + 1 ];

			if( name.type !== 'var' )
			{
				throw new Error( );
			}

			state =
				state.create(
					'pos', state.pos + 2,
					'ast',
						astDot.create(
							'expr', state.ast,
							'member', name.value
						)
				);

			break;

		case 'var' :

			if( state.ast !== null )
			{
				throw new Error(
					'parse error'
				);
			}

			state =
				state.create(
					'pos', state.pos + 1,
					'ast', astVar.create( 'name', token.value )
				);

			break;

		default :

			throw new Error( );
	}

	if( !state.reachedEnd )
	{
		state = parseToken( state );
	}

	return state;
};


/*
| Parses a code to create an ast of it
*/
parser.parse =
	function( code )
{
	var
//		ast,
		tokens;

/**/if( CHECK )
/**/{
/**/	if( !jools.isString( code ) )
/**/	{
/**/		throw new Error( 'cannot parse non-strings' );
/**/	}
/**/}

	tokens = lexer.tokenize( code );

	return(
		parseToken(
			state.create(
				'tokens', tokens,
				'pos', 0,
				'ast', null
			)
		).ast
	);
};


} )( );
