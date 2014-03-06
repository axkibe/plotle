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
| Returns a string indented by indent
*/
var tab =
	function(
		indent
	)
{
	var
		str =
			'';

	for( var a = 0; a < indent; a++ )
	{
		str += '\t';
	}

	return str;
};


/*
| Formats the header section.
*/
var formatComment =
	function(
		lines,
		comment,
		indent
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
			lines.push( tab( indent ) + '|' );
		}
		else
		{
			lines.push(
				tab( indent ) + '| ' + c
			);
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
		indent,
		semicolon
	)
{
	lines.push(
		tab( indent ) +
			'{'
	);

	lines.push(
		tab( indent ) +
			'}' +
			semicolon
	);
};


/*
| Formats a function.
*/
var formatFunction =
	function(
		lines,
		func,
		indent
	)
{
	var
		arg;

	lines.push(
		tab( indent ) + 'function('
	);

	for(
		var a = 0, aZ = func.args.length;
		a < aZ;
		a++
	)
	{
		arg =
			func.args[ a ];

		lines.push(
			tab( indent + 1 ) +
				arg.name +
				(
					arg.comment ?
						' // ' + arg.comment
						:
						''
				)
		);
	}

	lines.push(
		tab( indent ) + ')'
	);

	formatBlock(
		lines,
		func.block,
		indent - 1,
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
		indent
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
				tab( indent ) +
					left[ a ] +
					' ='
			);
		}
	}
	else
	{
		lines.push(
			tab( indent ) +
				left +
				' ='
		);
	}

	console.log( right.reflect );

	if( right.reflect === 'Function' )
	{
		formatFunction(
			lines,
			right,
			indent + 1
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
		indent
	)
{
	switch( expr.reflect )
	{
		case 'Assign' :

			formatAssign(
				lines,
				expr,
				indent
			);

			break;

		case 'Comment' :

			formatComment(
				lines,
				expr,
				indent
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
		file
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
			0
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
		lines =
			[ ];

	if( file.header )
	{
		formatComment( lines, file.header, 0 );
	}

	if( file.capsule )
	{
		if( lines.length > 0 )
		{
			formatSeparator( lines );
		}

		formatCapsule( lines, file );
	}

	return lines.join( '\n' );
};


/*
| Node exports
*/
if( SERVER )
{
	module.exports =
		Formatter;
}


} )( );
