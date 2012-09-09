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
                .-,--. .  .
                 `\__  |  |  . ,-. ,-. ,-.
                  /    |  |  | | | `-. |-'
                 '`--' `' `' ' |-' `-' `-'
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~|~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
                               '
 An ellipse.

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
var Ellipse = Euclid.Ellipse =
	function(
		pnw, // point in north-west
		pse  // point in south-east
	)
{
	this.pnw = pnw;
	this.pse = pse;

	// cardinal coords
	var wx = pnw.x;
	var ny = pnw.y;
	var ex = pse.x;
	var sy = pse.y;

	// middles of cardinal cords
	var my  = Jools.half(ny + sy);
	var mx  = Jools.half(wx + ex);

	// cardinal points
	var pw = new Euclid.Point(wx, my);
	var pn = new Euclid.Point(mx, ny);
	var pe = new Euclid.Point(ex, my);
	var ps = new Euclid.Point(mx, sy);

	var m  = Euclid.Const.magic;

	this.hull = Jools.immute(
		[
			'start',  pw,
			'bezier',  0,  m,  m,  0, pn,
			'bezier',  m,  0,  0,  m, pe,
			'bezier',  0,  m,  m,  0, ps,
			'bezier',  m,  0,  0,  m, 'close'
		]
	);

	Jools.immute(this);

	/*
	fabric.moveTo(                     wx, my );
	fabric.beziTo(   0, -bm, -am,   0, mx, ny );
	fabric.beziTo(  am,   0,   0, -bm, ex, my );
	// FIXME workaround chrome pixel error
	//fabric.lineTo(                   mx, sy - 1);
	fabric.beziTo(   0,  bm,  am,   0, mx, sy );
	fabric.beziTo( -am,   0,   0,  bm, wx, my );
	*/
};



/*
| Middle(center) point an Ellipse.
*/
Jools.lazyFixate( Ellipse.prototype, 'pc',
	function()
	{
		return new Euclid.Point(
			Jools.half(this.pnw.x + this.pse.x),
			Jools.half(this.pnw.y + this.pse.y)
		);
	}
);


/*
| Middle(center) point an Ellipse.
*/
Jools.lazyFixate( Ellipse.prototype, 'gradientPC',
	function()
	{
		return new Euclid.Point(
			Jools.half(this.pnw.x + this.pse.x),
			Jools.half(this.pnw.y + this.pse.y)
		);
	}
);


/*
| Middle(center) point an Ellipse.
*/
Jools.lazyFixate( Ellipse.prototype, 'gradientR1',
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
Ellipse.prototype.eq = function(r)
{
	return this.pnw.eq(r.pnw) && this.pse.eq(r.pse);
};


/*
| Draws the ellipse.
*/
Ellipse.prototype.sketch = function( fabric, border, twist, view )
{
	var hull = this.hull;
	var h    = 0;
	var hZ   = hull.length;

	if( hull[ h++ ] !== 'start' )
		{ throw new Error( 'hull must have start at [0]' ); }

	var pstart = view.point( hull [ h++ ] );
	var pc     = view.point( this.pc );

	pstart = pstart.add(
		pstart.x > pc.x ? -border : ( pstart.x < pc.x ? border : 0 ),
		pstart.y > pc.y ? -border : ( pstart.y < pc.y ? border : 0 )
	);

	var pp     = pstart;
	var pn     = null;
	var dx, dy;
	var bx, by;

	fabric.moveTo( pstart );

	while( h < hZ )
	{
		if( !pstart )
			{ throw new Error( 'hull closed prematurely'); }

		switch( hull[h] )
		{

			case 'bezier' :

				pn = hull[ h + 5 ];

				if( pn === 'close')
				{
					pn = pstart;
					pstart = null;
				}
				else
				{
					pn = view.point( pn );

					if( border !== 0 )
					{
						pn = pn.add(
							pn.x > pc.x ? -border : ( pn.x < pc.x ? border : 0 ),
							pn.y > pc.y ? -border : ( pn.y < pc.y ? border : 0 )
						);
					}
				}

				dx = pn.x - pp.x;
				dy = pn.y - pp.y;

				fabric.beziTo(
					hull[ h + 1 ] * dx,
					hull[ h + 2 ] * dy,
					- hull[ h + 3 ] * dx,
					- hull[ h + 4 ] * dy,
					pn
				);
				h += 6;
				break;

			default :
				throw new Error( 'unknown hull section: ' + hull[h] );

		}

		pp = pn;
	}

	if( pstart !== null )
		{ throw new Error( 'hull did not close' ); }

	/*

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

	*/
};


/*
| gets the source of a projection to p
*/
Ellipse.prototype.getProjection = function( p )
{
	return this.pc;
};



/*
| Returns true if point is within the slice.
*/
Ellipse.prototype.within = function( view, p )
{
	return Euclid.swatch.withinSketch(this, 'sketch', view, p);
};


} ) ();
