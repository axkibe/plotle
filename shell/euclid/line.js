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
                        ,
                        )   * ,-. ,-.
                       /    | | | |-'
                       `--' ' ' ' `-'
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

 A line. Possibly with arrow-heads as ends.

 Lines are pseudo-immutable objects.

 Authors: Axel Kittenberger
 License: MIT(Expat), see accompanying 'License'-file

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

/**
| Export
*/
var Euclid;
Euclid = Euclid || {};

/**
| Imports
*/
var Jools;

/**
| Capsule
*/
(function(){
'use strict';
if (typeof(window) === 'undefined') { throw new Error('this code needs a browser'); }

/**
| Constructor.
|
| p1: point 1
| p1end: 'normal' or 'arrow'
| p2: point 1
| p2end: 'normal' or 'arrow'
*/
var Line = Euclid.Line = function(p1, p1end, p2, p2end) {
	this.p1    = p1;
	this.p1end = p1end;
	this.p2    = p2,
	this.p2end = p2end;
	Jools.immute(this);
};

/**
| Returns the line connecting entity1 to entity2
|
| shape1: a Rect or Point
| end1: 'normal' or 'arrow'
| shape2: a Rect or Point
| end2: 'normal' or 'arrow'
*/
Line.connect = function(shape1, end1, shape2, end2) {
	if (!shape1 || !shape2) throw new Error('error');
	var z1, z2;

	if (shape1 instanceof Euclid.Rect && shape2 instanceof Euclid.Point) {
		var p2 = shape2;
		z1 = shape1; // REMOVE "z1"
		var p1;
		if (z1.within(p2, Euclid.Point.zero)) {
			p1 = z1.pc;
		} else {
			p1 = new Euclid.Point(
				Jools.limit(z1.pnw.x, p2.x, z1.pse.x),
				Jools.limit(z1.pnw.y, p2.y, z1.pse.y)
			);
		}
		return new Line(p1, end1, p2, end2);
	}
	if (shape1 instanceof Euclid.Rect && shape2 instanceof Euclid.Rect) {
		z1 = shape1;
		z2 = shape2;
		var x1, y1, x2, y2;
		if (z2.pnw.x > z1.pse.x) {
			// zone2 is clearly on the right
			x1 = z1.pse.x;
			x2 = z2.pnw.x;
		} else if (z2.pse.x < z1.pnw.x) {
			// zone2 is clearly on the left
			x1 = z1.pnw.x;
			x2 = z2.pse.x;
		} else {
			// an intersection
			x1 = x2 = Jools.half(Math.max(z1.pnw.x, z2.pnw.x) + Math.min(z1.pse.x, z2.pse.x));
		}
		if (z2.pnw.y > z1.pse.y) {
			// zone2 is clearly on the bottom
			y1 = z1.pse.y;
			y2 = z2.pnw.y;
		} else if (z2.pse.y < z1.pnw.y) {
			// zone2 is clearly on the top
			y1 = z1.pnw.y;
			y2 = z2.pse.y;
		} else {
			// an intersection
			y1 = y2 = Jools.half(Math.max(z1.pnw.y, z2.pnw.y) + Math.min(z1.pse.y, z2.pse.y));
		}

		return new Line(
			new Euclid.Point(x1, y1), end1,
			new Euclid.Point(x2, y2), end2
		);
	}

	throw new Error('do not know how to create connection.');
};

/**
| Returns the zone of the arrow.
*/
Jools.lazyFixate(Line.prototype, 'zone', function() {
	var p1 = this.p1;
	var p2 = this.p2;
	return new Euclid.Rect(
		Euclid.Point.renew(Math.min(p1.x, p2.x), Math.min(p1.y, p2.y), p1, p2),
		Euclid.Point.renew(Math.max(p1.x, p2.x), Math.max(p1.y, p2.y), p1, p2));
});


/**
| Returns the point at center.
*/
Jools.lazyFixate(Line.prototype, 'pc', function() {
	var p1 = this.p1;
	var p2 = this.p2;

	return new Euclid.Point(
		Jools.half(p1.x + p2.x),
		Jools.half(p1.y + p2.y)
	);
});

/**
| Draws the path of the line.
|
| fabric: Fabric to draw upon.
| border: pixel offset for fancy borders (unused)
| twist:  0.5 if drawing lines
*/
Line.prototype.path = function(fabric, border, twist, view) {
	var p1x = view.x(this.p1);
	var p1y = view.y(this.p1);
	var p2x = view.x(this.p2);
	var p2y = view.y(this.p2);

	// @@, multiple line end types
	switch(this.p1end) {
	case 'normal':
		if (twist)
			{ fabric.moveTo(p1x, p1y); }
		break;

	default :
		throw new Error('unknown line end');
	}

	switch(this.p2end) {
	case 'normal' :
		if (twist)
			{ fabric.lineTo(p2x, p2y);}
		break;

	case 'arrow' :
		var cos = Math.cos;
		var sin = Math.sin;
		var ro  = Math.round;

		// arrow size
		var as = 12;
		// degree of arrow tail
		var d = Math.atan2(p2y - p1y, p2x - p1x);
		// degree of arrow head
		var ad = Math.PI/12;
		// arrow span, the arrow is formed as hexagon piece
		var ms = 2 / Math.sqrt(3) * as;

		if (twist) {
			fabric.lineTo(p2x - ro(ms * cos(d)), p2y - ro(ms * sin(d)));
		} else {
			fabric.moveTo(p2x - ro(ms * cos(d)), p2y - ro(ms * sin(d)));
		}

		fabric.lineTo(p2x - ro(as * cos(d - ad)), p2y - ro(as * sin(d - ad)));
		fabric.lineTo(p2x, p2y);
		fabric.lineTo(p2x - ro(as * cos(d + ad)), p2y - ro(as * sin(d + ad)));
		fabric.lineTo(p2x - ro(ms * cos(d)), p2y - ro(ms * sin(d)));
		break;

	default :
		throw new Error('unknown line end');
	}

};

/**
| Draws the line.
*/
Line.prototype.draw = function(fabric, view, style) {
	if (!style) throw new Error('Line.draw misses style');
	fabric.paint(style, this, 'path', view);
};

})();
