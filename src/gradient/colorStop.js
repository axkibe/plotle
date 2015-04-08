/*
| A gradient color stop.
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
		id : 'gradient_colorStop',
		attributes :
		{
			offset :
			{
				comment : 'color stop offset (0-1)',
				type : 'number'
			},
			color :
			{
				comment : 'color stop color',
				type : 'euclid_color'
			}
		}
	};
}


if( NODE )
{
	require( 'jion' ).this( module, 'source' );
}


})( );
