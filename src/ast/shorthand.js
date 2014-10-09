/*
| Various shorthands for abstract syntax trees.
|
| FIXME lowercase shorthand
|
| Authors: Axel Kittenberger
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
	ast;

/*
| Import FIXME skip ast table
*/
ast =
	{
		astAnd :
			require( './ast-and' ),
		astArrayLiteral :
			require( './ast-array-literal' ),
		astAssign :
			require( './ast-assign' ),
		astBlock :
			require( './ast-block' ),
		astBooleanLiteral :
			require( './ast-boolean-literal' ),
		astCall :
			require( './ast-call' ),
		astCheck :
			require( './ast-check' ),
		astCommaList :
			require( './ast-comma-list' ),
		astComment :
			require( './ast-comment' ),
		astCondition :
			require( './ast-condition' ),
		astDelete :
			require( './ast-delete' ),
		astDiffers :
			require( './ast-differs' ),
		astDot :
			require( './ast-dot' ),
		astFile :
			require( './ast-file' ),
		astEquals :
			require( './ast-equals' ),
		astFunc :
			require( './ast-func' ),
		astFuncArg :
			require( './ast-func-arg' ),
		astGreaterThan :
			require( './ast-greater-than' ),
		astIf :
			require( './ast-if' ),
		astInstanceof :
			require( './ast-instanceof' ),
		astLessThan :
			require( './ast-less-than' ),
		astMember :
			require( './ast-member' ),
		astNew :
			require( './ast-new' ),
		aNot :
			require( './a-not' ),
		aNull :
			require( './a-null' ),
		aNumberLiteral :
			require( './a-number-literal' ),
		astObjLiteral :
			require( './ast-obj-literal' ),
		anOr :
			require( './an-or' ),
		aPlus :
			require( './a-plus' ),
		aPlusAssign :
			require( './a-plus-assign' ),
		aPreIncrement :
			require( './a-pre-increment' ),
		aStringLiteral :
			require( './a-string-literal' ),
		aSwitch :
			require( './a-switch' ),
		aTypeof :
			require( './a-typeof' ),
		aVar :
			require( './a-var' ),
		aVarDec :
			require( './a-var-dec' ),
		aVList :
			require( './a-vlist' )
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

		args.splice(
			0,
			2,
			ast.astAnd.create(
				'left',
					left,
				'right',
					right
			)
		);

		return(
			shorthand.astAnd.apply(
				this,
				args
			)
		);
	}

	return(
		ast.astAnd.create(
			'left',
				left,
			'right',
				right
		)
	);
};


/*
| Shorthand for creating array literals.
*/
shorthand.astArrayLiteral =
	function( )
{
	return ast.astArrayLiteral.create( );
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
	return(
		ast.astAssign.create(
			'left',
				left,
			'right',
				right
		)
	);
};


