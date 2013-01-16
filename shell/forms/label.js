/*
| A label on a form.
|
| Authors: Axel Kittenberger
*/


/*
| Export
*/
var Forms;
Forms = Forms || { };


/*
| Imports
*/
var Curve;


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
Forms.Label =
	function(
		name,
		twig,
		form,
		inherit
	)
{
	this.name =
		name;

	this.form =
		form;

	this.twig =
		twig;

	this.pos =
		Curve.computePoint(
			twig.pos,
			form.iframe
		);

	// if not null, overrides the design text
	this._$text =
		inherit ? inherit._$text : null;
};


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
	fabric.paintText(
		'text',
			this._$text || this.twig.text,
		'p',
			this.pos,
		'font',
			this.twig.font
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
	this.form.poke( );
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
