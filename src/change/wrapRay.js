/*
| An array of wraped change(rays).
*/


var
	change_wrapRay;


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
			'change_wrapRay',
		json :
			true,
		ray :
			[ 'change_wrap' ]
	};
}



if( SERVER )
{
	change_wrapRay = require( '../jion/this' )( module );
}


/*
| Performes the wraped-change-(rays) on a tree.
*/
change_wrapRay.prototype.changeTree =
	function(
		tree
	)
{
	var
		a, aZ;

	// iterates through the change ray
	for(
		a = 0, aZ = this.length;
		a < aZ;
		a++
	)
	{
		tree = this.get( a ).changeTree( tree );
	}

	return tree;
};


/*
| Transform cx on this ray of wrapped changes.
|
| cx can be a change, changeRay, changeWrap or changeWrapRay, sign
*/
change_wrapRay.prototype.transform =
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
