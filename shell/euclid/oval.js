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
var Oval = null;

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
Oval = function(pnw, pse)
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
		return new Point(
			Jools.half(this.pnw.x + this.pse.x),
			Jools.half(this.pnw.y + this.pse.y)
		);
	}
);

/*
| Draws the ovalslice.
*/
Oval.prototype.sketch = function(fabric, border, twist, view)
{
	var wx = view.x(this.pnw);
	var ny = view.y(this.pnw);
	var ex = view.x(this.pse);
	var sy = view.y(this.pse);
	var my  = Jools.half(ny + sy);
	var mx  = Jools.half(wx + ex);

	var m    = Euclid.magic;
	var am   = m * (mx - wx);
	var bm   = m * (my - ny);

	fabric.moveTo(                     mx, ny );
	fabric.beziTo(   0, -bm, -am,   0, ex, my );
	fabric.beziTo(  am,   0,   0, -bm, mx, sy );
	// FIXME workaround chrome pixel error
	//fabric.lineTo(                   mx, sy - 1);
	fabric.beziTo(   0,  bm,  am,   0, wx, my );
	fabric.beziTo( -am,   0,   0,  bm, mx, ny );
};


/*
| Returns true if point is within the slice.
*/
OvalSlice.prototype.within = function(fabric, view, p)
	{ return fabric.within(this, 'sketch', view, p); };


} ) ();
