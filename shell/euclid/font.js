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
Euclid = Euclid || { };


/*
| Imports
*/
var Jools;


/*
| Capsule
*/
( function( ) {
'use strict';


/*
| Constructor.
*/
var Font = Euclid.Font =
	function(
		size_o, // fontsize or one object having all the arguments
		family, // font familiy
		fill,   // font color
		align,  // horizontal align
		base    // vertical base position
	)
{
	if(
		typeof( size_o ) === 'object' &&
		!( size_o instanceof Number )
	)
	{
		this.size    = size_o.size;
		this.family  = size_o.family;
		this.align   = size_o.align;
		this.fill    = size_o.fill;
		this.base    = size_o.base;
	}
	else
	{
		this.size    = size_o;
		this.family  = family;
		this.align   = align;
		this.fill    = fill;
		this.base    = base;
	}

	Jools.immute( this );
};


/*
| MeshMashine type
*/
Font.prototype.type = 'Font';


/*
| Returns the CSS-string for this font.
*/
Font.prototype.getCSS = function()
{
	if( this._$css )
		{ return this._$css; }

	return Jools.innumerable(
		this,
		'_$css',
		this.size + 'px ' + this.family
	);
};

})( );
