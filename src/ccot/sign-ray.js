/*
| An array of signs.
|
| Authors: Axel Kittenberger
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
		node :
			true,
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
