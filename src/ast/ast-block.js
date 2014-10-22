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


var
	astAssign,
	astBlock,
	astCall,
	astCheck,
	astComment,
	astFail,
	astFor,
	astForIn,
	astIf,
	astNew,
	astPlusAssign,
	astReturn,
	astString,
	astVarDec,
	jools,
	shorthand,
	tools;


astBlock =
module.exports =
	require( '../jion/this' )( module );


astAssign = require( './ast-assign' );

astCall = require( './ast-call' );

astCheck = require( './ast-check' );

astComment = require( './ast-comment' );

astFail = require( './ast-fail' );

astFor = require( './ast-for' );

astForIn = require( './ast-for-in' );

astIf = require( './ast-if' );

astNew = require( './ast-new' );

astPlusAssign = require( './ast-plus-assign' );

astReturn = require( './ast-return' );

astString = require( './ast-string' );

astVarDec = require( './ast-var-dec' );

jools = require( '../jools/jools' );

shorthand = require( './shorthand' );

tools = require( './tools' );


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
| FUTURE use a shorthand
*/
astBlock.prototype.astAssign =
	function(
		left,
		right
	)
{
	left = tools.convertArg( left );

	right = tools.convertArg( right );

	return(
		this.append(
			astAssign.create(
				'left', left,
				'right', right
			)
		)
	);
};


/*
| Recreates the block with a call appended.
*/
astBlock.prototype.astCall =
	function(
		// func,
		// args...
	)
{
	return(
		this.append(
			shorthand.astCall.apply( shorthand, arguments )
		)
	);
};


/*
| Returns the block with a check appended.
*/
astBlock.prototype.astCheck =
	function(
		// block
	)
{
	return(
		this.append(
			shorthand.astCheck.apply( shorthand, arguments )
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
			astComment.create(
				'content',
					Array.prototype.slice.call( arguments )
			);
	}

	return this.append( header );
};


/*
| Returns the block with a delete statement appended.
*/
astBlock.prototype.astDelete =
	function(
		expr
	)
{
	return this.append( shorthand.astDelete( expr ) );

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
	return(
		this.append(
			shorthand.astIf( condition, then, elsewise )
		)
	);
};


/*
| Returns the block with a error throwing appended.
*/
astBlock.prototype.astFail =
	function(
		message
	)
{
	return this.append( shorthand.astFail( message ) );
};


/*
| Returns the block with a classical for loop appended.
|
| FUTURE use a shorthand
*/
astBlock.prototype.astFor =
	function(
		init,
		condition,
		iterate,
		block
	)
{
	return(
		this.append(
			astFor.create(
				'init', init,
				'condition', condition,
				'iterate', iterate,
				'block', block
			)
		)
	);
};


/*
| Returns the block with a for-in loop appended.
| FUTURE use a shorthand
*/
astBlock.prototype.astForIn =
	function(
		variable,
		object,
		block
	)
{
	return(
		this.append(
			astForIn.create(
				'variable', variable,
				'object', object,
				'block', block
			)
		)
	);
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
			astNew.create( 'call', call )
		)
	);
};


/*
| Returns the block with a plus-assignment appended.
| FUTURE use a shorthand
*/
astBlock.prototype.astPlusAssign =
	function(
		left,
		right
	)
{
	left = tools.convertArg( left );

	right = tools.convertArg( right );

	return(
		this.append(
			astPlusAssign.create(
				'left', left,
				'right', right
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
	if( expr.reflect !== 'ast.astReturn' )
	{
		expr = astReturn.create( 'expr', tools.convertArg( expr ) );
	}

	return this.append( expr );
};


/*
| Returns the block with a variable decleration appended.
*/
astBlock.prototype.astVarDec =
	function(
		// name,   // variable name
		// assign  // variable assignment
	)
{
	return(
		this.append(
			shorthand.astVarDec.apply( shorthand, arguments )
		)
	);
};


} )( );
