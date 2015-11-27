/*
| An askew gradient.
*/


/*
| The jion definition
*/
if( JION )
{
	throw{
		id : 'euclid_gradient_askew',
		attributes :
		{
			// FUTURE specify degree
		},
		ray : [ 'euclid_gradient_colorStop' ]
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
}


})( );
