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
              ,,--.          .  .---. .
              |`, | .  , ,-. |  \___  |  . ,-. ,-.
              |   | | /  ,-| |      \ |  | |   |-'
              `---' `'   `-^ `' `---' `' ' `-' `-'
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

 A vertical slice of the top half of an oval.

 Authors: Axel Kittenberger
 License: MIT(Expat), see accompanying 'License'-file

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

/**
| Imports
*/
var Euclid;
var Jools;

/**
| Exports
*/
var OvalSlice  = null;

/**
| Capsule
*/
(function(){
'use strict';
if (typeof(window) === 'undefined') { throw new Error('this code needs a browser'); }

/**
| Constructor.
|
| psw: Point to south west.
| rad: radius.
| height: slice height.
*/
OvalSlice = function(psw, dimensions) {
	this.psw       = psw;
	var a = this.a = dimensions.a1;
	var b = this.b = dimensions.b1;
	var am         = Euclid.magic * a;
	var bm         = Euclid.magic * b;

	this.slice = sliceBezier(
		-am, 0,
		0, -bm,
		-a, b,
		dimensions.slice);

	Jools.immute(this);
};

var sliceBezier = function(x2, y2, x3, y3, x4, y4, f) {
	var ff  = f*f;
	var rx2 = x2*f;
	var ry2 = y2*f;

	var rx3 = ((-3*x2 + 3*x3 + 2 * x4) * f + 4*x2 - 2*x3 - 2*x4)*ff - rx2;
	var ry3 = ((-3*y2 + 3*y3 + 2 * y4) * f + 4*y2 - 2*y3 - 2*y4)*ff - ry2;

	var rx4 = (-2*x2 + x3 + x4)*ff + 2*rx2 - rx3;
	var ry4 = (-2*y2 + y3 + y4)*ff + 2*ry2 - ry3;

	return Jools.immute({x2 : rx2, y2 : ry2, x3 : rx3, y3 : ry3, x4 : rx4, y4 : ry4});
};


/**
| Middle(center) point an Oval.
*/
Jools.lazyFixate(OvalSlice.prototype, 'pm', function() {
	return this.psw.add(
		Math.round(-this.slice.x4),
		Math.round(this.b - this.slice.y4)
	);
});

/**
| pnw (used by gradients)
*/
Jools.lazyFixate(OvalSlice.prototype, 'pnw', function() {
	return this.psw.add(0, Math.round(-this.slice.y4));
});

/**
| pnw (used by gradients)
*/
Jools.lazyFixate(OvalSlice.prototype, 'width', function() {
	return Math.round(-2 * this.slice.x4);
});

/**
| pse (used by gradients)
*/
Jools.lazyFixate(OvalSlice.prototype, 'pse', function() {
	return this.psw.add(2 * this.a, 0);
});

/**
| Draws the hexagon.
*/
OvalSlice.prototype.sketch = function(fabric, border, twist, view) {
	var pswx = view.x(this.psw);
	var pswy = view.y(this.psw);

	var slice  = this.slice;

	fabric.moveTo(pswx, pswy);
	fabric.beziTo(
		slice.x3, slice.y3,
		slice.x2, slice.y2,
		pswx - slice.x4, pswy - slice.y4);
	fabric.beziTo(
		-slice.x2, slice.y2,
		-slice.x3, slice.y3,
		pswx - 2 * slice.x4, pswy);
};

/**
| Returns true if point is within the slice.
*/
OvalSlice.prototype.within = function(fabric, view, p) {
	return fabric.within(this, 'sketch', view, p);
};

})();
