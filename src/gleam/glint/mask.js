/*
| Draws a container masked by a border(Ray).
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
			'container' :
			{
				comment : 'the container to draw',
				type : 'gleam_container'
			},
			'scale' :
			{
				comment : 'a scaled shape(ray) to mask',
				type : [ 'euclid_scale' ]

			},
			'reverse' :
			{
				comment : 'true if reversing mask',
				type : [ 'undefined', 'boolean' ]
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
