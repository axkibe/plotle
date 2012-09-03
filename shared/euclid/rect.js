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
                       .-,--.         .
                        `|__/ ,-. ,-. |-
                        )| \  |-' |   |
                        `'  ` `-' `-' `'
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

 Objects and operations on an euclidian plane.

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
var Jools;
var Euclid;

/**
| Capsule
*/
(function(){
'use strict';


/*
| Node imports
*/
if (typeof(window) === 'undefined')
{
	Euclid = {
		Point  : require('./point'),
		Margin : require('./margin')
	};

	Jools  = require('../jools');
}


/*
| Constructor.
|
| pnw: point to north west.
| pse: point to south east.
*/
var Rect = Euclid.Rect = function(pnw, pse, key)
{
	if (!pnw || !pse || pnw.x > pse.x || pnw.y > pse.y)
		{ throw Jools.reject('not a rectangle.'); }

	this.pnw = pnw;
	this.pse = pse;
	Jools.innumerable(this, 'width',  pse.x - pnw.x);
	Jools.innumerable(this, 'height', pse.y - pnw.y);
	this.type = 'Rect';
	Jools.immute(this);
};


/*
| Returns a rectangle thats reduced on every side by a margin object
*/
Rect.prototype.reduce = function(margin)
{
	if (margin.constructor !== Euclid.Margin)
		{ throw new Error('margin of wrong type'); }

	// allow margins to reduce the rect to zero size without erroring.
	return new Rect(
		Euclid.Point.renew(this.pnw.x + margin.e, this.pnw.y + margin.n, this.pnw, this.pse),
		Euclid.Point.renew(this.pse.x - margin.w, this.pse.y - margin.s, this.pnw, this.pse));
};


/*
| Point in the center.
*/
Jools.lazyFixate(Rect.prototype, 'pc',
	function()
	{
		return new Euclid.Point(
			Jools.half( this.pse.x + this.pnw.x ),
			Jools.half( this.pse.y + this.pnw.y )
		);
	}
);


/*
| Point in the north.
*/
Jools.lazyFixate(Rect.prototype, 'pn',
	function()
	{
		return new Euclid.Point(
			Jools.half( this.pse.x + this.pnw.x ),
			this.pnw.y
		);
	}
);


/*
| West.
*/
Jools.lazyFixate(Rect.prototype, 'w',
	function()
	{
		return new Euclid.Point(this.pnw.x, Jools.half(this.pse.y + this.pnw.y));
	}
);


/*
| East.
*/
Jools.lazyFixate(Rect.prototype, 'e',
	function()
	{
		return new Euclid.Point(this.pse.x, Jools.half(this.pse.y + this.pnw.y));
	}
);


/*
| Returns a rect moved by a point or x/y.
|
| add(point)   -or-
| add(x, y)
*/
Rect.prototype.add = function(a1, a2)
{
	return new this.constructor(this.pnw.add(a1, a2), this.pse.add(a1, a2));
};


/*
| Creates a new rect.
|
| Looks throw a list of additional rects to look for objects to be reused.
|
| Rect.renew(wx, ny, ex, sy, ...[rects]... )
*/
Rect.renew = function(wx, ny, ex, sy)
{
	var pnw   = null;
	var pse   = null;
	var isnon = Jools.isnon;

	for(var a = 4, aZ = arguments.length; a < aZ; a++)
	{
		var r = arguments[a];
		if (!isnon(r))
			{ continue; }

		if (r.pnw.x === wx && r.pnw.y === ny)
		{
			if (r.pse.x === ex && r.pse.y === sy)
				{ return r; }
			pnw = r.pnw;
			break;
		}

		if (r.pse.x === wx && r.pse.y === ny)
			{ pnw = r.pse; break; }
	}

	for(var a = 4, aZ = arguments.length; a < aZ; a++)
	{
		var r = arguments[a];

		if (!isnon(r))
			{ continue; }

		if (r.pnw.x === ex && r.pnw.y === sy)
		{
			pse = r.pnw;
			break;
		}

		if (r.pse.x === ex && r.pse.y === sy)
		{
			pse = r.pse;
			break;
		}
	}

	if (!pnw)
		{ pnw = new Euclid.Point(wx, ny); }

	if (!pse)
		{ pse = new Euclid.Point(ex, sy); }

	return new Rect(pnw, pse);
}


/*
| Returns a rect moved by a -point or -x/-y.
|
| sub(point)   -or-
| sub(x, y)
*/
Rect.prototype.sub = function(a1, a2)
{
	return new this.constructor(this.pnw.sub(a1, a2), this.pse.sub(a1, a2));
};


/*
| Returns true if this rectangle is the same as another
*/
Rect.prototype.eq = function(r)
{
	return this.pnw.eq(r.pnw) && this.pse.eq(r.pse);
};


/*
| Node export
*/
if (typeof(window) === 'undefined')
{
	module.exports = Rect;
}

} ) ();
