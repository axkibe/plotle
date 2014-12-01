/*
| An array of signs.
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
	return {
		id :
			'ccot_signRay',
		ray :
			[ 'ccot_sign' ],
		equals :
			false
	};
}


/*
| Node includes.
*/
if( SERVER )
{
	require( '../jion/this' )( module );
}


}( ) );
