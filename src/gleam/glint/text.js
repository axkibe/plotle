/*
| A text glint for gleam.
*/


/*
| The jion definition.
*/
if( JION )
{
	throw{
		id : 'gleam_glint_text',
		attributes :
		{
			font :
			{
				comment : 'the font to display the text in',
				type : 'gleam_font'
			},
			p :
			{
				comment : 'where to draw it',
				type : 'euclid_point'
			},
			text :
			{
				comment : 'text to display',
				type : 'string'
			},
			rotate :
			{
				comment : 'if defined rotation in radiant',
				type : [ 'undefined', 'number' ]
			}
		}
	};
}


/*
| Capsule
*/
( function( ) {
'use strict';


if( NODE )
{
	require( 'jion' ).this( module, 'source' );

	return;
}


} )( );
