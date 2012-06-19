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

 Objects and operations on an euclidian plane.

 Authors: Axel Kittenberger
 License: MIT(Expat), see accompanying 'License'-file

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

/**
| Imports
*/
var Jools;
var Point;
var Margin;

/**
| Exports
*/
var Rect = null;

/**
| Capsule
*/
(function(){
'use strict';

/**
| Node imports
*/
if (typeof(window) === 'undefined') {
	Jools  = require('../jools');
	Point  = require('./point');
	Margin = require('./margin');
}

var debug        = Jools.debug;
var immute       = Jools.immute;
var innumerable  = Jools.innumerable;
var isnon        = Jools.isnon;
var lazyFixate   = Jools.lazyFixate;
var reject       = Jools.reject;
var half         = Jools.half;

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
 A rectangle in a 2D plane.
 Rectangles are immutable objects.
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
/**
| Constructor.
|
| pnw: point to north west.
| pse: point to south east.
*/
Rect = function(pnw, pse, key) {
	if (!pnw || !pse || pnw.x > pse.x || pnw.y > pse.y)
		{ throw reject('not a rectangle.'); }

	this.pnw = pnw;
	this.pse = pse;
	innumerable(this, 'width',  pse.x - pnw.x);
	innumerable(this, 'height', pse.y - pnw.y);
	this.type = 'Rect';
	immute(this);
};

/**
| Returns a rectangle thats reduced on every side by a margin object
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
*/
lazyFixate(Rect.prototype, 'pc', function() {
	return new Point(half(this.pse.x + this.pnw.x), half(this.pse.y + this.pnw.y));
});

/**
| West.
*/
lazyFixate(Rect.prototype, 'w', function() {
	return new Point(this.pnw.x, half(this.pse.y + this.pnw.y));
});

/**
| East.
*/
lazyFixate(Rect.prototype, 'e', function() {
	return new Point(this.pse.x, half(this.pse.y + this.pnw.y));
});

/**
| Returns a rect moved by a point or x/y
|
| add(point)   -or-
| add(x, y)
*/
Rect.prototype.add = function(a1, a2) {
	return new this.constructor(this.pnw.add(a1, a2), this.pse.add(a1, a2));
};

/**
| Creates a new rect.
|
| Looks throw a list of additional rects to look for objects to be reused.
|
| Rect.renew(wx, ny, ex, sy, ...[rects]... )
*/
Rect.renew = function(wx, ny, ex, sy) {
	var pnw = null, pse = null;

	for(var a = 4, aZ = arguments.length; a < aZ; a++) {
		var r = arguments[a];
		if (!isnon(r)) { continue; }

		if (r.pnw.x === wx && r.pnw.y === ny) {
			if (r.pse.x === ex && r.pse.y === sy)
				{ return r; }
			pnw = r.pnw;
			break;
		}

		if (r.pse.x === wx && r.pse.y === ny)
			{ pnw = r.pse; break; }
	}
	
	for(var a = 4, aZ = arguments.length; a < aZ; a++) {
		var r = arguments[a];
		if (!isnon(r)) { continue; }

		if (r.pnw.x === ex && r.pnw.y === sy) { pse = r.pnw; break; }
		if (r.pse.x === ex && r.pse.y === sy) { pse = r.pse; break; }
	}

	if (!pnw)
		{ pnw = new Point(wx, ny); }
	
	if (!pse)
		{ pse = new Point(ex, sy); }
	
	return new Rect(pnw, pse);
}

/**
| Returns a rect moved by a -point or -x/-y.
|
| sub(point)   -or-
| sub(x, y)
*/
Rect.prototype.sub = function(a1, a2) {
	return new this.constructor(this.pnw.sub(a1, a2), this.pse.sub(a1, a2));
};

/**
| Returns true if point is within this rect.
*/
Rect.prototype.within = function(p) {
	return p.x >= this.pnw.x && p.y >= this.pnw.y && p.x <= this.pse.x && p.y <= this.pse.y;
};

/**
| Returns true if this rectangle is the same as another
*/
Rect.prototype.eq = function(r) {
	return this.pnw.eq(r.pnw) && this.pse.eq(r.pse);
};

/**
| Node export
*/
if (typeof(window) === 'undefined') {
	module.exports = Rect;
}

})();
