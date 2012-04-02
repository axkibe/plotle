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

                                   .-,--'    .
                                    \|__ ,-. |-. ,-. . ,-.
                                     |   ,-| | | |   | |
                                    `'   `-^ ^-' '   ' `-'
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

 A graphic 2D-Object library for HTML Canvas 5

 This is not a full blown feature complete, everything library
 but enhanced on the fly for what the meshcraft shell needs.

 Defines: fabric

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
var Fabric;

/**
| Capsule
*/
(function(){

'use strict';

if (typeof(window) === 'undefined') {
    Jools = require('./jools');
}

var debug        = Jools.debug;
var is           = Jools.is;
var log          = Jools.log;
var fixate       = Jools.fixate;
var fixateNoEnum = Jools.fixateNoEnum;
var reject       = Jools.reject;
var subclass     = Jools.subclass;
var min          = Math.min;
var max          = Math.max;

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
 Meshcrafts Canvas wrapper.

 It enhances the HTML5 Canvas Context by accpeting previously defined immutable graphic
 objects as arguments.
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
/**
| Fabric()        -or-    creates a new fabric
| Fabric(canvas)  -or-    encloses an existing HTML5 canvas
| Fabric(width, height)   creates a new fabric and sets its size;
*/
Fabric = function(a1, a2) {
	switch (typeof(a1)) {
	case 'undefined' :
		this._canvas = document.createElement('canvas');
		break;
	case 'object' :
		if (a1.constructor === Fabric) {
			this._canvas = a1._canvas;
		} else {
			if (!a1.getContext) throw new Error('Invalid parameter to new Farbic: ' + a1);
			this._canvas = a1;
		}
		break;
	default :
		this._canvas = document.createElement('canvas');
		this._canvas.width  = a1;
		this._canvas.height = a2;
	}
	this._cx = this._canvas.getContext('2d');
	this.pan = Point.zero;
};

/**
* A value is computed and fixated only when needed.
*/
// TODO this belongs to Jools
var lazyFixate = function(proto, key, getter) {
	Object.defineProperty(proto, key, {
		// this clever overriding does not work in IE9 :-( or Android 2.2 Browser
		// get : function() { return fixate(this, key, getter.call(this)); },
		get : function() {
			var ckey = '_$'+key;
			return is(this[ckey]) ? this[ckey] : fixateNoEnum(this, ckey, getter.call(this));
		}
	});
};

/**
| Shortcuts
*/
var R     = Math.round;
var PI    = Math.PI;
var cos   = Math.cos;
var sin   = Math.sin;
var tan   = Math.tan;
var cos30 = cos(PI / 6);   // cos(30°)
var tan30 = tan(PI / 6);   // tan(30°)

// divides by 2 and rounds up
var half = function(v) { return R(v / 2); };

/**
| Returns the compass direction opposite of a direction.
*/
var opposite = function(dir) {
	switch (dir) {
	case 'n'  : return 's';
	case 'ne' : return 'sw';
	case 'e'  : return 'w';
	case 'se' : return 'nw';
	case 's'  : return 'n';
	case 'sw' : return 'ne';
	case 'w'  : return 'e';
	case 'nw' : return 'se';
	case 'c'  : return 'c';
	default   : throw new Error('unknown compass direction');
	}
};

/**
| Throws an error if any argument is not an integer.
*/
var ensureInteger = function() {
	for(var a in arguments) {
		var arg = arguments[a];
		if (Math.floor(arg) - arg !== 0) {
			throw new Error(arg + ' not an integer');
		}
	}
};

/**
| Fabric width.
*/
Object.defineProperty(Fabric.prototype, 'width',  {
	get: function() { return this._canvas.width; }
});

/**
| Fabric height.
*/
Object.defineProperty(Fabric.prototype, "height", {
	get: function() { return this._canvas.height; }
});

/**
| The canvas is cleared and resized to width/height (of rect).
|
| attune()               -or-
| attune(rect)           -or-
| attune(width, height)
*/
Fabric.prototype.attune = function(a1, a2) {
	var ta1 = typeof(a1);
	var c = this._canvas;
	var w, h;
	switch(typeof(a1)) {
	case 'undefined' :
		this._cx.clearRect(0, 0, c.width, c.height);
		return;
	case 'object' :
		w  = a1.width;
		h  = a1.height;
		break;
	default :
		w  = a1;
		h  = a2;
		break;
	}
	if (c.width === w && c.height === h) {
		// no size change, clearRect() is faster
		this._cx.clearRect(0, 0, c.width, c.height);
		return;
	}
	/* setting width or height clears the contents */
	if (c.width  !== w) c.width  = w;
	if (c.height !== h) c.height = h;
};


/**
| Moves the path maker.
|
| moveTo(point) -or-
| moveTo(x, y)
*/
Fabric.prototype.moveTo = function(a1, a2) {
	var pan = this.pan, tw = this._twist, x, y;
	if (typeof(a1) === 'object') {
		x = a1.x; y = a1.y;
	} else {
		x = a1;   y = a2;
	}
	ensureInteger(x, y);
	this._cx.moveTo(x + pan.x + tw, y + pan.y + tw);
};

/**
| Draws a line.
|
| lineto(point) -or-
| lineto(x, y)
*/
Fabric.prototype.lineTo = function(a1, a2) {
	var pan = this.pan, tw = this._twist, x, y;
	if (typeof(a1) === 'object') {
		x = a1.x; y = a1.y;
	} else {
		x = a1;   y = a2;
	}
	ensureInteger(x, y);
	this._cx.lineTo(x + pan.x + tw, y + pan.y + tw);
};

/**
| Draws an arc.
|
| arc(p,    radius, startAngle, endAngle, anticlockwise)   -or-
| arc(x, y, radius, startAngle, endAngle, anticlockwise)   -or-
*/
Fabric.prototype.arc = function(a1, a2, a3, a4, a5, a6, a7) {
	var pan = this.pan, tw = this._twist, x, y, r, sa, ea, ac;
	if (typeof(a1) === 'object') {
		x = a1.x; y = a1.y; r = a2; sa = a3; ea = a4; ac = a5;
	} else {
		x = a1;   y = a2;   r = a3; sa = a4; ea = a5; ac = a6;
	}
	this._cx.arc(x + pan.x + tw, y + pan.y + tw, r, sa, ea, ac);
};

/**
| rect(rect)     -or-
| rect(pnw, pse) -or-
| rect(nwx, nwy, w, h)
*/
Fabric.prototype.rect = function(a1, a2, a3, a4) {
	var pan = this.pan;
	var cx = this._cx;
	/*
	if (typeof(r) === 'object') {
		if (r instanceof Rect)
			return this._cx.rect(
				a1.pnw.x + pan.x + 0.5, a1.pnw.y + pan.y + 0.5,
				a1.width, a1.height);
		if (r instanceof Point)
			return this._cx.rect(
				a1.x + pan.x + 0.5, a1.y + pan.y + 0.5,
				a2.x - a1.x,        a2.y - a1.y);
		throw new Error('fillRect not a rectangle');
	}
	*/
	return this._cx.rect(a1 + pan.x + 0.5,  a2 + pan.y + 0.5, a3, a4);
};

/**
| fillRect(style, rect)     -or-
| fillRect(style, pnw, pse) -or-
| fillRect(style, nwx, nwy, width, height)
*/
Fabric.prototype.fillRect = function(style, a1, a2, a3, a4) {
	var pan = this.pan;
	var cx = this._cx;
	cx.fillStyle = style;
	/*
	if (typeof(p) === 'object') {
		if (a1 instanceof Rect)
			return this._cx.fillRect(a1.pnw.x, a1.pnw.y, a1.pse.x, a1.pse.y);
		if (a1 instanceof Point)
			return this._cx.fillRect(a1.x, a1.y, a2.x, a2.y);
		throw new Error('fillRect not a rectangle');
	}
	*/
	return this._cx.fillRect(a1 + pan.x, a2 + pan.y, a3, a4);
};

/**
| Begins a path.
*/
Fabric.prototype.beginPath = function(twist) {
	if (typeof(twist) !== 'boolean') throw new Error('beginPath() needs twist argument');
	// lines are targed at .5 coords.
	this._twist = twist ? 0.5 : 0;
	this._cx.beginPath();
};

/**
| Closes a path.
*/
Fabric.prototype.closePath = function() {
	this._cx.closePath();
};

/**
| Draws an image.
|
| drawImage(image, pnw)   -or-
| drawImage(image, x, y)
*/
Fabric.prototype.drawImage = function(image, a1, a2) {
	var pan = this.pan;
	if (image instanceof Fabric) {
		if (!(image.width > 0 && image.height > 0)) return;
		image = image._canvas;
	}
	var x, y;
	if (typeof(a1) === 'object') {
		x = a1.x; y = a1.y;
	} else {
		x = a1; y = a2;
	}
	ensureInteger(x, y);
	this._cx.drawImage(image, x + pan.x, y + pan.y);
};


/**
| putImageData(imagedata, p) -or-
| putImageData(imagedata, x, y)
*/
Fabric.prototype.putImageData = function(imagedata, a1, a2) {
	var pan = this.pan;
	var x, y;
	if (typeof(a1) === 'object') {
		x = a1.x; y = a1.y;
	} else {
		x = a1;   y = a2;
	}
	ensureInteger(x, y);
	this._cx.putImageData(imagedata, x + pan.x, y + pan.y);
};

/**
| getImageData(rect)     -or-
| getImageData(pnw, pse) -or-
| getImageData(x1, y1, x2, y2)
*/
Fabric.prototype.getImageData = function(a1, a2, a3, a4) {
	var pan = this.pan;
	var x1, y1, x2, y2;
	if (typeof(p) === 'object') {
		if (a1 instanceof Rect) {
			x1 = a1.pnw.x; y1 = a1.pnw.y;
			x2 = a1.pse.x; y2 = a1.pse.y;
		} else if (a1 instanceof Point) {
			x1 = a1.x; y1 = a1.y;
			x2 = a2.x; y2 = a2.y;
		} else {
			throw new Error('getImageData not a rectangle');
		}
	} else {
		x1 = a1; y1 = a2;
		x2 = a3; y2 = a4;
	}

	ensureInteger(x1, y2, x1, y2);
	return this._cx.getImageData(a1, a2, a3, a4);
};

/**
| Returns a HTML5 color style for a meshcraft style notation.
*/
Fabric.prototype._colorStyle = function(style, shape) {
	if (style.substring) {
		return style;
	} else if (!style.gradient) {
		throw new Error('unknown style');
	}

	var grad;
	switch (style.gradient) {
	case 'askew' :
		// TODO use gradientPNW
		if (!shape.pnw || !shape.pse) throw new Error(style.gradient+' gradiend misses pnw/pse');
		grad = this._cx.createLinearGradient(
			shape.pnw.x + this.pan.x, shape.pnw.y + this.pan.y,
			shape.pnw.x + shape.width / 10 + this.pan.x, shape.pse.y + this.pan.y);
		break;
	case 'horizontal' :
		// TODO use gradientPNW
		if (!shape.pnw || !shape.pse) throw new Error(style.gradient+' gradient misses pnw/pse');
		grad = this._cx.createLinearGradient(
			0, this.pan.y + shape.pnw.y,
			0, this.pan.y + shape.pse.y);
		break;
	case 'radial' :
		if (!shape.gradientPC || !shape.gradientR1)
			throw new Error(style.gradient+' gradient misses gradient[PC|R0|R1]');
		var ro = shape.gradientR0 || 0;
		grad = this._cx.createRadialGradient(
			shape.gradientPC.x + this.pan.x, shape.gradientPC.y + this.pan.y, ro,
			shape.gradientPC.x + this.pan.x, shape.gradientPC.y + this.pan.y, shape.gradientR1);
		break;
	default :
		throw new Error('unknown gradient');
	}
	var steps = style.steps;
	for(var i = 0; i < steps.length; i++) {
		grad.addColorStop(steps[i][0], steps[i][1]);
	}
	return grad;
};

/**
| Draws a filled area.
|
| style: the style formated in meshcraft style notation.
| shape: an object which has path() defined
*/
Fabric.prototype.fill = function(style, shape, path, a1, a2, a3, a4) {
	var cx = this._cx;
	shape[path](this, 0, false, a1, a2, a3, a4);
	cx.fillStyle = this._colorStyle(style, shape);
	if (this._twist !== 0) throw new Error('wrong twist');
	cx.fill();
};

/**
| Draws a single edge.
|
| style: the style formated in meshcraft style notation.
| shape: an object which has path() defined
*/
Fabric.prototype._edge = function(style, shape, path, a1, a2, a3, a4) {
	var cx = this._cx;
	shape[path](this, style.border, true, a1, a2, a3, a4);
	cx.strokeStyle = this._colorStyle(style.color, shape);
	cx.lineWidth = style.width;
	if (this._twist !== 0.5) throw new Error('wrong twist');
	cx.stroke();
};

/**
| Draws an edge.
|
| style: the style formated in meshcraft style notation.
| shape: an object which has path() defined
*/
Fabric.prototype.edge = function(style, shape, path, a1, a2, a3, a4) {
	var cx = this._cx;
	if (style instanceof Array) {
		for(var i = 0; i < style.length; i++) {
			this._edge(style[i], shape, path, a1, a2, a3, a4);
		}
	} else {
		this._edge(style, shape, path, a1, a2, a3, a4);
	}
};

/**
| Fills an aera and draws its borders
*/
Fabric.prototype.paint = function(style, shape, path, a1, a2, a3, a4) {
	var fillStyle = style.fill;
	var edgeStyle = style.edge;
	var cx = this._cx;
	shape[path](this, 0, false, a1, a2, a3, a4);
	cx.fillStyle = this._colorStyle(fillStyle, shape);
	cx.fill();
	if (edgeStyle instanceof Array) {
		for(var i = 0; i < edgeStyle.length; i++) {
			this._edge(edgeStyle[i], shape, path, a1, a2, a3, a4);
		}
	} else {
		this._edge(edgeStyle, shape, path, a1, a2, a3, a4);
	}
};

/**
| Draws some text.
*/
Fabric.prototype.fillText = function(text, a1, a2) {
	if (typeof(a1) === 'object') {
		return this._cx.fillText(text, a1.x, a1.y);
	}
	return this._cx.fillText(text, a1, a2);
};

/**
| Draws some text rotated by phi
| text: text to draw
| p: center point of rotation
| phi: rotation angle
| d: distance from center // TODO rename
*/
Fabric.prototype.fillRotateText = function(text, pc, phi, d) {
	var cx = this._cx;
	var t1 = cos(phi);
	var t2 = sin(phi);
	var det = t1 * t1 + t2 * t2;
	var x = pc.x + d * t2;
	var y = pc.y - d * t1;
	if (t1 < 0) {
		/* turn lower segments so text isn't upside down */
		t1 = -t1;
		t2 = -t2;
	}
	cx.setTransform(t1, t2, -t2, t1, 0, 0);
	var x1 = (x * t1 + y * t2) / det;
	var y1 = (y * t1 - x * t2) / det;
	cx.fillText(text, x1, y1);
	cx.setTransform(1, 0, 0, 1, 0, 0);
};


/**
| Sets the fontStyle, fillStyle, textAlign, textBaseline.
|
| fontStyle(font, fill)                      -or-
| fontStyle(font, fill, align, baseline)
|
| TODO rename setFontStyle
*/
Fabric.prototype.fontStyle = function(font, fill, align, baseline) {
	var cx = this._cx;
	cx.font         = font;
	cx.fillStyle    = fill;
	cx.textAlign    = align;
	cx.textBaseline = baseline;
};

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ,-,-,-.
 `,| | |   ,-. ,-. ,-. . . ,-. ,-.
   | ; | . |-' ,-| `-. | | |   |-'
   '   `-' `-' `-^ `-' `-^ '   `-'
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
var Measure = {
	init : function() {
		Measure._canvas = document.createElement('canvas');
		Measure._cx = this._canvas.getContext('2d');
	},

	width : function(text) {
		return Measure._cx.measureText(text).width;
	}
};

Object.defineProperty(Measure, 'font', {
	get: function() { return Measure._cx.font; },
	set: function(font) { Measure._cx.font = font; }
});

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
.-,--.           .
 '|__/ ,-. . ,-. |-
 ,|    | | | | | |
 `'    `-' ' ' ' `'
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
 A Point in a 2D plane.
 Points are immutable objects.
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
/**
| Constructor.
|
| Point(x, y) or
| Point(p)
*/
var Point = function(a1, a2) {
	if (typeof(a1) === 'object') {
		fixate(this, 'x', a1.x);
		fixate(this, 'y', a1.y);
	} else {
		fixate(this, 'x', a1);
		fixate(this, 'y', a2);
	}
	fixate(this, 'type', 'Point'); // @@ So Tree is happy TODO prototype
};

/**
| Shortcut for point at 0/0.
*/
Point.zero = new Point(0, 0);

/**
| Creates a new point.
| However it will look through a list of points to see if
| this point has already this x/y to save creation of yet
| another object
|
| Point.renew(x, y, p1, p2, p3, ...)
*/
Point.renew = function(x, y) {
	for(var a = 2; a < arguments.length; a++) {
		var p = arguments[a];
		if (p instanceof Point && p.x === x && p.y === y) return p;
	}
	return new Point(x, y);
};

/**
| Returns a json object for this point.
*/
/*Point.prototype.toJSON = function() {
	return this._json || (this._json = { x: this.x, y: this.y });
}*/

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

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 .-,--.         .
  `|__/ ,-. ,-. |-
  )| \  |-' |   |
  `'  ` `-' `-' `'
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
var Rect = function(pnw, pse, key) {
	if (!pnw || !pse || pnw.x > pse.x || pnw.y > pse.y) {
		throw reject('not a rectangle.');
	}
	fixate(this, 'pnw',    pnw);
	fixate(this, 'pse',    pse);
	fixateNoEnum(this, 'width',  pse.x - pnw.x);
	fixateNoEnum(this, 'height', pse.y - pnw.y);
	fixate(this, 'type', 'Rect'); // @@ So Tree is happy TODO prototype
};

/**
| Returns a rect moved by a point or x/y
|
| add(point)   -or-
| add(x, y)
*/
Rect.prototype.add = function(a1, a2) {
	return new Rect(this.pnw.add(a1, a2), this.pse.add(a1, a2));
};

/**
| Returns a rect moved by a -point or -x/-y.
|
| sub(point)   -or-
| sub(x, y)
*/
Rect.prototype.sub = function(a1, a2) {
	return new Rect(this.pnw.sub(a1, a2), this.pse.sub(a1, a2));
};

/**
| Returns true if point is within this rect.
*/
Rect.prototype.within = function(p) {
	return p.x >= this.pnw.x && p.y >= this.pnw.y && p.x <= this.pse.x && p.y <= this.pse.y;
};

/**
| Draws the rectangle.
*/
Rect.prototype.path = function(fabric, border, twist) {
	fabric.beginPath(twist);
	fabric.moveTo(this.pnw.x + border, this.pnw.y + border);
	fabric.lineTo(this.pse.x - border, this.pnw.y + border);
	fabric.lineTo(this.pse.x - border, this.pse.y - border);
	fabric.lineTo(this.pnw.x + border, this.pse.y - border);
	fabric.closePath();
};

/**
| Returns a resized rectangle.
|
| width:  new width
| height: new height
| align:  compass direction which point will be identical to this rectangle.
*/
Rect.prototype.resize = function(width, height, align) {
	if (this.width === width && this.height === height) return this;
	var pnw, pse;
	switch(align) {
	case 'n' :
		pnw = Point.renew(this.pnw.x - half(width - this.width), this.pnw.y,
			this.pnw, this.pse);
		pse = Point.renew(pnw.x + width, this.pnw.y + height,
			this.pnw, this.pse);
		break;
	case 'ne' :
		pnw = Point.renew(this.pse.x - width, this.pnw.y,
			this.pnw, this.pse);
		pse = Point.renew(this.pse.x, this.pnw.y + height,
			this.pnw, this.pse);
		break;
	case 'e' :
		pnw = Point.renew(this.pse.x - width, this.pnw.y - half(height - this.height),
			this.pnw, this.pse);
		pse = Point.renew( this.pse.x, pnw.y + height,
			this.pnw, this.pse);
		break;
	case 'se' :
		pnw = Point.renew(this.pse.x - width, this.pse.y - height,
			this.pnw, this.pse);
		pse = this.pse;
		break;
	case 's' :
		pnw = Point.renew(this.pnw.x - half(width - this.width), this.pse.y - height,
			this.pnw, this.pse);
		pse = Point.renew(
			pnw.x + width, this.pse.y,
			this.pnw, this.pse);
		break;
	case 'sw' :
		pnw = Point.renew(this.pnw.x, this.pse.y - height,
			this.pnw, this.pse);
		pse = Point.renew(
			this.pnw.x + width, this.pse.y,
			this.pnw, this.pse);
		break;
	case 'w' :
		pnw = Point.renew(this.pnw.x, this.pnw.y - half(height - this.height),
			this.pnw, this.pse);
		pse = Point.renew(
			this.pnw.x + width, pnw.y + height,
			this.pnw, this.pse);
		break;
	case 'nw' :
		pnw = this.pnw;
		pse = Point.renew(this.pnw.x + width, this.pnw.y + height,
			this.pnw, this.pse);
		break;
	case 'c' :
		pnw = Point.renew(
			this.pnw.x - half(width - this.width), this.pnw.y - half(height - this.height),
			this.pnw, this.pse);
		pse = Point.renew(
			pnw.x + width, pnw.y + height,
			this.pnw, this.pse);
		break;
	default :
		throw new Error('invalid align: '+align);
	}
	return new Rect(pnw, pse);
};

/**
| Returns a rectangle with same size at position.
|
| moveto(p)   -or-
| moveto(x, y)
*/
Rect.prototype.moveto = function(a1, a2) {
	if (typeof(a1) !== 'object') a1 = new Point(a1, a2);
	return new Rect(a1, a1.add(this.width, this.height));
};

/**
| Returns true if this rectangle is the same as another
*/
Rect.prototype.eq = function(r) {
	return this.pnw.eq(r.pnw) && this.pse.eq(r.pse);
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

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
,-,-,-.
`,| | |   ,-. ,-. ,-. . ,-.
  | ; | . ,-| |   | | | | |
  '   `-' `-^ '   `-| ' ' '
~ ~ ~ ~ ~ ~ ~ ~ ~ ~,| ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
                   `'
 Holds information of inner or outer distances.
 Margins are immutable objects.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
/**
| Constructor.
|
| Margin(n, e, s, w)
|
| n: master or north margin
| e: east margin
| s: south margin
| w: west margin
*/
var Margin = function(m, e, s, w) {
	if (typeof(m) === 'object') {
		fixate(this, 'n', m.n);
		fixate(this, 'e', m.e);
		fixate(this, 's', m.s);
		fixate(this, 'w', m.w);
	} else {
		fixate(this, 'n', m);
		fixate(this, 'e', e);
		fixate(this, 's', s);
		fixate(this, 'w', w);
	}
};

/**
| A margin with all distances 0.
*/
Margin.zero = new Margin(0, 0, 0, 0);

/**
| Returns a json object for this margin
*/
Margin.prototype.toJSON = function() {
	return this._json || (this._json = { n: this.n, e: this.e, s: this.s, w: this.w });
};

/**
| East + west margin = x
*/
lazyFixate(Margin.prototype, 'x', function() { return this.e + this.w; });

/**
| North + south margin = y
*/
lazyFixate(Margin.prototype, 'y', function() { return this.n + this.s; });

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 .-,--.               . .-,--.         .
  `|__/ ,-. . . ,-. ,-|  `|__/ ,-. ,-. |-
  )| \  | | | | | | | |  )| \  |-' |   |
  `'  ` `-' `-^ ' ' `-^  `'  ` `-' `-' `'
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

 A rectangle in a 2D plane with rounded corners
 Rectangles are immutable objects.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

