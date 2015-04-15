/*
| A radial gradient.
*/


/*
| Capsule
*/
( function( ) {
'use strict';


/*
| The jion definition
*/
if( JION )
{
	return{
		id : 'euclid_gradient_radial',
		attributes :
		{
			// FUTURE specify something
		},
		ray : [ 'euclid_gradient_colorStop' ]
	};
}


if( NODE )
{
	require( 'jion' ).this( module, 'source' );
}


})( );
