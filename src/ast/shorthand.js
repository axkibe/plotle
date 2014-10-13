/*
| Various shorthands for abstract syntax trees.
|
| Authors: Axel Kittenberger
*/


var
	shorthand;

shorthand =
module.exports =
	{ };


/*
| Capsule
*/
(function() {
'use strict';


var
	astAnd,
	astArrayLiteral,
	astAssign,
	astBlock,
	astBooleanLiteral,
	astCall,
	astCheck,
	astCommaList,
	astComment,
	astCondition,
	astDelete,
	astDiffers,
	astDot,
	astFile,
	astEquals,
	astFunc,
	astFuncArg,
	astGreaterThan,
	astIf,
	astInstanceof,
	astLessThan,
	astMember,
	astNew,
	astNot,
	astNull,
	astNumberLiteral,
	astObjLiteral,
	astOr,
	astPlus,
	astPlusAssign,
	astPreIncrement,
	astString,
	astSwitch,
	astTypeof,
	astVar,
	astVarDec,
	astVList;


astAnd = require( './ast-and' );

astArrayLiteral = require( './ast-array-literal' );

astAssign = require( './ast-assign' );

astBlock = require( './ast-block' );

astBooleanLiteral = require( './ast-boolean-literal' );

astCall = require( './ast-call' );

astCheck = require( './ast-check' );

astCommaList = require( './ast-comma-list' );

astComment = require( './ast-comment' );

astCondition = require( './ast-condition' );

astDelete = require( './ast-delete' );

astDiffers = require( './ast-differs' );

astDot = require( './ast-dot' );

astFile = require( './ast-file' );

astEquals = require( './ast-equals' );

astFunc = require( './ast-func' );

astFuncArg = require( './ast-func-arg' );

astGreaterThan = require( './ast-greater-than' );

astIf = require( './ast-if' );

astInstanceof = require( './ast-instanceof' );

astLessThan = require( './ast-less-than' );

astMember = require( './ast-member' );

astNew = require( './ast-new' );

astNot = require( './ast-not' );

astNull = require( './ast-null' );

astNumberLiteral = require( './ast-number-literal' );

astObjLiteral = require( './ast-obj-literal' );

astOr = require( './ast-or' );

astPlus = require( './ast-plus' );

astPlusAssign = require( './ast-plus-assign' );

astPreIncrement = require( './ast-pre-increment' );

astString = require( './ast-string' );

astSwitch = require( './ast-switch' );

astTypeof = require( './ast-typeof' );

astVar = require( './ast-var' );

astVarDec = require( './ast-var-dec' );

astVList = require( './ast-vlist' );


/*
| Shorthand for creating ands.
*/
shorthand.astAnd =
	function(
		left,
		right
		// or more
	)
{
	var
		args;

	if( arguments.length > 2 )
	{
		args = Array.prototype.slice.call( arguments );

		args.splice(
			0,
			2,
			astAnd.create(
				'left',
					left,
				'right',
					right
			)
		);

		return(
			shorthand.astAnd.apply(
				this,
				args
			)
		);
	}

	return(
		astAnd.create(
			'left',
				left,
			'right',
				right
		)
	);
};


/*
| Shorthand for creating array literals.
*/
shorthand.astArrayLiteral =
	function( )
{
	return astArrayLiteral.create( );
};


/*
| Shorthand for creating assignments.
*/
shorthand.astAssign =
	function(
		left,
		right
	)
{
	return(
		astAssign.create(
			'left',
				left,
			'right',
				right
		)
	);
};


/*
| Shorthand for creating blocks.
*/
shorthand.astBlock =
	function( )
{
	return astBlock.create( );
};


/*
| Shorthand for creating number boolean literals.
*/
shorthand.astBoolean =
	function(
		value
	)
{
	return astBooleanLiteral.create( 'boolean', value );
};



/*
| Shorthand for creating calls.
*/
shorthand.astCall =
	function(
		func
		// args
	)
{
	var
		call;

	call = astCall.create( 'func', func );

	for(
		var a = 1, aZ = arguments.length;
		a < aZ;
		a++
	)
	{
		call = call.append( arguments[ a ] );
	}

	return call;
};


/*
| Shorthand for creating conditions.
*/
shorthand.astCondition =
	function(
		condition,
		then,
		elsewise
	)
{
	return(
		astCondition.create(
			'condition',
				condition,
			'then',
				then,
			'elsewise',
				elsewise
		)
	);
};


/*
| Shorthand for creating differs.
*/
shorthand.astDiffers =
	function(
		left,
		right
	)
{
	return(
		astDiffers.create(
			'left',
				left,
			'right',
				right
		)
	);
};


/*
| Shorthand for creating delete calls.
*/
shorthand.astDelete =
	function(
		expr
	)
{
	return astDelete.create( 'expr', expr );
};


/*
| Shorthand for creating dots.
*/
shorthand.astDot =
	function(
		expr,
		member
	)
{
	return(
		astDot.create(
			'expr',
				expr,
			'member',
				member
		)
	);
};


/*
| Shorthand for creating equals.
*/
shorthand.astEquals =
	function(
		left,
		right
	)
{
	return(
		astEquals.create(
			'left',
				left,
			'right',
				right
		)
	);
};


/*
| Shorthand for creating less-than comparisons.
*/
shorthand.astLessThan =
	function(
		left,
		right
	)
{
	return(
		astLessThan.create(
			'left',
				left,
			'right',
				right
		)
	);
};


/*
| Shorthand for creating greater-than comparisons.
*/
shorthand.astGreaterThan =
	function(
		left,
		right
	)
{
	return(
		astGreaterThan.create(
			'left',
				left,
			'right',
				right
		)
	);
};


/*
| Shorthand for creating ifs.
*/
shorthand.astIf =
	function(
		condition,
		then,
		elsewise
	)
{
	return(
		astIf.create(
			'condition',
				condition,
			'then',
				then,
			'elsewise',
				elsewise || null
		)
	);
};


/*
| Shorthand for creating files.
*/
shorthand.astFile =
	function( )
{
	return astFile.create( );
};


/*
| Shorthand for creating functions.
*/
shorthand.astFunc =
	function(
		block
	)
{
	return astFunc.create( 'block', block || null );
};


/*
| Shorthand for creating instanceof expressions.
*/
shorthand.astInstanceof =
	function(
		left,
		right
	)
{
	return(
		astInstanceof.create(
			'left',
				left,
			'right',
				right
		)
	);
};



/*
| Shorthand for creating members.
*/
shorthand.astMember =
	function(
		expr,
		member
	)
{
	return(
		astMember.create(
			'expr',
				expr,
			'member',
				member
		)
	);
};


/*
| Shorthand for creating new calls.
*/
shorthand.astNew =
	function(
		call
	)
{
	return astNew.create( 'call', call );
};


/*
| Shorthand for creating negations.
*/
shorthand.astNot =
	function(
		expr
	)
{
	return astNot.create( 'expr', expr );
};


/*
| Shorthand for creating nulls.
*/
shorthand.astNull =
	function( )
{
	return astNull.create( );
};


/*
| Shorthand for creating number literals.
*/
shorthand.astNumberLiteral =
	function(
		number
	)
{
	return astNumberLiteral.create( 'number', number );
};


/*
| Shorthand for creating object literals.
*/
shorthand.astObjLiteral =
	function( )
{
	return astObjLiteral.create( );
};


/*
| Shorthand for creating ors.
*/
shorthand.astOr =
	function(
		left,
		right
		// or more
	)
{
	var
		args;

	if( arguments.length > 2 )
	{
		args = Array.prototype.slice.call( arguments );

		args.splice(
			0,
			2,
			astOr.create(
				'left',
					left,
				'right',
					right
			)
		);

		return(
			shorthand.astOr.apply(
				this,
				args
			)
		);
	}

	return(
		astOr.create(
			'left',
				left,
			'right',
				right
		)
	);
};


/*
| Shorthand for creating pluses.
*/
shorthand.astPlus =
	function(
		left,
		right
		// or more
	)
{
	var
		args;

	if( arguments.length > 2 )
	{
		args = Array.prototype.slice.call( arguments );

		args.splice(
			0,
			2,
			astPlus.create(
				'left',
					left,
				'right',
					right
			)
		);

		return(
			shorthand.astPlus.apply(
				this,
				args
			)
		);
	}

	return(
		astPlus.create(
			'left',
				left,
			'right',
				right
		)
	);
};


/*
| Shorthand for creating plus-assignments.
*/
shorthand.astPlusAssign =
	function(
		left,
		right
	)
{
	return(
		astPlusAssign.create(
			'left',
				left,
			'right',
				right
		)
	);
};



/*
| Shorthand for creating pre-increments.
*/
shorthand.astPreIncrement =
	function(
		expr
	)
{
	return astPreIncrement.create( 'expr', expr );
};


/*
| Shorthand for creating string literals.
*/
shorthand.astString =
	function(
		string
	)
{
	return astString.create( 'string', string );
};


/*
| Shorthand for creating switch statements.
*/
shorthand.astSwitch =
	function(
		statement
	)
{
	return astSwitch.create( 'statement', statement );
};


/*
| Shorthand for creating typeofs.
*/
shorthand.astTypeof =
	function(
		expr
	)
{
	return astTypeof.create( 'expr', expr );
};



/*
| Shorthand for creating variable uses.
*/
shorthand.astVar =
	function(
		name
	)
{
	return astVar.create( 'name', name );
};


/*
| Shorthand for variable declerations.
*/
/*
shorthand.astVarDec =
	function(
		name,   // variable name
		assign  // variable assignment
	)
{
	return(
		astVarDec.create(
			'name',
				name,
			'assign',
				assign || null
		)
	);
};
*/


/*
| Shorthand for creating comma lists.
*/
shorthand.astCommaList =
	function( )
{
	return astCommaList.create( );
};



/*
| Shorthand for creating vlists.
*/
shorthand.astVList =
	function( )
{
	return astVList.create( );
};


} )( );
