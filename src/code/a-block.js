/*
| A code block to be generated
|
| FIXME: use shorthand calls when cycle require
|        is no longer an issue.
|
| Authors: Axel Kittenberger
*/


/*
| Capsule
*/
(function() {
'use strict';


/*
| The jion definition.
*/
if( JION )
{
	return {
		name :
			'aBlock',
		unit :
			'Code',
		node :
			true,
		twig :
			{
				// FUTURE statement
			}
	};
}

/*
| Node imports.
*/
var
	aBlock =
		require( '../jion/this' )( module ),
	Code =
		{
			anAssign :
				require( './an-assign' ),
			aCall :
				require( './a-call' ),
			Check :
				require( './check' ),
			Comment :
				require( './comment' ),
			Fail :
				require( './fail' ),
			For :
				require( './for' ),
			ForIn :
				require( './for-in' ),
			If :
				require( './if' ),
			New :
				require( './new' ),
			Return :
				require( './return' ),
			StringLiteral :
				require( './string-literal' ),
			VarDec :
				require( './var-dec' ),
		},
	Jools =
		require( '../jools/jools' );

/*
| Returns the block with a statement appended;
*/
aBlock.prototype.Append =
	function(
		statement
	)
{
	return (
		this.create(
			'twig:add',
			Jools.uid( ), // FIXME
			statement
		)
	);
};

/*
| Returns the block with an assignment appended.
*/
aBlock.prototype.anAssign =
	function(
		left,
		right
	)
{
	var
		assign =
			Code.anAssign.create(
				'left',
					left,
				'right',
					right
			);

	return this.Append( assign );
};


/*
| Recreates the block with a call appended.
*/
aBlock.prototype.aCall =
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

	return this.Append( call );
};

/*
| Returns the block with a check appended.
*/
aBlock.prototype.Check =
	function(
		block
	)
{
	return (
		this.Append(
			Code.Check.create(
				'block',
					block
			)
		)
	);
};


/*
| Returns the block with a comment appended.
*/
aBlock.prototype.Comment =
	function(
		header
	)
{
	if( header.reflect !== 'Comment' )
	{
		// arguments have to be a list of strings otherwise
		header =
			Code.Comment.create(
				'content',
					Array.prototype.slice.call( arguments )
			);
	}

	return this.Append( header );
};


/*
| Returns the block with an if appended.
*/
aBlock.prototype.If =
	function(
		condition,
		then,
		elsewise
	)
{
	var
		statement =
			Code.If.create(
				'condition',
					condition,
				'then',
					then,
				'elsewise',
					elsewise || null
			);

	return this.Append( statement );
};


/*
| Returns the block with a error throwing appended.
*/
aBlock.prototype.Fail =
	function(
		message
	)
{
	if( !message )
	{
		message =
			null;
	}
	else if( Jools.isString( message ) )
	{
		message =
			Code.StringLiteral.create(
				'string',
					message
			);
	}

	return (
		this.Append(
			Code.Fail.create(
				'message',
					message
			)
		)
	);
};


/*
| Returns the block with a classical for loop appended.
*/
aBlock.prototype.For =
	function(
		init,
		condition,
		iterate,
		block
	)
{
	var
		statement =
			Code.For.create(
				'init',
					init,
				'condition',
					condition,
				'iterate',
					iterate,
				'block',
					block
			);

	return this.Append( statement );
};


/*
| Returns the block with a for-in loop appended.
*/
aBlock.prototype.ForIn =
	function(
		variable,
		object,
		block
	)
{
	var
		statement =
			Code.ForIn.create(
				'variable',
					variable,
				'object',
					object,
				'block',
					block
			);

	return this.Append( statement );
};

/*
| Shorthand for creating new calls.
*/
aBlock.prototype.New =
	function(
		call
	)
{
	return (
		this.Append(
			Code.New.create(
				'call',
					call
			)
		)
	);
};


/*
| Returns the block with a term appended.
*/
aBlock.prototype.Return =
	function(
		expr
	)
{
	switch( expr.reflect )
	{
		case 'Return' :

			break;

		default :

			expr =
				Code.Return.create(
					'expr',
						expr
				);

			break;
	}

	return this.Append( expr );
};


/*
| Returns the block with a variable decleration appended.
*/
aBlock.prototype.VarDec =
	function(
		name,   // variable name
		assign  // variable assignment
	)
{
	var
		varDec =
			Code.VarDec.create(
				'name',
					name,
				'assign',
					assign || null
			);

	return this.Append( varDec );
};


/*
| Node export.
*/
module.exports = aBlock;


} )( );
