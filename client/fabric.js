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
var Fabric  = null;
var Measure = null;

/**
| Capsule
*/
(function(){
'use strict';
if (typeof(window) === 'undefined') { throw new Error('fabric needs a browser'); }

var debug        = Jools.debug;
var immute       = Jools.immute;
var innumerable  = Jools.innumerable;
var is           = Jools.is;
var isnon        = Jools.isnon;
var log          = Jools.log;
var fixate       = Jools.fixate;
var lazyFixate   = Jools.lazyFixate;
var reject       = Jools.reject;
var subclass     = Jools.subclass;
var min          = Math.min;
var max          = Math.max;
var ovalDebug    = false;

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
	// @@ this is strange, replace with switch(a1.constructor)
	switch (typeof(a1)) {
	case 'undefined' :
		this._canvas = document.createElement('canvas');
		break;
	case 'object' :
		switch(a1.constructor) {
		case Fabric:
			this._canvas = a1._canvas;
			break;
		case Rect :
			this._canvas = document.createElement('canvas');
			this._canvas.width  = a1.width;
			this._canvas.height = a1.height;
			break;
		default :
			if (!a1.getContext) throw new Error('Invalid parameter to new Farbic: ' + a1);
			this._canvas = a1;
			break;
		}
		break;
	default :
		this._canvas = document.createElement('canvas');
		this._canvas.width  = a1;
		this._canvas.height = a2;
	}
	this._cx = this._canvas.getContext('2d');
	this.pan = Point.zero;

	// curren positiont (without twist)
	this._posx = this._posy = null;
};

/**
| Shortcuts
*/
var R     = Math.round;
var PI    = Math.PI;
var cos   = Math.cos;
var sin   = Math.sin;
var tan   = Math.tan;
var cos30 = cos(PI / 6);   // cos(30)
var tan30 = tan(PI / 6);   // tan(30)
var magic = 0.551784;      // 'magic' number to approximate ellipses with beziers.

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
	this._posx = x;
	this._posy = y;
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
	this._posx = x;
	this._posy = y;
	this._cx.lineTo(x + pan.x + tw, y + pan.y + tw);
};

/**
| Draws a bezier.
|
| bezier(cp1,  cp2,  p)   -or-
| bezier(cp1x, cp1y, cp2x, cp2y, x, y) -or-
| any combination of points and arguments.
*/
Fabric.prototype.beziTo = function() {
	var a   = 0, aZ = arguments.length;
	var pan = this.pan;
	var tw  = this._twist;
	var px  = this.pan.x + tw;
	var py  = this.pan.y + tw;

	var cp1x, cp1y, cp2x, cp2y, x, y;

	if (this._posx === null || this._posy === null) {
		throw new Error('beziTo: pFail');
	}

	if (a >= aZ) throw new Error('beziTo: aFail');
	if (typeof(arguments[a]) === 'object') {
		cp1x = arguments[a].x;
		cp1y = arguments[a++].y;
	} else {
		cp1x = arguments[a++];
		if (a >= aZ) throw new Error('beziTo: aFail');
		cp1y = arguments[a++];
	}

	if (a >= aZ) throw new Error('beziTo: aFail');
	if (typeof(arguments[a]) === 'object') {
		cp2x = arguments[a].x;
		cp2y = arguments[a++].y;
	} else {
		cp2x = arguments[a++];
		if (a >= aZ) throw new Error('beziTo: aFail');
		cp2y = arguments[a++];
	}

	if (a >= aZ) throw new Error('beziTo: aFail');
	if (typeof(arguments[a]) === 'object') {
		x = arguments[a].x;
		y = arguments[a++].y;
	} else {
		x = arguments[a++];
		if (a >= aZ) throw new Error('beziTo: aFail');
		y = arguments[a++];
	}

	cp1x += this._posx + px;
	cp1y += this._posy + py;
	cp2x += x + px;
	cp2y += y + py;
	this._posx = x;
	this._posy = y;
	x += px;
	y += py;

	this._cx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y);
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
	this._posx = this.posy = null;
};

