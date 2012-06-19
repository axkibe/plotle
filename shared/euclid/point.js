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

                                     .-,--.           .
                                      '|__/ ,-. . ,-. |-
                                      ,|    | | | | | |
                                      `'    `-' ' ' ' `'
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

 A Point in a 2D plane.
 Points are pseudo immutable objects.

 Authors: Axel Kittenberger
 License: MIT(Expat), see accompanying 'License'-file

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

/**
| Imports
*/
var Jools;

/**
| Exports
*/
var Point = null;

/**
| Capsule
*/
(function(){
'use strict';

/**
| Node imports
*/
if (typeof(window) === 'undefined') {
	Jools = require('../jools');
}

var debug        = Jools.debug;
var immute       = Jools.immute;
var log          = Jools.log;

/**
| Constructor.
|
| Point(x, y) or
| Point(p)
*/
Point = function(a1, a2) {
	if (typeof(a1) === 'object') {
		this.x = a1.x;
		this.y = a1.y;
	} else {
		this.x = a1;
		this.y = a2;
	}
	this.type = 'Point';
	immute(this);
};

/**
| Shortcut for point at 0/0.
*/
Point.zero = new Point(0, 0);

/**
| Creates a new point.
|
| However, this will look through a list of points to see if
| this point has already this x/y to save the creation of yet
| another object
|
| Point.renew(x, y, p1, p2, p3, ...)
*/
Point.renew = function(x, y) {
	for(var a = 2, aZ = arguments.length; a < aZ; a++) {
		var p = arguments[a];
		if (p instanceof Point && p.x === x && p.y === y) return p;
	}
	return new Point(x, y);
};

/**
| Returns true if this point is equal to another.
*/
Point.prototype.eq = function(a1, a2) {
	return typeof(a1) === 'object' ?
		this.x === a1.x && this.y === a1.y :
		this.x === a1   && this.y === a2;
};

/**
| Adds two points or x/y values, returns a new point.
*/
Point.prototype.add = function(a1, a2) {
	return typeof(a1) === 'object' ?
		new Point(this.x + a1.x, this.y + a1.y) :
		new Point(this.x + a1,   this.y + a2);
};

/**
| Subtracts a points (or x/y from this), returns new point
*/
Point.prototype.sub = function(a1, a2) {
	return typeof(a1) === 'object' ?
		new Point(this.x - a1.x, this.y - a1.y) :
		new Point(this.x - a1,   this.y - a2);
};

/**
| Node exports.
*/
if (typeof(window) === 'undefined') {
	module.exports = Point;
}

})();
