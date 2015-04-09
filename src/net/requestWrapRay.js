/*
| A ray of request wrappings.
*/


/*
| Capsule
*/
( function( ) {
"use strict";


/*
| The jion definition.
*/
if( JION )
{
	return{
		id : 'net_requestWrapRay',
		ray : [ 'net_requestWrap' ]
	};
}


if( NODE )
{
	require( 'jion' ).this( module, 'source' );

	return;
}


}( ) );
