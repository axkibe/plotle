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
			Switch :
				require( '../code/switch' ),
			Term :
				require( '../code/term' ),
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
		Code.And.create(
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
		Code.Assign.create(
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
	return Code.Block.create( );
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
			Code.Call.create(
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
| Shorthand for creating object literals.
*/
ShortHand.ObjLiteral =
	function( )
{
	return Code.ObjLiteral.create( );
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
| Shorthand for creating terms.
*/
ShortHand.Term =
	function(
		term
	)
{
	return (
		Code.Term.create(
			'term',
				term
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
