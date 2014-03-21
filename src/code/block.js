/*
| A code block to be generated
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
							'null'
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
Block.prototype.append =
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
Block.prototype.Assign =
	function(
		left,
		right
	)
{
	var
		assign =
			Code.Assign.create(
				'left',
					left,
				'right',
					right
			);

	return this.append( assign );
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
		this.append(
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
Block.prototype.Comment =
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

	return this.append( header );
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
			Code.If.create(
				'condition',
					condition,
				'then',
					then,
				'elsewise',
					elsewise || null
			);

	return this.append( statement );
};


/*
| Returns the block with a error throwing appended.
*/
Block.prototype.Fail =
	function(
		message
	)
{
	var
		fail =
			Code.Fail.create(
				'message',
					message || null
			);

	return this.append( fail );
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

	return this.append( statement );
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
			Code.ForIn.create(
				'variable',
					variable,
				'object',
					object,
				'block',
					block
			);

	return this.append( statement );
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
				Code.Return.create(
					'expr',
						expr
				);

			break;
	}

	return this.append( expr );
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
			Code.Term.create(
				'term',
					term
			);
	}

	return this.append( term );
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
			Code.VarDec.create(
				'name',
					name,
				'assign',
					assign || null
			);

	return this.append( varDec );
};


/*
| Node export.
*/
module.exports =
	Block;


} )( );
