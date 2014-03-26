/*
| Formats a code structure into a js file
|
| Authors: Axel Kittenberger
*/


/*
| Export
*/
var
	Formatter =
		{ };


/*
| Capsule
*/
(function() {
'use strict';


/*
| Node imports.
*/
var
	Context =
		require( './context' );

//var
//	Jools =
//		require( '../jools/jools' );


/*
| Formats an And.
*/
var
formatAnd =
	function(
		context,
		expr
	)
{
	var
		text;

/**/if( CHECK )
/**/{
/**/	if( expr.reflect !== 'And' )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	if( context.inline )
	{
		throw 'noinline';
	}

	text =
		context.tab
		+
		formatExpression(
			context,
			expr.left
		)
		+
		'\n'
		+
		context.tab
		+
		'&&\n'
		+
		context.tab
		+
		formatExpression(
			context,
			expr.right
		);

	return text;
};


/*
| Formats an assignment.
*/
var
formatAssign =
	function(
		context,
		assign
	)
{
	var
		text =
			'';

	text +=
		formatTerm(
			context,
			assign.left
		)
		+
		' =\n';

	if( assign.right.reflect !== 'Assign' )
	{
		context =
			context.IncSame;
	}

	if( !context.inline )
	{
		text +=
			context.tab;
	}

	text +=
		formatExpression(
			context,
			assign.right
		);

	return text;
};



/*
| Formats a comment.
*/
var
formatComment =
	function(
		context,
		comment
	)
{
	var
		a,
		aZ,
		c,
		text =
			'/*' + '\n';

	for(
		a = 0, aZ = comment.content.length;
		a < aZ;
		a++
	)
	{
		c =
			comment.content[ a ];


		if( c === '' )
		{
			text +=
				'|' + '\n';
		}
		else
		{
			text +=
				'| ' + c + '\n';
		}
	}

	text +=
		'*/' + '\n';

	return text;
};


/*
| Formats a conditional checking code.
*/
var
formatCheck =
	function(
		context,
		check
	)
{
	if( context.check )
	{
		throw new Error( );
	}

	context =
		context.create(
			'check',
				true
		);

	return (
		context.tab + 'if( CHECK )\n'
		+
		formatBlock(
			context,
			check.block
		)
	);
};


/*
| Formats a block.
*/
var
formatBlock =
	function(
		context,   // the context to format in
		block,     // the block to format to
		noBrackets // omit brackets
	)
{
	var
		blockContext,
		text =
			'';

	if( !noBrackets )
	{
		text =
			context.tab + '{\n';

		blockContext =
			context.Inc;
	}
	else
	{
		blockContext =
			context;
	}

	for(
		var a = 0, aZ = block.ranks.length;
		a < aZ;
		a++
	)
	{
		text +=
			formatStatement(
				blockContext,
				block.atRank( a ),
				a > 0 ?
					block.atRank( a - 1 ) :
					null,
				a + 1 < aZ ?
					block.atRank( a + 1 ) :
					null
			);
	}

	if( !noBrackets )
	{
		text +=
			context.tab + '}';
	}

	return text;
};


/*
| Formats an if statement.
*/
var
formatIf =
	function(
		context,
		ifExpr
	)
{
	var
		cond =
			ifExpr.condition,
		text;

	switch( cond.reflect )
	{
		case 'Term' :

			text =
				context.tab +
				'if( '
				+
				formatTerm(
					context.Inline,
					cond
				)
				+
				' )\n';

			break;

		case 'TList' :

			text =
				context.tab + 'if(\n';

			for(
				var a = 0, aZ = cond.ranks.length;
				a < aZ;
				a++
			)
			{
				text +=
					(
						context.inline ?
						'' :
						context.Inc.tab
					)
					+
					formatTerm(
						context.Inc,
						cond.atRank( a )
					)
					+
					'\n';
			}

			text +=
				context.tab + ')\n';

			break;

		default :

			throw new Error( );
	}

	text +=
		formatBlock(
			context,
			ifExpr.then
		);

	return text;
};


/*
| Formats a classical for loop.
*/
var
formatFor =
	function(
		context,
		forExpr
	)
{
	var
		forContext =
			context.Inc,
		text;

	text =
		context.tab +
		'for(\n' +
		forContext.tab +
		formatExpression(
			forContext.Inline,
			forExpr.init
		) +
		';\n' +
		forContext.tab +
		formatExpression(
			forContext.Inline,
			forExpr.condition
		) +
		';\n' +
		forContext.tab +
		formatExpression(
			forContext.Inline,
			forExpr.iterate
		) +
		'\n' +
		context.tab +
		')\n'
		+
		formatBlock(
			context,
			forExpr.block
		);

	return text;
};


/*
| Formats a for-in loop.
*/
var
formatForIn =
	function(
		context,
		expr
	)
{
	var
		text;

	text =
		context.tab
		+
		'for( var '
		+
		expr.variable
		+
		' in '
		+
		formatTerm(
			context.Inline,
			expr.object
		)
		+
		' )\n'
		+
		formatBlock(
			context,
			expr.block
		);

	return text;
};



/*
| Formats a return statement.
*/
var
formatReturn =
	function(
		context,
		statement
	)
{
	var
		text;

/**/if( CHECK )
/**/{
/**/	if( context.inline )
/**/	{
/**/		throw new Error(
/**/			'invalid inline'
/**/		);
/**/	}
/**/}

	try
	{
		// first tries to inline the
		// return expression.
		text =
			context.tab
			+
			'return '
			+
			formatExpression(
				context.Inline,
				statement.expr
			);

		return text;
	}
	catch( e )
	{
		if( e !== 'noinline' )
		{
			throw e;
		}
	}

	// no inline mode
	text =
		context.tab + 'return (\n'
		+
		formatExpression(
			context.Inc,
			statement.expr
		)
		+
		'\n'
		+
		context.tab + ')';

	return text;
};


/*
| Formats a switch statement
*/
var
formatSwitch =
	function(
		context,
		switchExpr
	)
{
	var
		caseContext =
			context.Inc,
		caseExpr,
		text;

	text =
		context.tab
		+
		'switch( '
		+
		formatTerm(
			context.Inline,
			switchExpr.statement
		)
		+
		' )\n'
		+
		context.tab + '{\n';

	for(
		var a = 0, aZ = switchExpr.ranks.length;
		a < aZ;
		a++
	)
	{
		caseExpr =
			switchExpr.atRank( a );

		if( a > 0 )
		{
			text +=
				'\n';
		}

		for(
			var b = 0, bZ = caseExpr.ranks.length;
			b < bZ;
			b++
		)
		{
			text +=
				caseContext.tab
				+
				'case '
				+
				formatTerm(
					caseContext.Inline,
					caseExpr.atRank( b )
				)
				+
				' :\n\n'
				+
				formatBlock(
					caseContext.Inc,
					caseExpr.block,
					true
				)
				+
				'\n'
				+
				caseContext.Inc.tab + 'break;\n';
		}
	}

	if( switchExpr.defaultCase )
	{
		if( switchExpr.ranks.length > 0 )
		{
			text +=
				'\n';
		}

		text +=
			caseContext.tab +
			'default :\n\n'
			+
			formatBlock(
				caseContext.Inc,
				switchExpr.defaultCase,
				true
			);
	}

	text +=
		context.tab +
		'}';

	return text;
};


/*
| Formats a function.
*/
var
formatFunc =
	function(
		context,
		func
	)
{
	var
		arg,
		comma,
		text;

	text =
		'function(\n';

	for(
		var a = 0, aZ = func.ranks.length;
		a < aZ;
		a++
	)
	{
		arg =
			func.twig[ func.ranks[ a ] ];

		comma =
			a + 1 < aZ ?
				','
				:
				'';

		text +=
			context.Inc.tab
			+
			( arg.name || '' )
			+
			comma
			+
			(
				arg.comment ?
					' // ' + arg.comment
					:
					''
			)
			+
			'\n';
	}

	text +=
		context.tab;

	// In VarDecs function bodies are decremented.
	if( context.root )
	{
		context =
			context.Dec;
	}


	text +=
		')\n'
		+
		formatBlock(
			context,
			func.block
		);

	return text;
};


/*
| Formats a statement.
*/
var
formatStatement =
	function(
		context,    // the indent in the text
		statement,  // the statement to be formated
		lookBehind, // the previous statement (or null)
		lookAhead   // the next statement (or null)
	)
{
	var
		text =
			'';

	if(
		lookBehind
		&&
		lookBehind.reflect !== 'Comment'
		&&
		!(
			lookBehind.reflect === 'VarDec'
			&&
			statement.reflect === 'VarDec'
		)
	)
	{
		text +=
			context.check ?
				'/**/\n'
				:
				'\n';

		if( context.root )
		{
			text +=
				context.check ?
					'/**/\n'
					:
					'\n';
		}
	}

	if( statement.reflect === 'Comment' )
	{
		text +=
			formatComment(
				context,
				statement
			);

		return text;
	}

	switch( statement.reflect )
	{
		case 'Check' :

			text +=
				formatCheck(
					context,
					statement
				);

			break;

		case 'If' :

			text +=
				formatIf(
					context,
					statement
				);

			break;

		case 'For' :

			text +=
				formatFor(
					context,
					statement
				);

			break;

		case 'ForIn' :

			text +=
				formatForIn(
					context,
					statement
			);

			break;

		case 'Return' :

			text +=
				formatReturn(
					context,
					statement
				);

			break;

		case 'VarDec' :

			text +=
				formatVarDec(
					context,
					statement,
					lookBehind
				);

			break;

		case 'Switch' :

			text +=
				formatSwitch(
					context,
					statement
				);

			break;

		default :

			text +=
				context.tab;

			text +=
				formatExpression(
					context,
					statement
				);
	}

	switch( statement.reflect )
	{
		case 'VarDec' :

			if(
				lookAhead
				&&
				lookAhead.reflect === 'VarDec'
			)
			{
				return text += ',\n';
			}
			else
			{
				return text += ';\n';
			}

			break;

		case 'Assign' :
		case 'Call' :
		case 'Fail' :
		case 'Return' :
		case 'Term' :

			return text += ';\n';

		case 'Check' :
		case 'For' :
		case 'ForIn' :
		case 'If' :
		case 'Switch' :

			return text += '\n';

		default :

			throw new Error( statement.reflect );
	}
};


/*
| Formats an expression.
*/
var
formatExpression =
	function(
		context, // context to be formated in
		expr     // the expression to format
	)
{
	switch( expr.reflect )
	{
		case 'And' :

			return formatAnd( context, expr );

		case 'Assign' :

			return formatAssign( context, expr );

		case 'Call' :

			return formatCall( context, expr );

		case 'Fail' :

			return formatFail( context, expr );

		case 'Func' :

			return formatFunc( context, expr );

		case 'New' :

			return formatNew( context, expr );

		case 'ObjLiteral' :

			return formatObjLiteral( context, expr );

		case 'Term' :

			return formatTerm( context, expr );

		case 'VList' :

			return formatVList( context, expr );

		default :

			throw new Error( expr.reflect );
	}
};


/*
| Formats a fail.
*/
var
formatFail =
	function(
		context,
		fail
	)
{
/**/if( CHECK )
/**/{
/**/	if( fail.reflect !== 'Fail' )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	if( fail.message === null )
	{
		return (
			'throw new Error( )'
		);
	}
	else
	{
		return (
			'throw new Error(\n'
			+
			context.Inc.tab + '\'' + fail.message + '\'\n'
			+
			context.tab + ')'
		);
	}
};


/*
| Formats a call.
*/
var
formatCall =
	function(
		context,
		call
	)
{
	var
		arg,
		text;

/**/if( CHECK )
/**/{
/**/	if( call.reflect !== 'Call' )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	if(
		context.inline
		&&
		call.ranks.length > 1
	)
	{
		throw 'noinline';
	}

	text =
		formatExpression(
			context,
			call.func
		);

	if( call.ranks.length === 0 )
	{
		text +=
			'( )';
	}
	else
	{
		text +=
			context.inline ?
				'( '
				:
				'(\n';

		for(
			var a = 0, aZ = call.ranks.length;
			a < aZ;
			a++
		)
		{
			arg =
				call.atRank( a );

			if( !context.inline )
			{
				text +=
					context.Inc.tab;
			}

			text +=
				formatExpression(
					context.Inc,
					arg
				);

			if( a + 1 < aZ )
			{
				text +=
					context.inline ?
						', '
						:
						',\n';
			}
			else
			{
				text +=
					context.inline ?
						' '
						:
						'\n';

			}
		}

		text +=
			context.inline ?
				')'
				:
				context.tab + ')';
	}

	return text;
};


/*
| Formats a new statement.
*/
var
formatNew =
	function(
		context,
		newexpr
	)
{
	var
		text =
			'';

/**/if( CHECK )
/**/{
/**/	if( newexpr.reflect !== 'New' )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	if( !context.inline )
	{
		text +=
			context.tab;
	}

	text +=
		'new ';

	text +=
		formatCall(
			context,
			newexpr.call
		);

	return text;
};


/*
| Formats an object literal.
|
| MAYBE format also inline
*/
var
formatObjLiteral =
	function(
		context,
		objliteral
	)
{
	var
		key,
		text =
			'';

/**/if( CHECK )
/**/{
/**/	if( objliteral.reflect !== 'ObjLiteral' )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	if( context.inline )
	{
		throw 'noinline';
	}


	text +=
		'{\n';

	for(
		var a = 0, aZ = objliteral.ranks.length;
		a < aZ;
		a++
	)
	{
		key =
			objliteral.ranks[ a ];

		text +=
			context.Inc.tab
			+
			key + ' :\n';

		text +=
			context.Inc.Inc.tab
			+
			formatExpression(
				context.Inc.Inc,
				objliteral.twig[ key ]
			)
			+
			(
				a + 1 < aZ ?
				',\n'
				:
				'\n'
			);
	}

	text +=
		context.tab
		+
		'}';

	return text;
};


/*
| Formats an term.
|
| FIXME remove
*/
var
formatTerm =
	function(
		context,
		term
	)
{

/**/if( CHECK )
/**/{
/**/	if( term.reflect !== 'Term' )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	return term.term;
};


/*
| Formats a variable declaration.
*/
var
formatVarDec =
	function(
		context,
		varDec,
		lookBehind
	)
{
	var
		// true when this is a root function
		isRootFunc =
			false,
		text =
			'';

	if(
		context.root
		&&
		varDec.assign
	)
	{
		if(
			varDec.assign.reflect === 'Func'
		)
		{
			isRootFunc =
				true;
		}
		else if(
			varDec.assign.reflect === 'Assign'
			&&
			varDec.assign.right.reflect === 'Func'
		)
		{
			// FUTURUE allow abitrary amount of assignments
			isRootFunc =
				true;
		}
	}

	if( !isRootFunc )
	{
		if(
			!lookBehind
			||
			lookBehind.reflect !== 'VarDec'
		)
		{
			if( !context.inline )
			{
				text +=
					context.tab + 'var' + '\n';
			}
			else
			{
				text +=
					'var ';
			}
		}

		if( !context.inline )
		{
			context =
				context.Inc;

			text +=
				context.tab;
		}

		text +=
			varDec.name;
	}
	else
	{
		// root functions are not combined in VarDecs
		text =
			context.tab + 'var ' + varDec.name;
	}

	if( varDec.assign )
	{
		text +=
			' =';

		if( !context.inline )
		{
			text +=
				'\n'
				+
				context.tab;
		}
		else
		{
			text +=
				' ';
		}

		if( varDec.assign.reflect !== 'Assign' )
		{
			context =
				context.Inc;
		}

		text +=
			formatExpression(
				context,
				varDec.assign
			);
	}

	return text;
};


/*
| Formats a variable list
|
| Used in for-loop initializers only.
*/
var
formatVList =
	function(
		context,
		vList
	)
{
	var
		text =
			'var ',
		varDec;

/**/if( CHECK )
/**/{
/**/	if( !context.inline )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	for(
		var a = 0, aZ = vList.ranks.length;
		a < aZ;
		a++
	)
	{
		varDec =
			vList.atRank( a );

		if( CHECK )
		{
			if( varDec.reflect !== 'VarDec' )
			{
				throw new Error( );
			}
		}

		text +=
			varDec.name;

		if( varDec.assign )
		{
			text +=
				' = ' +
				formatTerm(
					context,
					varDec.assign
				);
		}

		if( a + 1 < aZ )
		{
			text += ', ';
		}
	}

	return text;
};



/*
| Formats the capsule.
*/
var
formatCapsule =
	function(
		text,
		context,
		file
	)
{
	var
		capsule =
			file.capsule;

	text +=
		'/*\n' +
		'| Capulse.\n' +
		'*/\n' +
		'( function( ) {\n' +
		'\'use strict\';\n' +
		'\n\n';

	for(
		var a = 0, aZ = capsule.ranks.length;
		a < aZ;
		a++
	)
	{
		text +=
			formatStatement(
				context,
				capsule.atRank( a ),
				a > 0 ?
					capsule.atRank( a - 1 ) :
					null,
				a + 1 < aZ ?
					capsule.atRank( a + 1 ) :
					null
			);
	}

	text +=
		'\n\n} )( );\n';

	return text;
};


/*
| Formats a file.
*/
Formatter.format =
	function(
		file
	)
{
	var
		context =
			Context.create(
				'root',
					true
			),
		text =
			'';

	if( file.header )
	{
		text +=
			formatComment(
				context,
				file.header
			);
	}

	if( file.capsule )
	{
		if( file.header )
		{
			text +=
				'\n\n';
		}

		text =
			formatCapsule(
				text,
				context,
				file
			);
	}

	return text;
};


/*
| Node export.
*/
if( SERVER )
{
	module.exports =
		Formatter;
}


} )( );
