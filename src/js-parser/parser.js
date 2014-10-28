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
	astBoolean,
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
	handlerDualistic,
	parseToken,
	state,
	tokenSpecs;


astAnd = require( '../ast/ast-and' );

astAssign = require( '../ast/ast-assign' );

astBoolean = require( '../ast/ast-boolean' );

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


/*
| Generic handler for dualistic operations
*/
handlerDualistic =
	function(
		state, // current parser state
		spec   // operator spec
	)
{
	var
		ast;

	ast = state.ast;

	if( !ast )
	{
		throw new Error( 'parser error' );
	}

	state = state.advance( null, spec.precedence );

	state = parseToken( state );

	state =
		state.create(
			'ast',
				spec.astCreator.create(
					'left', ast,
					'right', state.ast
				)
		);

	return state;
};



/*
| Token specifications.
*/
tokenSpecs = { };

tokenSpecs.number =
	{
		precedence : -1
	};

tokenSpecs.identifier =
	{
		precedence : -1
	};

tokenSpecs[ 'true' ] =
	{
		precedence : -1
	};

tokenSpecs[ 'false' ] =
	{
		precedence : -1
	};


tokenSpecs[ ']' ] =
	{
		precedence : 1
	};

tokenSpecs[ '.' ] =
	{
		precedence : 1
	};

tokenSpecs[ '[' ] =
	{
		precedence : 1
	};

tokenSpecs[ '++' ] =
	{
		precedence : 3
		// 4 for postfix
	};

tokenSpecs[ '!' ] =
	{
		precedence : 4
	};

tokenSpecs[ '+' ] =
	{
		precedence : 6
	};

tokenSpecs[ '<' ] =
	{
		precedence : 8
	};

tokenSpecs[ '>' ] =
	{
		precedence : 8
	};

tokenSpecs[ '===' ] =
	{
		precedence : 9,
		handler : handlerDualistic,
		astCreator : astEquals
	};

tokenSpecs[ '!==' ] =
	{
		precedence : 9,
		handler : handlerDualistic,
		astCreator : astDiffers
	};

tokenSpecs[ '&&' ] =
	{
		precedence : 13
	};

tokenSpecs[ '||' ] =
	{
		precedence : 14
	};

tokenSpecs[ '=' ] =
	{
		precedence : 16,
		handler : handlerDualistic,
		astCreator : astAssign
	};


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
		spec,
		token;

	pos = state.pos;

	prec = state.prec;

	token = state.current;

	ast = state.ast;

	spec = tokenSpecs[ token.type ];

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
					tokenSpecs[ '.' ].precedence,
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

			state = state.advance( null, tokenSpecs[ '!' ].precedence );

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
				state = state.advance( null, tokenSpecs[ '++' ].precedence );

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

		case '=' :
		case '!==' :
		case '===' :

			state = spec.handler( state, spec );

			break;

		case '>' :

			if( !ast )
			{
				throw new Error( );
			}

			state = state.advance( null, tokenSpecs[ '<' ].precedence );

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

			state = state.advance( null, tokenSpecs[ '<' ].precedence );

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

			state = state.advance( null, tokenSpecs[ '||' ].precedence );

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

			state = state.advance( null, tokenSpecs[ '&&' ].precedence );

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

			state = state.advance( null, tokenSpecs[ '+' ].precedence );

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

			state = state.advance( null, tokenSpecs[ '[' ].precedence );

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
					99 // tokenSpecs[ '[' ].precedence
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

		case 'false' :

			if( state.ast !== null )
			{
				throw new Error( 'parse error' );
			}

			state =
				state.advance(
					astBoolean.create( 'boolean', false ),
					undefined
				);

			break;


		case 'true' :

			if( state.ast !== null )
			{
				throw new Error( 'parse error' );
			}

			state =
				state.advance(
					astBoolean.create( 'boolean', true ),
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
			tokenSpecs[ state.current.type ].precedence < prec
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
