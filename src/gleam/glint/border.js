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
	gleam_glint_border,
	swatch;


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

prototype = gleam_glint_border.prototype;


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
