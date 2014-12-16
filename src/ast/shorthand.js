/*
| Various shorthands for abstract syntax trees.
*/


var
	shorthand;

shorthand =
module.exports =
	{ };


/*
| Capsule
*/
(function() {
'use strict';


var
	ast_and,
	ast_arrayLiteral,
	ast_assign,
	ast_block,
	ast_boolean,
	ast_call,
	ast_check,
	ast_commaList,
	ast_comment,
	ast_condition,
	ast_delete,
	ast_differs,
	ast_dot,
	ast_equals,
	ast_fail,
	ast_for,
	ast_forIn,
	ast_func,
	ast_funcArg,
	ast_greaterThan,
	ast_if,
	ast_instanceof,
	ast_lessThan,
	ast_member,
	ast_new,
	ast_not,
	ast_null,
	ast_number,
	astObjLiteral,
	astOr,
	astPlus,
	astPlusAssign,
	astPreIncrement,
	astReturn,
	astString,
	astSwitch,
	astTypeof,
	astVar,
	astVarDec,
	jools,
	tools;


ast_and = require( './and' );

ast_arrayLiteral = require( './arrayLiteral' );

ast_assign = require( './assign' );

ast_block = require( './block' );

ast_boolean = require( './boolean' );

ast_call = require( './call' );

ast_check = require( './check' );

ast_commaList = require( './commaList' );

ast_comment = require( './comment' );

ast_condition = require( './condition' );

ast_delete = require( './delete' );

ast_differs = require( './differs' );

ast_dot = require( './dot' );

ast_equals = require( './equals' );

ast_fail = require( './fail' );

ast_for = require( './for' );

ast_forIn = require( './forIn' );

ast_func = require( './func' );

ast_funcArg = require( './funcArg' );

ast_greaterThan = require( './greaterThan' );

ast_if = require( './if' );

ast_instanceof = require( './instanceof' );

ast_lessThan = require( './lessThan' );

ast_member = require( './member' );

ast_new = require( './new' );

ast_not = require( './not' );

ast_null = require( './null' );

ast_number = require( './number' );

astObjLiteral = require( './ast-obj-literal' );

astOr = require( './ast-or' );

astPlus = require( './ast-plus' );

astPlusAssign = require( './ast-plus-assign' );

astPreIncrement = require( './ast-pre-increment' );

astReturn = require( './ast-return' );

astString = require( './ast-string' );

astSwitch = require( './ast-switch' );

astTypeof = require( './ast-typeof' );

astVar = require( './ast-var' );

astVarDec = require( './ast-var-dec' );

jools = require( '../jools/jools' );

tools = require( './tools' );


/*
| Shorthand for invoking the convert(parser).
*/
shorthand.ast =
	function( arg )
{

/**/if( CHECK )
/**/{
/**/	if( arguments.length !== 1 )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	return tools.convert( arg );
};


/*
| Shorthand for creating ands.
*/
shorthand.$and =
	function(
		left,
		right
		// or more
	)
{
	var
		args;

	if( arguments.length > 2 )
	{
		args = Array.prototype.slice.call( arguments );

		left = tools.convert( left );

		right = tools.convert( right );

		args.splice(
			0,
			2,
			ast_and.create( 'left', left, 'right', right )
		);

		return shorthand.$and.apply( this, args );
	}

	left = tools.convert( left );

	right = tools.convert( right );

	return ast_and.create( 'left', left, 'right', right );
};


/*
| Shorthand for creating array literals.
*/
shorthand.astArrayLiteral =
	function( )
{
	return ast_arrayLiteral.create( );
};


/*
| Shorthand for creating assignments.
*/
shorthand.$assign =
	function(
		left,
		right
	)
{
	left = tools.convert( left );

	right = tools.convert( right );

	return(
		ast_assign.create(
			'left', left,
			'right', right
		)
	);
};


/*
| Shorthand for creating blocks.
*/
shorthand.$block =
	function( )
{
	return ast_block.create( );
};


/*
| Shorthand for creating capsule function.
|
| FIXME used?
*/
shorthand.astCapsule =
	function(
		block
	)
{
	if(
		block
		&& block.reflect !== 'ast_block'
	)
	{
		block = ast_block.create( ).append( block );
	}

	return(
		ast_call.create(
			'func',
			ast_func.create(
				'block', block || null,
				'capsule', true
			)
		)
	);
};


/*
| Shorthand for creating calls.
*/
shorthand.$call =
	function(
		func
		// args
	)
{
	var
		call;

	call = ast_call.create( 'func', tools.convert( func ) );

	for(
		var a = 1, aZ = arguments.length;
		a < aZ;
		a++
	)
	{
		call = call.addArgument( arguments[ a ] );
	}

	return call;
};


/*
| Shorthand for creating ast check blocks.
*/
shorthand.$check =
	function(
		block // or statement/expression
	)
{
	if( block && block.reflect !== 'ast_block' )
	{
		block = ast_block.create( ).append( block );
	}

	return(
		ast_check.create( 'block', block )
	);
};


/*
| Shorthand for creating comments
*/
shorthand.$comment =
	function(
		// list of strings
	)
{
	return(
		ast_comment.create(
			'content', Array.prototype.slice.call( arguments )
		)
	);
};



/*
| Shorthand for creating conditions.
*/
shorthand.$condition =
	function(
		condition,
		then,
		elsewise
	)
{
	return(
		ast_condition.create(
			'condition', tools.convert( condition ),
			'then', tools.convert( then ),
			'elsewise', tools.convert( elsewise )
		)
	);
};


/*
| Shorthand for creating differs.
*/
shorthand.$differs =
	function(
		left,
		right
	)
{
	left = tools.convert( left );

	right = tools.convert( right );

	return ast_differs.create( 'left', left, 'right', right );
};


/*
| Shorthand for creating delete calls.
*/
shorthand.$delete =
	function(
		expr
	)
{
	expr = tools.convert( expr );

	return ast_delete.create( 'expr', expr );
};


/*
| Shorthand for creating dots.
*/
shorthand.$dot =
	function(
		expr,
		member
	)
{
	return ast_dot.create( 'expr', expr, 'member', member );
};


/*
| Shorthand for creating equals.
*/
shorthand.$equals =
	function(
		left,
		right
	)
{
	left = tools.convert( left );

	right = tools.convert( right );

	return ast_equals.create( 'left', left, 'right', right );
};


/*
| Shorthand for 'false' literals.
*/
shorthand.$false = ast_boolean.create( 'boolean', false );


/*
| Shorthand for ast code that throws a fail.
*/
shorthand.$fail =
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

	return ast_fail.create( 'message', message );
};


/*
| Shorthand for creating less-than comparisons.
*/
shorthand.$lessThan =
	function(
		left,
		right
	)
{
	left = tools.convert( left );

	right = tools.convert( right );

	return ast_lessThan.create( 'left', left, 'right', right );
};


/*
| Shorthand for creating greater-than comparisons.
*/
shorthand.ast_greaterThan =
	function(
		left,
		right
	)
{
	left = tools.convert( left );

	right = tools.convert( right );

	return(
		ast_greaterThan.create(
			'left', left,
			'right', right
		)
	);
};


/*
| Shorthand for creating ifs.
*/
shorthand.$if =
	function(
		condition,
		then,
		elsewise
	)
{
	// automatic block convertions for comfort.

	condition = tools.convert( condition );

	if(
		then.reflect !== 'ast_block'
	)
	{
		then = ast_block.create( ).append( then );
	}

	if(
		elsewise
		&&
		elsewise.reflect !== 'ast_block'
	)
	{
		elsewise = ast_block.create( ).append( elsewise );
	}

	return(
		ast_if.create(
			'condition', condition,
			'then', then,
			'elsewise', elsewise || null
		)
	);
};


/*
| Shorthand for creating for loops.
*/
shorthand.$for =
	function(
		init,
		condition,
		iterate,
		block
	)
{
	if( block.reflect !== 'ast_block' )
	{
		block = ast_block.create( ).append( block );
	}

	init = tools.convert( init );

	condition = tools.convert( condition );

	iterate = tools.convert( iterate );

	return(
		ast_for.create(
			'init', init,
			'condition', condition,
			'iterate', iterate,
			'block', block
		)
	);
};


/*
| Shorthand for creating for in loops.
*/
shorthand.$forIn =
	function(
		variable,
		object,
		block
	)
{
	if( block.reflect !== 'ast_block' )
	{
		block = ast_block.create( ).append( block );
	}

	object = tools.convert( object );

	block = tools.convert( block );

	return(
		ast_forIn.create(
			'variable', variable,
			'object', object,
			'block', block
		)
	);
};


/*
| Shorthand for creating functions.
*/
shorthand.$func =
	function(
		block
	)
{
	if(
		block
		&&
		block.reflect !== 'ast_block'
	)
	{
		block = ast_block.create( ).append( block );
	}

	return ast_func.create( 'block', block || null );
};


/*
| Shorthand for creating instanceof expressions.
*/
shorthand.$instanceof =
	function(
		left,
		right
	)
{
	left = tools.convert( left );

	right = tools.convert( right );

	return(
		ast_instanceof.create(
			'left', left,
			'right', right
		)
	);
};



/*
| Shorthand for creating members.
*/
shorthand.$member =
	function(
		expr,
		member
	)
{
	return ast_member.create( 'expr', expr, 'member', member );
};


/*
| Shorthand for creating new calls.
*/
shorthand.$new =
	function(
		call
	)
{
	return ast_new.create( 'call', call );
};


/*
| Shorthand for creating negations.
*/
shorthand.$not =
	function(
		expr
	)
{
	expr = tools.convert( expr );

	return ast_not.create( 'expr', expr );
};


/*
| Shorthand for ast nulls.
*/
shorthand.$null = ast_null.create( );


/*
| Shorthand for creating number literals.
*/
shorthand.$number =
	function(
		number
	)
{
	return ast_number.create( 'number', number );
};


/*
| Shorthand for creating object literals.
*/
shorthand.astObjLiteral =
	function( )
{
	return astObjLiteral.create( );
};


/*
| Shorthand for creating ors.
*/
shorthand.astOr =
	function(
		left,
		right
		// or more
	)
{
	var
		args;

	if( arguments.length > 2 )
	{
		args = Array.prototype.slice.call( arguments );

		left = tools.convert( left );

		right = tools.convert( right );

		args.splice(
			0,
			2,
			astOr.create(
				'left', left,
				'right', right
			)
		);

		return(
			shorthand.astOr.apply(
				this,
				args
			)
		);
	}

	left = tools.convert( left );

	right = tools.convert( right );

	return(
		astOr.create(
			'left', left,
			'right', right
		)
	);
};


/*
| Shorthand for creating pluses.
*/
shorthand.astPlus =
	function(
		left,
		right
		// or more
	)
{
	var
		args;

	if( arguments.length > 2 )
	{
		args = Array.prototype.slice.call( arguments );

		left = tools.convert( left );

		right = tools.convert( right );

		args.splice(
			0,
			2,
			astPlus.create(
				'left', left,
				'right', right
			)
		);

		return(
			shorthand.astPlus.apply(
				this,
				args
			)
		);
	}

	left = tools.convert( left );

	right = tools.convert( right );

	return(
		astPlus.create(
			'left', left,
			'right', right
		)
	);
};


/*
| Shorthand for creating plus-assignments.
*/
shorthand.astPlusAssign =
	function(
		left,
		right
	)
{
	left = tools.convert( left );

	right = tools.convert( right );

	return(
		astPlusAssign.create(
			'left', left,
			'right', right
		)
	);
};



/*
| Shorthand for creating pre-increments.
*/
shorthand.astPreIncrement =
	function(
		expr
	)
{
	expr = tools.convert( expr );

	return astPreIncrement.create( 'expr', expr );
};


/*
| Shorthand for creating a return statement
*/
shorthand.astReturn =
	function(
		expr
	)
{
	return astReturn.create( 'expr', tools.convert( expr ) );
};



/*
| Shorthand for creating string literals.
*/
shorthand.$string =
	function(
		string
	)
{
	return astString.create( 'string', string );
};


/*
| Shorthand for creating switch statements.
*/
shorthand.astSwitch =
	function(
		statement
	)
{
	return astSwitch.create( 'statement', tools.convert( statement ) );
};


/*
| Shorthand for 'true' literals.
*/
shorthand.$true = ast_boolean.create( 'boolean', true );



/*
| Shorthand for creating typeofs.
*/
shorthand.astTypeof =
	function(
		expr
	)
{
	return astTypeof.create( 'expr', expr );
};



/*
| Shorthand for creating variable uses.
*/
shorthand.astVar =
	function(
		name
	)
{
	return astVar.create( 'name', name );
};


/*
| Shorthand for variable declerations.
*/
shorthand.astVarDec =
	function(
		name,   // variable name
		assign  // variable assignment
	)
{
	return(
		astVarDec.create(
			'name',
				name,
			'assign',
				arguments.length > 1
				? tools.convert( assign )
				: null
		)
	);
};


/*
| Shorthand for creating comma lists.
*/
shorthand.$commaList =
	function( )
{
	return ast_commaList.create( );
};



/*
| Shorthand for 'undefined'
*/
shorthand.astUndefined = astVar.create( 'name', 'undefined' );


} )( );
