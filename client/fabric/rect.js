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
Rect.prototype.path = function(fabric, border, twist, view) {
	var wx = view.x(this.pnw);
	var ny = view.y(this.pnw);
	var ex = view.x(this.pse);
	var sy = view.y(this.pse);

	fabric.beginPath(twist);
	fabric.moveTo(wx + border, ny + border);
	fabric.lineTo(ex - border, ny + border);
	fabric.lineTo(ex - border, sy - border);
	fabric.lineTo(wx + border, sy - border);
	fabric.closePath();
};


})();
