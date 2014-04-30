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
		And :
			require( '../code/and' ),
		ArrayLiteral :
			require( '../code/array-literal' ),
		Assign :
			require( '../code/assign' ),
		Block :
			require( '../code/block' ),
		BooleanLiteral :
			require( '../code/boolean-literal' ),
		Call :
			require( '../code/call' ),
		Check :
			require( '../code/check' ),
		Comment :
			require( '../code/comment' ),
		Condition :
			require( '../code/condition' ),
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
		New :
			require( '../code/new' ),
		Not :
			require( '../code/not' ),
		Null :
			require( '../code/null' ),
		NumberLiteral :
			require( '../code/number-literal' ),
		ObjLiteral :
			require( '../code/obj-literal' ),
		Or :
			require( '../code/or' ),
		StringLiteral :
			require( '../code/string-literal' ),
		Switch :
			require( '../code/switch' ),
		Term :
			require( '../code/term' ),
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
ShortHand.And =
	function(
		left,
		right
	)
{
	return (
		Code.And.Create(
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
ShortHand.ArrayLiteral =
	function( )
{
	return Code.ArrayLiteral.Create( );
};


/*
| Shorthand for creating assignments.
*/
ShortHand.Assign =
	function(
		left,
		right
	)
{
	return (
		Code.Assign.Create(
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
ShortHand.Block =
	function( )
{
	return Code.Block.Create( );
};


/*
| Shorthand for creating calls.
*/
ShortHand.Call =
	function(
		func
		// args
	)
{
	var
		call =
			Code.Call.Create(
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
ShortHand.Condition =
	function(
		condition,
		then,
		elsewise
	)
{
	return (
		Code.Condition.Create(
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
		Code.Differs.Create(
			'left',
				left,
			'right',
				right
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
		Code.Dot.Create(
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
		Code.Equals.Create(
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
		Code.BooleanLiteral.Create(
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
		Code.If.Create(
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
	return Code.File.Create( );
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
			Code.Func.Create(
				'block',
					block || null
			);

	return func;
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
		Code.New.Create(
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
		Code.Not.Create(
			'expr',
				expr
		)
	);
};

/*
| Shorthand for creating nulls.
*/
ShortHand.Null =
	function( )
{
	return Code.Null.Create( );
};


/*
| Shorthand for creating object literals.
*/
ShortHand.ObjLiteral =
	function( )
{
	return Code.ObjLiteral.Create( );
};


/*
| Shorthand for creating ors.
*/
ShortHand.Or =
	function(
		left,
		right
	)
{
	return (
		Code.Or.Create(
			'left',
				left,
			'right',
				right
		)
	);
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
		Code.NumberLiteral.Create(
			'number',
				number
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
		Code.StringLiteral.Create(
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
		Code.Switch.Create(
			'statement',
				statement
		)
	);
};


/*
| Shorthand for creating terms.
*/
ShortHand.Term =
	function(
		term
	)
{
	return (
		Code.Term.Create(
			'term',
				term
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
		Code.BooleanLiteral.Create(
			'boolean',
				true
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
		Code.Var.Create(
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
		Code.VarDec.Create(
			'name',
				name,
			'assign',
				assign || null
		)
	);
};
*/


/*
| Shorthand for creating vlists.
*/
ShortHand.VList =
	function( )
{
	return Code.VList.Create( );
};



/*
| Node export.
*/
module.exports =
	ShortHand;


} )( );
