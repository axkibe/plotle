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
	astBoolean,
	astCall,
	astCheck,
	astCommaList,
	astComment,
	astCondition,
	astDelete,
	astDiffers,
	astDot,
	astFail,
	astFile,
	astEquals,
	astFor,
	astForIn,
	astFunc,
	astFuncArg,
	astGreaterThan,
	astIf,
	astInstanceof,
	astLessThan,
	astMember,
	astNew,
	astNot,
	astNull,
	astNumber,
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

ast_assign = require( './ast-assign' );

ast_block = require( './ast-block' );

astBoolean = require( './ast-boolean' );

astCall = require( './ast-call' );

astCheck = require( './ast-check' );

astCommaList = require( './ast-comma-list' );

astComment = require( './ast-comment' );

astCondition = require( './ast-condition' );

astDelete = require( './ast-delete' );

astDiffers = require( './ast-differs' );

astDot = require( './ast-dot' );

astEquals = require( './ast-equals' );

astFail = require( './ast-fail' );

astFile = require( './ast-file' );

astFor = require( './ast-for' );

astForIn = require( './ast-for-in' );

astFunc = require( './ast-func' );

astFuncArg = require( './ast-func-arg' );

astGreaterThan = require( './ast-greater-than' );

astIf = require( './ast-if' );

astInstanceof = require( './ast-instanceof' );

astLessThan = require( './ast-less-than' );

astMember = require( './ast-member' );

astNew = require( './ast-new' );

astNot = require( './ast-not' );

astNull = require( './ast-null' );

astNumber = require( './ast-number' );

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
shorthand.astAnd =
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

		return shorthand.astAnd.apply( this, args );
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
shorthand.astAssign =
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
shorthand.astBlock =
	function( )
{
	return ast_block.create( );
};


/*
| Shorthand for creating capsule function.
*/
shorthand.astCapsule =
	function(
		block
	)
{
	if(
		block
		&& block.reflect !== 'ast_astBlock'
	)
	{
		block = ast_block.create( ).append( block );
	}

	return(
		astCall.create(
			'func',
			astFunc.create(
				'block', block || null,
				'capsule', true
			)
		)
	);
};


/*
| Shorthand for creating calls.
*/
shorthand.astCall =
	function(
		func
		// args
	)
{
	var
		call;

	call = astCall.create( 'func', tools.convert( func ) );

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
shorthand.astCheck =
	function(
		block // or statement/expression
	)
{
	if(
		block
		&&
		block.reflect !== 'ast_astBlock'
	)
	{
		block = ast_block.create( ).append( block );
	}

	return(
		astCheck.create( 'block', block )
	);
};


/*
| Shorthand for creating comments
*/
shorthand.astComment =
	function(
		// list of strings
	)
{
	return(
		astComment.create(
			'content',
				Array.prototype.slice.call( arguments )
		)
	);
};



/*
| Shorthand for creating conditions.
*/
shorthand.astCondition =
	function(
		condition,
		then,
		elsewise
	)
{
	return(
		astCondition.create(
			'condition', tools.convert( condition ),
			'then', tools.convert( then ),
			'elsewise', tools.convert( elsewise )
		)
	);
};


/*
| Shorthand for creating differs.
*/
shorthand.astDiffers =
	function(
		left,
		right
	)
{
	left = tools.convert( left );

	right = tools.convert( right );

	return(
		astDiffers.create(
			'left', left,
			'right', right
		)
	);
};


/*
| Shorthand for creating delete calls.
*/
shorthand.astDelete =
	function(
		expr
	)
{
	expr = tools.convert( expr );

	return astDelete.create( 'expr', expr );
};


/*
| Shorthand for creating dots.
*/
shorthand.astDot =
	function(
		expr,
		member
	)
{
	return(
		astDot.create(
			'expr', expr,
			'member', member
		)
	);
};


/*
| Shorthand for creating equals.
*/
shorthand.astEquals =
	function(
		left,
		right
	)
{
	left = tools.convert( left );

	right = tools.convert( right );

	return(
		astEquals.create(
			'left', left,
			'right', right
		)
	);
};


/*
| Shorthand for 'false' literals.
*/
shorthand.astFalse = astBoolean.create( 'boolean', false );


/*
| Shorthand for ast code that throws a fail.
*/
shorthand.astFail =
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

	return astFail.create( 'message', message );
};


