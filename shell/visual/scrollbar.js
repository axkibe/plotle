                                                  /***.
.----.     .----..--.                             |   |
 \    \   /    / |__|                             |   |
  '   '. /'   /  .--.                             |   |
  |    |'    /   |  |                       __    |   |
  |    ||    |   |  |     _     _    _   .:--.'.  |   |
  '.   `'   .'   |  |   .' |   | '  / | / |   \ | |   |
   \        /    |  |  .   | /.' | .' | `" __ | | |   |
    \      /     |__|.'.'| |///  | /  |  .'.''| | |   |
     '----'        .'.'.-'  /|   `'.  | / /   | |_'---'
                   .'   \_.' '   .'|  '/\ \._,\ '/
                              `-'  `--'  `--'  `"
          .---.             .  .  .
          \___  ,-. ,-. ,-. |  |  |-. ,-. ,-.
              \ |   |   | | |  |  | | ,-| |
          `---' `-' '   `-' `' `' ^-' `-^ '
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

 A scrollbar (used by note).

 Currently there are only vertical scrollbars.

 Authors: Axel Kittenberger

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

/*
| Export
*/
var Visual;


/*
| Imports
*/
var Euclid;
var Jools;
var theme;


/*
| Capsule
*/
( function () {
'use strict';

if (typeof(window) === 'undefined')
	{ throw new Error('this code needs a browser!'); }


/*
| Constructor.
*/
var Scrollbar = Visual.Scrollbar = function()
{
	this.visible    = false;

	// position
	this._$pos      = 0;

	// maximum position
	this._$max      = null;

	// the size of the bar
	this._$aperture = null;

	this._$zone     = null;
};


/*
| Draws the scrollbar.
*/
Scrollbar.prototype.draw = function(fabric, view)
{
	if (!this.visible)
		{ throw new Error('Drawing an invisible scrollbar'); }

	fabric.paint(theme.scrollbar.style, this.getArea(view), 'sketch', Euclid.View.proper);
};


/*
| Returns the (2d) area of the scrollbar.
*/
Scrollbar.prototype.getArea = function(view)
{
	var ths  = theme.scrollbar;
	var pnw  = this._$pnw;
	var size = this._$size;
	var pos  = this._$pos;
	var max  = this._$max;

	var ap   = Math.round( this._$aperture * size / max );
	var map  = Math.max( ap, ths.minSize );
	var sy   = Math.round( pos * ( ( size - map + ap ) / max ) );
	var s05  = Jools.half( ths.strength );

	return new Euclid.RoundRect(
		view.point( pnw.x, pnw.y + sy       ).add( -s05, 0 ),
		view.point( pnw.x, pnw.y + sy + map ).add(  s05, 0 ),
		ths.ellipseA,
		ths.ellipseB
	);
};


/*
| Returns the scrollbars position.
*/
Scrollbar.prototype.getPos = function( )
{
	if( !this.visible )
		{ return 0; }

	return this._$pos;
};


/*
| Sets the scrollbars position and location.
*/
Scrollbar.prototype.setPos = function( pos, aperture, max, pnw, size )
{
	if( max - aperture >= 0 )
		{ pos = Jools.limit( 0, pos, max - aperture ); }
	else
		{ pos = 0; }

	if( pos < 0 )
		{ throw new Error( 'Scrollbar.setPos < 0' ); }

	this._$pos      = pos;
	this._$aperture = aperture;
	this._$max      = max;
	this._$pnw      = pnw,
	this._$size     = size;
};


/*
| Returns true if p is within the scrollbar.
*/
Scrollbar.prototype.within = function( view, p )
{
	if( !this.visible )
		{ return false; }

	var pnw = this._$pnw;
	var dex = view.dex(p);
	var dey = view.dey(p);

	return (
		dex >= pnw.x &&
		dey >= pnw.y &&
		dex <= pnw.x + theme.scrollbar.strength &&
		dey <= pnw.y + this._$size
	);
};


/*
| Returns the value of pos change for d pixels in the current zone.
*/
Scrollbar.prototype.scale = function(d)
{
	return d * this._$max / this._$size;
};


} ) ();
