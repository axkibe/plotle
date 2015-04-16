/*
| A point with fixed view relativ to another anchor point
| for which view position is applied
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
		id : 'euclid_fixPoint',
		attributes :
		{
			x :
			{
				comment : 'x distance to anchor',
				type : 'number'
			},
			y :
			{
				comment : 'y distance to anchor',
				type : 'number'
			},
			anchor :
			{
				comment : 'anchor',
				type : 'euclid_point'
			}
		}
	};
}


if( NODE )
{
	require( 'jion' ).this( module, 'source' );
}


} )( );