/*
| Shorthand for creating less-than comparisons.
*/
shorthand.astLessThan =
	function(
		left,
		right
	)
{
	left = tools.convert( left );

	right = tools.convert( right );

	return(
		astLessThan.create(
			'left', left,
			'right', right
		)
	);
};


/*
| Shorthand for creating greater-than comparisons.
*/
shorthand.astGreaterThan =
	function(
		left,
		right
	)
{
	left = tools.convert( left );

	right = tools.convert( right );

	return(
		astGreaterThan.create(
			'left', left,
			'right', right
		)
	);
};


/*
| Shorthand for creating ifs.
*/
shorthand.astIf =
	function(
		condition,
		then,
		elsewise
	)
{
	// automatic block convertions for comfort.

	condition = tools.convert( condition );

	if(
		then.reflect !== 'ast_astBlock'
	)
	{
		then = ast_block.create( ).append( then );
	}

	if(
		elsewise
		&&
		elsewise.reflect !== 'ast_astBlock'
	)
	{
		elsewise = ast_block.create( ).append( elsewise );
	}

	return(
		astIf.create(
			'condition', condition,
			'then', then,
			'elsewise', elsewise || null
		)
	);
};


/*
| Shorthand for creating files.
*/
shorthand.astFile =
	function( )
{
	return astFile.create( );
};


/*
| Shorthand for creating for loops.
*/
shorthand.astFor =
	function(
		init,
		condition,
		iterate,
		block
	)
{
	if( block.reflect !== 'ast_astBlock' )
	{
		block = ast_block.create( ).append( block );
	}

	init = tools.convert( init );

	condition = tools.convert( condition );

	iterate = tools.convert( iterate );

	return(
		astFor.create(
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
shorthand.astForIn =
	function(
		variable,
		object,
		block
	)
{
	if( block.reflect !== 'ast_astBlock' )
	{
		block = ast_block.create( ).append( block );
	}

	object = tools.convert( object );

	block = tools.convert( block );

	return(
		astForIn.create(
			'variable', variable,
			'object', object,
			'block', block
		)
	);
};


/*
| Shorthand for creating functions.
*/
shorthand.astFunc =
	function(
		block
	)
{
	if(
		block
		&&
		block.reflect !== 'ast_astBlock'
	)
	{
		block = ast_block.create( ).append( block );
	}

	return astFunc.create( 'block', block || null );
};


/*
| Shorthand for creating instanceof expressions.
*/
shorthand.astInstanceof =
	function(
		left,
		right
	)
{
	left = tools.convert( left );

	right = tools.convert( right );

	return(
		astInstanceof.create(
			'left', left,
			'right', right
		)
	);
};



/*
| Shorthand for creating members.
*/
shorthand.astMember =
	function(
		expr,
		member
	)
{
	return(
		astMember.create(
			'expr', expr,
			'member', member
		)
	);
};


/*
| Shorthand for creating new calls.
*/
shorthand.astNew =
	function(
		call
	)
{
	return astNew.create( 'call', call );
};


/*
| Shorthand for creating negations.
*/
shorthand.astNot =
	function(
		expr
	)
{
	expr = tools.convert( expr );

	return astNot.create( 'expr', expr );
};


/*
| Shorthand for ast nulls.
*/
shorthand.astNull = astNull.create( );


/*
| Shorthand for creating number literals.
*/
shorthand.astNumber =
	function(
		number
	)
{
	return astNumber.create( 'number', number );
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
shorthand.astString =
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
shorthand.astTrue =
	astBoolean.create( 'boolean', true );



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
shorthand.astCommaList =
	function( )
{
	return astCommaList.create( );
};



/*
| Shorthand for 'undefined'
*/
shorthand.astUndefined = astVar.create( 'name', 'undefined' );


} )( );
