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
		Differs :
			require( '../code/differs' ),
		Dot :
			require( '../code/dot' ),
		If :
			require( '../code/if' ),
		Equals :
			require( '../code/equals' ),
		File :
			require( '../code/file' ),
		Func :
			require( '../code/func' ),
		FuncArg :
			require( '../code/func-arg' ),
		GreaterThan :
			require( '../code/greater-than' ),
		Instanceof :
			require( '../code/instanceof' ),
		LessThan :
			require( '../code/less-than' ),
		Member :
			require( '../code/member' ),
		New :
			require( '../code/new' ),
		Not :
			require( '../code/not' ),
		aNull :
			require( '../code/a-null' ),
		NumberLiteral :
			require( '../code/number-literal' ),
		ObjLiteral :
			require( '../code/obj-literal' ),
		Or :
			require( '../code/or' ),
		Plus :
			require( '../code/plus' ),
		PlusAssign :
			require( '../code/plus-assign' ),
		PreIncrement :
			require( '../code/pre-increment' ),
		StringLiteral :
			require( '../code/string-literal' ),
		Switch :
			require( '../code/switch' ),
		Typeof :
			require( '../code/typeof' ),
		Var :
			require( '../code/var' ),
		VarDec :
			require( '../code/var-dec' ),
		VList :
			require( '../code/vlist' )
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
ShortHand.Differs =
	function(
		left,
		right
	)
{
	return (
		Code.Differs.create(
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
ShortHand.Dot =
	function(
		expr,
		member
	)
{
	return (
		Code.Dot.create(
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
ShortHand.Equals =
	function(
		left,
		right
	)
{
	return (
		Code.Equals.create(
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
ShortHand.LessThan =
	function(
		left,
		right
	)
{
	return (
		Code.LessThan.create(
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
ShortHand.GreaterThan =
	function(
		left,
		right
	)
{
	return (
		Code.GreaterThan.create(
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
ShortHand.If =
	function(
		condition,
		then,
		elsewise
	)
{
	return (
		Code.If.create(
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
ShortHand.File =
	function( )
{
	return Code.File.create( );
};


/*
| Shorthand for creating functions.
*/
ShortHand.Func =
	function(
		block
	)
{
	var
		func =
			Code.Func.create(
				'block',
					block || null
			);

	return func;
};


/*
| Shorthand for creating instanceof expressions.
*/
ShortHand.Instanceof =
	function(
		left,
		right
	)
{
	return (
		Code.Instanceof.create(
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
ShortHand.Member =
	function(
		expr,
		member
	)
{
	return (
		Code.Member.create(
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
ShortHand.New =
	function(
		call
	)
{
	return (
		Code.New.create(
			'call',
				call
		)
	);
};


/*
| Shorthand for creating negations.
*/
ShortHand.Not =
	function(
		expr
	)
{
	return (
		Code.Not.create(
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
ShortHand.NumberLiteral =
	function(
		number
	)
{
	return (
		Code.NumberLiteral.create(
			'number',
				number
		)
	);
};


/*
| Shorthand for creating object literals.
*/
ShortHand.ObjLiteral =
	function( )
{
	return Code.ObjLiteral.create( );
};


/*
| Shorthand for creating ors.
*/
ShortHand.Or =
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
			Code.Or.create(
				'left',
					left,
				'right',
					right
			)
		);

		return (
			ShortHand.Or.apply(
				this,
				args
			)
		);
	}

	return (
		Code.Or.create(
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
ShortHand.Plus =
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
			Code.Plus.create(
				'left',
					left,
				'right',
					right
			)
		);

		return (
			ShortHand.Plus.apply(
				this,
				args
			)
		);
	}

	return (
		Code.Plus.create(
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
ShortHand.PlusAssign =
	function(
		left,
		right
	)
{
	return (
		Code.PlusAssign.create(
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
ShortHand.PreIncrement =
	function(
		expr
	)
{
	return (
		Code.PreIncrement.create(
			'expr',
				expr
		)
	);
};


/*
| Shorthand for creating string literals.
*/
ShortHand.StringLiteral =
	function(
		string
	)
{
	return (
		Code.StringLiteral.create(
			'string',
				string
		)
	);
};


/*
| Shorthand for creating switch statements.
*/
ShortHand.Switch =
	function(
		statement
	)
{
	return (
		Code.Switch.create(
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
ShortHand.Typeof =
	function(
		expr
	)
{
	return (
		Code.Typeof.create(
			'expr',
				expr
		)
	);
};



/*
| Shorthand for creating variable uses.
*/
ShortHand.Var =
	function(
		name
	)
{
	return (
		Code.Var.create(
			'name',
				name
		)
	);
};


/*
| Shorthand for variable declerations.
*/
/*
ShortHand.VarDec =
	function(
		name,   // variable name
		assign  // variable assignment
	)
{
	return (
		Code.VarDec.create(
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
ShortHand.VList =
	function( )
{
	return Code.VList.create( );
};



/*
| Node export.
*/
module.exports =
	ShortHand;


} )( );
