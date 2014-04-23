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


/*
| Import
*/
var
	Code =
		{
			And :
				require( '../code/and' ),
			Assign :
				require( '../code/assign' ),
			Block :
				require( '../code/block' ),
			Call :
				require( '../code/call' ),
			Check :
				require( '../code/check' ),
			Comment :
				require( '../code/comment' ),
			If :
				require( '../code/if' ),
			File :
				require( '../code/file' ),
			Func :
				require( '../code/func' ),
			FuncArg :
				require( '../code/func-arg' ),
			New :
				require( '../code/new' ),
			ObjLiteral :
				require( '../code/obj-literal' ),
			Or :
				require( '../code/or' ),
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
| Shorthand for creatings ifs.
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
