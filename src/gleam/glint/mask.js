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
				type : 'gleam_glint_twig'
			},
			key :
			{
				comment : 'key in parent twig',
				type : 'string'
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
					// FIXME XXX
					require( '../../euclid/anchor/typemap-shape' )
					.concat( require( '../../euclid/typemap-shape' ) )
					.concat( [ 'euclid_shapeRay' ] )
			}
		}
	};
}


var
	gleam_glint_mask;


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
		p,
		view
	)
{
	if( this.reverse )
	{
		if( this.shape.within( p, view ) ) return false;
	}
	else
	{
		if( !this.shape.within( p, view ) ) return false;
	}

	return this.glint.within( p, view );
};



} )( );
