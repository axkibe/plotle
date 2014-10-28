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
	handleBooleanLiteral,
	handleDot,
	handleDualisticOps,
	handleMonoOps,
	handleNumber,
	handleIdentifier,
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
			spec.prePrec,
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
			99 // tokenSpecs[ '[' ].prePrec
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
	{
		prePrec : -1,
		postPrec : -1,
		handler : handleNumber
	};

tokenSpecs.identifier =
	{
		prePrec : -1,
		postPrec : -1,
		handler : handleIdentifier
	};

tokenSpecs[ 'true' ] =
	{
		prePrec : -1,
		postPrec : -1,
		handler : handleBooleanLiteral
	};

tokenSpecs[ 'false' ] =
	{
		prePrec : -1,
		postPrec : -1,
		handler : handleBooleanLiteral
	};

tokenSpecs[ ']' ] =
	{
		prePrec : 1,
		postPrec : 1,
		handler : handlePass
	};

tokenSpecs[ '.' ] =
	{
		prePrec : 1,
		postPrec : 1,
		handler : handleDot
	};

tokenSpecs[ '[' ] =
	{
		prePrec : 1,
		postPrec : 1,
		handler : handleSquareBrackets
	};

tokenSpecs[ '++' ] =
	{
		prePrec : 3,
		postPrec : 4,
		handler : handleMonoOps,
		astCreator : astPreIncrement
		// FUTURE postfixCreator
	};

tokenSpecs[ '!' ] =
	{
		prePrec : 4,
		postPrec : 4,
		handler : handleMonoOps,
		astCreator : astNot
	};

tokenSpecs[ '+' ] =
	{
		prePrec : 6,
		postPrec : 6,
		handler : handleDualisticOps,
		astCreator : astPlus
	};

tokenSpecs[ '<' ] =
	{
		prePrec : 8,
		postPrec : 8,
		handler : handleDualisticOps,
		astCreator : astLessThan
	};

tokenSpecs[ '>' ] =
	{
		prePrec : 8,
		postPrec : 8,
		handler : handleDualisticOps,
		astCreator : astGreaterThan
	};

tokenSpecs[ '===' ] =
	{
		prePrec : 9,
		postPrec : 9,
		handler : handleDualisticOps,
		astCreator : astEquals
	};

tokenSpecs[ '!==' ] =
	{
		prePrec : 9,
		postPrec : 9,
		handler : handleDualisticOps,
		astCreator : astDiffers
	};

tokenSpecs[ '&&' ] =
	{
		prePrec : 13,
		postPrec : 13,
		handler : handleDualisticOps,
		astCreator : astAnd
	};

tokenSpecs[ '||' ] =
	{
		prePrec : 14,
		postPrec : 14,
		handler : handleDualisticOps,
		astCreator : astOr
	};

tokenSpecs[ '=' ] =
	{
		prePrec : 16,
		postPrec : 16,
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
		prec,
		spec;

	prec = state.prec;

	spec = tokenSpecs[ state.current.type ];

	state = spec.handler( state, spec );

	if(
		!state.reachedEnd
		&&
		tokenSpecs[ state.current.type ].prePrec < prec
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
