/*
| Draws a shape in a display.
|
| This is first the fill then the border
*/


/*
| The jion definition.
*/
if( JION )
{
	throw{
		id : 'gleam_glint_paint',
		attributes :
		{
			facet :
			{
				comment : 'the facet to draw the shape with',
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
					// FIXME only anchors
					// XXX
					require( '../../typemaps/shape' )
					.concat( [ 'euclid_shapeRay' ] )
					.concat( require( '../../euclid/anchor/typemap-shape' ) )
//					require( '../../typemaps/anchorShape' )
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
