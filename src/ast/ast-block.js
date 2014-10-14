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


// FIXME remove ast table
ast =
	{
		astAssign :
			require( './ast-assign' ),
		astCall :
			require( './ast-call' ),
		astCheck :
			require( './ast-check' ),
		astComment :
			require( './ast-comment' ),
		astFail :
			require( './ast-fail' ),
		astFor :
			require( './ast-for' ),
		astForIn :
			require( './ast-for-in' ),
		astIf :
			require( './ast-if' ),
		astNew :
			require( './ast-new' ),
		astReturn :
			require( './ast-return' ),
		astString :
			require( './ast-string' ),
		astVarDec :
			require( './ast-var-dec' )
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
	return(
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
astBlock.prototype.astAssign =
	function(
		left,
		right
	)
{
	var
		assign;

	assign =
		ast.astAssign.create(
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
astBlock.prototype.astCall =
	function(
		func
		// args
	)
{
	var
		call;

	call = ast.astCall.create( 'func', func );

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
astBlock.prototype.astCheck =
	function(
		block
	)
{
	return(
		this.append(
			ast.astCheck.create( 'block', block )
		)
	);
};


/*
| Returns the block with a comment appended.
*/
astBlock.prototype.astComment =
	function(
		header
	)
{
	if( header.reflect !== 'ast.astComment' )
	{
		// arguments have to be a list of strings otherwise
		header =
			ast.astComment.create(
				'content',
					Array.prototype.slice.call( arguments )
			);
	}

	return this.append( header );
};


/*
| Returns the block with an if appended.
*/
astBlock.prototype.astIf =
	function(
		condition,
		then,
		elsewise
	)
{
	var
		statement =
			ast.astIf.create(
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
astBlock.prototype.astFail =
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
		message = ast.astString.create( 'string', message );
	}

	return(
		this.append(
			ast.astFail.create(
				'message',
					message
			)
		)
	);
};


/*
| Returns the block with a classical for loop appended.
*/
astBlock.prototype.astFor =
	function(
		init,
		condition,
		iterate,
		block
	)
{
	var
		statement =
			ast.astFor.create(
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
astBlock.prototype.astForIn =
	function(
		variable,
		object,
		block
	)
{
	var
		statement =
			ast.astForIn.create(
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
astBlock.prototype.astNew =
	function(
		call
	)
{
	return(
		this.append(
			ast.astNew.create(
				'call',
					call
			)
		)
	);
};


/*
| Returns the block with a term appended.
*/
astBlock.prototype.astReturn =
	function(
		expr
	)
{
	switch( expr.reflect )
	{
		case 'ast.astReturn' :

			break;

		default :

			expr = ast.astReturn.create( 'expr', expr );

			break;
	}

	return this.append( expr );
};


/*
| Returns the block with a variable decleration appended.
*/
astBlock.prototype.astVarDec =
	function(
		name,   // variable name
		assign  // variable assignment
	)
{
	var
		varDec;

	varDec =
		ast.astVarDec.create(
			'name',
				name,
			'assign',
				assign || null
		);

	return this.append( varDec );
};


} )( );
