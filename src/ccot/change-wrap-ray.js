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


var
	changeWrapRay;

if( SERVER )
{
	changeWrapRay = require( '../jion/this' )( module );
}



/*
| Transform cx on this ray of wrapped changes.
|
| cx can be a change, changeRay, changeWrap or changeWrapRay.
*/
changeWrapRay.prototype.transform =
	function(
		cx
	)
{
	var
		r,
		rZ;

	for(
		r = 0, rZ = this.length;
		r < rZ;
		r++
	)
	{
		cx = this.get( r ).transform( cx );
	}

	return cx;
};


}( ) );
