/*
| Common base of all visual objects
|
| Authors: Axel Kittenberger
*/


/*
| Export
*/
var
	Visual;

Visual =
	Visual || { };


/*
| Capsule
*/
( function( ) {
'use strict';

if( CHECK && typeof( window ) === 'undefined' )
{
	throw new Error(
		'this code requires a browser!'
	);
}


/*
| Constructor
*/
var Base =
Visual.Base =
	function(
		tree
	)
{
	this.tree =
		tree;

	this.sub =
		null;
};


/*
| Returns the visual with a given tree-rank.
*/
Base.prototype.atRank =
	function(
		rank
	)
{
	return this.sub[ this.tree.ranks[ rank ] ];
};


} )( );
