/*
| Formats an AST into a .js file
|
| Authors: Axel Kittenberger
*/


/*
| Export
*/
var
	Formatter;

Formatter =
		{ };


/*
| Capsule
*/
(function() {
'use strict';

/*
| Constants.
*/
var MAX_TEXT_WIDTH = 79;

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
| Expression precedence table.
*/
var
precTable =
	{
		'anAnd' :
			13,
		'anArrayLiteral' :
			-1,
		'anAssign' :
			17,
		'aBooleanLiteral' :
			-1,
		'aCall' :
			2,
		'aCommaList' :
			18,
		'aCondition' :
			15,
		'aDelete' :
			4,
		'aDiffers' :
			9,
		'aDot' :
			1,
		'Equals' :
			9,
		'Func' :
			-1,
		'In' :
			8,
		'Instanceof' :
			8,
		'GreaterThan' :
			8,
		'LessThan' :
			8,
		'Member' :
			1,
		'New' :
			2,
		'Not' :
			4,
		'aNull' :
			-1,
		'NumberLiteral' :
			-1,
		'ObjLiteral' :
			-1,
		'Or' :
			14,
		'Plus' :
			6,
		'PlusAssign' :
			17,
		'PreIncrement' :
			3,
		'Typeof' :
			4,
		'StringLiteral' :
			-1,
		'Var' :
			-1,
		'VList' :
			-1
	};


/*
| Returns the length of a text
*/
var
textLen =
	function(
		txt
	)
{
	return txt.replace( '\t', '        ' ).length;
};


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
/**/	if( expr.reflex !== 'code.anAnd' )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	text =
		formatExpression(
			context,
			expr.left,
			precTable.anAnd
		)
		+
		context.sep
		+
		context.tab + '&&' + context.sep
		+
		formatExpression(
			context,
			expr.right,
			precTable.anAnd
		);

	return text;
};


/*
| Formats an assignment.
*/
var
formatAnAssign =
	function(
		context,
		assign
	)
{
	var
		subtext,
		text;

	text = '';

	text +=
		formatExpression(
			context,
			assign.left,
			precTable.anAssign
		)
		+ ' ='
		+ context.sep;

	if( assign.right.reflex !== 'code.assign' )
	{
		context =
			context.IncSame;
	}

	try
	{
		subtext = null;

		subtext =
			context.tab
			+
			formatExpression(
				context.Inline,
				assign.right,
				precTable.anAssign
			);
	}
	catch( e )
	{
		// rethrows any real error
		if( e !== 'noinline' )
		{
			throw e;
		}

		// forwards noinline if this was a noinline
		if( context.inline )
		{
			throw 'noinline';
		}
	}

	if( subtext !== null && textLen( subtext ) < MAX_TEXT_WIDTH )
	{
		text += subtext;
	}
	else
	{
		text +=
			formatExpression(
				context,
				assign.right,
				precTable.anAssign
			);
	}

	return text;
};



/*
| Formats a comment.
*/
var
formatAComment =
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
		c = comment.content[ a ];

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

	text += '*/' + '\n';

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
	if(
		context.inline
		&&
		block.ranks.length > 1
	)
	{
		throw 'noinline';
	}

	if( !noBrackets )
	{
		text =
			context.tab + '{' + context.sep;

		blockContext = context.Inc;
	}
	else
	{
		blockContext = context;
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
		text += context.tab + '}';
	}

	return text;
};


