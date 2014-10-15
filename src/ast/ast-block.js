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
		func
		// args
	)
{
	var
		call;

	call = astCall.create( 'func', func );

	for(
		var a = 1, aZ = arguments.length;
		a < aZ;
		a++
	)
	{
		call =
			call.addArgument(
				tools.convertArg( arguments[ a ] )
			);
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
			astCheck.create( 'block', block )
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
	if( !message )
	{
		message = null;
	}
	else if( jools.isString( message ) )
	{
		message = astString.create( 'string', message );
	}

	return(
		this.append(
			astFail.create( 'message', message )
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
	switch( expr.reflect )
	{
		case 'ast.astReturn' :

			break;

		default :

			expr = astReturn.create( 'expr', expr );

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
	return(
		this.append(
			astVarDec.create(
				'name', name,
				'assign', assign || null
			)
		)
	);
};


} )( );
