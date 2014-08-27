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
			'ast',
		node :
			true,
		twig :
			'->statement'
	};
}


/*
| Node imports.
*/
var
	aBlock =
		require( '../jion/this' )( module ),
	ast =
		{
			anAssign :
				require( './an-assign' ),
			aCall :
				require( './a-call' ),
			aCheck :
				require( './a-check' ),
			aComment :
				require( './a-comment' ),
			aFail :
				require( './a-fail' ),
			aFor :
				require( './a-for' ),
			aForIn :
				require( './a-for-in' ),
			anIf :
				require( './an-if' ),
			aNew :
				require( './a-new' ),
			aReturn :
				require( './a-return' ),
			aStringLiteral :
				require( './a-string-literal' ),
			aVarDec :
				require( './a-var-dec' ),
		},
	jools =
		require( '../jools/jools' );

/*
| Returns the block with a statement appended;
|
| TODO rename
*/
aBlock.prototype.Append =
	function(
		statement
	)
{
	return (
		this.create(
			'twig:add',
			jools.uid( ), // FIXME
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
		assign;

	assign =
		ast.anAssign.create(
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
		call;

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

	return this.Append( call );
};

/*
| Returns the block with a check appended.
*/
aBlock.prototype.aCheck =
	function(
		block
	)
{
	return (
		this.Append(
			ast.aCheck.create(
				'block',
					block
			)
		)
	);
};


/*
| Returns the block with a comment appended.
*/
aBlock.prototype.aComment =
	function(
		header
	)
{
	if( header.reflect !== 'ast.aComment' )
	{
		// arguments have to be a list of strings otherwise
		header =
			ast.aComment.create(
				'content',
					Array.prototype.slice.call( arguments )
			);
	}

	return this.Append( header );
};


/*
| Returns the block with an if appended.
*/
aBlock.prototype.anIf =
	function(
		condition,
		then,
		elsewise
	)
{
	var
		statement =
			ast.anIf.create(
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
aBlock.prototype.aFail =
	function(
		message
	)
{
	if( !message )
	{
		message = null;
	}
	else if( jools.isString( message ) )
	{
		message =
			ast.aStringLiteral.create(
				'string',
					message
			);
	}

	return (
		this.Append(
			ast.aFail.create(
				'message',
					message
			)
		)
	);
};


/*
| Returns the block with a classical for loop appended.
*/
aBlock.prototype.aFor =
	function(
		init,
		condition,
		iterate,
		block
	)
{
	var
		statement =
			ast.aFor.create(
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
aBlock.prototype.aForIn =
	function(
		variable,
		object,
		block
	)
{
	var
		statement =
			ast.aForIn.create(
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
aBlock.prototype.aNew =
	function(
		call
	)
{
	return (
		this.Append(
			ast.aNew.create(
				'call',
					call
			)
		)
	);
};


/*
| Returns the block with a term appended.
*/
aBlock.prototype.aReturn =
	function(
		expr
	)
{
	switch( expr.reflect )
	{
		case 'ast.aReturn' :

			break;

		default :

			expr =
				ast.aReturn.create(
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
aBlock.prototype.aVarDec =
	function(
		name,   // variable name
		assign  // variable assignment
	)
{
	var
		varDec;

	varDec =
		ast.aVarDec.create(
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
