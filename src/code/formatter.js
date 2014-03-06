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
| Formats the header section.
*/
var _formatComment =
	function(
		lines,
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
			lines.push( '|' );
		}
		else
		{
			lines.push(
				'| ' + c
			);
		}
	}

	lines.push(
		'*/'
	);
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
| Formats an expression
*/
var _formatExpression =
	function(
		file,
		lines,
		expr
	)
{
	lines.push(
		expr ? '' : ''
	);
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
		_formatExpression( file, lines, content[ a ] );
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
		_formatComment( lines, file.header );
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
