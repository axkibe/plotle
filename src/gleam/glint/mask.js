/*
| Masked glints.
*/


/*
| The jion definition.
*/
if( JION )
{
	throw{
		id : 'gleam_glint_mask',
		attributes :
		{
			glint :
			{
				comment : 'the glints to draw',
				type : 'gleam_glint_ray'
			},
			reverse :
			{
				comment : 'true if reversing mask',
				type : [ 'undefined', 'boolean' ]
			},
			shape :
			{
				comment : 'the shape(ray) to mask to',
				type :
					require( '../../euclid/typemap-shape' )
					.concat( [ 'gleam_shapeRay' ] )
			}
		}
	};
}


var
	gleam_glint_mask,
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

prototype = gleam_glint_mask.prototype;


/*
| Returns true if p is within the
| glint its shape.
*/
prototype.within =
	function(
		p
	)
{
	if( this.reverse )
	{
		if( swatch.within( p, this.shape ) ) return false;
	}
	else
	{
		if( !swatch.within( p, this.shape ) ) return false;
	}

	return this.glint.within( p );
};



} )( );
