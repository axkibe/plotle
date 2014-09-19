/*
| An array of wraped change(rays).
|
| Authors: Axel Kittenberger
*/


/*
| Export
*/
var
	jion;

jion = jion || { };


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
			'jion.changeWrapRay',
		node :
			true,
		ray :
			[
				'jion.changeWrap'
			],
		equals :
			'primitive'
	};
}


/*
| Node includes.
*/
if( SERVER )
{
	jools =
		require( '../jools/jools'  );

	jion =
		{
			changeWrapRay :
				require( '../jion/this' )( module )
		};
}


var
	changeWrapRay;

changeWrapRay = jion.changeWrapRay;


/*
| Exports
*/
if( SERVER )
{
	module.exports = changeWrapRay;
}


}( ) );
