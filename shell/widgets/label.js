/*
| A label.
|
| Authors: Axel Kittenberger
*/


/*
| Export
*/
var Widgets;
Widgets =
	Widgets || { };


/*
| Imports
*/
var Curve;
var Jools;


/*
| Capsule
*/
( function( ) {
'use strict';

if( typeof( window ) === 'undefined' )
{
	throw new Error( 'this code needs a browser!' );
}


/*
| Constructor.
*/
var Label =
Widgets.Label =
	function(
		// ... free strings ...
	)
{
	Widgets.Widget.call(
		this,
		'Label',
		arguments
	);

	var
		inherit =
			this.inherit;

	this.pos =
		this.parent.iframe.computePoint(
			this.tree.pos
		);

	// if not null, overrides the design text
	this._$text =
		inherit ? inherit._$text : null;

	this._font =
		new Euclid.Font(
			this.tree.font
		);
};


/*
| Labels are Widgets
*/
Jools.subclass(
	Label,
	Widgets.Widget
);


/*
| Labels cannot focus.
*/
Label.prototype.grepFocus =
	function( )
{
	return false;
};


/*
| Draws the label on the fabric.
*/
Label.prototype.draw =
	function(
		fabric
	)
{
	if( !this._$visible )
	{
		return;
	}

	fabric.paintText(
		'text',
			this._$text || this.tree.text,
		'p',
			this.pos,
		'font',
			this._font
	);
};


/*
| Overrides the designed text.
*/
Label.prototype.setText =
	function(
		text
	)
{
	this._$text = text;

	this.poke();
};


/*
| Clears cache.
*/
Label.prototype.poke =
	function( )
{
	this.parent.poke( );
};


/*
| Force clears all caches.
*/
Label.prototype.knock =
	function( )
{
	// pass
};


/*
| User is hovering his/her pointer ( mouse move )
*/
Label.prototype.pointingHover =
	function(
		// p,
		// shift,
		// ctrl
	)
{
	return null;
};


/*
| User is starting to point at something ( mouse down, touch start )
*/
Label.prototype.pointingStart =
	function(
		// p,
		// shift,
		// ctrl
	)
{
	return null;
};

} ) ( );
