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


/*
| Formats the header section.
*/
var formatComment =
	function(
		lines,
		comment,
		context
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
var formatBlock =
	function(
		lines,
		block,
		context,
		semicolon
	)
{
	lines.push(
		context.tab + '{'
	);

	lines.push(
		context.tab + '}' + semicolon
	);
};


/*
| Formats a function.
*/
var formatFunction =
	function(
		lines,
		func,
		context
	)
{
	var
		arg,
		comma;

	lines.push(
		context.tab + 'function('
	);

	for(
		var a = 0, aZ = func.args.length;
		a < aZ;
		a++
	)
	{
		arg =
			func.args[ a ];

		comma =
			a + 1 < aZ ?
				','
				:
				'';

		lines.push(
			context.tab +
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
		func.block,
		context.create(
			'indent',
				context.indent - 1
		),
		';'
	);
};


/*
| Formats an assignment.
*/
var formatAssign =
	function(
		lines,
		assign,
		context
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

	if( right.reflect === 'Function' )
	{
		formatFunction(
			lines,
			right,
			context.create(
				'indent',
					context.indent + 1
			)
		);
	}
	else
	{
		throw new Error( );
	}
};


/*
| Formats a separator.
*/
var formatSeparator =
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
var formatExpression =
	function(
		lines,
		expr,
		context
	)
{
	switch( expr.reflect )
	{
		case 'Assign' :

			formatAssign(
				lines,
				expr,
				context
			);

			break;

		case 'Comment' :

			formatComment(
				lines,
				expr,
				context
			);

			break;

		default :

			throw new Error( );
	}
};


/*
| Formats the capsule.
*/
var formatCapsule =
	function(
		lines,
		file,
		context
	)
{
	var
		capsule =
			file.capsule,
		content =
			capsule.content;

	lines.push(
		'/*',
		'| Capulse.',
		'*/',
		'( function( ) {',
		'\'use strict\';'
	);

	formatSeparator( lines );

	for(
		var a = 0, aZ = content.length;
		a < aZ;
		a++
	)
	{
		formatExpression(
			lines,
			content[ a ],
			context
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
			file.header,
			context
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
			file,
			context
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
