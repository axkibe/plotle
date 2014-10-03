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
		id :
			'ast.astBlock',
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
	astBlock,
	ast,
	jools;


astBlock =
module.exports =
	require( '../jion/this' )( module );

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
			require( './a-var-dec' )
	};

jools = require( '../jools/jools' );

/*
| Returns the block with a statement appended;
*/
astBlock.prototype.append =
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
astBlock.prototype.anAssign =
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

	return this.append( assign );
};


/*
| Recreates the block with a call appended.
*/
astBlock.prototype.aCall =
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
		call = call.append( arguments[ a ] );
	}

	return this.append( call );
};

/*
| Returns the block with a check appended.
*/
astBlock.prototype.aCheck =
	function(
		block
	)
{
	return (
		this.append(
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
astBlock.prototype.aComment =
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

	return this.append( header );
};


/*
| Returns the block with an if appended.
*/
astBlock.prototype.anIf =
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

	return this.append( statement );
};


/*
| Returns the block with a error throwing appended.
*/
astBlock.prototype.aFail =
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
		this.append(
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
astBlock.prototype.aFor =
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

	return this.append( statement );
};


/*
| Returns the block with a for-in loop appended.
*/
astBlock.prototype.aForIn =
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

	return this.append( statement );
};

/*
| Shorthand for creating new calls.
*/
astBlock.prototype.aNew =
	function(
		call
	)
{
	return (
		this.append(
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
astBlock.prototype.aReturn =
	function(
		expr
	)
{
	switch( expr.reflect )
	{
		case 'ast.aReturn' :

			break;

		default :

			expr = ast.aReturn.create( 'expr', expr );

			break;
	}

	return this.append( expr );
};


/*
| Returns the block with a variable decleration appended.
*/
astBlock.prototype.aVarDec =
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

	return this.append( varDec );
};


} )( );
