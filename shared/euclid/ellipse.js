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
			'start', pw,
			'round', 'clockwise', pn,
			'round', 'clockwise', pe,
			'round', 'clockwise', ps,
			'round', 'clockwise', 'close'
		]
	);

	Jools.immute(this);
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
	var magic;

	fabric.moveTo( pstart );

	while( h < hZ )
	{
		if( !pstart )
			{ throw new Error( 'hull closed prematurely'); }

		switch( hull[h] )
		{

			case 'bezier' :
				pn = hull[ h + 5 ];
				break;

			case 'round' :
				pn    = hull[ h + 2 ];
			 	magic = Euclid.Const.magic;
			 	break;

			default :
				throw new Error( 'unknown hull section: ' + hull[h] );

		}

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

		switch( hull[h] )
		{

			case 'bezier' :

				fabric.beziTo(
					hull[ h + 1 ] * dx,
					hull[ h + 2 ] * dy,
					- hull[ h + 3 ] * dx,
					- hull[ h + 4 ] * dy,
					pn
				);

				h += 6;
				break;

			case 'round' :
				var rotation = hull[ h + 1 ];
				var dxy = dx * dy;

				switch( rotation )
				{
					case 'clockwise' :

						fabric.beziTo(
							dxy > 0 ?   magic * dx : 0,
							dxy < 0 ?   magic * dy : 0,
							dxy < 0 ? - magic * dx : 0,
							dxy > 0 ? - magic * dy : 0,
							pn
						);
						break;

					default :

						throw new Error('unknown rotation');
				}

				h += 3;
				break;

			default :
				throw new Error( 'unknown hull section: ' + hull[h] );
		}

		pp = pn;
	}

	if( pstart !== null )
		{ throw new Error( 'hull did not close' ); }

};


/*
| gets the source of a projection to p
*/
Ellipse.prototype.getProjection = function( p )
{
	console.log('G');

	var hull = this.hull;
	var h    = 0;
	var hZ   = hull.length;

	if( hull[ h++ ] !== 'start' )
		{ throw new Error( 'hull must have start at [0]' ); }

	var pstart = hull [ h++ ] ;
	var pc     = this.pc;
	var pp     = pstart;
	var pn     = null;

	var dx, dy, dxy;
	var nx, ny;
	var cx, cy;
	var a, b;

	while( h < hZ )
	{
		if( !pstart )
			{ throw new Error( 'hull closed prematurely'); }

		switch( hull[h] )
		{

			case 'bezier' :
				pn = hull[ h + 5 ];
				break;

			case 'round' :
				pn    = hull[ h + 2 ];
			 	break;

			default :
				throw new Error( 'unknown hull section: ' + hull[h] );

		}

		if( pn === 'close')
		{
			pn = pstart;
			pstart = null;
		}

		switch( hull[h] )
		{

			case 'bezier' :

				throw new Error(' cannot yet do projections for beziers ');

			case 'round' :

				dx = pn.x - pp.x;
				dy = pn.y - pp.y;

				dxy = dx * dy;

				if( dx === 0 )
				{
					// XXX
				}

				if( dxy > 0 )
				{
					cx = pp.x;
					cy = pn.y;
					a  = Math.abs( pn.x - cx );
					b  = Math.abs( pp.y - cy );
				}
				else
				{
					cx = pn.x;
					cy = pp.y;
					a  = Math.abs( pp.x - cx );
					b  = Math.abs( pn.y - cy );
				}

				if(
					( ( p.x >= cx && dy > 0 ) || ( p.x <= cx && dy < 0 ) ) &&
					( ( p.y >= cy && dx < 0 ) || ( p.y <= cy && dx > 0 ) ) )
				{
					var k = ( p.y - cy ) / ( p.x - cx );

					// x^2 / a^2 + y^2 / b^2 = 1
					// y = k * x
					// x^2 / a^2 + x^2 * k^2 / b^2 = 1
					// x^2 ( 1 / a^2 + k^2 / b^2) = 1

					var x = Math.sqrt( 1 / ( 1 / ( a * a ) + k * k / ( b * b ) ) );
					var y = Math.abs( k * x );

					return new Euclid.Point(
						cx + ( p.x > cx ? x : -x ),
						cy + ( p.y > cy ? y : -y )
					);

				}

				h += 3;
			 	break;

			default :
				throw new Error( 'unknown hull section: ' + hull[h] );

		}

		pp = pn;
	}

	if( pstart !== null )
		{ throw new Error( 'hull did not close' ); }

	console.log('PC');

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
