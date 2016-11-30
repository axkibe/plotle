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
	gleam_glint_paint,
	swatch;


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
| glint's shape.
*/
prototype.within =
	function(
		p
	)
{

/**/if( CHECK )
/**/{
/**/	if( arguments.length !== 1 ) throw new Error( );
/**/}

	return swatch.within( p, this.shape );
};


} )( );
