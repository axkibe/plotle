/*
| Formats an AST into a .js file.
*/


var
	format_context,
	format_formatter;


/*
| Capsule
*/
(function() {
'use strict';


/*
| Constants.
*/
var MAX_TEXT_WIDTH = 79;



format_formatter =
module.exports =
	{ };

format_context = require( './context' );


/*
| Expression precedence table.
*/
var
precTable =
	{
		'ast_and' : 13,
		'ast_arrayLiteral' : -1,
		'ast_assign' : 17,
		'ast_boolean' : -1,
		'ast_call' : 2,
		'ast_commaList' : 18,
		'ast_condition' : 15,
		'ast_delete' : 4,
		'ast_differs' : 9,
		'ast_dot' : 1,
		'ast_equals' : 9,
		// this is random guess, must be larger than call
		// so the capsule is generated right.
		'ast_func' : 3,
		'ast_greaterThan' : 8,
		'ast_in' : 8,
		'ast_instanceof' : 8,
		'ast_lessThan' : 8,
		'ast_member' : 1,
		'ast_new' : 2,
		'ast_not' : 4,
		'ast_null' : -1,
		'ast_number' : -1,
		'ast_objLiteral' : -1,
		'ast_or' : 14,
		'ast_plus' : 6,
		'ast_plusAssign' : 17,
		'ast_preIncrement' : 3,
		'ast_string' : -1,
		'astTypeof' : 4,
		'astVar' : -1
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
/**/	if( expr.reflect !== 'ast_and' )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	text =
		formatExpression(
			context,
			expr.left,
			precTable.ast_and
		)
		+ context.sep
		+ context.tab
		+ '&&'
		+ context.sep
		+ formatExpression(
			context,
			expr.right,
			precTable.ast_and
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
			precTable.ast_assign
		)
		+ ' ='
		+ context.sep;

	if( assign.right.reflect !== 'ast_assign' )
	{
		context = context.incSame;
	}

	try
	{
		subtext = null;

		subtext =
			context.tab
			+ formatExpression(
				context.setInline,
				assign.right,
				precTable.ast_assign
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
				precTable.ast_assign
			);
	}

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
		text;

	text = context.tab + '/*' + '\n';

	for(
		a = 0, aZ = comment.content.length;
		a < aZ;
		a++
	)
	{
		c = comment.content[ a ];

		if( c === '' )
		{
			text += context.tab + '|' + '\n';
		}
		else
		{
			text += context.tab + '| ' + c + '\n';
		}
	}

	text += context.tab + '*/' + '\n';

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

	context = context.create( 'check', true );

	return (
		context.tab
		+ 'if( CHECK )\n'
		+ formatBlock( context, check.block )
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
		a, aZ,
		blockContext,
		text;

	text = '';

	if( context.inline && block.length > 1 )
	{
		throw 'noinline';
	}

	if( !noBrackets )
	{
		text = context.tab + '{' + context.sep;

		blockContext = context.inc;
	}
	else
	{
		blockContext = context;
	}

	for(
		a = 0, aZ = block.length;
		a < aZ;
		a++
	)
	{
		text +=
			formatStatement(
				blockContext,
				block.get( a ),
				a > 0
					?  block.get( a - 1 )
					: null,
				a + 1 < aZ
					?  block.get( a + 1 )
					: null
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
/**/	if( expr.reflect !== 'ast_differs' )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	text =
		formatExpression(
			context,
			expr.left,
			precTable.ast_differs
		)
		+ context.sep
		+ context.tab + '!==' + context.sep
		+ formatExpression(
			context,
			expr.right,
			precTable.ast_differs
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
/**/	if( expr.reflect !== 'ast_plus' )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	text =
		formatExpression(
			context,
			expr.left,
			precTable.ast_plus
		)
		+ context.sep
		+ context.tab
		+ '+'
		+ context.sep
		+ formatExpression(
			context,
			expr.right,
			precTable.ast_plus
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

	text = '';

	context = context.incSame;

	try
	{
		// first tries to inline the
		// return expression.
		text =
			null;

		text =
			formatExpression(
				context.setInline,
				assign.left,
				precTable.ast_assign
			)
			+ ' += '
			+ formatExpression(
				context.setInline,
				assign.right,
				precTable.ast_assign
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
/**/	if( expr.reflect !== 'ast_dot' )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	return (
		formatExpression(
			context,
			expr.expr,
			precTable.ast_dot
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
/**/	if( expr.reflect !== 'ast_member' )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	return (
		formatExpression(
			context,
			expr.expr,
			precTable.ast_member
		)
		+ '['
		+ context.sep
		+ formatExpression(
			context.inc,
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
/**/	if( expr.reflect !== 'ast_equals' )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	text =
		formatExpression(
			context,
			expr.left,
			precTable.ast_equals
		)
		+ context.sep
		+ context.tab
		+ '==='
		+ context.sep
		+ formatExpression(
			context,
			expr.right,
			precTable.ast_equals
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
/**/	if( expr.reflect !== 'ast_condition' )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	return (
		formatExpression(
			context,
			expr.condition,
			precTable.ast_condition
		)
		+ context.sep
		+ context.tab
		+ '? '
		+ formatExpression(
			context.setInline,
			expr.then,
			precTable.ast_condition
		)
		+ context.sep
		+ context.tab
		+ ': '
		+ formatExpression(
			context.setInline,
			expr.elsewise,
			precTable.ast_condition
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
/**/	if( statement.reflect !== 'ast_if' )
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
			+ formatExpression( context.setInline, cond, null )
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
			context.tab
			+ 'if(\n'
			+ formatExpression( context.inc, cond, null )
			+ '\n'
			+ context.tab
			+ ')\n';
	}

	text += formatBlock( context, statement.then );

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
		forContext,
		text;

	forContext = context.inc;

	text =
		context.tab
		+ 'for(\n'
		+ forContext.tab
		+ formatExpression(
			forContext.setInline,
			forExpr.init,
			null
		)
		+ ';\n'
		+ forContext.tab
		+ formatExpression(
			forContext.setInline,
			forExpr.condition,
			null
		)
		+ ';\n'
		+ forContext.tab
		+ formatExpression(
			forContext.setInline,
			forExpr.iterate,
			null
		)
		+ '\n'
		+ context.tab
		+ ')\n'
		+ formatBlock( context, forExpr.block );

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
		+ 'for( var '
		+ expr.variable
		+ ' in '
		+ formatExpression(
			context.setInline,
			expr.object,
			precTable.ast_in
		)
		+ ' )\n'
		+ formatBlock( context, expr.block );

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
/**/	if( expr.reflect !== 'ast_lessThan' )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	text =
		formatExpression(
			context,
			expr.left,
			precTable.ast_lessThan
		)
		+ context.sep
		+ context.tab
		+ '<'
		+ context.sep
		+ formatExpression(
			context,
			expr.right,
			precTable.ast_lessThan
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
/**/	if( expr.reflect !== 'ast_greaterThan' )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	text =
		formatExpression(
			context,
			expr.left,
			precTable.ast_greaterThan
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
			precTable.ast_greaterThan
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
/**/	if( expr.reflect !== 'ast_instanceof' )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	text =
		formatExpression(
			context,
			expr.left,
			precTable.ast_instanceof
		)
		+ context.sep
		+ context.tab
		+ 'instanceof'
		+ context.sep
		+ formatExpression(
			context,
			expr.right,
			precTable.ast_instanceof
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
/**/	if( expr.reflect !== 'ast_or' )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	text =
		formatExpression(
			context,
			expr.left,
			precTable.ast_or
		)
		+ context.sep
		+ context.tab
		+ '||'
		+ context.sep
		+ formatExpression(
			context,
			expr.right,
			precTable.ast_or
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
/**/	if( statement.reflect !== 'ast_return' )
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
				context.setInline,
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
		context.tab
		+ 'return (\n'
		+ formatExpression( context.inc, statement.expr, null )
		+ '\n'
		+ context.tab
		+ ')';

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
		a, aZ,
		b, bZ,
		caseContext,
		caseExpr,
		text;

	caseContext = context.inc;

	text =
		context.tab
		+ 'switch( '
		+ formatExpression(
			context.setInline,
			switchExpr.statement,
			null
		)
		+ ' )\n'
		+ context.tab
		+ '{\n';

	for(
		a = 0, aZ = switchExpr.length;
		a < aZ;
		a++
	)
	{
		caseExpr = switchExpr.get( a );

		if( a > 0 )
		{
			text += '\n';
		}

		// FIXME this is broken for
		// caseExpr.length > 1
		for(
			b = 0, bZ = caseExpr.length;
			b < bZ;
			b++
		)
		{
			text +=
				caseContext.tab
				+ 'case '
				+ formatExpression(
					caseContext.setInline,
					caseExpr.get( b ),
					null
				)
				+ ' :\n\n'
				+ formatBlock(
					caseContext.inc,
					caseExpr.block,
					true
				)
				+ '\n'
				+ caseContext.inc.tab
				+ 'break;\n';
		}
	}

	if( switchExpr.defaultCase )
	{
		if( switchExpr.length > 0 )
		{
			text += '\n';
		}

		text +=
			caseContext.tab +
			'default :\n\n'
			+
			formatBlock(
				caseContext.inc,
				switchExpr.defaultCase,
				true
			);
	}

	text += context.tab + '}';

	return text;
};


/*
| Formats a capsule function.
*/
var
formatCapsuleFunc =
	function(
		context,
		func
	)
{
	var
		text;

	if( func.length !== 0 )
	{
		throw new Error( );
	}

	text =
		'function( ) {\n'
		+ formatBlock(
			context.dec.create( 'root', true ),
			func.block,
			true
		)
		+ '\n\n}';

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
		a,
		arg,
		argSpace,
		aZ,
		comma,
		text;

	if( func.capsule )
	{
		return formatCapsuleFunc( context, func );
	}

	text = context.tab;

	if( func.length === 0 )
	{
		text += 'function( )' + context.sep;
	}
	else
	{
		text += 'function(' + context.sep;

		for(
			a = 0, aZ = func.length;
			a < aZ;
			a++
		)
		{
			arg = func.get( a );

			comma = a + 1 < aZ ? ',' : '';

			argSpace = arg.name ? ' ' : '';

			text +=
				context.inc.tab
				+ ( arg.name || '' )
				+ comma
				+ (
					arg.comment
					?  argSpace + '// ' + arg.comment
					: ''
				)
				+ '\n';
		}

		text += context.tab + ')' + context.sep;
	}

	// formats to body at one indentation decremented.
	context = context.dec;

	text += formatBlock( context, func.block );

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
		&& lookBehind.reflect !== 'ast_comment'
		&& !(
			lookBehind.reflect === 'ast_astVarDec'
			&& statement.reflect === 'ast_astVarDec'
		)
	)
	{
		text +=
			context.check
			? '/**/\n'
			: '\n';

		if( context.root )
		{
			text +=
				context.check
				?  '/**/\n'
				: '\n';
		}
	}

	if( statement.reflect === 'ast_comment' )
	{
		if(
			lookBehind
			&& lookBehind.reflect === 'ast_comment'
		)
		{
			text += '\n\n';
		}

		text += formatComment( context, statement );

		return text;
	}

	switch( statement.reflect )
	{
		case 'ast_check' :

			text += formatCheck( context, statement );

			break;

		case 'ast_if' :

			text += formatIf( context, statement );

			break;

		case 'ast_fail' :

			try
			{
				subtext =
					context.tab
					+ formatFail( context.setInline, statement );
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
				text += formatFail( context, statement );
			}

			break;

		case 'ast_for' :

			text += formatFor( context, statement );

			break;

		case 'ast_forIn' :

			text += formatForIn( context, statement );

			break;

		case 'ast_return' :

			text += formatReturn( context, statement );

			break;

		case 'ast_astSwitch' :

			text += formatSwitch( context, statement );

			break;

		case 'ast_astVarDec' :

			text += formatVarDec( context, statement, lookBehind );

			break;

		default :

			try
			{
				subtext =
					context.tab
					+ formatExpression(
						context.setInline,
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
				text += subtext;
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
		case 'ast_astVarDec' :

			if(
				lookAhead
				&&
				lookAhead.reflect === 'ast_astVarDec'
			)
			{
				return text += ',\n';
			}
			else
			{
				return text += ';\n';
			}

			break;

		case 'ast_assign' :
		case 'ast_boolean' :
		case 'ast_call' :
		case 'ast_delete' :
		case 'ast_fail' :
		case 'ast_new' :
		case 'ast_number' :
		case 'ast_plusAssign' :
		case 'ast_return' :
		case 'ast_string' :
		case 'ast_astVar' :

			return text + ';' + context.sep;

		case 'ast_check' :
		case 'ast_for' :
		case 'ast_forIn' :
		case 'ast_if' :
		case 'ast_astSwitch' :

			return text + context.sep;

		default :

			throw new Error( );
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

	// FIXME remove reflectName
	prec = precTable[ expr.reflectName ] || precTable[ expr.reflect ];

	if( prec === undefined )
	{
		throw new Error( expr.reflectName );
	}

	formatter = exprFormatter[ expr.reflectName ] || exprFormatter[ expr.reflect ];

	if( !formatter )
	{
		throw new Error( expr.reflectName );
	}

	bracket = pprec !== null && prec > pprec;

	subcontext = context;

	text = '';

	if( bracket )
	{
		text = context.tab + '(' + context.sep;

		subcontext = context.inc;
	}

	subtext = null;

	if(
		!subcontext.inline
		&& !bracket
		&& pprec !== null && prec < pprec
	)
	{
		// tries to go inline
		try
		{
			subtext =
				subcontext.tab
				+ formatter( subcontext.setInline, expr );
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
	var
		checkContext,
		messageContext,
		result;

/**/if( CHECK )
/**/{
/**/	if( fail.reflect !== 'ast_fail' )
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

		messageContext = checkContext.inc;

		result =
			checkContext.tab
			+ 'if( CHECK )'
			+ checkContext.sep
			+ checkContext.tab
			+ '{'
			+ checkContext.sep;
	}

	result +=
		messageContext.tab
		+ 'throw new Error('
		+ messageContext.sep
		+ formatExpression(
			messageContext.inc,
			fail.message,
			null
		)
		+ messageContext.sep
		+ messageContext.tab
		+ ')';

	if( !context.check )
	{
		result +=
			';'
			+ checkContext.sep
			+ checkContext.tab
			+ '}'
			+ checkContext.sep
			+ checkContext.sep
			+ context.tab
			+ 'throw new Error( )';
	}

	return result;
};


/*
| Formats a boolean literal use.
*/
var
formatBoolean =
	function(
		context,
		expr
	)
{

/**/if( CHECK )
/**/{
/**/	if( expr.reflect !== 'ast_boolean' )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	return (
		context.tab +
		(
			expr.boolean
			? 'true'
			: 'false'
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
		a, aZ,
		text;

/**/if( CHECK )
/**/{
/**/	if( call.reflect !== 'ast_call' )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	text =
		formatExpression(
			snuggle ? context.setInline : context,
			call.func,
			precTable.ast_call
		);

	if( call.length === 0 )
	{
		text += '( )';
	}
	else
	{
		text += '(' + context.sep;

		for(
			a = 0, aZ = call.length;
			a < aZ;
			a++
		)
		{
			text += formatExpression( context.inc, call.get( a ), null );

			if( a + 1 < aZ )
			{
				text += ',' + context.sep;
			}
			else
			{
				text += context.sep;
			}
		}

		text += context.tab + ')';
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
/**/	if( expr.reflect !== 'ast_delete' )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	return(
		context.tab
		+ 'delete '
		+ formatExpression(
			context,
			expr.expr,
			precTable.ast_delete
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
/**/	if( expr.reflect !== 'ast_new' )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	return(
		context.tab
		+ 'new '
		+ formatCall(
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
/**/	if( expr.reflect !== 'ast_not' )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	return(
		context.tab
		+ '!'
		+ formatExpression(
			context,
			expr.expr,
			precTable.ast_not
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
/**/	if( expr.reflect !== 'ast_null' )
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
		a,
		aZ,
		text;

	text = '';

/**/if( CHECK )
/**/{
/**/	if( expr.reflect !== 'ast_arrayLiteral' )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}


	if( expr.length === 0 )
	{
		return context.tab + '[ ]';
	}

	if( context.inline )
	{
		throw 'noinline';
	}

	text += context.tab + '[\n';

	for(
		a = 0, aZ = expr.length;
		a < aZ;
		a++
	)
	{
		text +=
			formatExpression(
				context.inc,
				expr.get( a ),
				precTable.ast_arrayLiteral
			)
			+ (
				a + 1 < aZ
				? ',\n'
				: '\n'
			);
	}

	text += context.tab + ']';

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
		a,
		aZ,
		key,
		text;

	text = '';

/**/if( CHECK )
/**/{
/**/	if( objliteral.reflect !== 'ast_objLiteral' )
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

	text += context.tab + '{\n';

	for(
		a = 0, aZ = objliteral.ranks.length;
		a < aZ;
		a++
	)
	{
		key = objliteral.ranks[ a ];

		text +=
			context.inc.tab
			+ key
			+ ' :\n';

		text +=
			formatExpression(
				context.inc.inc,
				objliteral.twig[ key ],
				null // FIXME precTable.Objliteral
			)
			+
			(
				a + 1 < aZ
				? ',\n'
				: '\n'
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
/**/	if( expr.reflect !== 'ast_preIncrement' )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	return(
		context.tab
		+ '++'
		+ formatExpression(
			context,
			expr.expr,
			precTable.preIncrement
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
/**/	if( expr.reflect !== 'ast_astTypeof' )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	return(
		context.tab
		+ 'typeof('
		+ context.sep
		+ formatExpression(
			context.inc,
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
/**/	if( expr.reflect !== 'ast_astVar' )
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
formatNumber =
	function(
		context,
		expr
	)
{

/**/if( CHECK )
/**/{
/**/	if( expr.reflect !== 'ast_number' )
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
/**/	if( expr.reflect !== 'ast_string' )
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

	if( context.root && varDec.assign )
	{
		if(
			varDec.assign.reflect === 'ast_func'
		)
		{
			isRootFunc = true;
		}
		else if(
			varDec.assign.reflect === 'ast_assign'
			&& varDec.assign.right.reflect === 'ast_func'
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
			|| lookBehind.reflect !== 'ast_astVarDec'
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
			context = context.inc;

			text += context.tab;
		}

		text += varDec.name;
	}
	else
	{
		// root functions are not combined in VarDecs
		text = context.tab + 'var ' + varDec.name;
	}

	if( varDec.assign )
	{
		text += ' =' + context.sep;

		if( varDec.assign.reflect !== 'ast_assign' )
		{
			context = context.inc;
		}

		aText = null;

		try
		{
			aText =
				context.tab
				+ formatExpression(
					context.setInline,
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
		a,
		aZ,
		text;

	text = '';

	for(
		a = 0, aZ = list.length;
		a < aZ;
		a++
	)
	{
		text +=
			(
				a > 0
				? ( ',' + context.sep )
				: ''
			)
			+ formatExpression(
				context.inc,
				list.get( a ),
				precTable.ast_commaList
			);
	}

	return text;
};


/*
| Formats a block as file.
*/
format_formatter.format =
	function(
		block
	)
{
	var
		context;

	context = format_context.create( 'root', true );

	return formatBlock( context, block, true );
};


/*
| Table of all expression formatters.
*/
var
exprFormatter =
	{
		'ast_and' : formatAnd,
		'ast_arrayLiteral' : formatArrayLiteral,
		'ast_assign' : formatAssign,
		'ast_boolean' : formatBoolean,
		'ast_call' : formatCall,
		'ast_commaList' : formatCommaList,
		'ast_condition' : formatCondition,
		'ast_delete' : formatDelete,
		'ast_differs' : formatDiffers,
		'ast_dot' : formatDot,
		'ast_equals' : formatEquals,
		'ast_func' : formatFunc,
		'ast_greaterThan' : formatGreaterThan,
		'ast_instanceof' : formatInstanceof,
		'ast_lessThan' : formatLessThan,
		'ast_member' : formatMember,
		'ast_new' : formatNew,
		'ast_not' : formatNot,
		'ast_null' : formatNull,
		'ast_number' : formatNumber,
		'ast_objLiteral' : formatObjLiteral,
		'ast_or' : formatOr,
		'ast_plus' : formatPlus,
		'ast_plusAssign' : formatPlusAssign,
		'ast_preIncrement' : formatPreIncrement,
		'ast_string' : formatString,
		'astTypeof' : formatTypeof,
		'astVar' : formatVar
	};




} )( );
