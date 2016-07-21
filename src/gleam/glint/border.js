/*
| The border of a shape.
*/


/*
| The jion definition.
*/
if( JION )
{
	throw{
		id : 'gleam_glint_border',
		attributes :
		{
			facet :
			{
				comment : 'the facet to draw the border with',
				type : 'gleam_facet'
			},
			key :
			{
				comment : 'key in parent twig',
				type : 'string'
			},
			shape :
			{
				comment : 'the shape to draw',
				type :
					require( '../../euclid/anchor/typemap-shape' )
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
