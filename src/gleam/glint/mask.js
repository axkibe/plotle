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
			scale :
			{
				comment : 'a scaled shape(ray) to mask',
				type : [ 'euclid_scale', 'euclid_scaleRay' ]
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
