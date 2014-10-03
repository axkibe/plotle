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
| Imports
*/
var
	jools;


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
	jools =
		require( '../jools/jools'  );

	ccot =
		{
			sign :
				require( '../ccot/sign' ),
			signRay :
				require( '../jion/this' )( module )
		};
}


var
	signRay;

signRay = ccot.signRay;


/*
| Exports
*/
if( SERVER )
{
	module.exports = signRay;
}

}( ) );
