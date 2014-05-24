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
| The joobj definition.
*/
if( JOOBJ )
{
	return {
		name :
			'Block',
		unit :
			'Code',
		node :
			true,
		attributes :
			{
				// FIXME check if necessary
				'path' :
					{
						comment :
							'the path',
						type :
							'Path',
						defaultValue :
							null
					}
			},
		twig :
			{
				'Check' :
					'Code.Check',
				'Comment' :
					'Code.Comment',
				'Assign' :
					'Code.Assign'
			}
	};
}

/*
| Node imports.
*/
var
	Block =
		require( '../joobj/this' )( module ),
	Code =
		{
			Assign :
				require( './assign' ),
			Call :
				require( './call' ),
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
			Term :
				require( './term' ),
			VarDec :
				require( './var-dec' ),
		},
	Jools =
		require( '../jools/jools' );

/*
| Returns the block with a statement appended;
*/
Block.prototype.Append =
	function(
		statement
	)
{
	return (
		this.Create(
			'twig:add',
			Jools.uid( ), // FIXME
			statement
		)
	);
};

/*
| Returns the block with an assignment appended.
*/
Block.prototype.Assign =
	function(
		left,
		right
	)
{
	var
		assign =
			Code.Assign.Create(
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
Block.prototype.Call =
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

	return this.Append( call );
};

/*
| Returns the block with a check appended.
*/
Block.prototype.Check =
	function(
		block
	)
{
	return (
		this.Append(
			Code.Check.Create(
				'block',
					block
			)
		)
	);
};


/*
| Returns the block with a comment appended.
*/
Block.prototype.Comment =
	function(
		header
	)
{
	if( header.reflect !== 'Comment' )
	{
		// arguments have to be a list of strings otherwise
		header =
			Code.Comment.Create(
				'content',
					Array.prototype.slice.call( arguments )
			);
	}

	return this.Append( header );
};


/*
| Returns the block with an if appended.
*/
Block.prototype.If =
	function(
		condition,
		then,
		elsewise
	)
{
	var
		statement =
			Code.If.Create(
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
Block.prototype.Fail =
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
			Code.Term.Create(
				'term',
					'\'' + message + '\''
			);
	}

	return (
		this.Append(
			Code.Fail.Create(
				'message',
					message
			)
		)
	);
};


/*
| Returns the block with a classical for loop appended.
*/
Block.prototype.For =
	function(
		init,
		condition,
		iterate,
		block
	)
{
	var
		statement =
			Code.For.Create(
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
Block.prototype.ForIn =
	function(
		variable,
		object,
		block
	)
{
	var
		statement =
			Code.ForIn.Create(
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
Block.prototype.New =
	function(
		call
	)
{
	return (
		this.Append(
			Code.New.Create(
				'call',
					call
			)
		)
	);
};


/*
| Returns the block with a term appended.
*/
Block.prototype.Return =
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
				Code.Return.Create(
					'expr',
						expr
				);

			break;
	}

	return this.Append( expr );
};


/*
| Returns the block with a term appended.
*/
Block.prototype.Term =
	function(
		term
	)
{
	if( term.reflect !== 'Term' )
	{
		term =
			Code.Term.Create(
				'term',
					term
			);
	}

	return this.Append( term );
};



/*
| Returns the block with a variable decleration appended.
*/
Block.prototype.VarDec =
	function(
		name,   // variable name
		assign  // variable assignment
	)
{
	var
		varDec =
			Code.VarDec.Create(
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
module.exports =
	Block;


} )( );
