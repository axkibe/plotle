/*
| A code block to be generated
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
	astBlock,
	astComment,
	astNew,
	astPlusAssign,
	astReturn,
	jools,
	shorthand,
	tools;


astBlock = require( '../jion/this' )( module );

astComment = require( './ast-comment' );

astNew = require( './ast-new' );

astPlusAssign = require( './ast-plus-assign' );

astReturn = require( './ast-return' );

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
| Returns the block with a parsed statement appended.
*/
astBlock.prototype.ast =
	function(
		statement
	)
{
	return(
		this.create(
			'twig:add',
			jools.uid( ), // FIXME
			tools.convert( statement )
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

/**/if( CHECK )
/**/{
/**/	if( arguments.length !== 2 )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	return this.append( shorthand.astAssign( left, right ) );
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
			shorthand.astFor( init, condition, iterate, block )
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
			shorthand.astForIn( variable, object, block )
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
	return(
		this.append(
			shorthand.astPlusAssign( left, right )
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
		expr = astReturn.create( 'expr', tools.convert( expr ) );
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
