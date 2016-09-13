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
					// FIXME XXX
					require( '../../euclid/anchor/typemap-shape' )
					.concat( require( '../../euclid/typemap-shape' ) )
					.concat( [ 'euclid_shapeRay' ] )
			}
		}
	};
}


var
	gleam_glint_paint;


/*
| Capsule
*/
( function( ) {
'use strict';


var
	prototype;


if( NODE )
{
	require( 'jion' ).this( module, 'source' );

	return;
}

prototype = gleam_glint_paint.prototype;


/*
| Returns true if p is within the 
| glint its shape.
*/
prototype.within =
	function(
		p,
		view
	)
{
	return this.shape.within( p, view );
};


} )( );
