/*
| A partial parser for javascript.
|
| This parser must not use ast-shorthands,
| because these are using the parser.
|
| FUTURE combine all left-right dualistic operators
|        into one handling.
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
	ast_and,
	ast_arrayLiteral,
	ast_assign,
	ast_boolean,
	ast_call,
	ast_comma,
	ast_delete,
	ast_differs,
	ast_dot,
	ast_equals,
	ast_greaterThan,
	ast_instanceof,
	ast_lessThan,
	ast_member,
	ast_new,
	ast_not,
	ast_number,
	ast_or,
	ast_plus,
	ast_plusAssign,
	ast_preIncrement,
	ast_string,
	ast_var,
	jools,
	lexer,
	handleBooleanLiteral,
	handleDot,
	handleDualisticOps,
	handleMonoOps,
	handleNew,
	handleNumber,
	handleIdentifier,
	handleParserError,
	handlePass,
	handleRoundBrackets,
	handleString,
	handleSquareBrackets,
	parseToken,
	state,
	tokenSpec,
	tokenSpecs;


ast_and = require( '../ast/and' );

ast_arrayLiteral = require( '../ast/arrayLiteral' );

ast_assign = require( '../ast/assign' );

ast_boolean = require( '../ast/boolean' );

ast_call = require( '../ast/call' );

ast_comma = require( '../ast/comma' );

ast_delete = require( '../ast/delete' );

ast_differs = require( '../ast/differs' );

ast_dot = require( '../ast/dot' );

ast_equals = require( '../ast/equals' );

ast_greaterThan = require( '../ast/greaterThan' );

ast_instanceof = require( '../ast/instanceof' );

ast_lessThan = require( '../ast/lessThan' );

ast_member = require( '../ast/member' );

ast_new = require( '../ast/new' );

ast_not = require( '../ast/not' );

ast_number = require( '../ast/number' );

ast_or = require( '../ast/or' );

ast_plus = require( '../ast/plus' );

ast_plusAssign = require( '../ast/plusAssign' );

ast_preIncrement = require( '../ast/preIncrement' );

ast_string = require( '../ast/string' );

ast_var = require( '../ast/var' );

jools = require( '../jools/jools' );

lexer = require( '../jsLexer/lexer' );

state = require( './state' );

tokenSpec = require( './tokenSpec' );


/*
| Handler for boolean literals.
*/
handleBooleanLiteral =
	function(
		state // current parser state
		// spec   // operator spec
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
			ast_boolean.create( 'boolean', bool ),
			undefined
		);

	return state;
};