/**
| Closes a path.
*/
Fabric.prototype.closePath = function() {
	this._cx.closePath();
	this._posx = this.posy = null;
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

	if (isnon(style.fill)) {
		cx.fillStyle = this._colorStyle(fillStyle, shape);
		cx.fill();
	}

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
	var pan = this.pan;
	if (typeof(a1) === 'object') {
		return this._cx.fillText(text, a1.x + pan.x, a1.y + pan.y);
	}
	return this._cx.fillText(text, a1 + pan.x, a2 + pan.y);
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

/**
| TODO
*/
Fabric.prototype.within = function(shape, path, a1, a2, a3, a4, a5) {
	var px, py;
	var pan = this.pan, tw = this._twist;
	var pobj;
	if (typeof(a1) === 'object') {
		px   = a1.x;
		py   = a1.y;
		pobj = true;
	} else {
		px   = a1;
		py   = a2;
		pobj = false;
	}

	px += pan.x + tw;
	py += pan.y + tw;

	if (pobj) {
		shape[path](this, 0, true, a2, a3, a4);
	} else {
		shape[path](this, 0, true, a3, a4, a5);
	}

	return this._cx.isPointInPath(px, py);
};

/**
| Sets the global alpha
*/
Fabric.prototype.globalAlpha = function(a) {
	this._cx.globalAlpha = a;
};

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ,-,-,-.
 `,| | |   ,-. ,-. ,-. . . ,-. ,-.
   | ; | . |-' ,-| `-. | | |   |-'
   '   `-' `-' `-^ `-' `-^ '   `-'
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
 
 TODO seperate file.
  
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
Measure = {
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
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

var Point = Euclid.Point;

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
	Euclid.Rect.call(this, pnw, pse, key);
};
subclass(Rect, Euclid.Rect);

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
		this.n = m.n;
		this.e = m.e;
		this.s = m.s;
		this.w = m.w;
	} else {
		this.n = m;
		this.e = e;
		this.s = s;
		this.w = w;
	}
	immute(this);
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
 +++ BeziRect +++
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

 A rectangle with rounded (beziers) corners
 BeziRects are immutable objects.

      <-> a
      | |
 pnw  +.------------------.  - - A
      .                    . _ _ V b
      |                    |
      |                    |
      |                    |
      '                    '
       `------------------'+ pse

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

/**
| Constructor.
|
| BeziRect(rect, a, b)      -or-
| BeziRect(pnw, pse, a, b)
*/
var BeziRect = function(a1, a2, a3, a4) {
	if (a1.constructor === Point) {
		Rect.call(this, a1, a2);
		this.a = a3;
		this.b = a4;
	} else {
		Rect.call(this, a1.pnw, a1.pse);
		this.a = a2;
		this.b = a3;
	}
};
subclass(BeziRect, Rect);

/**
| Draws the roundrect.
|
| fabric : fabric to draw the path upon.
| border : additional distance.
| twist  : parameter to beginPath, add +0.5 on everything for lines
*/
BeziRect.prototype.path = function(fabric, border, twist) {
	var nwx = this.pnw.x + border;
	var nwy = this.pnw.y + border;
	var sex = this.pse.x - border - 1;
	var sey = this.pse.y - border - 1;
	var a = this.a;
	var b = this.b;
	var ma = magic * (a + border);
	var mb = magic * (b + border) ;

	fabric.beginPath(twist);
	fabric.moveTo(                     nwx + a, nwy    );
	fabric.lineTo(                     sex - a, nwy    );
	fabric.beziTo(  ma,   0,   0, -mb, sex    , nwy + b);
	fabric.lineTo(                     sex    , sey - b);
	fabric.beziTo(   0,  mb,  ma,   0, sex - a, sey    );
	fabric.lineTo(                     nwx + a, sey    );
	fabric.beziTo( -ma,   0,   0,  mb, nwx    , sey - b);
	fabric.lineTo(                     nwx    , nwy + b);
	fabric.beziTo(   0, -mb, -ma,   0, nwx + a, nwy    );

/*
	var tbx = to.x + bx;
	var tby = to.y + by;
	fabric.beziTo(
		ct.c1x + (tbx && tbx + lbx ? (tbx / (tbx + lbx)) : 0),
		ct.c1y + (tby && tby + lby ? (tby / (tby + lby)) : 0),

		ct.c2x + (tbx && tbx +  bx ? (tbx / (tbx + bx)) : 0),
		ct.c2y + (tby && tby +  by ? (tby / (tby + by)) : 0),

		tbx         , tby
	);
	*/
};

/*
BeziRect.prototype.within = function(fabric, p) {
	return();
}*/


/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 .-,--.               . .-,--.         .
  `|__/ ,-. . . ,-. ,-|  `|__/ ,-. ,-. |-
  )| \  | | | | | | | |  )| \  |-' |   |
  `'  ` `-' `-^ ' ' `-^  `'  ` `-' `-' `'
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

 A rectangle with round (circle) corners
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
 ,,--.          .  .---. .
 |`, | .  , ,-. |  \___  |  . ,-. ,-.
 |   | | /  ,-| |      \ |  | |   |-'
 `---' `'   `-^ `' `---' `' ' `-' `-'
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

 A vertical slice of the top half of an oval.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
