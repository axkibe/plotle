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
//	Jools =
//		require( '../jools/jools' );


/*
| Formats an assignment.
*/
var
formatAssign =
	function(
		text,
		context,
		assign
	)
{
	text +=
		formatTerm(
			context,
			assign.left
		);

	// TODO
	text +=
		' =\n',


	// TODO only if assign.right not an assign
	context =
		context.increment;

	text =
		formatExpression(
			text,
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
		text,
		context,
		comment
	)
{
	var
		a,
		aZ,
		c;

	text +=
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
		text,
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

	text +=
		context.tab + 'if( CHECK )' + '\n';

	text =
		formatBlock(
			text,
			context,
			check.block
		);

	return text;
};


/*
| Formats a block.
*/
var
formatBlock =
	function(
		text,
		context,
		block
	)
{
	text +=
		context.tab + '{' + '\n';

	for(
		var a = 0, aZ = block.ranks.length;
		a < aZ;
		a++
	)
	{
		text =
			formatEntry(
				text,
				context.increment,
				block.twig[ block.ranks[ a ] ],
				a > 0 ?
					block.twig[ block.ranks[ a - 1 ] ] :
					null
			);
	}

	text +=
		context.tab + '}';

	return text;
};


/*
| Formats an if statement.
*/
var
formatIf =
	function(
		text,
		context,
		ifExpr
	)
{
	var
		cond =
			ifExpr.condition;

	if( cond.reflect === 'Term' )
	{
		text +=
			context.tab +
			'if( '
			+
			formatTerm( context, cond )
			+
			' )\n';
	}
	else
	{
		throw new Error( 'TODO' );
	}

	text =
		formatBlock(
			text,
			context,
			ifExpr.then
		);

	return text;
};


/*
| Formats a function.
*/
var
formatFunction =
	function(
		text,
		context,
		func
	)
{
	var
		arg,
		comma;

	text +=
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
			arg.name
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
		context.tab + ')\n';

	text =
		formatBlock(
			text,
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
		text,
		context,
		entry,
		lookBehind
	)
{
	if(
		lookBehind
		&&
		lookBehind.reflect !== 'Comment'
	)
	{
		text +=
			'\n';

		if( context.root )
		{
			text +=
				'\n';
		}
	}

	if( entry.reflect === 'Comment' )
	{
		return (
			formatComment(
				text,
				context,
				entry
			)
		);
	}

	text =
		formatExpression(
			text,
			context,
			entry
		);

	switch( entry.reflect )
	{
		case 'VarDec' :

			return text += ';\n';

		case 'Check' :
		case 'If' :

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
		text,
		context,
		expr
	)
{
	switch( expr.reflect )
	{
		case 'Assign' :

			return (
				formatAssign(
					text,
					context,
					expr
				)
			);

		case 'Check' :

			return (
				formatCheck(
					text,
					context,
					expr
				)
			);

		case 'If' :

			return (
				formatIf(
					text,
					context,
					expr
				)
			);

		case 'Function' :

			return (
				formatFunction(
					text,
					context,
					expr
				)
			);

		case 'Term' :

			text +=
				formatTerm(
					context,
					expr
				);

			return text;

		case 'VarDec' :

			return (
				formatVarDec(
					text,
					context,
					expr
				)
			);

		default :

			throw new Error( expr.reflect );
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
| Formats a variable decleration.
|
| FIXME combine multiple var-decs
*/
var
formatVarDec =
	function(
		text,
		context,
		varDec
	)
{
	var
		// true when this is a root function
		isRootFunc =
			false;

	if(
		context.root
		&&
		varDec.assign
	)
	{
		if(
			varDec.assign.reflect === 'Function'
		)
		{
			isRootFunc =
				true;
		}
		else if(
			varDec.assign.reflect === 'Assign'
			&&
			varDec.assign.right.reflect === 'Function'
		)
		{
			// FUTURUE allow abitrary amount of assignments
			isRootFunc =
				true;
		}
	}

	if( !isRootFunc )
	{
		text +=
			context.tab + 'var' + '\n',
			context.increment.tab + varDec.name;
	}
	else
	{
		text +=
			context.tab + 'var ' + varDec.name;
	}

	if( varDec.assign )
	{
		text +=
			' =\n';

		if( varDec.assign.reflect !== 'Assign' )
		{
			context =
				context.increment;
		}

		text =
			formatExpression(
				text,
				context,
				varDec.assign
			);
	}
	else
	{
		text +=
			';\n';
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
		text =
			formatEntry(
				text,
				context,
				capsule.atRank( a ),
				a > 0 ?
					capsule.atRank( a - 1 ) :
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
		text =
			formatComment(
				text,
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