/*
| Shorthand for creating blocks.
*/
shorthand.astBlock =
	function( )
{
	return ast.astBlock.create( );
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

	call = ast.astCall.create( 'func', func );

	for(
		var a = 1, aZ = arguments.length;
		a < aZ;
		a++
	)
	{
		call = call.append( arguments[ a ] );
	}

	return call;
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
		ast.astCondition.create(
			'condition',
				condition,
			'then',
				then,
			'elsewise',
				elsewise
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
	return(
		ast.astDiffers.create(
			'left',
				left,
			'right',
				right
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
	return ast.astDelete.create( 'expr', expr );
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
		ast.astDot.create(
			'expr',
				expr,
			'member',
				member
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
	return(
		ast.astEquals.create(
			'left',
				left,
			'right',
				right
		)
	);
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
	return(
		ast.astLessThan.create(
			'left',
				left,
			'right',
				right
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
	return(
		ast.astGreaterThan.create(
			'left',
				left,
			'right',
				right
		)
	);
};


/*
| Shorthand for creating number false boolean literal.
*/
shorthand.aFalse =
	function( )
{
	return(
		ast.astBooleanLiteral.create(
			'boolean',
				false
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
	return(
		ast.astIf.create(
			'condition',
				condition,
			'then',
				then,
			'elsewise',
				elsewise || null
		)
	);
};


/*
| Shorthand for creating files.
*/
shorthand.astFile =
	function( )
{
	return ast.astFile.create( );
};


/*
| Shorthand for creating functions.
*/
shorthand.astFunc =
	function(
		block
	)
{
	return(
		ast.astFunc.create(
			'block',
				block || null
		)
	);
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
	return(
		ast.astInstanceof.create(
			'left',
				left,
			'right',
				right
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
		ast.astMember.create(
			'expr',
				expr,
			'member',
				member
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
	return(
		ast.astNew.create(
			'call',
				call
		)
	);
};


/*
| Shorthand for creating negations.
*/
shorthand.aNot =
	function(
		expr
	)
{
	return(
		ast.aNot.create(
			'expr',
				expr
		)
	);
};


/*
| Shorthand for creating nulls.
*/
shorthand.aNull =
	function( )
{
	return ast.aNull.create( );
};


/*
| Shorthand for creating number literals.
*/
shorthand.aNumberLiteral =
	function(
		number
	)
{
	return(
		ast.aNumberLiteral.create(
			'number',
				number
		)
	);
};


/*
| Shorthand for creating object literals.
*/
shorthand.astObjLiteral =
	function( )
{
	return ast.astObjLiteral.create( );
};


/*
| Shorthand for creating ors.
*/
shorthand.anOr =
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

		args.splice(
			0,
			2,
			ast.anOr.create(
				'left',
					left,
				'right',
					right
			)
		);

		return(
			shorthand.anOr.apply(
				this,
				args
			)
		);
	}

	return(
		ast.anOr.create(
			'left',
				left,
			'right',
				right
		)
	);
};


/*
| Shorthand for creating pluses.
*/
shorthand.aPlus =
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

		args.splice(
			0,
			2,
			ast.aPlus.create(
				'left',
					left,
				'right',
					right
			)
		);

		return(
			shorthand.aPlus.apply(
				this,
				args
			)
		);
	}

	return(
		ast.aPlus.create(
			'left',
				left,
			'right',
				right
		)
	);
};


/*
| Shorthand for creating plus-assignments.
*/
shorthand.aPlusAssign =
	function(
		left,
		right
	)
{
	return(
		ast.aPlusAssign.create(
			'left',
				left,
			'right',
				right
		)
	);
};



/*
| Shorthand for creating pre-increments.
*/
shorthand.aPreIncrement =
	function(
		expr
	)
{
	return(
		ast.aPreIncrement.create(
			'expr',
				expr
		)
	);
};


/*
| Shorthand for creating string literals.
*/
shorthand.aStringLiteral =
	function(
		string
	)
{
	return(
		ast.aStringLiteral.create(
			'string',
				string
		)
	);
};


/*
| Shorthand for creating switch statements.
*/
shorthand.aSwitch =
	function(
		statement
	)
{
	return(
		ast.aSwitch.create(
			'statement',
				statement
		)
	);
};


/*
| Shorthand for creating number true boolean literal.
*/
shorthand.aTrue =
	function( )
{
	return(
		ast.astBooleanLiteral.create(
			'boolean',
				true
		)
	);
};


/*
| Shorthand for creating typeofs.
*/
shorthand.aTypeof =
	function(
		expr
	)
{
	return(
		ast.aTypeof.create(
			'expr',
				expr
		)
	);
};



/*
| Shorthand for creating variable uses.
*/
shorthand.aVar =
	function(
		name
	)
{
	return(
		ast.aVar.create(
			'name',
				name
		)
	);
};


/*
| Shorthand for variable declerations.
*/
/*
shorthand.aVarDec =
	function(
		name,   // variable name
		assign  // variable assignment
	)
{
	return(
		ast.aVarDec.create(
			'name',
				name,
			'assign',
				assign || null
		)
	);
};
*/


/*
| Shorthand for creating comma lists.
*/
shorthand.astCommaList =
	function( )
{
	return ast.astCommaList.create( );
};



/*
| Shorthand for creating vlists.
*/
shorthand.aVList =
	function( )
{
	return ast.aVList.create( );
};


} )( );