/**
| Constructor.
|
| Rect(rect, crad)      -or-
| Rect(pnw, pse, crad)
*/
var RoundRect = function(a1, a2, a3) {
	if (a1 instanceof Point) {
		Rect.call(this, a1, a2);
		fixate(this, 'crad', a3);
	} else {
		Rect.call(this, a1.pnw, a1.pse);
		fixate(this, 'crad', a2);
	}
};
subclass(RoundRect, Rect);

/**
| Draws the roundrect.
|
| fabric : fabric to draw the path upon.
| border : additional distance.
| twist  : parameter to beginPath, add +0.5 on everything for lines
*/
RoundRect.prototype.path = function(fabric, border, twist) {
	var nwx = this.pnw.x + border;
	var nwy = this.pnw.y + border;
	var sex = this.pse.x - border - 1;
	var sey = this.pse.y - border - 1;
	var cr  = this.crad  - border;
	var pi = Math.PI;
	var ph = pi / 2;
	fabric.beginPath(twist);
	fabric.moveTo(nwx + cr, nwy);
	fabric.arc(sex - cr, nwy + cr, cr, -ph,   0, false);
	fabric.arc(sex - cr, sey - cr, cr,   0,  ph, false);
	fabric.arc(nwx + cr, sey - cr, cr,  ph,  pi, false);
	fabric.arc(nwx + cr, nwy + cr, cr,  pi, -ph, false);
};


