/*
| Formats an AST into a .js file
|
| Authors: Axel Kittenberger
*/


/*
| Export
*/
var
	formatter;

formatter = { };


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
	format;

format =
	{
		context :
			require( './context' )
	};


/*
| Expression precedence table.
*/
var
precTable =
	{
		'astAnd' :
			13,
		'astArrayLiteral' :
			-1,
		'astAssign' :
			17,
		'astBooleanLiteral' :
			-1,
		'astCall' :
			2,
		'astCommaList' :
			18,
		'astCondition' :
			15,
		'astDelete' :
			4,
		'astDiffers' :
			9,
		'astDot' :
			1,
		'astEquals' :
			9,
		'astFunc' :
			-1,
		'astGreaterThan' :
			8,
		'anIn' :
			8,
		'astInstanceof' :
			8,
		'astLessThan' :
			8,
		'astMember' :
			1,
		'astNew' :
			2,
		'astNot' :
			4,
		'astNull' :
			-1,
		'astNumberLiteral' :
			-1,
		'astObjLiteral' :
			-1,
		'astOr' :
			14,
		'astPlus' :
			6,
		'astPlusAssign' :
			17,
		'astPreIncrement' :
			3,
		'astString' :
			-1,
		'astTypeof' :
			4,
		'astVar' :
			-1,
		'astVList' :
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
/**/	if( expr.reflect !== 'ast.astAnd' )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	text =
		formatExpression(
			context,
			expr.left,
			precTable.astAnd
		)
		+
		context.sep
		+
		context.tab + '&&' + context.sep
		+
		formatExpression(
			context,
			expr.right,
			precTable.astAnd
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
		subtext,
		text;

	text = '';

	text +=
		formatExpression(
			context,
			assign.left,
			precTable.astAssign
		)
		+ ' ='
		+ context.sep;

	if( assign.right.reflect !== 'ast.astAssign' )
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
				precTable.astAssign
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
				precTable.astAssign
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
			'check', true
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
formatDiffers =
	function(
		context,
		expr
	)
{
	var
		text;

/**/if( CHECK )
/**/{
/**/	if( expr.reflect !== 'ast.astDiffers' )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	text =
		formatExpression(
			context,
			expr.left,
			precTable.astDiffers
		)
		+ context.sep
		+ context.tab + '!==' + context.sep
		+ formatExpression(
			context,
			expr.right,
			precTable.astDiffers
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
/**/	if( expr.reflect !== 'ast.astPlus' )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	text =
		formatExpression(
			context,
			expr.left,
			precTable.astPlus
		)
		+ context.sep
		+ context.tab
		+ '+'
		+ context.sep
		+ formatExpression(
			context,
			expr.right,
			precTable.astPlus
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
				precTable.astAssign
			)
			+
			' += '
			+
			formatExpression(
				context.Inline,
				assign.right,
				precTable.astAssign
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
formatDot =
	function(
		context,
		expr
	)
{
/**/if( CHECK )
/**/{
/**/	if( expr.reflect !== 'ast.astDot' )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	return (
		formatExpression(
			context,
			expr.expr,
			precTable.astDot
		)
		+ '.'
		+ expr.member
	);
};


/*
| Formats a member.
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
/**/	if( expr.reflect !== 'ast.astMember' )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	return (
		formatExpression(
			context,
			expr.expr,
			precTable.astMember
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
/**/	if( expr.reflect !== 'ast.astEquals' )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	text =
		formatExpression(
			context,
			expr.left,
			precTable.astEquals
		)
		+
		context.sep + context.tab
		+
		'==='
		+
		context.sep
		+
		formatExpression(
			context,
			expr.right,
			precTable.astEquals
		);

	return text;
};


/*
| Formats a condition expression.
|
| The ? : thing.
*/
var
formatCondition =
	function(
		context,
		expr
	)
{

/**/if( CHECK )
/**/{
/**/	if( expr.reflect !== 'ast.astCondition' )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	return (
		context.tab
		+ formatExpression(
			context,
			expr.condition,
			precTable.astCondition
		)
		+ context.sep
		+ '?'
		+ context.sep
		+ formatExpression(
			context,
			expr.then,
			precTable.astCondition
		)
		+ context.sep
		+ ':'
		+ context.sep
		+ formatExpression(
			context,
			expr.elsewise,
			precTable.astCondition
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
/**/	if( statement.reflect !== 'ast.astIf' )
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
formatAFor =
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
			precTable.anIn
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
/**/	if( expr.reflect !== 'ast.astLessThan' )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	text =
		formatExpression(
			context,
			expr.left,
			precTable.astLessThan
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
			precTable.astLessThan
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
/**/	if( expr.reflect !== 'ast.astGreaterThan' )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	text =
		formatExpression(
			context,
			expr.left,
			precTable.astGreaterThan
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
			precTable.astGreaterThan
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
/**/	if( expr.reflect !== 'ast.astInstanceof' )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	text =
		formatExpression(
			context,
			expr.left,
			precTable.astInstanceof
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
			precTable.astInstanceof
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
/**/	if( expr.reflect !== 'ast.astOr' )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	text =
		formatExpression(
			context,
			expr.left,
			precTable.astOr
		)
		+
		context.sep
		+
		context.tab + '||' + context.sep
		+
		formatExpression(
			context,
			expr.right,
			precTable.astOr
		);

	return text;
};



/*
| Formats a return statement.
*/
var
formatAReturn =
	function(
		context,
		statement
	)
{
	var
		text;

/**/if( CHECK )
/**/{
/**/	if( statement.reflect !== 'ast.astReturn' )
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
formatASwitch =
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

	text = '';

	subtext = null;

	if(
		lookBehind
		&&
		lookBehind.reflect !== 'ast.astComment'
		&&
		!(
			lookBehind.reflect === 'ast.aCarDec'
			&&
			statement.reflect === 'ast.astVarDec'
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

	if( statement.reflect === 'ast.astComment' )
	{
		text +=
			formatAComment(
				context,
				statement
			);

		return text;
	}

	switch( statement.reflect )
	{
		case 'ast.astCheck' :

			text += formatCheck( context, statement );

			break;

		case 'ast.astIf' :

			text += formatIf( context, statement );

			break;

		case 'ast.astFail' :

			try
			{
				subtext =
					context.tab
					+
					formatAFail( context.Inline, statement );
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
				text += subtext;
			}
			else
			{
				text += formatAFail( context, statement );
			}

			break;

		case 'ast.astFor' :

			text += formatAFor( context, statement );

			break;

		case 'ast.astForIn' :

			text += formatForIn( context, statement );

			break;

		case 'ast.astReturn' :

			text += formatAReturn( context, statement );

			break;

		case 'ast.astSwitch' :

			text += formatASwitch( context, statement );

			break;

		case 'ast.astVarDec' :

			text += formatVarDec( context, statement, lookBehind );

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

	switch( statement.reflect )
	{
		case 'ast.astVarDec' :

			if(
				lookAhead
				&&
				lookAhead.reflect === 'ast.astVarDec'
			)
			{
				return text += ',\n';
			}
			else
			{
				return text += ';\n';
			}

			break;

		case 'ast.astAssign' :
		case 'ast.astBooleanLiteral' :
		case 'ast.astCall' :
		case 'ast.astDelete' :
		case 'ast.astFail' :
		case 'ast.astNew' :
		case 'ast.astNumberLiteral' :
		case 'ast.astPlusAssign' :
		case 'ast.astReturn' :
		case 'ast.astString' :
		case 'ast.astVar' :

			return text + ';' + context.sep;

		case 'ast.astCheck' :
		case 'ast.astFor' :
		case 'ast.astForIn' :
		case 'ast.astIf' :
		case 'ast.astSwitch' :

			return text + context.sep;

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

	prec = precTable[ expr.reflectName ];

	if( prec === undefined )
	{
		throw new Error( expr.reflectName );
	}

	formatter = exprFormatter[ expr.reflectName ];

	if( !formatter )
	{
		throw new Error( expr.reflectName );
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
formatAFail =
	function(
		context,
		fail
	)
{
	var
		checkContext,
		messageContext,
		result;

/**/if( CHECK )
/**/{
/**/	if( fail.reflect !== 'ast.astFail' )
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

	if( context.check )
	{
		messageContext = context;

		result = '';
	}
	else
	{
		checkContext = context.create( 'check', true );

		messageContext = checkContext.Inc;

		result =
			checkContext.tab
			+
			'if( CHECK )'
			+
			checkContext.sep + checkContext.tab + '{'
			+
			checkContext.sep;
	}

	result +=
		messageContext.tab
		+
		'throw new Error('
		+
		messageContext.sep
		+
		formatExpression(
			messageContext.Inc,
			fail.message,
			null
		)
		+
		messageContext.sep + messageContext.tab
		+
		')';

	if( !context.check )
	{
		result +=
			';'
			+
			checkContext.sep
			+
			checkContext.tab + '}'
			+
			checkContext.sep
			+
			checkContext.sep
			+
			context.tab + 'throw new Error( )';
	}

	return result;
};


/*
| Formats a boolean literal use.
*/
var
formatBooleanLiteral =
	function(
		context,
		expr
	)
{

/**/if( CHECK )
/**/{
/**/	if( expr.reflect !== 'ast.astBooleanLiteral' )
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
formatCall =
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
/**/	if( call.reflect !== 'ast.astCall' )
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
formatDelete =
	function(
		context,
		expr
	)
{

/**/if( CHECK )
/**/{
/**/	if( expr.reflect !== 'ast.astDelete' )
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
			precTable.astDelete
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
/**/	if( expr.reflect !== 'ast.astNew' )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	return(
		context.tab
		+
		'new '
		+
		formatCall(
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
/**/	if( expr.reflect !== 'ast.astNot' )
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
			precTable.astNot
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
/**/	if( expr.reflect !== 'ast.astNull' )
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
formatArrayLiteral =
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
/**/	if( expr.reflect !== 'ast.astArrayLiteral' )
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
				precTable.astArrayLiteral
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
/**/	if( objliteral.reflect !== 'ast.astObjLiteral' )
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
/**/	if( expr.reflect !== 'ast.astPreIncrement' )
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
			precTable.astPreIncrement
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
/**/	if( expr.reflect !== 'ast.astTypeof' )
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
			precTable.astTypeof
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
/**/	if( expr.reflect !== 'ast.astVar' )
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
/**/	if( expr.reflect !== 'ast.astNumberLiteral' )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	return context.tab + '' + expr.number;
};


/*
| Formats a string literal.
*/
var
formatString =
	function(
		context,
		expr
	)
{

/**/if( CHECK )
/**/{
/**/	if( expr.reflect !== 'ast.astString' )
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
	isRootFunc = false;

	text = '';

	if(
		context.root
		&&
		varDec.assign
	)
	{
		if(
			varDec.assign.reflect === 'ast.astFunc'
		)
		{
			isRootFunc = true;
		}
		else if(
			varDec.assign.reflect === 'ast.astAssign'
			&&
			varDec.assign.right.reflect === 'ast.astFunc'
		)
		{
			// FUTURUE allow abitrary amount of assignments
			isRootFunc = true;
		}
	}

	if( !isRootFunc )
	{
		if(
			!lookBehind
			||
			lookBehind.reflect !== 'ast.astVarDec'
		)
		{
			if( !context.inline )
			{
				text += context.tab + 'var' + '\n';
			}
			else
			{
				text += 'var ';
			}
		}

		if( !context.inline )
		{
			context = context.Inc;

			text += context.tab;
		}

		text += varDec.name;
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

		if( varDec.assign.reflect !== 'ast.astAssign' )
		{
			context = context.Inc;
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

		text += aText;
	}

	return text;
};


/*
| Formats a comma list operator
*/
var
formatCommaList =
	function(
		context,
		list
	)
{
	var
		expr,
		text;

	text = '';

	for(
		var a = 0, aZ = list.ranks.length;
		a < aZ;
		a++
	)
	{
		expr = list.atRank( a );

		text +=
			(
				a > 0
				? ( ',' + context.sep )
				: ''
			)
			+
			formatExpression(
				context.Inc,
				expr,
				precTable.astCommaList
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
		varDec = vList.atRank( a );

		if( CHECK )
		{
			if( varDec.reflect !== 'ast.astVarDec' )
			{
				throw new Error( );
			}
		}

		text += varDec.name;

		if( varDec.assign )
		{
			text +=
				' = ' +
				formatExpression(
					context,
					varDec.assign,
					precTable.astAssign
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
formatter.format =
	function(
		file
	)
{
	var
		context,
		text,
		doSep;

	context =
		format.context.create(
			'root',
				true
		);

	text = '';

	// do a seperator?
	doSep = false;

	if( file.header )
	{
		text +=
			formatAComment(
				context,
				file.header
			);

		doSep = true;
	}

	if( file.preamble )
	{
		if( doSep )
		{
			text += '\n\n';
		}

		text +=
			formatBlock(
				context,
				file.preamble,
				true
			);

		doSep = true;
	}

	if( file.capsule )
	{
		if( doSep )
		{
			text += '\n\n';
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
		'astAnd' :
			formatAnd,
		'astArrayLiteral' :
			formatArrayLiteral,
		'astAssign' :
			formatAssign,
		'astBooleanLiteral' :
			formatBooleanLiteral,
		'astCall' :
			formatCall,
		'astCommaList' :
			formatCommaList,
		'astCondition' :
			formatCondition,
		'astDelete' :
			formatDelete,
		'astDiffers' :
			formatDiffers,
		'astDot' :
			formatDot,
		'astEquals' :
			formatEquals,
		'astFunc' :
			formatFunc,
		'astGreaterThan' :
			formatGreaterThan,
		'astInstanceof' :
			formatInstanceof,
		'astLessThan' :
			formatLessThan,
		'astMember' :
			formatMember,
		'astNew' :
			formatNew,
		'astNot' :
			formatNot,
		'astNull' :
			formatNull,
		'astNumberLiteral' :
			formatNumberLiteral,
		'astObjLiteral' :
			formatObjLiteral,
		'astOr' :
			formatOr,
		'astPlus' :
			formatPlus,
		'astPlusAssign' :
			formatPlusAssign,
		'astPreIncrement' :
			formatPreIncrement,
		'astString' :
			formatString,
		'astTypeof' :
			formatTypeof,
		'astVar' :
			formatVar,
		'astVList' :
			formatVList
	};


/*
| Node export.
*/
if( SERVER )
{
	module.exports = formatter;
}


} )( );
