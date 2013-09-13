/*
|
| A font face style.
|
| Authors: Axel Kittenberger
|
*/


/*
| Export
*/
var Euclid;

Euclid =
	Euclid || { };


/*
| Imports
*/
var
	Jools,
	Tree;


/*
| Capsule
*/
( function( ) {
'use strict';


/*
| Constructor.
*/
var Font =
Euclid.Font =
	function(
		tag,
		twig,
		ranks
	)
{
	if( tag !== 'TREE' )
	{
		throw new Error(
			'Argument fail'
		);
	}

	Tree.call(
		this,
		'TREE',
		'Font',
		twig,
		ranks
	);

	this.size =
		twig.size;

	Jools.immute( this );
};


/*
| MeshMashine type
*/
Font.prototype.type =
	'Font';


/*
| The CSS-string for this font.
*/
Jools.lazyFixate(
	Font.prototype,
	'css',
	function( )
	{
		return this.twig.size + 'px ' + this.twig.family;
	}
);

})( );
