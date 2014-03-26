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
			Fail :
				require( '../code/fail' ),
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
			TList :
				require( '../code/tlist' ),
			VarDec :
				require( '../code/var-dec' ),
			VList :
				require( '../code/vlist' )
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
	)
{
	return (
		Code.Call.create(
			'func',
				func
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
| Shorthand for creating term lists.
|
| FIXME remove
*/
ShortHand.TList =
	function( )
{
	return Code.TList.create( );
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
