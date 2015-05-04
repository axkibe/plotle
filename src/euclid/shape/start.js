/*
| Start section of a shape.
|
| Used by shape.
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
	return {
		id : 'euclid_shape_start',
		attributes :
		{
			p :
			{
				comment : 'start here',
				type : [ 'euclid_point', 'euclid_fixPoint' ]
			}
		}
	};
}


if( NODE )
{
	require( 'jion' ).this( module, 'source' );

	return;
}


})( );
