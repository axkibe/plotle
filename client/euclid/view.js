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

                                         ,.   ,.
                                         `|  / . ,-. . , ,
                                          | /  | |-' |/|/
                                          `'   ' `-' ' '
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

 A view on a space determines the current pan, zooming and a possible ongoing pan/zooming motion.

 Authors: Axel Kittenberger
 License: MIT(Expat), see accompanying 'License'-file

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

/**
| Imports
*/
var Jools;
var Point;
var Rect;
var theme;

/**
| Import/Exports
*/
var View = null;

/**
| Capsule
*/
(function(){
'use strict';
if (typeof(window) === 'undefined') { throw new Error('this code needs a browser'); }

var debug  = Jools.debug;
var immute = Jools.immute;
var limit  = Jools.limit;
var log    = Jools.log;
var ro     = Math.round;

/**
| Constructor.
*/
View = function(pan, fact) {
	this.pan  = pan;
	this.fact = limit(theme.zoom.min, fact, theme.zoom.max);
	this.zoom = Math.pow(theme.zoom.base, this.fact);
	immute(this);
};

View.proper = new View(Point.zero, 0);

/**
| Returns the x value for a point for this view.
*/
View.prototype.x = function(a1, a2) {
	var x, y;

	if (a1 instanceof Point) {
		x = a1.x;
		y = a1.y;
	} else {
		if (typeof(a1) !== 'number' || typeof(a2) !== 'number')
			{ throw new Error('not a number'); }
		x = a1;
		y = a2;
	}
	
	return ro((x + this.pan.x) * this.zoom);
};

/**
| Returns the original x value for a point in this view.
*/
View.prototype.dex = function(a1, a2) {
	var x, y;

	if (a1 instanceof Point) {
		x = a1.x;
		y = a1.y;
	} else {
		if (typeof(a1) !== 'number' || typeof(a2) !== 'number')
			{ throw new Error('not a number'); }
		x = a1;
		y = a2;
	}
	
	return ro(x / this.zoom - this.pan.x);
};

/**
| Returns the y value for a point for this view.
*/
View.prototype.y = function(a1, a2) {
	var x, y;
	
	if (a1 instanceof Point) {
		x = a1.x;
		y = a1.y;
	} else {
		if (typeof(a1) !== 'number' || typeof(a2) !== 'number')
			{ throw new Error('not a number'); }
		x = a1;
		y = a2;
	}
	
	return ro((y + this.pan.y) * this.zoom);
};

/**
| Returns the original y value for a point in this view.
*/
View.prototype.dey = function(a1, a2) {
	var x, y;
	
	if (a1 instanceof Point) {
		x = a1.x;
		y = a1.y;
	} else {
		if (typeof(a1) !== 'number' || typeof(a2) !== 'number')
			{ throw new Error('not a number'); }
		x = a1;
		y = a2;
	}
	
	return ro(y / this.zoom - this.pan.y);
};

/**
| Returns a view with pan == Point.zero, but same zero level
*/
View.prototype.home = function() {
	if (this._$home) return this._$home;
	return this._$home = new View(Point.zero, this.fact);
};

/**
| Returns a point repositioned to the current view.
*/
View.prototype.point = function(a1, a2) {
	return new Point(this.x(a1, a2), this.y(a1, a2));
};

/**
| Returns the original position of repositioned point.
*/
View.prototype.depoint = function(a1, a2) {
	return new Point(this.dex(a1, a2), this.dey(a1, a2));
};

/**
| Returns true if views are equal in terms of zoom and pan.
*/
View.prototype.eq = function(a1) {
	return this.zoom === a1.zoom && this.pan.eq(a1.pan);
};

/**
| Returns a rect repositioned and resized to the current view.
*/
View.prototype.rect = function(a1, a2) {
	if (this.zoom === 1) {
		var r = (a1 instanceof Rect) ? a1 : new Rect(a1, a2);

		return (this.pan.x === 0 && this.pan.y === 0)  ? r : r.add(this.pan);
	}

	var pnw, pse;
	if (a1 instanceof Rect) {
		pnw = a1.pnw;
		pse = a1.pse;
	} else {
		pnw = a1;
		pse = a2;
	}

	return new Rect(this.point(pnw), this.point(pse));
};

/**
| Returns a view with changes zoom level and a pan so p stays in the same spot.
|
| new pan (k1) calculates as:
|
| A: p = (y0 + k1) * z1
| B: p = (y0 + k0) * z0
|
| A: p / z1 = y0 + k1
| B: p / z0 = y0 + k0
|
| A - B: p / z1 - p / z0 = k1 - k0
|
| -> k1 = p *(1 / z1 - 1 / z0) + k0
*/
View.prototype.review = function(df, p) {
	var pan = this.pan;
	var f1;
	if (df === 0) {
		f1 = 0;
	} else {
		f1 = limit(theme.zoom.min, this.fact + df, theme.zoom.max);
	}
	var z1 = Math.pow(1.1, f1);
	var f = 1 / z1  - 1 / this.zoom;

	return new View(
		new Point(
			ro(pan.x + p.x * f),
			ro(pan.y + p.y * f)
		),
		f1
	);
};

})();