/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ,-_/,.
 ' |_|/ ,-. . , ,-. ,-. ,-. ,-.
  /| |  |-'  X  ,-| | | | | | |
  `' `' `-' ' ` `-^ `-| `-' ' '
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~,| ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
                     `'
 A hexagon in a 2D plane.
 Hexagons are immutable objects.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

/**
| Constructor.
|
| Hexagon(p, r)
| pc: center
| r: radius
*/
var Hexagon = function(pc, r) {
	if (typeof(pc) !== 'object' || !(pc instanceof Point)) throw new Error('invalid pc');
	fixate(this, 'pc', pc);
	fixate(this, 'r', r);
	Object.freeze(this);
};


/**
| Creates a hexgon from json.
*/
Hexagon.jnew = function(js) {
	return new Hexagon(js.pc, js.r);
};

/**
| Returns a json object for this hexagon.
*/
Hexagon.prototype.toJSON = function() {
	return this._json || (this._json = { pc: this.pc, r: this.r });
};

/**
| Returns a hexagon moved by a point or x/y.
*/
Hexagon.prototype.add = function(a1, a2) {
	return new Hexagon(this.pc.add(a1, a2), this.r);
};

/**
| Returns true if point is within this hexagon.
*/
Hexagon.prototype.within = function(p) {
	var rc = this.r * cos30;
	var dy = this.p.y - p.y;
	var dx = this.p.x - p.x;
	var yhc6 = Math.abs(dy * cos30);
	return dy >= -rc && dy <= rc &&
           dx - this.r < -yhc6 &&
           dx + this.r >  yhc6;
};

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ,-_/,.                         .---. .
 ' |_|/ ,-. . , ,-. ,-. ,-. ,-. \___  |  . ,-. ,-.
  /| |  |-'  X  ,-| | | | | | |     \ |  | |   |-'
  `' `' `-' ' ` `-^ `-| `-' ' ' `---' `' ' `-' `-'
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~,| ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
                     `'
 The top slice of a hexagon.

       ------------        ^
      /............\       |  height
     /..............\      |
 psw*................\     v
   /                  \
  *<-------->*         *
   \   rad   pm       /
    \                /
     \              /
      \            /
       *----------*

 height must be <= rad

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
/**
| Constructor.
|
| psw: Point to south west.
| rad: radius.
| height: slice height.
*/
var HexagonSlice = function(psw, rad, height) {
	fixate(this, 'psw', psw);
	fixate(this, 'rad', rad);
	fixate(this, 'height', height);

	if (height > rad) throw new Error('Cannot make slice larger than radius');
};

