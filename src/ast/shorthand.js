/*
| Various shorthands for abstract syntax trees.
|
| FIXME lowercase ShortHand
|
| Authors: Axel Kittenberger
*/


/*
| Export.
*/
var
	ShortHand =
		{ };

/*
| Capsule
*/
(function() {
'use strict';


var
	ast;

/*
| Import
*/
ast =
	{
		anAnd :
			require( './an-and' ),
		anArrayLiteral :
			require( './an-array-literal' ),
		anAssign :
			require( './an-assign' ),
		aBlock :
			require( './a-block' ),
		aBooleanLiteral :
			require( './a-boolean-literal' ),
		aCall :
			require( './a-call' ),
		aCheck :
			require( './a-check' ),
		aCommaList :
			require( './a-comma-list' ),
		aComment :
			require( './a-comment' ),
		aCondition :
			require( './a-condition' ),
		aDelete :
			require( './a-delete' ),
		aDiffers :
			require( './a-differs' ),
		aDot :
			require( './a-dot' ),
		anEquals :
			require( './an-equals' ),
		aFile :
			require( './a-file' ),
		aFunc :
			require( './a-func' ),
		aFuncArg :
			require( './a-func-arg' ),
		aGreaterThan :
			require( './a-greater-than' ),
		anIf :
			require( './an-if' ),
		anInstanceof :
			require( './an-instanceof' ),
		aLessThan :
			require( './a-less-than' ),
		aMember :
			require( './a-member' ),
		aNew :
			require( './a-new' ),
		aNot :
			require( './a-not' ),
		aNull :
			require( './a-null' ),
		aNumberLiteral :
			require( './a-number-literal' ),
		anObjLiteral :
			require( './an-obj-literal' ),
		anOr :
			require( './an-or' ),
		aPlus :
			require( './a-plus' ),
		aPlusAssign :
			require( './a-plus-assign' ),
		aPreIncrement :
			require( './a-pre-increment' ),
		aStringLiteral :
			require( './a-string-literal' ),
		aSwitch :
			require( './a-switch' ),
		aTypeof :
			require( './a-typeof' ),
		aVar :
			require( './a-var' ),
		aVarDec :
			require( './a-var-dec' ),
		aVList :
			require( './a-vlist' )
	};


/*
| Shorthand for creating ands.
*/
ShortHand.anAnd =
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
			ast.anAnd.create(
				'left',
					left,
				'right',
					right
			)
		);

		return (
			ShortHand.anAnd.apply(
				this,
				args
			)
		);
	}

	return (
		ast.anAnd.create(
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
ShortHand.anArrayLiteral =
	function( )
{
	return ast.anArrayLiteral.create( );
};


/*
| Shorthand for creating assignments.
*/
ShortHand.anAssign =
	function(
		left,
		right
	)
{
	return (
		ast.anAssign.create(
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
ShortHand.aBlock =
	function( )
{
	return ast.aBlock.create( );
};


/*
| Shorthand for creating calls.
*/
ShortHand.aCall =
	function(
		func
		// args
	)
{
	var
		call =
			ast.aCall.create(
				'func',
					func
			);

	for(
		var a = 1, aZ = arguments.length;
		a < aZ;
		a++
	)
	{
		call = call.Append( arguments[ a ] );
	}

	return call;
};


/*
| Shorthand for creating conditions.
*/
ShortHand.aCondition =
	function(
		condition,
		then,
		elsewise
	)
{
	return (
		ast.aCondition.create(
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
ShortHand.aDiffers =
	function(
		left,
		right
	)
{
	return (
		ast.aDiffers.create(
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
ShortHand.aDelete =
	function(
		expr
	)
{
	return (
		ast.aDelete.create(
			'expr',
				expr
		)
	);
};


/*
| Shorthand for creating dots.
*/
ShortHand.aDot =
	function(
		expr,
		member
	)
{
	return (
		ast.aDot.create(
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
ShortHand.anEquals =
	function(
		left,
		right
	)
{
	return (
		ast.anEquals.create(
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
ShortHand.aLessThan =
	function(
		left,
		right
	)
{
	return (
		ast.aLessThan.create(
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
ShortHand.aGreaterThan =
	function(
		left,
		right
	)
{
	return (
		ast.aGreaterThan.create(
			'left',
				left,
			'right',
				right
		)
	);
};


/*
| Shorthand for creating number false boolean literal.
*/
ShortHand.False =
	function( )
{
	return (
		ast.aBooleanLiteral.create(
			'boolean',
				false
		)
	);
};


/*
| Shorthand for creating ifs.
*/
ShortHand.anIf =
	function(
		condition,
		then,
		elsewise
	)
{
	return (
		ast.anIf.create(
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
ShortHand.aFile =
	function( )
{
	return ast.aFile.create( );
};


/*
| Shorthand for creating functions.
*/
ShortHand.aFunc =
	function(
		block
	)
{
	return (
		ast.aFunc.create(
			'block',
				block || null
		)
	);
};


/*
| Shorthand for creating instanceof expressions.
*/
ShortHand.anInstanceof =
	function(
		left,
		right
	)
{
	return (
		ast.anInstanceof.create(
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
ShortHand.aMember =
	function(
		expr,
		member
	)
{
	return (
		ast.aMember.create(
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
ShortHand.aNew =
	function(
		call
	)
{
	return (
		ast.aNew.create(
			'call',
				call
		)
	);
};


/*
| Shorthand for creating negations.
*/
ShortHand.aNot =
	function(
		expr
	)
{
	return (
		ast.aNot.create(
			'expr',
				expr
		)
	);
};


/*
| Shorthand for creating nulls.
*/
ShortHand.aNull =
	function( )
{
	return ast.aNull.create( );
};


/*
| Shorthand for creating number literals.
*/
ShortHand.aNumberLiteral =
	function(
		number
	)
{
	return (
		ast.aNumberLiteral.create(
			'number',
				number
		)
	);
};


/*
| Shorthand for creating object literals.
*/
ShortHand.anObjLiteral =
	function( )
{
	return ast.anObjLiteral.create( );
};


/*
| Shorthand for creating ors.
*/
ShortHand.anOr =
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
			ast.anOr.create(
				'left',
					left,
				'right',
					right
			)
		);

		return (
			ShortHand.anOr.apply(
				this,
				args
			)
		);
	}

	return (
		ast.anOr.create(
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
ShortHand.aPlus =
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
			ast.aPlus.create(
				'left',
					left,
				'right',
					right
			)
		);

		return (
			ShortHand.aPlus.apply(
				this,
				args
			)
		);
	}

	return (
		ast.aPlus.create(
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
ShortHand.aPlusAssign =
	function(
		left,
		right
	)
{
	return (
		ast.aPlusAssign.create(
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
ShortHand.aPreIncrement =
	function(
		expr
	)
{
	return (
		ast.aPreIncrement.create(
			'expr',
				expr
		)
	);
};


/*
| Shorthand for creating string literals.
*/
ShortHand.aStringLiteral =
	function(
		string
	)
{
	return (
		ast.aStringLiteral.create(
			'string',
				string
		)
	);
};


/*
| Shorthand for creating switch statements.
*/
ShortHand.aSwitch =
	function(
		statement
	)
{
	return (
		ast.aSwitch.create(
			'statement',
				statement
		)
	);
};


/*
| Shorthand for creating number true boolean literal.
*/
ShortHand.True =
	function( )
{
	return (
		ast.aBooleanLiteral.create(
			'boolean',
				true
		)
	);
};


/*
| Shorthand for creating typeofs.
*/
ShortHand.aTypeof =
	function(
		expr
	)
{
	return (
		ast.aTypeof.create(
			'expr',
				expr
		)
	);
};



/*
| Shorthand for creating variable uses.
*/
ShortHand.aVar =
	function(
		name
	)
{
	return (
		ast.aVar.create(
			'name',
				name
		)
	);
};


/*
| Shorthand for variable declerations.
*/
/*
ShortHand.aVarDec =
	function(
		name,   // variable name
		assign  // variable assignment
	)
{
	return (
		ast.aVarDec.create(
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
ShortHand.aCommaList =
	function( )
{
	return ast.aCommaList.create( );
};



/*
| Shorthand for creating vlists.
*/
ShortHand.aVList =
	function( )
{
	return ast.aVList.create( );
};



/*
| Node export.
*/
module.exports =
	ShortHand;


} )( );
