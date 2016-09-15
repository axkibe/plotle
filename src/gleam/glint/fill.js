/*
| The fill of a shape.
*/


/*
| The jion definition.
*/
if( JION )
{
	throw{
		id : 'gleam_glint_fill',
		attributes :
		{
			facet :
			{
				comment : 'the facet to draw the fill with',
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
					require( '../../euclid/typemap-shape' )
					.concat( [ 'euclid_shapeRay' ] )
			}
		}
	};
}


var
	gleam_glint_fill;


/*
| Capsule
*/
( function( ) {
'use strict';

var prototype;


if( NODE )
{
	require( 'jion' ).this( module, 'source' );

	return;
}

prototype = gleam_glint_fill.prototype;


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
