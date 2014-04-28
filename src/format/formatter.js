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
var
	MAX_TEXT_WIDTH =
		79;

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
		'And' :
			13,
		'Assign' :
			17,
		'BooleanLiteral' :
			-1,
		'Call' :
			2,
		'Condition' :
			15,
		'Differs' :
			9,
		'Dot' :
			1,
		'Equals' :
			9,
		'Func' :
			-1,
		'In' :
			8,
		'New' :
			2,
		'Null' :
			-1,
		'NumberLiteral' :
			-1,
		'ObjLiteral' :
			-1,
		'Or' :
			14,
		'Term' :
			-1,
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
/**/	if( expr.reflect !== 'And' )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	text =
		formatExpression(
			context,
			expr.left,
			precTable.And
		)
		+
		context.sep
		+
		context.tab + '&&' + context.sep
		+
		formatExpression(
			context,
			expr.right,
			precTable.And
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

	if( context.inline )
	{
		throw 'noinline';
	}

	text =
		'';

	text +=
		formatExpression(
			context,
			assign.left,
			precTable.Assign
		)
		+
		' =\n';

	if( assign.right.reflect !== 'Assign' )
	{
		context =
			context.IncSame;
	}

	try
	{
		subtext =
			null;

		subtext =
			context.tab
			+
			formatExpression(
				context.Inline,
				assign.right,
				precTable.Assign
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
				assign.right,
				precTable.Assign
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
		context.Create(
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
/**/	if( expr.reflect !== 'Differs' )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	text =
		formatExpression(
			context,
			expr.left,
			precTable.Differs
		)
		+
		context.sep
		+
		context.tab + '!==' + context.sep
		+
		formatExpression(
			context,
			expr.right,
			precTable.Differs
		);

	return text;
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
/**/	if( expr.reflect !== 'Dot' )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	return (
		formatExpression(
			context,
			expr.expr,
			precTable.Dot
		)
		+
		'.'
		+
		expr.member
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
/**/	if( expr.reflect !== 'Equals' )
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
		+
		context.sep
		+
		context.tab + '===' + context.sep
		+
		formatExpression(
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
formatCondition =
	function(
		context,
		expr
	)
{

/**/if( CHECK )
/**/{
/**/	if( expr.reflect !== 'Condition' )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	return (
		context.tab
		+
		formatExpression(
			context,
			expr.condition,
			precTable.Condition
		)
		+
		context.sep
		+
		'?'
		+
		context.sep
		+
		formatExpression(
			context,
			expr.then,
			precTable.Condition
		)
		+
		context.sep
		+
		':'
		+
		context.sep
		+
		formatExpression(
			context,
			expr.elsewise,
			precTable.Condition
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
		cond =
			statement.condition,
		text =
			null;

/**/if( CHECK )
/**/{
/**/	if( statement.reflect !== 'If' )
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
			context.tab +
			'if( '
			+
			formatExpression(
				context.Inline,
				cond,
				null
			)
			+
			' )\n';
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
			+
			context.tab + 'else\n'
			+
			formatBlock(
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
/**/	if( expr.reflect !== 'Or' )
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
/**/	if( statement.reflect !== 'Return' )
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
				formatCheck( context, statement );

			break;

		case 'If' :

			text +=
				formatIf( context, statement );

			break;

		case 'Fail' :

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

		case 'For' :

			text +=
				formatFor( context, statement );

			break;

		case 'ForIn' :

			text +=
				formatForIn( context, statement );

			break;

		case 'Return' :

			text +=
				formatReturn( context, statement );

			break;

		case 'VarDec' :

			text +=
				formatVarDec( context, statement, lookBehind );

			break;

		case 'Switch' :

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
		case 'BooleanLiteral' :
		case 'Call' :
		case 'Fail' :
		case 'New' :
		case 'NumberLiteral' :
		case 'Return' :
		case 'StringLiteral' :
		case 'Term' :
		case 'Var' :

			return text + ';' + context.sep;

		case 'Check' :
		case 'For' :
		case 'ForIn' :
		case 'If' :
		case 'Switch' :

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

	prec =
		precTable[ expr.reflect ];

	if( prec === undefined )
	{
		throw new Error( expr.reflect );
	}

	formatter =
		exprFormatter[ expr.reflect ];

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
		subtext =
			formatter( subcontext, expr );
	}

	text += subtext;

	if( bracket )
	{
		text +=
			context.sep + context.tab + ')';
	}

	return text;
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
			context.tab + 'throw new Error( )'
		);
	}

	return (
		context.tab
		+
		'throw new Error(' + context.sep
		+
		formatExpression(
			context.Inc,
			fail.message,
			null
		)
		+
		context.sep
		+
		context.tab + ')'
	);
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
/**/	if( expr.reflect !== 'BooleanLiteral' )
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
/**/	if( call.reflect !== 'Call' )
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
		text;

/**/if( CHECK )
/**/{
/**/	if( newexpr.reflect !== 'New' )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	text =
		'';

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
			newexpr.call,
			true
		);

	return text;
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
/**/	if( expr.reflect !== 'Null' )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	return context.tab + 'null';
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
				null
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
| Formats a term.
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

	return context.tab + term.term;
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
/**/	if( expr.reflect !== 'Var' )
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
/**/	if( expr.reflect !== 'NumberLiteral' )
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
/**/	if( expr.reflect !== 'StringLiteral' )
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
			' =' + context.sep;

		if( varDec.assign.reflect !== 'Assign' )
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
				formatExpression(
					context,
					varDec.assign,
					precTable.Assign
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
			Context.Create(
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
			formatComment(
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
		'And' :
			formatAnd,
		'Assign' :
			formatAssign,
		'BooleanLiteral' :
			formatBooleanLiteral,
		'Call' :
			formatCall,
		'Condition' :
			formatCondition,
		'Differs' :
			formatDiffers,
		'Dot' :
			formatDot,
		'Equals' :
			formatEquals,
		'Func' :
			formatFunc,
		'New' :
			formatNew,
		'Null' :
			formatNull,
		'NumberLiteral' :
			formatNumberLiteral,
		'ObjLiteral' :
			formatObjLiteral,
		'Or' :
			formatOr,
		'StringLiteral' :
			formatStringLiteral,
		'Term' :
			formatTerm,
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
