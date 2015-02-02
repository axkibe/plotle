/*
| A partial parser for javascript.
|
| This parser must not use ast-shorthands,
| because these are using the parser.
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
	ast_objLiteral,
	ast_or,
	ast_plus,
	ast_plusAssign,
	ast_preIncrement,
	ast_string,
	ast_var,
	getSpec,
	jools,
	jsParser_spec,
	lexer,
	handleBooleanLiteral,
	handleDot,
	handleDualisticOps,
	handleMonoOps,
	handleNew,
	handleNumber,
	handleIdentifier,
	handleObjectLiteral,
	handleParserError,
	handlePass,
	handleRoundBrackets,
	handleString,
	handleSquareBrackets,
	parseToken,
	state,
	leftSpecs,
	rightSpecs;


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

ast_objLiteral = require( '../ast/objLiteral' );

ast_or = require( '../ast/or' );

ast_plus = require( '../ast/plus' );

ast_plusAssign = require( '../ast/plusAssign' );

ast_preIncrement = require( '../ast/preIncrement' );

ast_string = require( '../ast/string' );

ast_var = require( '../ast/var' );

jools = require( '../jools/jools' );

lexer = require( '../jsLexer/lexer' );

state = require( './state' );

jsParser_spec = require( './spec' );


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
		state.create(
			'ast', ast_boolean.create( 'boolean', bool ),
			'pos', state.pos + 1
		);

	return state;
};


/*
| Handler for dots.
*/
handleDot =
	function(
		state // current parser state
		// spec   // operator spec
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
		state.create(
			'ast',
				ast_dot.create(
					'expr', state.ast,
					'member', name.value
				),
			'pos', state.pos + 2
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

	state =
		state.create(
			'ast', null,
			'pos', state.pos + 1
		);

	state = parseToken( state, spec );

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

	state =
		state.create(
			'ast', null,
			'pos', state.pos + 1
		);

	state = parseToken( state, spec );

	state =
		state.create(
			'ast', spec.astCreator.create( 'expr', state.ast )
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

	state =
		state.create(
			'ast', null,
			'pos', state.pos + 1
		);

	state = parseToken( state, spec );

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

		state =
			state.create(
				'ast', null,
				'pos', state.pos + 1
			);

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
					state = parseToken( state, spec );
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
					state =
						state.create(
							'ast', null,
							'pos', state.pos + 1
						);

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
		state =
			state.create(
				'ast', call,
				'pos', state.pos + 1
			);

		return state;
	}

	// this is a grouping

	state =
		state.create(
			'ast', null,
			'pos', state.pos + 1
		);

	state = parseToken( state, spec );

	while( state.current.type !== ')' )
	{
		state = parseToken( state, spec );

		if( state.reachedEnd )
		{
			throw new Error( 'missing ")"' );
		}
	}

	state = state.create( 'pos', state.pos + 1 );

	return state;
};


/*
| Handler for { } Object literals
*/
handleObjectLiteral =
	function(
		state // current parser state
		// spec   // operator spec
	)
{
	var
		olit,
		ast;

	ast = state.ast;

	if( ast )
	{
		throw new Error( 'parser error' );
	}

	// this is an array literal
	olit = ast_objLiteral.create( );

	state =
		state.create(
			'ast', null,
			'pos', state.pos + 1
		);

	if( state.reachedEnd )
	{
		throw new Error( 'missing "}"' );
	}

	if( state.current.type !== '}' )
	{
		// FUTURE cannot handle element currently
		throw new Error( );
	}

	// advances over closing square bracket
	state =
		state.create(
			'ast', olit,
			'pos', state.pos + 1
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

		state =
			state.create(
				'ast', null,
				'pos', state.pos + 1
			);

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
					state = parseToken( state, spec );
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
					state =
						state.create(
							'ast', null,
							'pos', state.pos + 1
						);

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
		state =
			state.create(
				'ast', alit,
				'pos', state.pos + 1
			);

		return state;
	}

	state =
		state.create(
			'ast', null,
			'pos', state.pos + 1
		);

	state = parseToken( state, spec );

	while( state.current.type !== ']' )
	{
		state = parseToken( state, spec );

		if( state.reachedEnd )
		{
			throw new Error( );
		}
	}

	state =
		state.create(
			'ast',
				ast_member.create(
					'expr', ast,
					'member', state.ast
				),
			'pos', state.pos + 1
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
| Handler for string literals.
*/
handleString =
	function(
		state // current parser state
		// spec   // operator spec
	)
{
	state =
		state.create(
			'ast', ast_string.create( 'string', state.current.value ),
			'pos', state.pos + 1
		);

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
	state =
		state.create(
			'ast', ast_number.create( 'number', state.current.value ),
			'pos', state.pos + 1
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
	state =
		state.create(
			'ast', ast_var.create( 'name', state.current.value ),
			'pos', state.pos + 1
		);

	return state;
};


/*
| Left token specifications for unary operants.
| They are consulted when the current parse buffer is empty.
*/
leftSpecs = { };

leftSpecs.identifier =
	jsParser_spec.create(
		'prec', -1,
		'handler', handleIdentifier,
		'associativity', 'n/a'
	);

leftSpecs.number =
	jsParser_spec.create(
		'prec', -1,
		'handler', handleNumber,
		'associativity', 'n/a'
	);

leftSpecs.string =
	jsParser_spec.create(
		'prec', -1,
		'handler', handleString,
		'associativity', 'n/a'
	);

leftSpecs[ 'true' ] =
	jsParser_spec.create(
		'prec', -1,
		'handler', handleBooleanLiteral,
		'associativity', 'n/a'
	);

leftSpecs[ 'false' ] =
	jsParser_spec.create(
		'prec', -1,
		'handler', handleBooleanLiteral,
		'associativity', 'n/a'
	);

leftSpecs[ '[' ] =
	jsParser_spec.create(
		'prec', 1,
		'handler', handleSquareBrackets, // FIXME handleArrayLit
		'associativity', 'l2r'
	);

leftSpecs[ '{' ] =
	jsParser_spec.create(
		'prec', -1,
		'handler', handleObjectLiteral,
		'associativity', 'n/a'
	);

leftSpecs[ '(' ] =
	jsParser_spec.create(
		'prec', 0,
		'handler', handleRoundBrackets,
		'associativity', 'l2r'
	);

leftSpecs[ 'new' ] =
	jsParser_spec.create(
		'prec', 2,
		'handler', handleNew,
		'associativity', 'r2l'
	);

leftSpecs[ '++' ] =
	jsParser_spec.create(
		'prec', 3,
		'handler', handleMonoOps,
		'astCreator', ast_preIncrement,
		'associativity', 'n/a'
	);

leftSpecs[ '!' ] =
	jsParser_spec.create(
		'prec', 4,
		'handler', handleMonoOps,
		'astCreator', ast_not,
		'associativity', 'r2l'
	);

leftSpecs[ 'delete' ] =
	jsParser_spec.create(
		'prec', 4,
		'handler', handleMonoOps,
		'astCreator', ast_delete,
		'associativity', 'r2l'
	);

/*
| This is a phony token that ought to never come from lexer
| used to differencate ',' operator from ',' sequences
| FIXME check if needed
*/
leftSpecs.sequence =
	jsParser_spec.create(
		'prec', 18,
		'handler', handleParserError,
		'associativity', 'l2r'
	);

leftSpecs[ ',' ] =
	jsParser_spec.create(
		'prec', 19,
		'handler', handleDualisticOps,
		'astCreator', ast_comma,
		'associativity', 'l2r'
	);

// phony spec that cannot be created
// by lexer denoting start of parsing
leftSpecs.start =
	jsParser_spec.create(
		'prec', 99,
		'handler', handleParserError,
		'associativity', 'n/a'
	);


/*
| Right token specifications for unary operants.
| They are consulted when the current parse buffer is empty.
*/
rightSpecs = { };

rightSpecs[ '(' ] =
	jsParser_spec.create(
		'prec', 1,
		'handler', handleRoundBrackets,
		'associativity', 'l2r'
	);

rightSpecs[ ')' ] =
	jsParser_spec.create(
		'prec', 98,
		'handler', handlePass,
		'associativity', 'n/a'
	);

rightSpecs[ '[' ] =
	jsParser_spec.create(
		'prec', 1,
		'handler', handleSquareBrackets, // FIXME handleMember
		'associativity', 'l2r'
	);

rightSpecs[ ']' ] =
	jsParser_spec.create(
		'prec', 1, // 98?
		'handler', handlePass,
		'associativity', 'n/a'
	);

rightSpecs[ '.' ] =
	jsParser_spec.create(
		'prec', 1,
		'handler', handleDot,
		'associativity', 'l2r'
	);

rightSpecs[ '+' ] =
	jsParser_spec.create(
		'prec', 6,
		'handler', handleDualisticOps,
		'astCreator', ast_plus,
		'associativity', 'l2r'
	);

rightSpecs[ '<' ] =
	jsParser_spec.create(
		'prec', 8,
		'handler', handleDualisticOps,
		'astCreator', ast_lessThan,
		'associativity', 'l2r'
	);

rightSpecs[ '>' ] =
	jsParser_spec.create(
		'prec', 8,
		'handler', handleDualisticOps,
		'astCreator', ast_greaterThan,
		'associativity', 'l2r'
	);

rightSpecs[ '===' ] =
	jsParser_spec.create(
		'prec', 9,
		'handler', handleDualisticOps,
		'astCreator', ast_equals,
		'associativity', 'l2r'
	);

rightSpecs[ '!==' ] =
	jsParser_spec.create(
		'prec', 9,
		'handler', handleDualisticOps,
		'astCreator', ast_differs,
		'associativity', 'l2r'
	);

rightSpecs[ 'instanceof' ] =
	jsParser_spec.create(
		'prec', 11,
		'handler', handleDualisticOps,
		'astCreator', ast_instanceof,
		'associativity', 'l2r'
	);

rightSpecs[ '&&' ] =
	jsParser_spec.create(
		'prec', 13,
		'handler', handleDualisticOps,
		'astCreator', ast_and,
		'associativity', 'l2r'
	);

rightSpecs[ '||' ] =
	jsParser_spec.create(
		'prec', 14,
		'handler', handleDualisticOps,
		'astCreator', ast_or,
		'associativity', 'l2r'
	);

rightSpecs[ '=' ] =
	jsParser_spec.create(
		'prec', 16,
		'handler', handleDualisticOps,
		'astCreator', ast_assign,
		'associativity', 'r2l'
	);

rightSpecs[ '+=' ] =
	jsParser_spec.create(
		'prec', 16,
		'handler', handleDualisticOps,
		'astCreator', ast_plusAssign,
		'associativity', 'r2l'
	);

/*
| This is a phony token that ought to never come from lexer
| used to differencate ',' operator from ',' sequences
|
| FIXME check if needed
*/
rightSpecs.sequence =
	jsParser_spec.create(
		'prec', 18,
		'handler', handleParserError,
		'associativity', 'l2r'
	);

rightSpecs[ ',' ] =
	jsParser_spec.create(
		'prec', 19,
		'handler', handleDualisticOps,
		'astCreator', ast_comma,
		'associativity', 'l2r'
	);

// phony spec that cannot be created
// by lexer denoting start of parsing
rightSpecs.start =
	jsParser_spec.create(
		'prec', 98,
		'handler', handleParserError,
		'associativity', 'n/a'
	);


/*
| Returns the spec for a state
*/
getSpec =
	function(
		ast,
		token
	)
{
	var
		spec;

	if( ast === null )
	{
		spec = leftSpecs[ token.type ];
	}
	else
	{
		spec = rightSpecs[ token.type ];
	}

	if( !spec )
	{
		throw new Error( 'unexpected ' + token.type );
	}

	return spec;
};


/*
| Parses a token at pos from a tokenRay.
*/
parseToken =
	function(
		state,
		spec
	)
{
	var
		curState,
		nextSpec,
		tokenSpec;

	curState = state;

	tokenSpec = getSpec( state.ast, state.current );

//	console.log( 'H>', state.current.type, state.current.value, tokenSpec.prec );

	state = tokenSpec.handler( state, tokenSpec );

//	console.log( '<H', state.ast );

	while( !state.reachedEnd )
	{
		nextSpec = getSpec( state.ast, state.current );

//		console.log( 'C', curState.current.type, curState.current.value || '', spec.prec );
//		console.log( 'N', state.current.type, state.current.value || '', nextSpec.prec );

		if(
			nextSpec.prec > spec.prec
			||
			(
				nextSpec.prec === spec.prec
				&&
				spec.associativity === 'l2r'
			)
			||
			nextSpec.handler === handlePass
		)
		{
			break;
		}

				/*
				|| (
					nextSpec.prec === curState.spec.prec
					&&
					curState.spec.associativity === 'r2l'
				)
				*/
			//&& curState.spec.handler !== handlePass
			//&& spec.handler !== handlePass

//		console.log( '->' );

		state = parseToken( state, nextSpec );

//		console.log( '<-' );
	}

//	console.log( '' );

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
			'ast', null
		);

		st = parseToken( st, leftSpecs.start );

	if( !st.reachedEnd )
	{
		throw new Error( 'internal fail, premature end' );
	}

	return st.ast;
};


} )( );