/**
| Constructor.
|
| psw: Point to south west.
| rad: radius.
| height: slice height.
*/
var OvalSlice = function(psw, dimensions) {
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
| Middle(center) point of Hexagon.
*/
lazyFixate(OvalSlice.prototype, 'pm', function() {
	return this.psw.add(R(-this.slice.x4), R(this.b - this.slice.y4));
});

/**
| pnw (used by gradients)
*/
lazyFixate(OvalSlice.prototype, 'pnw', function() {
	return this.psw.add(0, R(-this.slice.y4));
});

/**
| pnw (used by gradients)
*/
lazyFixate(OvalSlice.prototype, 'width', function() {
	return R(-2 * this.slice.x4);
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
OvalSlice.prototype.path = function(fabric, border, twist) {
	var a   = this.a;
	var b   = this.b;
	var am  = magic * this.a;
	var bm  = magic * this.b;
	var bo  = border;
	var psw = this.psw;

	fabric.beginPath(twist);

	var slice  = this.slice;

	fabric.moveTo(R(psw.x), R(psw.y));
	fabric.beziTo(
		slice.x3, slice.y3,
		slice.x2, slice.y2,
		psw.x - slice.x4, psw.y - slice.y4);
	fabric.beziTo(
		-slice.x2, slice.y2,
		-slice.x3, slice.y3,
		psw.x - 2 * slice.x4,  psw.y);
};

/**
| Returns true if point is within the slice.
*/
OvalSlice.prototype.within = function(fabric, p) {
	return fabric.within(this, 'path', p);
};

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ,,--.          . .-,--' .
 |`, | .  , ,-. |  \|__  |  ,-. . , , ,-. ,-.
 |   | | /  ,-| |   |    |  | | |/|/  |-' |
 `---' `'   `-^ `' `'    `' `-' ' '   `-' '
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~,~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

 Makes a double oval with 6 segments.


      a1      |----->|
      a2      |->|   '
              '  '   '           b2
          ..-----.. .' . . . . . A
        ,' \  n  / ','       b1  |
       , nw .---. ne , . . . A   |
 pc>   |---(  +  )---| . . . v . v
       ' sw `---' se '
        `. /  s  \ .'
          ``-----''             outside = null

 pc:     center
 a1,b1:  width and height of inner oval
 a2,b2:  width and height of outer oval
 segs: which segments to include

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
var OvalFlower = function(pc, dimensions, segs) {
	this.pc = pc;
	this.a1 = dimensions.a1;
	this.a2 = dimensions.a2;
	this.b1 = dimensions.b1;
	this.b2 = dimensions.b2;

	this.gradientPC = pc;
	this.gradientR0 = 0;
	this.gradientR1 = max(this.a2, this.b2);
	this.segs = segs;
	immute(this);
};

/**
| Makes the OvalFlower path.
*/
OvalFlower.prototype.path = function(fabric, border, twist, segment) {
	var pc   = this.pc;
	var pcx  = pc.x;
	var pcy  = pc.y;
	var segs = this.segs;
	var a1   = this.a1;
	var b1   = this.b1;
	var a2   = this.a2;
	var b2   = this.b2;
	var bo   = border;

	var m    = magic;
	var am1  = m * this.a1;
	var bm1  = m * this.b1;
	var am2  = m * this.a2;
	var bm2  = m * this.b2;

	fabric.beginPath(twist);
	// inner oval
	if (segment === null || segment === 'c') {
		fabric.moveTo(                       pcx - a1 + bo, pcy);
		fabric.beziTo(  0, -bm1, -am1,    0, pcx,           pcy - b1 + bo);
		fabric.beziTo( am1,   0,    0, -bm1, pcx + a1 - bo, pcy);
		// @@ workaround chrome pixel error
		fabric.lineTo(                       pcx + a1 - bo, pcy - 1);
		fabric.beziTo(  0,  bm1,  am1,    0, pcx,           pcy + b1 - bo);
		fabric.beziTo(-am1,   0,    0,  bm1, pcx - a1 + bo, pcy);
	}

	// outer oval
	if (segment === null || segment === 'outer') {
		fabric.moveTo(                       pcx - a2 + bo, pcy);
		fabric.beziTo(  0, -bm2, -am2,    0, pcx,           pcy - b2 + bo);
		fabric.beziTo( am2,   0,    0, -bm2, pcx + a2 - bo, pcy);
		// @@ workaround chrome pixel error
		fabric.lineTo(                       pcx + a2 - bo, pcy - 1);
		fabric.beziTo(  0,  bm2,  am2,    0, pcx,           pcy + b2 - bo);
		fabric.beziTo(-am2,   0,    0,  bm2, pcx - a2 + bo, pcy);
	}

	var bs  = half(b2 - b1 - 0.5);
	var bss = half(b2 - b1) - 2;
	var bms =   R((b2 - b1) / 2 * m);
	var odbg = segment === null && ovalDebug;

	if (segment === 'n' || odbg) {
		var pny = pcy - b1 - bs;
		fabric.moveTo(                       pcx - a1 + bo, pny);
		fabric.beziTo(  0, -bms, -am1,    0, pcx,           pny - bss + bo);
		fabric.beziTo( am1,   0,    0, -bms, pcx + a1 - bo, pny);
		fabric.beziTo(  0,  bms,  am1,    0, pcx,           pny + bss - bo);
		fabric.beziTo(-am1,   0,    0,  bms, pcx - a1 + bo, pny);
	}
	if (segment === 'ne' || odbg) {
		var pney = pcy - bs;
		var pnex = pcx + R(a2 * m);
		fabric.moveTo(                       pnex - a1 + bo, pney);
		fabric.beziTo(  0, -bms, -am1,    0, pnex,           pney - bss + bo);
		fabric.beziTo( am1,   0,    0, -bms, pnex + a1 - bo, pney);
		fabric.beziTo(  0,  bms,  am1,    0, pnex,           pney + bss - bo);
		fabric.beziTo(-am1,   0,    0,  bms, pnex - a1 + bo, pney);
	}
	if (segment === 'se' || odbg) {
		var psey = pcy + bs;
		var psex = pcx + R(a2 * m);
		fabric.moveTo(                       psex - a1 + bo, psey);
		fabric.beziTo(  0, -bms, -am1,    0, psex,           psey - bss + bo);
		fabric.beziTo( am1,   0,    0, -bms, psex + a1 - bo, psey);
		fabric.beziTo(  0,  bms,  am1,    0, psex,           psey + bss - bo);
		fabric.beziTo(-am1,   0,    0,  bms, psex - a1 + bo, psey);
	}
	if (segment === 's' || odbg) {
		var psy = pcy + b1 + bs;
		fabric.moveTo(                       pcx - a1 + bo, psy);
		fabric.beziTo(  0, -bms, -am1,    0, pcx,           psy - bss + bo);
		fabric.beziTo( am1,   0,    0, -bms, pcx + a1 - bo, psy);
		fabric.beziTo(  0,  bms,  am1,    0, pcx,           psy + bss - bo);
		fabric.beziTo(-am1,   0,    0,  bms, pcx - a1 + bo, psy);
	}
	if (segment === 'sw' || odbg) {
		var pswy = pcy + bs;
		var pswx = pcx - R(a2 * m);
		fabric.moveTo(                       pswx - a1 + bo, pswy);
		fabric.beziTo(  0, -bms, -am1,    0, pswx,           pswy - bss + bo);
		fabric.beziTo( am1,   0,    0, -bms, pswx + a1 - bo, pswy);
		fabric.beziTo(  0,  bms,  am1,    0, pswx,           pswy + bss - bo);
		fabric.beziTo(-am1,   0,    0,  bms, pswx - a1 + bo, pswy);
	}
	if (segment === 'nw' || odbg) {
		var pnwy = pcy - bs;
		var pnwx = pcx - R(a2 * m);
		fabric.moveTo(                       pnwx - a1 + bo, pnwy);
		fabric.beziTo(  0, -bms, -am1,    0, pnwx,           pnwy - bss + bo);
		fabric.beziTo( am1,   0,    0, -bms, pnwx + a1 - bo, pnwy);
		fabric.beziTo(  0,  bms,  am1,    0, pnwx,           pnwy + bss - bo);
		fabric.beziTo(-am1,   0,    0,  bms, pnwx - a1 + bo, pnwy);
	}
};

/**
| Returns the segment the point is within.
*/
OvalFlower.prototype.within = function(fabric, p) {
	// TODO quick null if out of box.
	if (!fabric.within(this, 'path', p, 'outer')) { return null; }
	if (isnon(this.segs.c ) && fabric.within(this, 'path', p, 'c' )) { return 'c';  }
	if (isnon(this.segs.n ) && fabric.within(this, 'path', p, 'n' )) { return 'n';  }
	if (isnon(this.segs.ne) && fabric.within(this, 'path', p, 'ne')) { return 'ne'; }
	if (isnon(this.segs.se) && fabric.within(this, 'path', p, 'se')) { return 'se'; }
	if (isnon(this.segs.e ) && fabric.within(this, 'path', p, 'e' )) { return 's';  }
	if (isnon(this.segs.sw) && fabric.within(this, 'path', p, 'sw')) { return 'sw'; }
	if (isnon(this.segs.nw) && fabric.within(this, 'path', p, 'nw')) { return 'nw'; }
	return 'gap';
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

Fabric.BeziRect      = BeziRect;
Fabric.Hexagon       = Hexagon;
Fabric.Line          = Line;
Fabric.Margin        = Margin;
Fabric.Measure       = Measure;
Fabric.OvalFlower    = OvalFlower;
Fabric.OvalSlice     = OvalSlice;
Fabric.Point         = Point;
Fabric.Rect          = Rect;
Fabric.RoundRect     = RoundRect;

Fabric.cos30         = cos30;
Fabric.ensureInteger = ensureInteger;
Fabric.half          = half;
Fabric.magic         = magic;
Fabric.opposite      = opposite;
Fabric.tan30         = tan30;

if (typeof(window) === 'undefined') {
	module.exports = Fabric;
}

})();
