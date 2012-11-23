/*
|
| A label on a dashboard.
|
| Authors: Axel Kittenberger
|
*/


/*
| Export
*/
var Dash;
Dash = Dash || {};


/*
| Imports
*/
var Curve;


/*
| Capsule
*/
( function( ) {
'use strict';

if (typeof(window) === 'undefined')
	{ throw new Error('this code needs a browser!'); }

/**
| Constructor.
*/
var Label = Dash.Label = function( twig, panel, inherit, name )
{
	this.name    = name;
	this.twig    = twig;
	this.panel   = panel;
	this.pos     = Curve.computePoint( twig.pos, panel.iframe );

	// if not null, overrides the design text
	this._$text    = inherit ? inherit._$text : null;
};


/*
| Labels cannot focus.
*/
Label.prototype.grepFocus = function( )
{
	return false;
};


/*
| Draws the label on the fabric.
*/
Label.prototype.draw = function( fabric )
{
	fabric.fillText(
		this._$text || this.twig.text,
		this.pos,
		this.twig.font
	);
};


/*
| overrides the designed text
*/
Label.prototype.setText = function(text)
{
	this._$text = text;
	this.poke();
};


/*
| Clears cache.
*/
Label.prototype.poke = function( )
{
	this.panel.poke( );
};


/*
| Force clears all caches.
*/
Label.prototype.knock = function( )
{
	// pass
};


/*
| User is hovering his/her pointer ( mouse move )
*/
Label.prototype.pointingHover = function( p, shift, ctrl )
{
	return null;
};


/*
| User is starting to point at something ( mouse down, touch start )
*/
Label.prototype.pointingStart = function( p, shift, ctrl )
{
	return null;
};

} ) ( );