/*
| Handler for dots.
*/
handleDot =
	function(
		state, // current parser state
		spec   // operator spec
	)
{
	var
		ast,
		name;

	ast = state.ast;

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
			ast_dot.create(
				'expr', state.ast,
				'member', name.value
			),
			spec.prec( ast ),
			2
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

	state = state.advance( null, spec.prePrec );

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
| Generic handler for mono operations.
*/
handleMonoOps =
	function(
		state, // current parser state
		spec   // operator spec
	)
{
	var
		ast;

	ast = state.ast;

	if( ast )
	{
		throw new Error(
			'FIXME cannot do postfix ops'
		);
	}

	state = state.advance( null, spec.prePrec );

	state = parseToken( state );

	state =
		state.create(
			'ast',
				spec.astCreator.create(
					'expr', state.ast
				)
		);

	return state;
};


/*
| Handler for new operations.
*/
handleNew =
	function(
		state, // current parser state
		spec   // operator spec
	)
{
	var
		ast;

	ast = state.ast;

	if( ast )
	{
		throw new Error( 'parse error' );
	}

	state = state.advance( null, spec.prePrec );

	state = parseToken( state );

	state =
		state.create(
			'ast',
				ast_new.create(
					'call', state.ast
				)
		);

	return state;
};



/*
| Handler for ( ).
|
| This can be grouping or a call.
*/
handleRoundBrackets =
	function(
		state, // current parser state
		spec   // operator spec
	)
{
	var
		call,
		ast;

	ast = state.ast;

	if( ast )
	{
		// this is a call.
		call = ast_call.create( 'func', ast );

		state = state.advance( null, spec.postPrec );

		if( state.reachedEnd )
		{
			throw new Error( 'missing ")"' );
		}

		if( state.current.type !== ')' )
		{
			// there are arguments

			for( ;; )
			{
				do
				{
					state = parseToken( state );
				}
				while(
					!state.reachedEnd
					&&
					state.current.type !== ')'
					&&
					state.current.type !== ','
				);

				if( state.reachedEnd )
				{
					throw new Error( 'missing ")"' );
				}

				if( state.ast )
				{
					call = call.addArgument( state.ast );
				}

				if( state.current.type === ')' )
				{
					// finished call
					break;
				}

				if( state.current.type === ',' )
				{
					state = state.advance( null, tokenSpecs.sequence.prePrec );

					if( state.current.type === ')' )
					{
						throw new Error( 'parser error' );
					}

					continue;
				}

				throw new Error( 'parser error' );
			}
		}

		// advances over closing bracket
		state = state.advance( call, spec.postPrec );

		return state;
	}

	// this is a grouping

	state = state.advance( null, spec.prePrec );

	state = parseToken( state );

	while( state.current.type !== ')' )
	{
		state = parseToken( state );

		if( state.reachedEnd )
		{
			throw new Error( 'missing ")"' );
		}
	}

	state =
		state.advance(
			state.ast,
			99 // tokenSpecs[ ')' ].prePrec
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
		alit,
		ast;

	ast = state.ast;

	if( !ast )
	{
		// this is an array literal
		alit = ast_arrayLiteral.create( );

		state = state.advance( null, spec.postPrec );

		if( state.reachedEnd )
		{
			throw new Error( 'missing "]"' );
		}

		if( state.current.type !== ']' )
		{
			// there are elements

			for( ;; )
			{
				do{
					state = parseToken( state );
				} while(
					!state.reachedEnd
					&&
					state.current.type !== ']'
					&&
					state.current.type !== ','
				);

				if( state.reachedEnd )
				{
					throw new Error( 'missing "]"' );
				}

				if( state.ast )
				{
					alit = alit.append( state.ast );
				}

				if( state.current.type === ']' )
				{
					// fiinished array literal
					break;
				}

				if( state.current.type === ',' )
				{
					state = state.advance( null, tokenSpecs[ ',' ].prePrec );

					if( state.current.type === ']' )
					{
						throw new Error( 'parser error' );
					}

					continue;
				}

				throw new Error( 'parser error' );
			}
		}

		// advances over closing square bracket
		state = state.advance( alit, spec.postPrec );

		return state;
	}

	state = state.advance( null, spec.prePrec );

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
			ast_member.create(
				'expr', ast,
				'member', state.ast
			),
			99 // tokenSpecs[ ')' ].prePrec
		);

	return state;
};


/*
| Generic parser error.
*/
handleParserError =
	function(
		// state // current parser state
		// spec   // operator spec
	)
{
	throw new Error( 'parser error' );
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
| Handler for numeric literals.
*/
handleNumber =
	function(
		state // current parser state
		// spec   // operator spec
	)
{
	if( state.ast !== null )
	{
		throw new Error( 'parse error' );
	}

	state =
		state.advance(
			ast_number.create( 'number', state.current.value ),
			undefined
		);

	return state;
};


/*
| Handler for string literals.
*/
handleString =
	function(
		state // current parser state
		// spec   // operator spec
	)
{
	if( state.ast !== null )
	{
		throw new Error( 'parse error' );
	}

	state =
		state.advance(
			ast_string.create( 'string', state.current.value ),
			undefined
		);

	return state;
};



/*
| Handler for string literals.
*/
handleNumber =
	function(
		state // current parser state
		// spec   // operator spec
	)
{
	if( state.ast !== null )
	{
		throw new Error( 'parse error' );
	}

	state =
		state.advance(
			ast_number.create( 'number', state.current.value ),
			undefined
		);

	return state;
};



/*
| Handler for identifiers.
*/
handleIdentifier =
	function(
		state // current parser state
		// spec   // operator spec
	)
{
	if( state.ast !== null )
	{
		throw new Error( 'parse error' );
	}

	state =
		state.advance(
			ast_var.create( 'name', state.current.value ),
			undefined
	);

	return state;
};


/*
| Token specifications.
*/
tokenSpecs = { };

tokenSpecs.identifier =
	tokenSpec.create(
		'prePrec', -1,
		'postPrec', -1,
		'handler', handleIdentifier,
		'associativity', 'n/a'
	);

tokenSpecs.number =
	tokenSpec.create(
		'prePrec', -1,
		'postPrec', -1,
		'handler', handleNumber,
		'associativity', 'n/a'
	);

tokenSpecs.string =
	tokenSpec.create(
		'prePrec', -1,
		'postPrec', -1,
		'handler', handleString,
		'associativity', 'n/a'
	);

tokenSpecs[ 'true' ] =
	tokenSpec.create(
		'prePrec', -1,
		'postPrec', -1,
		'handler', handleBooleanLiteral,
		'associativity', 'n/a'
	);

tokenSpecs[ 'false' ] =
	tokenSpec.create(
		'prePrec', -1,
		'postPrec', -1,
		'handler', handleBooleanLiteral,
		'associativity', 'n/a'
	);

tokenSpecs[ '(' ] =
	tokenSpec.create(
		'prePrec', 0,
		'postPrec', 1,
		'handler', handleRoundBrackets,
		'associativity', 'n/a'
	);

tokenSpecs[ ')' ] =
	tokenSpec.create(
		'prePrec', 1, // FIXME 99?
		'postPrec', 1,
		'handler', handlePass,
		'associativity', 'n/a'
	);

tokenSpecs[ '[' ] =
	tokenSpec.create(
		'prePrec', 1,
		'postPrec', 1,
		'handler', handleSquareBrackets,
		'associativity', 'l2r'
	);

tokenSpecs[ ']' ] =
	tokenSpec.create(
		'prePrec', 1, // 99?
		'postPrec', 1,
		'handler', handlePass,
		'associativity', 'n/a'
	);

tokenSpecs[ '.' ] =
	tokenSpec.create(
		'prePrec', 1,
		'postPrec', 1,
		'handler', handleDot,
		'associativity', 'l2r'
	);

tokenSpecs[ 'new' ] =
	tokenSpec.create(
		'prePrec', 1,
		'postPrec', 1,
		'handler', handleNew,
		'associativity', 'r2l'
	);

tokenSpecs[ '++' ] =
	tokenSpec.create(
		'prePrec', 3,
		'postPrec', 4,
		'handler', handleMonoOps,
		'astCreator', ast_preIncrement,
		// FUTURE postfixCreator
		'associativity', 'n/a'
	);

tokenSpecs[ '!' ] =
	tokenSpec.create(
		'prePrec', 4,
		'postPrec', 4,
		'handler', handleMonoOps,
		'astCreator', ast_not,
		'associativity', 'r2l'
	);

tokenSpecs[ 'delete' ] =
	tokenSpec.create(
		'prePrec', 4,
		'postPrec', 4,
		'handler', handleMonoOps,
		'astCreator', ast_delete,
		'associativity', 'r2l'
	);

tokenSpecs[ '+' ] =
	tokenSpec.create(
		'prePrec', 6,
		'postPrec', 6,
		'handler', handleDualisticOps,
		'astCreator', ast_plus,
		'associativity', 'r2l'
	);

tokenSpecs[ '<' ] =
	tokenSpec.create(
		'prePrec', 8,
		'postPrec', 8,
		'handler', handleDualisticOps,
		'astCreator', ast_lessThan,
		'associativity', 'l2r'
	);

tokenSpecs[ '>' ] =
	tokenSpec.create(
		'prePrec', 8,
		'postPrec', 8,
		'handler', handleDualisticOps,
		'astCreator', ast_greaterThan,
		'associativity', 'l2r'
	);

tokenSpecs[ '===' ] =
	tokenSpec.create(
		'prePrec', 9,
		'postPrec', 9,
		'handler', handleDualisticOps,
		'astCreator', ast_equals,
		'associativity', 'l2r'
	);

tokenSpecs[ '!==' ] =
	tokenSpec.create(
		'prePrec', 9,
		'postPrec', 9,
		'handler', handleDualisticOps,
		'astCreator', ast_differs,
		'associativity', 'l2r'
	);

tokenSpecs[ 'instanceof' ] =
	tokenSpec.create(
		'prePrec', 11,
		'postPrec', 11,
		'handler', handleDualisticOps,
		'astCreator', ast_instanceof,
		'associativity', 'l2r'
	);

tokenSpecs[ '&&' ] =
	tokenSpec.create(
		'prePrec', 13,
		'postPrec', 13,
		'handler', handleDualisticOps,
		'astCreator', ast_and,
		'associativity', 'l2r'
	);

tokenSpecs[ '||' ] =
	tokenSpec.create(
		'prePrec', 14,
		'postPrec', 14,
		'handler', handleDualisticOps,
		'astCreator', ast_or,
		'associativity', 'l2r'
	);

tokenSpecs[ '=' ] =
	tokenSpec.create(
		'prePrec', 16,
		'postPrec', 16,
		'handler', handleDualisticOps,
		'astCreator', ast_assign,
		'associativity', 'r2l'
	);

tokenSpecs[ '+=' ] =
	tokenSpec.create(
		'prePrec', 16,
		'postPrec', 16,
		'handler', handleDualisticOps,
		'astCreator', ast_plusAssign,
		'associativity', 'r2l'
	);

/*
| This is a phony token that ought to never come from lexer
| used to differencate ',' operator from ',' sequences
*/
tokenSpecs.sequence =
	tokenSpec.create(
		'prePrec', 18,
		'postPrec', 18,
		'handler', handleParserError,
		'associativity', 'l2r'
	);

tokenSpecs[ ',' ] =
	tokenSpec.create(
		'prePrec', 19,
		'postPrec', 19,
		'handler', handleDualisticOps,
		'astCreator', ast_comma,
		'associativity', 'l2r'
	);


/*
| Parses a token at pos from a tokenRay.
*/
parseToken =
	function(
		state
	)
{
	var
		prec,
		curSpec,
		nextSpec;

	prec = state.prec;

	curSpec = tokenSpecs[ state.current.type ];

	state = curSpec.handler( state, curSpec );

	if( !state.reachedEnd )
	{
		nextSpec = tokenSpecs[ state.current.type ];

		if(
			(
				nextSpec.prec( state.ast ) < prec
				|| (
					nextSpec.prec( state.ast ) === prec
//					&& nextSpec.associativity === 'r2l'
				)
			)
			&& curSpec.handler !== handlePass
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