/**
| Middle(center) point of Hexagon.
*/
lazyFixate(HexagonSlice.prototype, 'pm', function() {
	return new Point(
		this.psw.x + this.rad - Math.round((this.rad * cos30 - this.height) * tan30),
		this.psw.y + Math.round(this.rad * cos30) - this.height);
});

/**
| pnw (used by gradients)
*/
lazyFixate(HexagonSlice.prototype, 'pnw', function() {
	return new Point(this.psw.x, this.psw.y - this.height);
});

/**
| pnw (used by gradients)
*/
lazyFixate(HexagonSlice.prototype, 'width', function() {
	return 2 * Math.round(this.rad - (this.rad * cos30 - this.height) * tan30);
});

/**
| pse (used by gradients)
*/
lazyFixate(HexagonSlice.prototype, 'pse', function() {
	return new Point(this.psw.x + this.width, this.psw.y);
});

/**
| Draws the hexagon.
*/
HexagonSlice.prototype.path = function(fabric, border, twist) {
	var r05 = half(this.rad);
	fabric.beginPath(twist);
	fabric.moveTo(this.psw.x                 + border, this.psw.y               - border);
	fabric.lineTo(this.pm.x - r05            + border, this.psw.y - this.height + border);
	fabric.lineTo(this.pm.x + r05            - border, this.psw.y - this.height + border);
	fabric.lineTo(2 * this.pm.x - this.psw.x - border, this.psw.y               - border);
};

