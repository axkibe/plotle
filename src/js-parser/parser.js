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
	parseToken,
	state;


astVar = require( '../ast/ast-var' );

jools = require( '../jools/jools' );

lexer = require( '../js-lexer/lexer' );

state = require( './state' );


/*
| Parses a token at tpos from a tokenRay.
*/
parseToken =
	function(
		state
	)
{
	var
		token;

	token = state.tokens[ state.tpos ];

	switch( token.type )
	{
		case 'var' :

			return(
				state.create(
					'tpos', state.tpos + 1,
					'ast', astVar.create( 'name', token.value )
				)
			);

		default :

			throw new Error( );
	}
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
				'tpos', 0,
				'ast', null
			)
		).ast
	);
};


} )( );
