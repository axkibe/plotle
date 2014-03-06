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
var _indent =
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
var _formatComment =
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
			lines.push( _indent( indent ) + '|' );
		}
		else
		{
			lines.push(
				_indent( indent ) + '| ' + c
			);
		}
	}

	lines.push(
		'*/'
	);
};



/*
| Formats an assignment.
*/
var _formatAssign =
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
			assign.left;
//		right =
//			assign.right;

	if( left.constructor === Array )
	{
		for(
			a = 0, aZ = left.length;
			a < aZ;
			a++
		)
		{
			lines.push(
				_indent( indent ) +
					left[ a ] +
					' ='
			);
		}
	}
	else
	{
		lines.push(
			_indent( indent ) +
				left +
				' ='
		);
	}
};


/*
| Formats a separator.
*/
var _formatSeparator =
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
var _formatExpression =
	function(
		lines,
		expr,
		indent
	)
{
	switch( expr.reflect )
	{
		case 'Assign' :

			_formatAssign(
				lines,
				expr,
				indent
			);

			break;

		case 'Comment' :

			_formatComment(
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
var _formatCapsule =
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

	_formatSeparator( lines );

	for(
		var a = 0, aZ = content.length;
		a < aZ;
		a++
	)
	{
		_formatExpression(
			lines,
			content[ a ],
			0
		);
	}

	lines.push(
		'} )( );'
	);
};


/*
| Formats a file.
*/
Formatter.format =
	function( file )
{
	var
		lines =
			[ ];

	if( file.header )
	{
		_formatComment( lines, file.header, 0 );
	}

	if( file.capsule )
	{
		if( lines.length > 0 )
		{
			_formatSeparator( lines );
		}

		_formatCapsule( lines, file );
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
