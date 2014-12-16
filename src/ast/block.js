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
			'ast_block',
		ray :
			// '->statement' FUTURE
			[ ]
	};
}


var
	ast_block,
	ast_comment,
	astNew,
	astPlusAssign,
	astReturn,
	jools,
	shorthand,
	tools;


ast_block = require( '../jion/this' )( module );

ast_comment = require( './comment' );

astNew = require( './ast-new' );

astPlusAssign = require( './ast-plus-assign' );

astReturn = require( './ast-return' );

jools = require( '../jools/jools' );

shorthand = require( './shorthand' );

tools = require( './tools' );


/*
| Returns the block with a parsed statement appended.
*/
ast_block.prototype.ast =
	function(
		statement
	)
{
	return this.append( tools.convert( statement ) );
};



/*
| Returns the block with an assignment appended.
| FUTURE use a shorthand
*/
ast_block.prototype.$assign =
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

	return this.append( shorthand.$assign( left, right ) );
};


/*
| Recreates the block with a call appended.
*/
ast_block.prototype.$call =
	function(
		// func,
		// args...
	)
{
	return(
		this.append(
			shorthand.$call.apply( shorthand, arguments )
		)
	);
};


/*
| Returns the block with a check appended.
*/
ast_block.prototype.$check =
	function(
		// block
	)
{
	return(
		this.append(
			shorthand.$check.apply( shorthand, arguments )
		)
	);
};


/*
| Returns the block with a comment appended.
*/
ast_block.prototype.$comment =
	function(
		header
	)
{
	if( header.reflect !== 'ast_comment' )
	{
		// arguments have to be a list of strings otherwise
		header =
			ast_comment.create(
				'content',
					Array.prototype.slice.call( arguments )
			);
	}

	return this.append( header );
};


/*
| Returns the block with a delete statement appended.
*/
ast_block.prototype.$delete =
	function(
		expr
	)
{
	return this.append( shorthand.$delete( expr ) );

};


/*
| Returns the block with an if appended.
*/
ast_block.prototype.$if =
	function(
		condition,
		then,
		elsewise
	)
{
	return(
		this.append(
			shorthand.$if( condition, then, elsewise )
		)
	);
};


/*
| Returns the block with a error throwing appended.
*/
ast_block.prototype.$fail =
	function(
		message
	)
{
	return this.append( shorthand.$fail( message ) );
};


/*
| Returns the block with a classical for loop appended.
|
| FUTURE use a shorthand
*/
ast_block.prototype.$for =
	function(
		init,
		condition,
		iterate,
		block
	)
{
	return this.append( shorthand.$for( init, condition, iterate, block ) );
};


/*
| Returns the block with a for-in loop appended.
| FUTURE use a shorthand
*/
ast_block.prototype.$forIn =
	function(
		variable,
		object,
		block
	)
{
	return(
		this.append(
			shorthand.$forIn( variable, object, block )
		)
	);
};

/*
| Shorthand for creating new calls.
*/
ast_block.prototype.astNew =
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
ast_block.prototype.astPlusAssign =
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
ast_block.prototype.astReturn =
	function(
		expr
	)
{
	if( expr.reflect !== 'ast_astReturn' )
	{
		expr = astReturn.create( 'expr', tools.convert( expr ) );
	}

	return this.append( expr );
};


/*
| Returns the block with a variable decleration appended.
*/
ast_block.prototype.astVarDec =
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