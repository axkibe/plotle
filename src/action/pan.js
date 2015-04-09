/*
| The user is panning the background.
*/


/*
| Capsule
*/
( function( ) {
'use strict';


/*
| The jion definition.
*/
if( JION )
{
	return{
		id : 'action_pan',
		attributes :
		{
			start :
			{
				comment : 'mouse down point on start of scrolling',
				type : 'euclid_point'
			},
			pan :
			{
				comment : 'pan position on start',
				type : 'euclid_point'
			}
		}
	};
}


if( NODE )
{
	require( 'jion' ).this( module, 'source' );

	return;
}


} )( );
