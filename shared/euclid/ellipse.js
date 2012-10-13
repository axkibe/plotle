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
		// ...
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

	Euclid.Shape.call(
		this,
		[
			'start', pw,
			'round', 'clockwise', pn,
			'round', 'clockwise', pe,
			'round', 'clockwise', ps,
			'round', 'clockwise', 'close'
		]
	);

	for( var a = 2; a < arguments.length; a += 2 ) {
		var arg = arguments[ a ];
		var val = arguments[ a + 1 ];
		switch( arg ) {

			case 'gradientPC' :
				this._lazy_gradientPC = val;
				break;

			case 'gradientR0' :
				this._lazy_gradientR0 = val;
				break;

			case 'gradientR1' :
				this._lazy_gradientR1 = val;
				break;

			default :
				throw new Error( 'invalid argument: ' + arg );

		}
	}

	Jools.immute(this);
};

Jools.subclass( Ellipse, Euclid.Shape );


/*
| center point of an ellipse
*/
Jools.lazyFixate(
	Ellipse.prototype,
	'pc',
	function()
	{
		return new Euclid.Point(
			Jools.half(this.pnw.x + this.pse.x),
			Jools.half(this.pnw.y + this.pse.y)
		);
	}
);


/*
| gradient's center point
*/
Jools.lazyFixate(
	Ellipse.prototype,
	'gradientPC',
	function()
	{
		return new Euclid.Point(
			Jools.half(this.pnw.x + this.pse.x),
			Jools.half(this.pnw.y + this.pse.y)
		);
	}
);


/*
| gradient's radius
*/
Jools.lazyFixate(
	Ellipse.prototype,
	'gradientR1',
	function( )
	{
		var dx = this.pse.x - this.pnw.x;
		var dy = this.pse.y - this.pnw.x;

		return Math.max( dx, dy );
	}
);

/*
| returns true if this ellipse is the same as another
*/
Ellipse.prototype.eq = function( r )
{
	return this.pnw.eq( r.pnw ) && this.pse.eq( r.pse );
};


/*
| Returns true if point is within the ellipse.
*/
Ellipse.prototype.within = function( view, p )
{
	return Euclid.swatch.withinSketch(this, 'sketch', view, p);
};


} ) ();
