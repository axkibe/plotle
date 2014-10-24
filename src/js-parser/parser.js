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
	astPlus,
	astMember,
	astVar,
	jools,
	lexer,
	parseToken,
	state,
	tokenPrecs;


astDot = require( '../ast/ast-dot' );

astMember = require( '../ast/ast-member' );

astPlus = require( '../ast/ast-plus' );

astVar = require( '../ast/ast-var' );

jools = require( '../jools/jools' );

lexer = require( '../js-lexer/lexer' );

state = require( './state' );


tokenPrecs = { };

tokenPrecs[ 'var' ] = -1;
tokenPrecs[   ']' ] = -1;
tokenPrecs[   '.' ] =  1;
tokenPrecs[   '[' ] =  1;
tokenPrecs[   '+' ] =  6;
tokenPrecs[   '*' ] =  5;


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

	token = state.current;

	ast = state.ast;

	switch( token.type )
	{
		case '.' :

			if( !ast )
			{
				throw new Error( );
			}

			name = state.preview;

			if( name.type !== 'var' )
			{
				throw new Error( );
			}

			state =
				state.advance(
					astDot.create(
						'expr', state.ast,
						'member', name.value
					),
					tokenPrecs[ '.' ],
					2
				);

			break;

		case ']' :

			return state;

		case '+' :

			if( !ast )
			{
				throw new Error( );
			}

			state = state.advance( null, tokenPrecs[ '+' ] );

			state = parseToken( state );

			state =
				state.advance(
					astPlus.create(
						'left', ast,
						'right', state.ast
					),
					tokenPrecs[ '+' ]
				);

			break;

		case '[' :

			if( !ast )
			{
				throw new Error( );
			}

			state = state.advance( null, tokenPrecs[ '[' ] );

			state = parseToken( state );

			if( state.current.type !== ']' )
			{
				throw new Error( );
			}

			state =
				state.advance(
					astMember.create(
						'expr', ast,
						'member', state.ast
					),
					tokenPrecs[ '[' ]
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
				state.advance(
					astVar.create( 'name', token.value ),
					tokenPrecs[ 'var' ]
				);

			break;

		default :

			throw new Error( );
	}

	if(
		!state.reachedEnd
		&&
		state.preview
		&&
		tokenPrecs[ state.preview.type ] <= state.prec
	)
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
				'ast', null,
				'prec', 99
			)
		).ast
	);
};


} )( );
