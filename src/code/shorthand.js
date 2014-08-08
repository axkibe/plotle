/*
| Various shorthands for the Code unit.
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
	Code;

/*
| Import
*/
Code =
	{
		anAnd :
			require( '../code/an-and' ),
		anArrayLiteral :
			require( '../code/an-array-literal' ),
		anAssign :
			require( '../code/an-assign' ),
		aBlock :
			require( '../code/a-block' ),
		aBooleanLiteral :
			require( '../code/a-boolean-literal' ),
		aCall :
			require( '../code/a-call' ),
		aCheck :
			require( '../code/a-check' ),
		aCommaList :
			require( '../code/a-comma-list' ),
		aComment :
			require( '../code/a-comment' ),
		aCondition :
			require( '../code/a-condition' ),
		aDelete :
			require( '../code/a-delete' ),
		aDiffers :
			require( '../code/a-differs' ),
		aDot :
			require( '../code/a-dot' ),
		anEquals :
			require( '../code/an-equals' ),
		aFile :
			require( '../code/a-file' ),
		aFunc :
			require( '../code/a-func' ),
		aFuncArg :
			require( '../code/a-func-arg' ),
		aGreaterThan :
			require( '../code/a-greater-than' ),
		anIf :
			require( '../code/an-if' ),
		anInstanceof :
			require( '../code/an-instanceof' ),
		aLessThan :
			require( '../code/a-less-than' ),
		aMember :
			require( '../code/a-member' ),
		aNew :
			require( '../code/a-new' ),
		aNot :
			require( '../code/a-not' ),
		aNull :
			require( '../code/a-null' ),
		aNumberLiteral :
			require( '../code/a-number-literal' ),
		anObjLiteral :
			require( '../code/an-obj-literal' ),
		anOr :
			require( '../code/an-or' ),
		aPlus :
			require( '../code/a-plus' ),
		aPlusAssign :
			require( '../code/a-plus-assign' ),
		aPreIncrement :
			require( '../code/a-pre-increment' ),
		aStringLiteral :
			require( '../code/a-string-literal' ),
		aSwitch :
			require( '../code/a-switch' ),
		aTypeof :
			require( '../code/a-typeof' ),
		aVar :
			require( '../code/a-var' ),
		aVarDec :
			require( '../code/a-var-dec' ),
		aVList :
			require( '../code/a-vlist' )
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
			Code.anAnd.create(
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
		Code.anAnd.create(
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
	return Code.anArrayLiteral.create( );
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
		Code.anAssign.create(
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
	return Code.aBlock.create( );
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
			Code.aCall.create(
				'func',
					func
			);

	for(
		var a = 1, aZ = arguments.length;
		a < aZ;
		a++
	)
	{
		call =
			call.Append( arguments[ a ] );
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
		Code.aCondition.create(
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
		Code.aDiffers.create(
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
		Code.aDelete.create(
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
		Code.aDot.create(
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
		Code.anEquals.create(
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
		Code.aLessThan.create(
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
		Code.aGreaterThan.create(
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
		Code.aBooleanLiteral.create(
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
		Code.anIf.create(
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
	return Code.aFile.create( );
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
		Code.aFunc.create(
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
		Code.anInstanceof.create(
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
		Code.aMember.create(
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
		Code.aNew.create(
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
		Code.aNot.create(
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
	return Code.aNull.create( );
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
		Code.aNumberLiteral.create(
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
	return Code.anObjLiteral.create( );
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
			Code.anOr.create(
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
		Code.anOr.create(
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
			Code.aPlus.create(
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
		Code.aPlus.create(
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
		Code.aPlusAssign.create(
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
		Code.aPreIncrement.create(
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
		Code.aStringLiteral.create(
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
		Code.aSwitch.create(
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
		Code.aBooleanLiteral.create(
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
		Code.aTypeof.create(
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
		Code.aVar.create(
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
		Code.aVarDec.create(
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
	return Code.aCommaList.create( );
};



/*
| Shorthand for creating vlists.
*/
ShortHand.aVList =
	function( )
{
	return Code.aVList.create( );
};



/*
| Node export.
*/
module.exports =
	ShortHand;


} )( );