/**
| Returns true if point is within the slice.
*/
HexagonSlice.prototype.within = function(p) {
	var dy = p.y - this.psw.y;
	var dx = p.x - this.psw.x;
	var hy = dy * tan30;
	return dy >= -this.height && dy <= 0 && dx >= -hy && dx - this.width <= hy;
};

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ,-_/,.                        .-,--' .
 ' |_|/ ,-. . , ,-. ,-. ,-. ,-. \|__  |  ,-. . , , ,-. ,-.
  /| |  |-'  X  ,-| | | | | | |  |    |  | | |/|/  |-' |
  `' `' `-' ' ` `-^ `-| `-' ' ' `'    `' `-' ' '   `-' '
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~,| ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
                     `'
 Makes a double hexagon with 6 segments.
 It kinda looks like a flower.

                 pc.x
                  |--------->| ro
                  |--->| ri  '
                  '    '     '
            *-----'----'*    '     -1
           / \    n    ' \   '
          /   \   '   /'  \  '
         / nw  *-----* 'ne \ '
        /   ' /   '   \'    \
 pc.y  *-----*    +    *-----*
        \     \    p  /     /
         \ sw  *-----*  se /
          \   /       \   /
           \ /    s    \ /
            *-----------*

 pc:   center
 ri:   inner radius
 ro:   outer radius
 segs: which segments to include

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
var HexagonFlower = function(pc, ri, ro, segs) {
	if (ri > ro) throw new Error('inner radius > outer radius');
	fixate(this, 'pc', pc);
	fixate(this, 'ri', ri);
	fixate(this, 'ro', ro);
	fixate(this, 'gradientPC', pc);
	fixate(this, 'gradientR1', ro);
	fixate(this, 'segs', segs);
};

