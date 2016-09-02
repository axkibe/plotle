/*
| A container of stuff to display.
*/


/*
| The jion definition.
*/
if( JION )
{
	throw{
		id : 'gleam_glint_twig',
		attributes :
		{
			key :
			{
				comment : 'key in parent twig',
				type : 'string'
			}
			
			,
			view :
			{
				comment : 'if defined apply this view',
				type : [ 'undefined', 'euclid_view' ]
			}
		},
		twig :
		[
			'gleam_glint_border',
			'gleam_glint_fill',
			'gleam_glint_mask',
			'gleam_glint_paint',
			'gleam_glint_text',
			'gleam_glint_twig',
			'gleam_glint_disWindow'
		]
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
