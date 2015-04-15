/*
| An askew gradient.
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
		id : 'euclid_gradient_askew',
		attributes :
		{
			// FUTURE specify degree
		},
		ray : [ 'euclid_gradient_colorStop' ]
	};
}


if( NODE )
{
	require( 'jion' ).this( module, 'source' );
}


})( );
