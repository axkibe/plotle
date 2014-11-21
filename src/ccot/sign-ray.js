/*
| An array of signs.
*/


/*
| Export
*/
var
	ccot;

ccot = ccot || { };


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
			'ccot.signRay',
		ray :
			[ 'ccot.sign' ],
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
