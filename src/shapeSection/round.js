/*
| A round section of a shape.
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
	return{
		id : 'shapeSection_round',
		attributes :
			{
				p :
				{
					comment : 'connect to',
					type : [ 'euclid_point', 'euclid_fixPoint' ],
					allowsUndefined : true
				},
				rotation :
				{
					comment : 'currently only "clockwise" supported',
					type : 'string'
				},
				close :
				{
					comment : 'true if this closes the shape',
					type : 'boolean',
					allowsUndefined : true
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
