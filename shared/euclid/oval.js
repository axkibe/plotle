/**                            _..._
    _....._                 .-'_..._''. .---.    _______
  .'       '.             .' .'      '.\|   |.--.\  ___ `'.
 /   .-'"'.  \           / .'           |   ||__| ' |--.\  \
/   /______\  |         . '             |   |.--. | |    \  '
|   __________|         | |             |   ||  | | |     |  '
\  (          '  _    _ | |             |   ||  | | |     |  |
 \  '-.___..-~. | '  / |. '             |   ||  | | |     ' .'
  `         .'..' | .' | \ '.          .|   ||  | | |___.' /'
   `'-.....-.'./  | /  |  '. `._____.-'/|   ||__|/_______.'/
              |   `'.  |    `-.______ / '---'    \_______|/
              '   .'|  '/            `
               `-'  `--'
              ,,--.          .
              |`, | .  , ,-. |
              |   | | /  ,-| |
              `---' `'   `-^ `'
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

 An oval.

 Authors: Axel Kittenberger
 License: MIT(Expat), see accompanying 'License'-file

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

/*
| Export
*/
var Euclid;
Euclid = Euclid || {};


/*
| Imports
*/
var Euclid;
var Jools;


/*
| Capsule
*/
(function() {
'use strict';

if (typeof(window) === 'undefined')
	{ throw new Error('this code needs a browser'); }

/*
| Constructor.
*/
var Oval = Euclid.Oval =
	function(
		pnw, // point in north-west
		pse  // point in south-east
	)
{
	this.pnw = pnw;
	this.pse = pse;

	Jools.immute(this);
};



/*
| Middle(center) point an Oval.
*/
Jools.lazyFixate(Oval.prototype, 'pm',
	function()
	{
		return new Euclid.Point(
			Jools.half(this.pnw.x + this.pse.x),
			Jools.half(this.pnw.y + this.pse.y)
		);
	}
);


/*
| Middle(center) point an Oval.
*/
Jools.lazyFixate(Oval.prototype, 'gradientPC',
	function()
	{
		return new Euclid.Point(
			Jools.half(this.pnw.x + this.pse.x),
			Jools.half(this.pnw.y + this.pse.y)
		);
	}
);


/*
| Middle(center) point an Oval.
*/
Jools.lazyFixate(Oval.prototype, 'gradientR1',
	function()
	{
		var dx = this.pse.x - this.pnw.x;
		var dy = this.pse.y - this.pnw.x;

		return Math.max(dx, dy);
	}
);

/*
| Returns true if this rectangle is the same as another
*/
Oval.prototype.eq = function(r)
{
	return this.pnw.eq(r.pnw) && this.pse.eq(r.pse);
};


/*
| Draws the ovalslice.
*/
Oval.prototype.sketch = function( fabric, border, twist, view )
{
	var wx = view.x(this.pnw) + border;
	var ny = view.y(this.pnw) + border;
	var ex = view.x(this.pse) - border;
	var sy = view.y(this.pse) - border;

	var my  = Jools.half(ny + sy);
	var mx  = Jools.half(wx + ex);

	var magic = Euclid.Const.magic;
	var am    = magic * (mx - wx);
	var bm    = magic * (my - ny);

	fabric.moveTo(                     wx, my );
	fabric.beziTo(   0, -bm, -am,   0, mx, ny );
	fabric.beziTo(  am,   0,   0, -bm, ex, my );
	// FIXME workaround chrome pixel error
	//fabric.lineTo(                   mx, sy - 1);
	fabric.beziTo(   0,  bm,  am,   0, mx, sy );
	fabric.beziTo( -am,   0,   0,  bm, wx, my );
};


/*
| gets the source of a projection to p
*/
Oval.prototype.getProjection = function( p )
{

}



/*
| Returns true if point is within the slice.
*/
Oval.prototype.within = function( view, p )
{
	return Euclid.swatch.withinSketch(this, 'sketch', view, p);
};


} ) ();