/**
| Makes the flower-hex-6 path.
*/
HexagonFlower.prototype.path = function(fabric, border, twist, segment) {
	var ri  = this.ri;
	var ri2 = half(this.ri);
	var ric = Math.round(this.ri * cos30);
	var ro  = this.ro;
	var ro2 = half(this.ro);
	var roc = Math.round(this.ro * cos30);
	var pc  = this.pc;
	var pcx = pc.x, pcy = pc.y;
	var b   = border;
	var b2  = half(border);
	var bc6 = Math.round(border * cos30);
	var segs = this.segs;
	fabric.beginPath(twist);
	/* inner hex */
	if (segment === 'innerHex' || segment === 'structure') {
		fabric.moveTo(pcx - ri  - b,  pcy);
		fabric.lineTo(pcx - ri2 - b2, pcy - ric - bc6);
		fabric.lineTo(pcx + ri2 + b2, pcy - ric - bc6);
		fabric.lineTo(pcx + ri  + b,  pcy);
		fabric.lineTo(pcx + ri2 + b2, pcy + ric + bc6);
		fabric.lineTo(pcx - ri2 - b2, pcy + ric + bc6);
		fabric.lineTo(pcx - ri  - b,  pcy);
	}

	/* outer hex */
	if (segment === 'outerHex' || segment === 'structure') {
		fabric.moveTo(pcx - ro  + b,  pcy);
		fabric.lineTo(pcx - ro2 + b2, pcy - roc + bc6);
		fabric.lineTo(pcx + ro2 - b2, pcy - roc + bc6);
		fabric.lineTo(pcx + ro  - b,  pcy);
		fabric.lineTo(pcx + ro2 - b2, pcy + roc - bc6);
		fabric.lineTo(pcx - ro2 + b2, pcy + roc - bc6);
		fabric.lineTo(pcx - ro  + b,  pcy);
	}

	switch (segment) {
	case 'structure' :
		if (segs.n || segs.nw) {
			fabric.moveTo(pcx - ri2,  pcy - ric);
			fabric.lineTo(pcx - ro2,  pcy - roc);
		}
		if (segs.n  || segs.ne) {
			fabric.moveTo(pcx + ri2, pcy - ric);
			fabric.lineTo(pcx + ro2, pcy - roc);
		}
		if (segs.ne || segs.se) {
			fabric.moveTo(pcx + ri,  pcy);
			fabric.lineTo(pcx + ro,  pcy);
		}
		if (segs.se || segs.s) {
			fabric.moveTo(pcx + ri2, pcy + ric + bc6);
			fabric.lineTo(pcx + ro2, pcy + roc - bc6);
		}
		if (segs.s || segs.sw) {
			fabric.moveTo(pcx - ri2, pcy + ric + bc6);
			fabric.lineTo(pcx - ro2, pcy + roc - bc6);
		}
		if (segs.sw || segs.nw) {
			fabric.moveTo(pcx - ri, pcy);
			fabric.lineTo(pcx - ro, pcy);
		}
		break;
	case 'n':
		fabric.moveTo(pcx - ro2 + b2, pcy - roc + bc6);
		fabric.lineTo(pcx + ro2 - b2, pcy - roc + bc6);
		fabric.lineTo(pcx + ri2 + b2, pcy - ric - bc6);
		fabric.lineTo(pcx - ri2 - b2, pcy - ric - bc6);
		fabric.lineTo(pcx - ro2 + b2, pcy - roc + bc6);
		break;
	case 'ne':
		fabric.moveTo(pcx + ro2 - b2, pcy - roc + bc6);
		fabric.lineTo(pcx + ro  - b,  pcy);
		fabric.lineTo(pcx + ri  + b,  pcy);
		fabric.lineTo(pcx + ri2 + b2, pcy - ric - bc6);
		fabric.lineTo(pcx + ro2 - b2, pcy - roc + bc6);
		break;
	case 'se':
		fabric.moveTo(pcx + ro  - b,  pcy);
		fabric.lineTo(pcx + ro2 - b2, pcy + roc - bc6);
		fabric.lineTo(pcx + ri2 + b2, pcy + ric + bc6);
		fabric.lineTo(pcx + ri  + b,  pcy);
		fabric.lineTo(pcx + ro  - b,  pcy);
		break;
	case 's':
		fabric.moveTo(pcx + ro2 - b2, pcy + roc - bc6);
		fabric.lineTo(pcx - ro2 + b2, pcy + roc - bc6);
		fabric.lineTo(pcx - ri2 - b2, pcy + ric + bc6);
		fabric.lineTo(pcx + ri2 + b2, pcy + ric + bc6);
		fabric.lineTo(pcx + ro2 - b2, pcy + roc - bc6);
		break;
	case 'sw':
		fabric.moveTo(pcx - ro2 + b2, pcy + roc - bc6);
		fabric.lineTo(pcx - ro  + b,  pcy);
		fabric.lineTo(pcx - ri  - b,  pcy);
		fabric.lineTo(pcx - ri2 - b2, pcy + ric + bc6);
		fabric.lineTo(pcx - ro2 + b2, pcy + roc - bc6);
		break;
	case 'nw':
		fabric.moveTo(pcx - ro  + b,  pcy);
		fabric.lineTo(pcx - ro2 + b2, pcy - roc + bc6);
		fabric.lineTo(pcx - ri2 - b2, pcy - ric - bc6);
		fabric.lineTo(pcx - ri  - b,  pcy);
		fabric.lineTo(pcx - ro  + b,  pcy);
		break;
	}
};

