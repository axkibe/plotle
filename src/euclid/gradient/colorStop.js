/*
| A gradient color stop.
*/


/*
| The jion definition
*/
if( JION )
{
	throw{
		id : 'euclid_gradient_colorStop',
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
				type : 'gleam_color'
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
}


})( );
