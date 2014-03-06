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
var _formatHeader =
	function( file, lines )
{
	var
		a,
		aZ;

	lines.push(
		'/*'
	);

	for(
		a = 0, aZ = file.header.length;
		a < aZ;
		a++
	)
	{
		lines.push(
			'| ' + file.header[ a ]
		);
	}

	lines.push(
		'*/'
	);
};


/*
| Formats a separator.
*/
var _formatSeparator =
	function( lines )
{
	lines.push(
		'',
		''
	);
};


/*
| Formats the capsule.
*/
var _formatCapsule =
	function( file, lines )
{
	lines.push(
		'/*',
		'| Capulse.',
		'*/',
		'( function( ) {',
		'\'use strict\';'
	);

	_formatSeparator( lines );

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

	_formatHeader( file, lines );

	_formatSeparator( lines );

	_formatCapsule( file, lines );

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
