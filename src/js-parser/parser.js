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
	astNumber,
	astVar,
	jools,
	lexer,
	parseToken,
	state,
	tokenPrecs;


astDot = require( '../ast/ast-dot' );

astMember = require( '../ast/ast-member' );

astNumber = require( '../ast/ast-number' );

astPlus = require( '../ast/ast-plus' );

astVar = require( '../ast/ast-var' );

jools = require( '../jools/jools' );

lexer = require( '../js-lexer/lexer' );

state = require( './state' );


tokenPrecs = { };

tokenPrecs[ 'number' ] = -1;
tokenPrecs[ 'var' ] = -1;

tokenPrecs[ ']' ] = -1;
tokenPrecs[ '.' ] =  1;
tokenPrecs[ '[' ] =  1;
tokenPrecs[ '+' ] =  6;


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
				state.create(
					'ast',
						astPlus.create(
							'left', ast,
							'right', state.ast
						)
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
					99 // tokenPrecs[ '[' ]
				);

			break;

		case 'number' :

			if( state.ast !== null )
			{
				throw new Error(
					'parse error'
				);
			}

			state =
				state.advance(
					astNumber.create( 'number', token.value ),
					undefined
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
					undefined
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
