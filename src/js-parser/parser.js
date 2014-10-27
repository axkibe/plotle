/*
| A partial parser for javascript.
|
| This parser must not use ast-shorthands,
| because these are using the parser.
|
| FUTURE combine all left-right dualistic operators
|        into one handling.
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
	astAnd,
	astAssign,
	astDiffers,
	astDot,
	astEquals,
	astGreaterThan,
	astLessThan,
	astMember,
	astPlus,
	astPreIncrement,
	astNot,
	astNumber,
	astOr,
	astVar,
	jools,
	lexer,
	parseToken,
	state,
	tokenPrecs;


astAnd = require( '../ast/ast-and' );

astAssign = require( '../ast/ast-assign' );

astDiffers = require( '../ast/ast-differs' );

astDot = require( '../ast/ast-dot' );

astEquals = require( '../ast/ast-equals' );

astGreaterThan = require( '../ast/ast-greater-than' );

astLessThan = require( '../ast/ast-less-than' );

astMember = require( '../ast/ast-member' );

astNot = require( '../ast/ast-not' );

astGreaterThan = require( '../ast/ast-greater-than' );

astNumber = require( '../ast/ast-number' );

astOr = require( '../ast/ast-or' );

astPlus = require( '../ast/ast-plus' );

astPreIncrement = require( '../ast/ast-pre-increment' );

astVar = require( '../ast/ast-var' );

jools = require( '../jools/jools' );

lexer = require( '../js-lexer/lexer' );

state = require( './state' );


tokenPrecs = { };

tokenPrecs.number = -1;
tokenPrecs.identifier = -1;

tokenPrecs[   ']' ] = -1;
tokenPrecs[   '.' ] =  1;
tokenPrecs[   '[' ] =  1;
tokenPrecs[  '++' ] =  3; // 4 for postfix
tokenPrecs[   '!' ] =  4;
tokenPrecs[   '+' ] =  6;
tokenPrecs[   '<' ] =  8;
tokenPrecs[   '>' ] =  8;
tokenPrecs[ '===' ] =  9;
tokenPrecs[ '!==' ] =  9;
tokenPrecs[  '&&' ] = 13;
tokenPrecs[  '||' ] = 14;


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
		prec,
		token;

	pos = state.pos;

	prec = state.prec;

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

			if( name.type !== 'identifier' )
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

		case '!' :

			if( ast )
			{
				throw new Error( 'parser error' );
			}

			state = state.advance( null, tokenPrecs[ '!' ] );

			state = parseToken( state );

			state =
				state.create(
					'ast',
						astNot.create(
							'expr',
								state.ast
						)
				);

			break;

		case '++' :

			if( !ast )
			{
				state = state.advance( null, tokenPrecs[ '++' ] );

				state = parseToken( state );

				state =
					state.create(
						'ast',
							astPreIncrement.create(
								'expr',
									state.ast
							)
					);
			}
			else
			{
				throw new Error(
					'FIXME cannot do postincrement'
				);
			}

			break;

		case '===' :

			if( !ast )
			{
				throw new Error( );
			}

			state = state.advance( null, tokenPrecs[ '===' ] );

			state = parseToken( state );

			state =
				state.create(
					'ast',
						astEquals.create(
							'left', ast,
							'right', state.ast
						)
				);

			break;

		case '!==' :

			if( !ast )
			{
				throw new Error( );
			}

			state = state.advance( null, tokenPrecs[ '!==' ] );

			state = parseToken( state );

			state =
				state.create(
					'ast',
						astDiffers.create(
							'left', ast,
							'right', state.ast
						)
				);

			break;

		case '=' :

			if( !ast )
			{
				throw new Error( );
			}

			state = state.advance( null, tokenPrecs[ '=' ] );

			state = parseToken( state );

			state =
				state.create(
					'ast',
						astAssign.create(
							'left', ast,
							'right', state.ast
						)
				);

			break;

		case '>' :

			if( !ast )
			{
				throw new Error( );
			}

			state = state.advance( null, tokenPrecs[ '<' ] );

			state = parseToken( state );

			state =
				state.create(
					'ast',
						astGreaterThan.create(
							'left', ast,
							'right', state.ast
						)
				);

			break;

		case '<' :

			if( !ast )
			{
				throw new Error( );
			}

			state = state.advance( null, tokenPrecs[ '<' ] );

			state = parseToken( state );

			state =
				state.create(
					'ast',
						astLessThan.create(
							'left', ast,
							'right', state.ast
						)
				);

			break;

		case '||' :

			if( !ast )
			{
				throw new Error( );
			}

			state = state.advance( null, tokenPrecs[ '||' ] );

			state = parseToken( state );

			state =
				state.create(
					'ast',
						astOr.create(
							'left', ast,
							'right', state.ast
						)
				);

			break;

		case '&&' :

			if( !ast )
			{
				throw new Error( );
			}

			state = state.advance( null, tokenPrecs[ '&&' ] );

			state = parseToken( state );

			state =
				state.create(
					'ast',
						astAnd.create(
							'left', ast,
							'right', state.ast
						)
				);

			break;

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

			while( state.current.type !== ']' )
			{
				state = parseToken( state );

				if( state.reachedEnd )
				{
					throw new Error( );
				}
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
				throw new Error( 'parse error' );
			}

			state =
				state.advance(
					astNumber.create( 'number', token.value ),
					undefined
				);

			break;

		case 'identifier' :

			if( state.ast !== null )
			{
				throw new Error( 'parse error' );
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

	if( !state.reachedEnd )
	{
		if(
			tokenPrecs[ state.current.type ] < prec
		)
		{
			state = parseToken( state );
		}
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
		st,
		tokens;

/**/if( CHECK )
/**/{
/**/	if( !jools.isString( code ) )
/**/	{
/**/		throw new Error( 'cannot parse non-strings' );
/**/	}
/**/}

	tokens = lexer.tokenize( code );

	st =
		state.create(
			'tokens', tokens,
			'pos', 0,
			'ast', null,
			'prec', 99
		);

	while( !st.reachedEnd )
	{
		st = parseToken( st );
	}

	return st.ast;
};


} )( );
