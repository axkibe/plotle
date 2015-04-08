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
		id : 'gradient_radial',
		attributes :
		{
			// FUTURE specify something
		},
		ray : [ 'gradient_colorStop' ]
	};
}


if( NODE )
{
	require( 'jion' ).this( module, 'source' );
}


})( );
