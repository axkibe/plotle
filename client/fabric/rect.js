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

                                         .-,--.         .
                                          `|__/ ,-. ,-. |-
                                          )| \  |-' |   |
                                          `'  ` `-' `-' `'
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

 A rectangle in a 2D plane.
 Extends the basic euclidian rect with some fabric features

 Authors: Axel Kittenberger
 License: MIT(Expat), see accompanying 'License'-file

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

/**
| Imports
*/
var Jools;
var Margin;
var Point;

/**
| Import/Exports
*/
var Rect;

/**
| Capsule
*/
(function(){
'use strict';
if (typeof(window) === 'undefined') { throw new Error('this code needs a browser'); }

var debug        = Jools.debug;
var immute       = Jools.immute;
var half         = Jools.half;
var log          = Jools.log;
var fixate       = Jools.fixate;
var lazyFixate   = Jools.lazyFixate;
var subclass     = Jools.subclass;

/**
| Constructor.
|
| pnw: point to north west.
| pse: point to south east.
*/
/*var eRect = Rect;
Rect = function(pnw, pse, key) {
	eRect.call(this, pnw, pse, key);
};
subclass(Rect, eRect);
*/

/**
| Draws the rectangle.
*/
Rect.prototype.path = function(fabric, border, twist, pan) {
	var px = pan.x;
	var py = pan.y;
	fabric.beginPath(twist);
	fabric.moveTo(this.pnw.x + px + border, this.pnw.y + px + border);
	fabric.lineTo(this.pse.x + px - border, this.pnw.y + px + border);
	fabric.lineTo(this.pse.x + px - border, this.pse.y + px - border);
	fabric.lineTo(this.pnw.x + px + border, this.pse.y + px - border);
	fabric.closePath();
};

/**
| Returns a rectangle thats reduced on every side by a margin object
| TODO move to euclid
*/
Rect.prototype.reduce = function(margin) {
	if (margin.constructor !== Margin) throw new Error('margin of wrong type');

	// allow margins to reduce the rect to zero size without erroring.
	return new Rect(
		Point.renew(this.pnw.x + margin.e, this.pnw.y + margin.n, this.pnw, this.pse),
		Point.renew(this.pse.x - margin.w, this.pse.y - margin.s, this.pnw, this.pse));
};

/**
| Point in the center.
| TODO move to euclid
*/
lazyFixate(Rect.prototype, 'pc', function() {
	return new Point(half(this.pse.x + this.pnw.x), half(this.pse.y + this.pnw.y));
});

})();
