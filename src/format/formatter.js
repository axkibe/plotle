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
		require( '../jools/jools' );


/*
| Formats the header section.
*/
var
formatComment =
	function(
		lines,
		context,
		comment
	)
{
	var
		a,
		aZ,
		c;

	lines.push(
		'/*'
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
			lines.push( context.tab + '|' );
		}
		else
		{
			lines.push( context.tab + '| ' + c );
		}
	}

	lines.push(
		'*/'
	);
};

/*
| Formats a block.
*/
var
formatCheck =
	function(
		lines,
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

	lines.push(
		context.tab + 'if( CHECK )'
	);

	formatBlock(
		lines,
		context,
		check.block,
		''
	);
};


/*
| Formats a block.
*/
var
formatBlock =
	function(
		lines,
		context,
		block,
		semicolon
	)
{
	var
		a,
		aZ,
		expr;

	lines.push(
		context.tab + '{'
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
					lines,
					context,
					expr
				);

				break;

			default :

				throw new Error( );
		}
	}

	lines.push(
		context.tab + '}' + semicolon
	);
};


/*
| Formats a function.
*/
var
formatFunction =
	function(
		lines,
		func,
		context
	)
{
	var
		arg,
		argContext,
		comma;

	lines.push(
		context.tab + 'function('
	);

	argContext =
		context.increment;

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

		lines.push(
			argContext.tab +
			arg.name +
			comma +
			(
				arg.comment ?
					' // ' + arg.comment
					:
					''
			)
		);
	}

	lines.push(
		context.tab + ')'
	);

	formatBlock(
		lines,
		context.decrement,
		func.block,
		';'
	);
};


/*
| Formats an assignment.
*/
var
formatAssign =
	function(
		lines,
		context,
		assign
	)
{
	var
		a,
		aZ,
		left =
			assign.left,
		right =
			assign.right;

	if( left.constructor === Array )
	{
		for(
			a = 0, aZ = left.length;
			a < aZ;
			a++
		)
		{
			lines.push(
				context.tab +
					left[ a ] +
					' ='
			);
		}
	}
	else
	{
		lines.push(
			context.tab + left + ' ='
		);
	}

	switch( right.reflect )
	{
		case 'Function' :

			formatFunction(
				lines,
				right,
				context.increment
			);

			break;

		default :

			if( !Jools.isString( right ) )
			{
				throw new Error( );
			}

			lines.push(
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
};


/*
| Formats a separator.
*/
var
formatSeparator =
	function(
		lines
	)
{
	lines.push(
		'',
		''
	);
};


/*
| Formats an expression.
*/
var
formatExpression =
	function(
		lines,
		context,
		expr
	)
{
	switch( expr.reflect )
	{
		case 'Assign' :

			formatAssign(
				lines,
				context,
				expr
			);

			break;

		case 'Comment' :

			formatComment(
				lines,
				context,
				expr
			);

			break;

		default :

			throw new Error( );
	}
};


/*
| Formats the capsule.
*/
var
formatCapsule =
	function(
		lines,
		context,
		file
	)
{
	var
		capsule =
			file.capsule;

	lines.push(
		'/*',
		'| Capulse.',
		'*/',
		'( function( ) {',
		'\'use strict\';'
	);

	formatSeparator( lines );

	for(
		var a = 0, aZ = capsule.ranks.length;
		a < aZ;
		a++
	)
	{
		formatExpression(
			lines,
			context,
			capsule.atRank( a )
		);
	}

	lines.push(
		'',
		'',
		'} )( );'
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
			Context.create( ),
		lines =
			[ ];

	if( file.header )
	{
		formatComment(
			lines,
			context,
			file.header
		);
	}

	if( file.capsule )
	{
		if( lines.length > 0 )
		{
			formatSeparator( lines );
		}

		formatCapsule(
			lines,
			context,
			file
		);
	}

	return lines.join( '\n' );
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
