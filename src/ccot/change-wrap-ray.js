/*
| An array of wraped change(rays).
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
			'ccot.changeWrapRay',
		node :
			true,
		json :
			true,
		ray :
			[
				'ccot.changeWrap'
			],
		equals :
			'primitive'
	};
}


/*
| Exports
*/
if( SERVER )
{
	module.exports = require( '../jion/this' )( module );
}


}( ) );
