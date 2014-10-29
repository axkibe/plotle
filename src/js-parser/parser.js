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
	astCall,
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
	astString,
	astOr,
	astVar,
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


astAnd = require( '../ast/ast-and' );

astAssign = require( '../ast/ast-assign' );

astBoolean = require( '../ast/ast-boolean' );

astCall = require( '../ast/ast-call' );

astDiffers = require( '../ast/ast-differs' );

astDot = require( '../ast/ast-dot' );

astEquals = require( '../ast/ast-equals' );

astGreaterThan = require( '../ast/ast-greater-than' );

astLessThan = require( '../ast/ast-less-than' );

astMember = require( '../ast/ast-member' );

astNot = require( '../ast/ast-not' );

astNumber = require( '../ast/ast-number' );

astOr = require( '../ast/ast-or' );

astPlus = require( '../ast/ast-plus' );

astPreIncrement = require( '../ast/ast-pre-increment' );

astString = require( '../ast/ast-string' );

astVar = require( '../ast/ast-var' );

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
			astBoolean.create( 'boolean', bool ),
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
			astDot.create(
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
		call = astCall.create( 'func', ast );
			
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
		ast;

	ast = state.ast;

	if( !ast )
	{
		throw new Error( );
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
			astMember.create(
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
			astNumber.create( 'number', state.current.value ),
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
			astString.create( 'string', state.current.value ),
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
			astNumber.create( 'number', state.current.value ),
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
			astVar.create( 'name', state.current.value ),
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
		'astCreator', astPreIncrement
		// FUTURE postfixCreator
	);

tokenSpecs[ '!' ] =
	tokenSpec.create(
		'prePrec', 4,
		'postPrec', 4,
		'handler', handleMonoOps,
		'astCreator', astNot
	);

tokenSpecs[ '+' ] =
	tokenSpec.create(
		'prePrec', 6,
		'postPrec', 6,
		'handler', handleDualisticOps,
		'astCreator', astPlus
	);

tokenSpecs[ '<' ] =
	tokenSpec.create(
		'prePrec', 8,
		'postPrec', 8,
		'handler', handleDualisticOps,
		'astCreator', astLessThan
	);

tokenSpecs[ '>' ] =
	tokenSpec.create(
		'prePrec', 8,
		'postPrec', 8,
		'handler', handleDualisticOps,
		'astCreator', astGreaterThan
	);

tokenSpecs[ '===' ] =
	tokenSpec.create(
		'prePrec', 9,
		'postPrec', 9,
		'handler', handleDualisticOps,
		'astCreator', astEquals
	);

tokenSpecs[ '!==' ] =
	tokenSpec.create(
		'prePrec', 9,
		'postPrec', 9,
		'handler', handleDualisticOps,
		'astCreator', astDiffers
	);

tokenSpecs[ '&&' ] =
	tokenSpec.create(
		'prePrec', 13,
		'postPrec', 13,
		'handler', handleDualisticOps,
		'astCreator', astAnd
	);

tokenSpecs[ '||' ] =
	tokenSpec.create(
		'prePrec', 14,
		'postPrec', 14,
		'handler', handleDualisticOps,
		'astCreator', astOr
	);

tokenSpecs[ '=' ] =
	tokenSpec.create(
		'prePrec', 16,
		'postPrec', 16,
		'handler', handleDualisticOps,
		'astCreator', astAssign
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
