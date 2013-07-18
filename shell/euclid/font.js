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

	Jools.keyNonGrata( this, 'family' );
	Jools.keyNonGrata( this, 'align' );
	Jools.keyNonGrata( this, 'fill' );
	Jools.keyNonGrata( this, 'base' );

	Jools.immute( this );
};


/*
| MeshMashine type
*/
Font.prototype.type =
	'Font';


/*
| Returns the CSS-string for this font.
| TODO use lazy fixate
*/
Font.prototype.getCSS =
	function( )
{
	if( this._$css )
	{
		return this._$css;
	}

	return Jools.innumerable(
		this,
		'_$css',
		this.twig.size + 'px ' + this.twig.family
	);
};

})( );
