/*
| An array of wraped change(rays).
*/


var
	ccot_changeWrapRay,
	result_changeTree;


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
			'ccot_changeWrapRay',
		json :
			true,
		ray :
			[ 'ccot_changeWrap' ],
		equals :
			'primitive'
	};
}



if( SERVER )
{
	ccot_changeWrapRay = require( '../jion/this' )( module );

	result_changeTree = require( '../result/changeTree' );
}


/*
| Performes the wraped-change-(rays) on a tree.
*/
ccot_changeWrapRay.prototype.changeTree =
	function(
		tree,
		resultModality
	)
{
	// the ray with the changes applied
	var
		a, aZ,
		cRay,
		cr;

	// FUTURE in case of resultModality === tree skip building cRay

	cRay = [ ];

	// iterates through the change ray
	for(
		a = 0, aZ = this.length;
		a < aZ;
		a++
	)
	{
		cr = this.get( a ).changeTree( tree, 'combined' ); // FUTURE

		// the tree returned by op-handler is the new tree
		tree = cr.tree;

		cRay.push( cr.reaction );
	}

	switch( resultModality )
	{
		case 'combined' :

			return(
				result_changeTree.create(
					'tree', tree,
					'reaction', ccot_changeWrapRay.create( 'ray:init', cRay )
				)
			);

		case 'reaction' :

			return ccot_changeWrapRay.create( 'ray:init', cRay );

		case 'tree' :

			return tree;
	}
};


/*
| Transform cx on this ray of wrapped changes.
|
| cx can be a change, changeRay, changeWrap or changeWrapRay, sign
*/
ccot_changeWrapRay.prototype.transform =
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
