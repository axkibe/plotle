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
	ast_differs,
	ast_dot,
	ast_equals,
	ast_greaterThan,
	ast_lessThan,
	ast_member,
	ast_not,
	ast_number,
	ast_or,
	ast_plus,
	ast_preIncrement,
	ast_string,
	ast_var,
	jools,
	lexer,
	handleBooleanLiteral,
	handleDot,
	handleDualisticOps,
	handleMonoOps,
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


ast_and = require( '../ast/ast-and' );

ast_arrayLiteral = require( '../ast/ast-array-literal' );

ast_assign = require( '../ast/ast-assign' );

ast_boolean = require( '../ast/ast-boolean' );

ast_call = require( '../ast/ast-call' );

ast_differs = require( '../ast/ast-differs' );

ast_dot = require( '../ast/ast-dot' );

ast_equals = require( '../ast/ast-equals' );

ast_greaterThan = require( '../ast/ast-greater-than' );

ast_lessThan = require( '../ast/ast-less-than' );

ast_member = require( '../ast/ast-member' );

ast_not = require( '../ast/ast-not' );

ast_number = require( '../ast/ast-number' );

ast_or = require( '../ast/ast-or' );

ast_plus = require( '../ast/ast-plus' );

ast_preIncrement = require( '../ast/ast-pre-increment' );

ast_string = require( '../ast/ast-string' );

ast_var = require( '../ast/ast-var' );

jools = require( '../jools/jools' );

lexer = require( '../js-lexer/lexer' );

state = require( './state' );

tokenSpec = require( './token-spec' );


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
				do{
					state = parseToken( state );
				} while(
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
					// fiinished call
					break;
				}

				if( state.current.type === ',' )
				{
					state = state.advance( null, tokenSpecs[ ',' ].prePrec );

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

tokenSpecs.number =
	tokenSpec.create(
		'prePrec', -1,
		'postPrec', -1,
		'handler', handleNumber
	);

tokenSpecs.string =
	tokenSpec.create(
		'prePrec', -1,
		'postPrec', -1,
		'handler', handleString
	);

tokenSpecs.identifier =
	tokenSpec.create(
		'prePrec', -1,
		'postPrec', -1,
		'handler', handleIdentifier
	);

tokenSpecs[ 'true' ] =
	tokenSpec.create(
		'prePrec', -1,
		'postPrec', -1,
		'handler', handleBooleanLiteral
	);

tokenSpecs[ 'false' ] =
	tokenSpec.create(
		'prePrec', -1,
		'postPrec', -1,
		'handler', handleBooleanLiteral
	);

tokenSpecs[ '(' ] =
	tokenSpec.create(
		'prePrec', 0,
		'postPrec', 1,
		'handler', handleRoundBrackets
	);

tokenSpecs[ ')' ] =
	tokenSpec.create(
		'prePrec', 1, // FIXME 99?
		'postPrec', 1,
		'handler', handlePass
	);

tokenSpecs[ '[' ] =
	tokenSpec.create(
		'prePrec', 1,
		'postPrec', 1,
		'handler', handleSquareBrackets
	);

tokenSpecs[ ']' ] =
	tokenSpec.create(
		'prePrec', 1, // FIXME 99?
		'postPrec', 1,
		'handler', handlePass
	);

tokenSpecs[ '.' ] =
	tokenSpec.create(
		'prePrec', 1,
		'postPrec', 1,
		'handler', handleDot
	);

tokenSpecs[ '++' ] =
	tokenSpec.create(
		'prePrec', 3,
		'postPrec', 4,
		'handler', handleMonoOps,
		'astCreator', ast_preIncrement
		// FUTURE postfixCreator
	);

tokenSpecs[ '!' ] =
	tokenSpec.create(
		'prePrec', 4,
		'postPrec', 4,
		'handler', handleMonoOps,
		'astCreator', ast_not
	);

tokenSpecs[ '+' ] =
	tokenSpec.create(
		'prePrec', 6,
		'postPrec', 6,
		'handler', handleDualisticOps,
		'astCreator', ast_plus
	);

tokenSpecs[ '<' ] =
	tokenSpec.create(
		'prePrec', 8,
		'postPrec', 8,
		'handler', handleDualisticOps,
		'astCreator', ast_lessThan
	);

tokenSpecs[ '>' ] =
	tokenSpec.create(
		'prePrec', 8,
		'postPrec', 8,
		'handler', handleDualisticOps,
		'astCreator', ast_greaterThan
	);

tokenSpecs[ '===' ] =
	tokenSpec.create(
		'prePrec', 9,
		'postPrec', 9,
		'handler', handleDualisticOps,
		'astCreator', ast_equals
	);

tokenSpecs[ '!==' ] =
	tokenSpec.create(
		'prePrec', 9,
		'postPrec', 9,
		'handler', handleDualisticOps,
		'astCreator', ast_differs
	);

tokenSpecs[ '&&' ] =
	tokenSpec.create(
		'prePrec', 13,
		'postPrec', 13,
		'handler', handleDualisticOps,
		'astCreator', ast_and
	);

tokenSpecs[ '||' ] =
	tokenSpec.create(
		'prePrec', 14,
		'postPrec', 14,
		'handler', handleDualisticOps,
		'astCreator', ast_or
	);

tokenSpecs[ '=' ] =
	tokenSpec.create(
		'prePrec', 16,
		'postPrec', 16,
		'handler', handleDualisticOps,
		'astCreator', ast_assign
	);

tokenSpecs[ ',' ] =
	tokenSpec.create(
		'prePrec', 19,
		'postPrec', 19,
		'handler', handleParserError // FIXME comma sequence
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
		spec;

	prec = state.prec;

	spec = tokenSpecs[ state.current.type ];

	state = spec.handler( state, spec );

	if(
		!state.reachedEnd
		&&
		tokenSpecs[ state.current.type ].prec( state.ast ) < prec
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
