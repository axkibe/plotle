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
		require( './context' ),
	Jools =
		require( '../jools/jools' ),
	TextFile =
		require( './text-file' );


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
	text =
		text.append(
			context.tab
		);

	text =
		formatTerm(
			text,
			context,
			assign.left
		);

	text =
		text.append(
			' =\n'
		);

	context =
		context.increment;

	text =
		text.append(
			context.tab
		);

	text =
		formatExpression(
			text,
			context,
			assign.right
		);

	return text;

	/*
		text.append(
			assign.left

	if( left.constructor === Array )
	{
		for(
			a = 0, aZ = left.length;
			a < aZ;
			a++
		)
		{
			text =
				text.append(
					context.tab + left[ a ] + ' ='
				);
		}
	}
	else
	{
		text =
			text.append(
				context.tab + left + ' ='
			);
	}

	switch( right.reflect )
	{
		case 'Function' :

			text =
				formatFunction(
					text,
					context.increment,
					right
				);

			break;

		default :

			if( !Jools.isString( right ) )
			{
				throw new Error( );
			}

			text =
				text.append(
					context.increment.tab + right + ';'
				);

			break;
	}

	if( right.reflect === 'Function' )
	{
	}
	else
	{
	}

	return text;
	*/
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

	text =
		text.append(
			'/*' + '\n'
		);

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
			text =
				text.append(
					'|' + '\n'
				);
		}
		else
		{
			text =
				text.append(
					'| ' + c + '\n'
				);
		}
	}

	text =
		text.append(
			'*/' + '\n'
		);

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

	text =
		text.append(
			context.tab + 'if( CHECK )' + '\n'
		);

	text =
		formatBlock(
			text,
			context,
			check.block
		);
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
	var
		a,
		aZ,
		expr;

	text =
		text.append(
			context.tab + '{' + '\n'
		);

	for(
		a = 0, aZ = block.ranks.length;
		a < aZ;
		a++
	)
	{
		expr =
			block.twig[ block.ranks[ a ] ];

		switch( expr.reflect )
		{
			case 'Check' :

				formatCheck(
					text,
					context,
					expr
				);

				break;

			default :

				throw new Error( );
		}
	}

	return (
		text.append(
			context.tab + '}'
		)
	);
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

	text =
		text.append(
			'function(' + '\n'
		);

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

		text =
			text.append(
				context.increment.tab +
				arg.name +
				comma +
				(
					arg.comment ?
						' // ' + arg.comment
						:
						''
				) +
				'\n'
			);
	}

	text =
		text.append(
			context.tab + ')\n'
		);

	return (
		formatBlock(
			text,
			context.decrement,
			func.block
		)
	);
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
		!lookBehind
		||
		lookBehind.reflect !== 'Comment'
	)
	{
		text =
			text.newline( 1 );

		if( context.root )
		{
			text =
				text.newline( 1 );
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

	text =
		text.append( ';' );

	return text;
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

		case 'Function' :

			return (
				formatFunction(
					text,
					context,
					expr
				)
			);

		case 'Term' :

			return (
				formatTerm(
					text,
					context,
					expr
				)
			);

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
		text,
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

	return (
		text.append(
			term.term
		)
	);
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
	text =
		text.append(
			context.tab + 'var' + '\n',
			context.increment.tab + varDec.name
		);

	if( varDec.assign )
	{
		text =
			text.append(
				' =' + '\n'
			);

		text =
			formatExpression(
				text,
				context.increment,
				varDec.assign
			);
	}
	else
	{
		text =
			text.append( ';\n' );
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

	text =
		text.append(
			'/*\n',
			'| Capulse.\n',
			'*/\n',
			'( function( ) {\n',
			'\'use strict\';\n'
		);

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

	text =
		text.newline( 2 );

	return (
		text.append(
			'} )( );'
		)
	);
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
			TextFile.create( );

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
			text =
				text.newline( 2 );
		}

		text =
			formatCapsule(
				text,
				context,
				file
			);
	}

	return text.text;
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
