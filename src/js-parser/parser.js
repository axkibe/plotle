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
	handleBoolean,
	handleDualisticOps,
	handlePass,
	handleSquareBrackets,
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
| Handler for boolean literals.
*/
handleBoolean =
	function(
		state, // current parser state
		spec   // operator spec
	)
{
	var
		bool;

	if( state.ast !== null )
	{
		throw new Error( 'parse error' );
	}

	switch( state.current.type )
	{
		case 'true' : bool = true; break;
		case 'false' : bool = false; break;
		default : throw new Error( );
	}

	state =
		state.advance(
			astBoolean.create( 'boolean', bool ),
			undefined
		);

	return state;
};



/*
| Generic handler for dualistic operations.
*/
handleDualisticOps =
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
| Handler for [ ].
*/
handleSquareBrackets =
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
		throw new Error( );
	}

	state = state.advance( null, spec.precedence );

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

	return state;
};


/*
| Generic pass handler.
| It just passes back up
*/
handlePass =
	function(
		state // current parser state
		// spec   // operator spec
	)
{
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
		precedence : -1,
		handler : handleBoolean
	};

tokenSpecs[ 'false' ] =
	{
		precedence : -1,
		handler : handleBoolean
	};

tokenSpecs[ ']' ] =
	{
		precedence : 1,
		handler : handlePass
	};

tokenSpecs[ '.' ] =
	{
		precedence : 1
	};

tokenSpecs[ '[' ] =
	{
		precedence : 1,
		handler : handleSquareBrackets
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
		precedence : 6,
		handler : handleDualisticOps,
		astCreator : astPlus
	};

tokenSpecs[ '<' ] =
	{
		precedence : 8,
		handler : handleDualisticOps,
		astCreator : astLessThan
	};

tokenSpecs[ '>' ] =
	{
		precedence : 8,
		handler : handleDualisticOps,
		astCreator : astGreaterThan
	};

tokenSpecs[ '===' ] =
	{
		precedence : 9,
		handler : handleDualisticOps,
		astCreator : astEquals
	};

tokenSpecs[ '!==' ] =
	{
		precedence : 9,
		handler : handleDualisticOps,
		astCreator : astDiffers
	};

tokenSpecs[ '&&' ] =
	{
		precedence : 13,
		handler : handleDualisticOps,
		astCreator : astAnd
	};

tokenSpecs[ '||' ] =
	{
		precedence : 14,
		handler : handleDualisticOps,
		astCreator : astOr
	};

tokenSpecs[ '=' ] =
	{
		precedence : 16,
		handler : handleDualisticOps,
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

		case '+' :
		case '=' :
		case '>' :
		case '<' :
		case '[' :
		case ']' :
		case '&&' :
		case '||' :
		case '!==' :
		case '===' :
		case 'true' :
		case 'false' :

			state = spec.handler( state, spec );

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

	if(
		!state.reachedEnd
		&&
		tokenSpecs[ state.current.type ].precedence < prec
		&&
		spec.handler !== handlePass
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
