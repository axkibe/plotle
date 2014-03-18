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
		text;

	text =
		context.tab
		+
		formatTerm(
			context,
			assign.left
		)
		+
		' =\n';

	if( assign.right.reflect !== 'Assign' )
	{
		context =
			context.increment;
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
			context.increment;
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
			formatEntry(
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

	if( cond.reflect === 'Term' )
	{
		text =
			context.tab +
			'if( '
			+
			formatTerm(
				context,
				cond
			)
			+
			' )\n';
	}
	else
	{
		throw new Error( 'TODO' );
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
			context.increment.setInline,
		text;

	text =
		context.tab +
		'for(\n' +
		forContext.tab +
		formatExpression(
			forContext,
			forExpr.init
		) +
		';\n' +
		forContext.tab +
		formatExpression(
			forContext,
			forExpr.condition
		) +
		';\n' +
		forContext.tab +
		formatExpression(
			forContext,
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
			context.increment,
		caseExpr,
		text;

	text =
		context.tab
		+
		'switch( '
		+
		formatTerm(
			context.inline,
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
					caseContext.inline,
					caseExpr.atRank( b )
				)
				+
				' :\n\n'
				+
				formatBlock(
					caseContext.increment,
					caseExpr.block,
					true
				)
				+
				'\n'
				+
				caseContext.increment.tab + 'break;\n';
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
				caseContext.increment,
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
		context.tab + 'function(\n';

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
			context.increment.tab
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
		context.tab + ')\n'
		+
		formatBlock(
			context.decrement,
			func.block
		);

	return text;
};


/*
| Formats an entry.
|
| An entry is an expression on its own.
*/
var
formatEntry =
	function(
		context,    // the indent in the text
		entry,      // the entry to be formated
		lookBehind, // the previous entry (or null)
		lookAhead   // the next entry (or null)
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
			entry.reflect === 'VarDec'
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

	if( entry.reflect === 'Comment' )
	{
		text +=
			formatComment(
				context,
				entry
			);

		return text;
	}

	text +=
		formatExpression(
			context,
			entry,
			lookBehind
		);

	switch( entry.reflect )
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
		case 'Fail' :
		case 'Term' :

			return text += ';\n';

		case 'Check' :
		case 'For' :
		case 'If' :
		case 'Switch' :

			return text += '\n';

		default :

			throw new Error( entry.reflect );
	}
};


/*
| Formats an expression.
*/
var
formatExpression =
	function(
		context,
		expr,
		lookBehind
	)
{
	switch( expr.reflect )
	{
		case 'Assign' :

			return (
				formatAssign(
					context,
					expr
				)
			);

		case 'Check' :

			return (
				formatCheck(
					context,
					expr
				)
			);

		case 'If' :

			return (
				formatIf(
					context,
					expr
				)
			);

		case 'Fail' :

			return (
				formatFail(
					context,
					expr
				)
			);

		case 'For' :

			return (
				formatFor(
					context,
					expr
				)
			);

		case 'Func' :

			return (
				formatFunc(
					context,
					expr
				)
			);

		case 'Switch' :

			return (
				formatSwitch(
					context,
					expr
				)
			);

		case 'Term' :

			return (
				( !context.inline ? context.tab : '' )
				+
				formatTerm(
					context,
					expr
				)
			);

		case 'VarDec' :

			return (
				formatVarDec(
					context,
					expr,
					lookBehind
				)
			);

		case 'VList' :

			return (
				formatVList(
					context,
					expr
				)
			);


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
			context.tab + 'throw new Error( )'
		);
	}
	else
	{
		return (
			context.tab + 'throw new Error(\n'
			+
			context.increment.tab + '\'' + fail.message + '\'\n'
			+
			context.tab + ')'
		);
	}
};



/*
| Formats an term.
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
				context.increment;

			text +=
				context.tab;
		}

		text +=
			varDec.name;
	}
	else
	{
		// root functions are not to be combined VarDecs
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
				'\n';
		}
		else
		{
			text +=
				' ';
		}

		if( varDec.assign.reflect !== 'Assign' )
		{
			context =
				context.increment;
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
			formatEntry(
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
