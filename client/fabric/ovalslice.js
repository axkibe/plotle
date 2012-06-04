/**                                                      _.._
                                                      .-'_.._''.
 __  __   ___       _....._              .          .' .'     '.\
|  |/  `.'   `.   .'       '.          .'|         / .'                                _.._
|   .-.  .-.   ' /   .-'"'.  \        (  |        . '            .-,.-~.             .' .._|    .|
|  |  |  |  |  |/   /______\  |        | |        | |            |  .-. |    __      | '      .' |_
|  |  |  |  |  ||   __________|    _   | | .'''-. | |            | |  | | .:-`.'.  __| |__  .'     |
|  |  |  |  |  |\  (          '  .' |  | |/.'''. \. '            | |  | |/ |   \ ||__   __|'-..  .-'
|  |  |  |  |  | \  '-.___..-~. .   | /|  /    | | \ '.         .| |  '- `" __ | |   | |      |  |
|__|  |__|  |__|  `         .'.'.'| |//| |     | |  '. `.____.-'/| |      .'.''| |   | |      |  |
                   `'-.....-.'.'.-'  / | |     | |    `-._____ / | |     / /   | |_  | |      |  '.'
                                 \_.'  | '.    | '.           `  |_|     \ \._,\ '/  | |      |   /
                                       '___)   '___)                      `~~'  `"   |_|      `--'

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
var Fabric;
var Jools;
var Point;

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

var debug        = Jools.debug;
var immute       = Jools.immute;
var log          = Jools.log;
var fixate       = Jools.fixate;
var lazyFixate   = Jools.lazyFixate;
var magic        = Fabric.magic;
var ro           = Math.round;

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
	var am         = magic * a;
	var bm         = magic * b;
	this.slice = sliceBezier(
		-am, 0,
		0, -bm,
		-a, b,
		dimensions.slice);

	immute(this);
};

var sliceBezier = function(x2, y2, x3, y3, x4, y4, f) {
	var ff  = f*f;
	var rx2 = x2*f;
	var ry2 = y2*f;

	var rx3 = ((-3*x2 + 3*x3 + 2 * x4) * f + 4*x2 - 2*x3 - 2*x4)*ff - rx2;
	var ry3 = ((-3*y2 + 3*y3 + 2 * y4) * f + 4*y2 - 2*y3 - 2*y4)*ff - ry2;

	var rx4 = (-2*x2 + x3 + x4)*ff + 2*rx2 - rx3;
	var ry4 = (-2*y2 + y3 + y4)*ff + 2*ry2 - ry3;

	return immute({x2 : rx2, y2 : ry2, x3 : rx3, y3 : ry3, x4 : rx4, y4 : ry4});
};


/**
| Middle(center) point an Oval.
*/
lazyFixate(OvalSlice.prototype, 'pm', function() {
	return this.psw.add(ro(-this.slice.x4), ro(this.b - this.slice.y4));
});

/**
| pnw (used by gradients)
*/
lazyFixate(OvalSlice.prototype, 'pnw', function() {
	return this.psw.add(0, ro(-this.slice.y4));
});

/**
| pnw (used by gradients)
*/
lazyFixate(OvalSlice.prototype, 'width', function() {
	return ro(-2 * this.slice.x4);
});

/**
| pse (used by gradients)
*/
lazyFixate(OvalSlice.prototype, 'pse', function() {
	return this.psw.add(2 * this.a, 0);
});

/**
| Draws the hexagon.
*/
OvalSlice.prototype.path = function(fabric, border, twist, pan) {
	var a   = this.a;
	var b   = this.b;
	var am  = magic * this.a;
	var bm  = magic * this.b;
	var bo  = border;
	var pswx = ro(this.psw.x + pan.x); // TODO need ro?
	var pswy = ro(this.psw.y + pan.y);

	fabric.beginPath(twist);

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
OvalSlice.prototype.within = function(fabric, pan, p) {
	return fabric.within(this, 'path', pan, p);
};

})();