/*
| Formats a difference check.
*/
var
formatADiffers =
	function(
		context,
		expr
	)
{
	var
		text;

/**/if( CHECK )
/**/{
/**/	if( expr.reflex !== 'code.aDiffers' )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	text =
		formatExpression(
			context,
			expr.left,
			precTable.aDiffers
		)
		+ context.sep
		+ context.tab + '!==' + context.sep
		+ formatExpression(
			context,
			expr.right,
			precTable.aDiffers
		);

	return text;
};


/*
| Formats a Plus.
*/
var
formatPlus =
	function(
		context,
		expr
	)
{
	var
		text;

/**/if( CHECK )
/**/{
/**/	if( expr.reflex !== 'code.plus' )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	text =
		formatExpression(
			context,
			expr.left,
			precTable.Plus
		)
		+ context.sep
		+ context.tab
		+ '+'
		+ context.sep
		+ formatExpression(
			context,
			expr.right,
			precTable.Plus
		);

	return text;
};


/*
| Formats a plus-assignment.
*/
var
formatPlusAssign =
	function(
		context,
		assign
	)
{
	var
		text;

	text =
		'';


	context =
		context.IncSame;

	try
	{
		// first tries to inline the
		// return expression.
		text =
			null;

		text =
			formatExpression(
				context.Inline,
				assign.left,
				precTable.anAssign
			)
			+ ' += '
			+ formatExpression(
				context.Inline,
				assign.right,
				precTable.anAssign
			);
	}
	catch( e )
	{
		// rethrows any real error
		if( e !== 'noinline' )
		{
			throw e;
		}
	}

	if( text !== null && textLen( text ) < MAX_TEXT_WIDTH )
	{
		return text;
	}

	// caller requested inline, but cannot do.
	if( context.inline )
	{
		throw 'noinline';
	}

	throw 'FUTURE: implement noinline +=';
};


/*
| Formats a Dot.
*/
var
formatADot =
	function(
		context,
		expr
	)
{
/**/if( CHECK )
/**/{
/**/	if( expr.reflex !== 'code.aDot' )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	return (
		formatExpression(
			context,
			expr.expr,
			precTable.aDot
		)
		+ '.'
		+ expr.member
	);
};


/*
| Formats a Member.
*/
var
formatMember =
	function(
		context,
		expr
	)
{
/**/if( CHECK )
/**/{
/**/	if( expr.reflex !== 'code.member' )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	return (
		formatExpression(
			context,
			expr.expr,
			precTable.Member
		)
		+ '['
		+ context.sep
		+ formatExpression(
			context.Inc,
			expr.member,
			null
		)
		+ context.sep
		+ context.tab
		+ ']'
	);
};


/*
| Formats an equality check.
*/
var
formatEquals =
	function(
		context,
		expr
	)
{
	var
		text;

/**/if( CHECK )
/**/{
/**/	if( expr.reflex !== 'code.equals' )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	text =
		formatExpression(
			context,
			expr.left,
			precTable.Equals
		)
		+ context.sep
		+ context.tab
		+ '==='
		+ context.sep
		+ formatExpression(
			context,
			expr.right,
			precTable.Equals
		);

	return text;
};


/*
| Formats a condition expression.
|
| The ? : thing.
*/
var
formatACondition =
	function(
		context,
		expr
	)
{

/**/if( CHECK )
/**/{
/**/	if( expr.reflex !== 'code.aCondition' )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	return (
		context.tab
		+ formatExpression(
			context,
			expr.condition,
			precTable.aCondition
		)
		+ context.sep
		+ '?'
		+ context.sep
		+ formatExpression(
			context,
			expr.then,
			precTable.aCondition
		)
		+ context.sep
		+ ':'
		+ context.sep
		+ formatExpression(
			context,
			expr.elsewise,
			precTable.aCondition
		)
	);
};



/*
| Formats an if statement.
*/
var
formatIf =
	function(
		context,
		statement
	)
{
	var
		cond = statement.condition,

		text = null;

/**/if( CHECK )
/**/{
/**/	if( statement.reflex !== 'code.if' )
/**/	{
/**/		throw new Error( );
/**/	}
/**/
/**/	if( context.inline )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	try {
		text =
			context.tab
			+ 'if( '
			+ formatExpression(
				context.Inline,
				cond,
				null
			)
			+ ' )\n';
	}
	catch ( e )
	{
		// rethrows any real error
		if( e !== 'noinline' )
		{
			throw e;
		}
	}

	if( text === null || textLen( text ) > MAX_TEXT_WIDTH )
	{
		text =
			context.tab + 'if(\n'
			+
			formatExpression(
				context.Inc,
				cond,
				null
			) + '\n'
			+
			context.tab + ')\n';
	}

	text +=
		formatBlock(
			context,
			statement.then
		);

	if( statement.elsewise )
	{
		text +=
			'\n'
			+ context.tab
			+ 'else\n'
			+ formatBlock(
				context,
				statement.elsewise
			);
	}

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
			forExpr.init,
			null
		) +
		';\n' +
		forContext.tab +
		formatExpression(
			forContext.Inline,
			forExpr.condition,
			null
		) +
		';\n' +
		forContext.tab +
		formatExpression(
			forContext.Inline,
			forExpr.iterate,
			null
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
		formatExpression(
			context.Inline,
			expr.object,
			precTable.In
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
| Formats a less-than check.
*/
var
formatLessThan =
	function(
		context,
		expr
	)
{
	var
		text;

/**/if( CHECK )
/**/{
/**/	if( expr.reflex !== 'code.lessThan' )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	text =
		formatExpression(
			context,
			expr.left,
			precTable.LessThan
		)
		+
		context.sep
		+
		context.tab
		+
		'<'
		+
		context.sep
		+
		formatExpression(
			context,
			expr.right,
			precTable.LessThan
		);

	return text;
};


/*
| Formats a more-than check.
*/
var
formatGreaterThan =
	function(
		context,
		expr
	)
{
	var
		text;

/**/if( CHECK )
/**/{
/**/	if( expr.reflex !== 'code.greaterThan' )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	text =
		formatExpression(
			context,
			expr.left,
			precTable.GreaterThan
		)
		+
		context.sep
		+
		context.tab
		+
		'>'
		+
		context.sep
		+
		formatExpression(
			context,
			expr.right,
			precTable.GreaterThan
		);

	return text;
};


/*
| Formats an instanceof expression.
*/
var
formatInstanceof =
	function(
		context,
		expr
	)
{
	var
		text;

/**/if( CHECK )
/**/{
/**/	if( expr.reflex !== 'code.instanceof' )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	text =
		formatExpression(
			context,
			expr.left,
			precTable.Instanceof
		)
		+
		context.sep
		+
		context.tab
		+
		'instanceof'
		+
		context.sep
		+
		formatExpression(
			context,
			expr.right,
			precTable.Instanceof
		);

	return text;
};

/*
| Formats a logical or.
*/
var
formatOr =
	function(
		context,
		expr
	)
{
	var
		text;

/**/if( CHECK )
/**/{
/**/	if( expr.reflex !== 'code.or' )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	text =
		formatExpression(
			context,
			expr.left,
			precTable.Or
		)
		+
		context.sep
		+
		context.tab + '||' + context.sep
		+
		formatExpression(
			context,
			expr.right,
			precTable.Or
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
/**/	if( statement.reflex !== 'code.return' )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	try
	{
		// first tries to inline the
		// return expression.
		text =
			null;

		text =
			context.tab
			+
			'return '
			+
			formatExpression(
				context.Inline,
				statement.expr,
				null
			);
	}
	catch( e )
	{
		// rethrows any real error
		if( e !== 'noinline' )
		{
			throw e;
		}
	}

	if( text !== null && textLen( text ) < MAX_TEXT_WIDTH )
	{
		return text;
	}

	// caller requested inline, but cannot do.
	if( context.inline )
	{
		throw 'noinline';
	}

	// no inline mode
	text =
		context.tab + 'return (\n'
		+
		formatExpression(
			context.Inc,
			statement.expr,
			null
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
		formatExpression(
			context.Inline,
			switchExpr.statement,
			null
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
				formatExpression(
					caseContext.Inline,
					caseExpr.atRank( b ),
					null
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
		argSpace,
		comma,
		text;

	text =
		context.tab;

	if( func.ranks.length === 0 )
	{
		text +=
			'function( )' + context.sep;
	}
	else
	{
		text +=
			'function(' + context.sep;

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

			argSpace =
				arg.name ?
					' '
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
						argSpace + '// ' + arg.comment
						:
						''
				)
				+
				'\n';
		}

		text +=
			context.tab + ')' + context.sep;
	}

	// In VarDecs function bodies are decremented.
	if( context.root )
	{
		context =
			context.Dec;
	}

	text +=
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
		context,    // context to be formated in
		statement,  // the statement to be formated
		lookBehind, // the previous statement (or null)
		lookAhead   // the next statement (or null)
	)
{
	var
		text,
		subtext;

	text =
		'';

	subtext =
		null;

	if(
		lookBehind
		&&
		lookBehind.reflex !== 'code.aComment'
		&&
		!(
			lookBehind.reflex === 'code.varDec'
			&&
			statement.reflex === 'code.varDec'
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

	if( statement.reflex === 'code.aComment' )
	{
		text +=
			formatAComment(
				context,
				statement
			);

		return text;
	}

	switch( statement.reflex )
	{
		case 'code.aCheck' :

			text +=
				formatCheck( context, statement );

			break;

		case 'code.if' :

			text +=
				formatIf( context, statement );

			break;

		case 'code.fail' :

			try
			{
				subtext =
					context.tab
					+
					formatFail( context.Inline, statement );
			}
			catch( e )
			{
				// rethrows any real error
				if( e !== 'noinline' )
				{
					throw e;
				}
			}

			if( subtext !== null && textLen( subtext ) < MAX_TEXT_WIDTH )
			{
				text +=
					subtext;
			}
			else
			{
				text +=
					formatFail( context, statement );
			}

			break;

		case 'code.for' :

			text +=
				formatFor( context, statement );

			break;

		case 'code.forIn' :

			text +=
				formatForIn( context, statement );

			break;

		case 'code.return' :

			text +=
				formatReturn( context, statement );

			break;

		case 'code.varDec' :

			text +=
				formatVarDec( context, statement, lookBehind );

			break;

		case 'code.switch' :

			text +=
				formatSwitch( context, statement );

			break;

		default :

			try
			{
				subtext =
					context.tab
					+
					formatExpression(
						context.Inline,
						statement,
						null
					);
			}
			catch( e )
			{
				// rethrows any real error
				if( e !== 'noinline' )
				{
					throw e;
				}
			}

			if( subtext !== null && textLen( subtext ) < MAX_TEXT_WIDTH )
			{
				text +=
					subtext;
			}
			else
			{
				text +=
					formatExpression(
						context,
						statement,
						null
					);
			}
	}

	switch( statement.reflex )
	{
		case 'code.varDec' :

			if(
				lookAhead
				&&
				lookAhead.reflex === 'code.varDec'
			)
			{
				return text += ',\n';
			}
			else
			{
				return text += ';\n';
			}

			break;

		case 'code.anAssign' :
		case 'code.aBooleanLiteral' :
		case 'code.aCall' :
		case 'code.aDelete' :
		case 'code.fail' :
		case 'code.new' :
		case 'code.numberLiteral' :
		case 'code.plusAssign' :
		case 'code.return' :
		case 'code.stringLiteral' :
		case 'code.var' :

			return text + ';' + context.sep;

		case 'code.aCheck' :
		case 'code.for' :
		case 'code.forIn' :
		case 'code.if' :
		case 'code.switch' :

			return text + context.sep;

		default :

			throw new Error( statement.reflex );
	}
};


/*
| Formats an expression.
*/
var
formatExpression =
	function(
		context, // context to be formated in
		expr,    // the expression to format
		pprec    // the operator precedence of the parenting expresson
	)
{
	var
		bracket,
		formatter,
		prec,
		subcontext,
		subtext,
		text;

	prec = precTable[ expr.reflect ];

	if( prec === undefined )
	{
		throw new Error( expr.reflect );
	}

	formatter = exprFormatter[ expr.reflect ];

	if( !formatter )
	{
		throw new Error( expr.reflect );
	}

	bracket =
		pprec !== null && prec > pprec;

	subcontext =
		context;

	text =
		'';

	if( bracket )
	{
		text =
			context.tab + '(' + context.sep;

		subcontext =
			context.Inc;
	}

	subtext =
		null;

	if(
		!subcontext.inline
		&&
		!bracket
		&&
		pprec !== null && prec < pprec
	)
	{
		// tries to go inline
		try
		{
			subtext =
				subcontext.tab
				+
				formatter( subcontext.Inline, expr );
		}
		catch( e )
		{
			// rethrows any real error
			if( e !== 'noinline' )
			{
				throw e;
			}
		}
	}

	if( subtext === null || textLen( subtext ) > MAX_TEXT_WIDTH )
	{
		subtext = formatter( subcontext, expr );
	}

	text += subtext;

	if( bracket )
	{
		text += context.sep + context.tab + ')';
	}

	return text;
};


/*
| Formats a fail statement.
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
/**/	if( fail.reflex !== 'code.fail' )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	if( fail.message === null )
	{
		return (
			context.tab + 'throw new Error( )'
		);
	}

	return (
		context.tab
		+
		'throw new Error('
		+
		context.sep
		+
		formatExpression(
			context.Inc,
			fail.message,
			null
		)
		+
		context.sep
		+
		context.tab
		+
		')'
	);
};


/*
| Formats a boolean literal use.
*/
var
formatABooleanLiteral =
	function(
		context,
		expr
	)
{

/**/if( CHECK )
/**/{
/**/	if( expr.reflex !== 'code.aBooleanLiteral' )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	return (
		context.tab +
		(
			expr.boolean
			?
			'true'
			:
			'false'
		)
	);
};


/*
| Formats a call.
*/
var
formatACall =
	function(
		context,
		call,
		snuggle
	)
{
	var
		arg,
		text;

/**/if( CHECK )
/**/{
/**/	if( call.reflex !== 'code.aCall' )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	text =
		formatExpression(
			snuggle ? context.Inline : context,
			call.func,
			null
		);

	if( call.ranks.length === 0 )
	{
		text +=
			'( )';
	}
	else
	{
		text +=
			'(' + context.sep;

		for(
			var a = 0, aZ = call.ranks.length;
			a < aZ;
			a++
		)
		{
			arg =
				call.atRank( a );

			text +=
				formatExpression(
					context.Inc,
					arg,
					null
				);

			if( a + 1 < aZ )
			{
				text +=
					',' + context.sep;
			}
			else
			{
				text +=
					context.sep;
			}
		}

		text +=
			context.tab + ')';
	}

	return text;
};


/*
| Formats a delete expression.
*/
var
formatADelete =
	function(
		context,
		expr
	)
{

/**/if( CHECK )
/**/{
/**/	if( expr.reflex !== 'code.aDelete' )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	return(
		context.tab
		+
		'delete '
		+
		formatExpression(
			context,
			expr.expr,
			precTable.aDelete
		)
	);
};



/*
| Formats a new expression.
*/
var
formatNew =
	function(
		context,
		expr
	)
{

/**/if( CHECK )
/**/{
/**/	if( expr.reflex !== 'code.new' )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	return(
		context.tab
		+
		'new '
		+
		formatACall(
			context,
			expr.call,
			true
		)
	);
};


/*
| Formats a not expression.
*/
var
formatNot =
	function(
		context,
		expr
	)
{

/**/if( CHECK )
/**/{
/**/	if( expr.reflex !== 'code.not' )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	return(
		context.tab
		+
		'!'
		+
		formatExpression(
			context,
			expr.expr,
			precTable.Not
		)
	);
};


/*
| Formats a null.
*/
var
formatNull =
	function(
		context,
		expr
	)
{
/**/if( CHECK )
/**/{
/**/	if( expr.reflex !== 'code.aNull' )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	return context.tab + 'null';
};


/*
| Formats an array literal.
|
| FUTURE format also inline
*/
var
formatAnArrayLiteral =
	function(
		context,
		expr
	)
{
	var
		key,
		text =
			'';

/**/if( CHECK )
/**/{
/**/	if( expr.reflex !== 'code.anArrayLiteral' )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}


	if( expr.ranks.length === 0 )
	{
		return context.tab + '[ ]';
	}

	if( context.inline )
	{
		throw 'noinline';
	}

	text +=
		context.tab + '[\n';

	for(
		var a = 0, aZ = expr.ranks.length;
		a < aZ;
		a++
	)
	{
		key =
			expr.ranks[ a ];

		text +=
			formatExpression(
				context.Inc,
				expr.twig[ key ],
				precTable.anArrayLiteral
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
		']';

	return text;
};


/*
| Formats an object literal.
|
| FUTURE format also inline
*/
var
formatObjLiteral =
	function(
		context,
		objliteral  // FIXME call expr
	)
{
	var
		key,
		text =
			'';

/**/if( CHECK )
/**/{
/**/	if( objliteral.reflex !== 'code.objLiteral' )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}


	if( objliteral.ranks.length === 0 )
	{
		return context.tab + '{ }';
	}

	if( context.inline )
	{
		throw 'noinline';
	}

	text +=
		context.tab + '{\n';

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
			formatExpression(
				context.Inc.Inc,
				objliteral.twig[ key ],
				null // FIXME precTable.Objliteral
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
| Formats a pre-increment.
*/
var
formatPreIncrement =
	function(
		context,
		expr
	)
{

/**/if( CHECK )
/**/{
/**/	if( expr.reflex !== 'code.preIncrement' )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	return(
		context.tab
		+
		'++'
		+
		formatExpression(
			context,
			expr.expr,
			precTable.PreIncrement
		)
	);
};


/*
| Formats a typeof expression.
*/
var
formatTypeof =
	function(
		context,
		expr
	)
{

/**/if( CHECK )
/**/{
/**/	if( expr.reflex !== 'code.typeof' )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	return(
		context.tab
		+
		'typeof('
		+
		context.sep
		+
		formatExpression(
			context.Inc,
			expr.expr,
			precTable.Typeof
		)
		+
		context.sep
		+
		')'
	);
};




/*
| Formats a variable use.
*/
var
formatVar =
	function(
		context,
		expr
	)
{

/**/if( CHECK )
/**/{
/**/	if( expr.reflex !== 'code.var' )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	return context.tab + expr.name;
};


/*
| Formats a string literal use.
*/
var
formatNumberLiteral =
	function(
		context,
		expr
	)
{

/**/if( CHECK )
/**/{
/**/	if( expr.reflex !== 'code.numberLiteral' )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	return context.tab + '' + expr.number;
};


/*
| Formats a string literal use.
*/
var
formatStringLiteral =
	function(
		context,
		expr
	)
{

/**/if( CHECK )
/**/{
/**/	if( expr.reflex !== 'code.stringLiteral' )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	return context.tab + '\'' + expr.string + '\'';
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
		aText,       // formated assignment
		isRootFunc,
		text;

	// true when this is a root function
	isRootFunc =
		false;

	text =
		'';

	if(
		context.root
		&&
		varDec.assign
	)
	{
		if(
			varDec.assign.reflex === 'code.func'
		)
		{
			isRootFunc =
				true;
		}
		else if(
			varDec.assign.reflex === 'code.assign'
			&&
			varDec.assign.right.reflex === 'code.func'
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
			lookBehind.reflex !== 'code.varDec'
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
			' =' + context.sep;

		if( varDec.assign.reflex !== 'code.assign' )
		{
			context =
				context.Inc;
		}

		aText =
			null;

		try
		{
			aText =
				context.tab
				+
				formatExpression(
					context.Inline,
					varDec.assign,
					null
				);
		}
		catch ( e )
		{
			// rethrows any real error
			if( e !== 'noinline' )
			{
				throw e;
			}
		}

		if( aText === null || textLen( aText ) > MAX_TEXT_WIDTH )
		{
			aText =
				formatExpression(
					context,
					varDec.assign,
					null
				);
		}

		text +=
			aText;
	}

	return text;
};


/*
| Formats a comma list operator
*/
var
formatACommaList =
	function(
		context,
		list
	)
{
	var
		expr,
		text;

	text =
		'';

	for(
		var a = 0, aZ = list.ranks.length;
		a < aZ;
		a++
	)
	{
		expr =
			list.atRank( a );

		text +=
			(
				a > 0
				? ( ',' + context.sep )
				: ''
			)
			+ formatExpression(
				context.Inc,
				expr,
				precTable.aCommaList
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
			if( varDec.reflex !== 'code.varDec' )
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
				formatExpression(
					context,
					varDec.assign,
					precTable.anAssign
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
		context,
		capsule
	)
{
	var
		text;

	text =
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
			'',
		// do a seperator?
		doSep =
			false;

	if( file.header )
	{
		text +=
			formatAComment(
				context,
				file.header
			);

		doSep =
			true;
	}

	if( file.preamble )
	{
		if( doSep )
		{
			text +=
				'\n\n';
		}

		text +=
			formatBlock(
				context,
				file.preamble,
				true
			);

		doSep =
			true;
	}

	if( file.capsule )
	{
		if( doSep )
		{
			text +=
				'\n\n';
		}

		text +=
			formatCapsule(
				context,
				file.capsule
			);
	}

	return text;
};


/*
| Table of all expression formatters.
*/
var
exprFormatter =
	{
		'anAnd' :
			formatAnd,
		'anArrayLiteral' :
			formatAnArrayLiteral,
		'anAssign' :
			formatAnAssign,
		'aBooleanLiteral' :
			formatABooleanLiteral,
		'aCall' :
			formatACall,
		'aCommaList' :
			formatACommaList,
		'aCondition' :
			formatACondition,
		'aDelete' :
			formatADelete,
		'aDiffers' :
			formatADiffers,
		'aDot' :
			formatADot,
		'Equals' :
			formatEquals,
		'Func' :
			formatFunc,
		'GreaterThan' :
			formatGreaterThan,
		'Instanceof' :
			formatInstanceof,
		'LessThan' :
			formatLessThan,
		'Member' :
			formatMember,
		'New' :
			formatNew,
		'Not' :
			formatNot,
		'aNull' :
			formatNull,
		'NumberLiteral' :
			formatNumberLiteral,
		'ObjLiteral' :
			formatObjLiteral,
		'Or' :
			formatOr,
		'Plus' :
			formatPlus,
		'PlusAssign' :
			formatPlusAssign,
		'PreIncrement' :
			formatPreIncrement,
		'StringLiteral' :
			formatStringLiteral,
		'Typeof' :
			formatTypeof,
		'Var' :
			formatVar,
		'VList' :
			formatVList
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