/**
| Returns the segment the point is within.
*/
HexagonFlower.prototype.within = function(p) {
	var roc6 = this.ro * cos30;
	var dy = p.y - this.pc.y;
	var dx = p.x - this.pc.x;
	var dyc6 = Math.abs(dy * tan30);

	if (dy <  -roc6 || dy >  roc6 || dx - this.ro >= -dyc6 || dx + this.ro <= dyc6) {
		return null;
	}

	var ric6 = this.ri * cos30;
	if (dy >= -ric6 && dy <= ric6 && dx - this.ri <  -dyc6 && dx + this.ri >  dyc6) {
		return 'center';
	}

	var lor = dx <= -dy * tan30; // left of right diagonal
	var rol = dx >=  dy * tan30; // right of left diagonal
	var aom = dy <= 0;           // above of middle line
	if (lor && rol)        return 'n';
	else if (!lor && aom)  return 'ne';
	else if (rol && !aom)  return 'se';
	else if (!rol && !lor) return 's';
	else if (lor && !aom)  return 'sw';
	else if (!rol && aom)  return 'nw';
	else return 'center';
};

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  ,
  )   * ,-. ,-.
 /    | | | |-'
 `--' ' ' ' `-'
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

 A line. Possibly with arrow-heads as ends.
 Lines are pseudo-immutable objects.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

