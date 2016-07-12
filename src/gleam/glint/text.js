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
			key :
			{
				comment : 'key in parent twig',
				type : 'string'
			},
			p :
			{
				comment : 'where to draw it',
				type : 'euclid_anchor_point'
			},
			text :
			{
				comment : 'text to display',
				type : 'string'
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