/**
| Constructor.
|
| p1: point 1
| p1end: 'normal' or 'arrow'
| p2: point 1
| p2end: 'normal' or 'arrow'
*/
var Line = function(p1, p1end, p2, p2end) {
	fixate(this, 'p1', p1);
	fixate(this, 'p1end', p1end);
	fixate(this, 'p2', p2);
	fixate(this, 'p2end', p2end);
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

	if (shape1 instanceof Rect && shape2 instanceof Point) {
		var p2 = shape2;
		z1 = shape1;
		var p1;
		if (z1.within(p2)) {
			p1 = z1.pc;
		} else {
			p1 = new Point(
				max(z1.pnw.x, min(p2.x, z1.pse.x)),  // @@ make limit() call
				max(z1.pnw.y, min(p2.y, z1.pse.y)));
		}
		return new Line(p1, end1, p2, end2);
	}
	if (shape1 instanceof Rect && shape2 instanceof Rect) {
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
			x1 = x2 = half(max(z1.pnw.x, z2.pnw.x) + min(z1.pse.x, z2.pse.x));
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
			y1 = y2 = half(max(z1.pnw.y, z2.pnw.y) + min(z1.pse.y, z2.pse.y));
		}
		return new Line(new Point(x1, y1), end1, new Point(x2, y2), end2);
	}
	throw new Error('do not know how to create connection.');
};

/**
| Returns the zone of the arrow.
*/
lazyFixate(Line.prototype, 'zone', function() {
	var p1 = this.p1;
	var p2 = this.p2;
	return new Rect(
		Point.renew(min(p1.x, p2.x), min(p1.y, p2.y), p1, p2),
		Point.renew(max(p1.x, p2.x), max(p1.y, p2.y), p1, p2));
});


/**
| Returns the point at center.
*/
lazyFixate(Line.prototype, 'pc', function() {
	var p1 = this.p1;
	var p2 = this.p2;
	return new Point(half(p1.x + p2.x), half(p1.y + p2.y));
});

/**
| Draws the path of the line.
|
| fabric: Fabric to draw upon.
| border: pixel offset for fancy borders (unused)
| twist:  0.5 if drawing lines
*/
Line.prototype.path = function(fabric, border, twist) {
	var p1 = this.p1;
	var p2 = this.p2;

	fabric.beginPath(twist);
	// TODO, multiple line end types
	switch(this.p1end) {
	case 'normal':
		if (twist) fabric.moveTo(p1);
		break;
	default :
		throw new Error('unknown line end');
	}

	switch(this.p2end) {
	case 'normal' :
		if (twist) fabric.lineTo(p2);
		break;
	case 'arrow' :
		// arrow size
		var as = 12;
		// degree of arrow tail
		var d = Math.atan2(p2.y - p1.y, p2.x - p1.x);
		// degree of arrow head
		var ad = Math.PI/12;
		// arrow span, the arrow is formed as hexagon piece
		var ms = 2 / Math.sqrt(3) * as;
		if (twist) {
			fabric.lineTo(p2.x - R(ms * cos(d)), p2.y - R(ms * sin(d)));
		} else {
			fabric.moveTo(p2.x - R(ms * cos(d)), p2.y - R(ms * sin(d)));
		}
		fabric.lineTo(p2.x - R(as * cos(d - ad)), p2.y - R(as * sin(d - ad)));
		fabric.lineTo(p2);
		fabric.lineTo(p2.x - R(as * cos(d + ad)), p2.y - R(as * sin(d + ad)));
		fabric.lineTo(p2.x - R(ms * cos(d)), p2.y - R(ms * sin(d)));
		break;
	default :
		throw new Error('unknown line end');
	}

};

/**
| Draws the line.
*/
Line.prototype.draw = function(fabric, style) {
	if (!style) throw new Error('Line.draw misses style');
	fabric.paint(style, this, 'path');
};

/**
| Returns true if p is near the line spawned by p1 and p2.
*/
/*
Line.prototype.isNear = function(p, dis) {
	var dx = p.x - p1.x;
	var dy = p.y - p1.y;
	if (Math.abs(dx) < 8 && Math.abs(dy) < 8) {
		return true;
	}
	if (Math.abs(dx) < dis) {
		return Math.abs(dx - (p2.x - p1.x) / (p2.y - p1.y) * dy) < dis;
	} else {
		return Math.abs(dy - (p2.y - p1.y) / (p2.x - p1.x) * dx) < dis;
	}
}
*/

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 Module Export
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

Fabric.Hexagon       = Hexagon;
Fabric.HexagonFlower = HexagonFlower;
Fabric.HexagonSlice  = HexagonSlice;
Fabric.Line          = Line;
Fabric.Margin        = Margin;
Fabric.Measure       = Measure;
Fabric.Point         = Point;
Fabric.Rect          = Rect;
Fabric.RoundRect     = RoundRect;

Fabric.cos30         = cos30;
Fabric.ensureInteger = ensureInteger;
Fabric.half          = half;
Fabric.opposite      = opposite;
Fabric.tan30         = tan30;

if (typeof(window) === 'undefined') {
	module.exports = Fabric;
}

})();
