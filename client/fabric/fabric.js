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
var Point;
var Rect;
var View;

/**
| Exports
*/
var Fabric  = null;

/**
| Capsule
*/
(function(){
'use strict';
if (typeof(window) === 'undefined') { throw new Error('this code needs a browser'); }

var debug        = Jools.debug;
var immute       = Jools.immute;
var is           = Jools.is;
var isnon        = Jools.isnon;
var log          = Jools.log;

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
	// TODO this is strange, replace with switch(a1.constructor)
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

	// curren positiont (without twist)
	this._posx = this._posy = null;
	this.$clip = false;
};

/**
| Shortcuts
*/
var ro    = Math.round;
var cos   = Math.cos;
var sin   = Math.sin;
var tan   = Math.tan;
var magic = 0.551784;      // 'magic' number to approximate ellipses with beziers.

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
| moveTo(point)       -or-
| moveTo(x, y)        -or-
|
| moveTo(point, view) -or-
| moveTo(x, y, view)
*/
Fabric.prototype.moveTo = function(a1, a2, a3) {
	var tw = this._twist, v, x, y;
	if (typeof(a1) === 'object') {
		x = a1.x;
		y = a1.y;
		v = a2;
	} else {
		x = a1;
		y = a2;
		v = a3;
	}
	ensureInteger(x, y);
	if (v) {
		var x1 = x;
		x = v.x(x,  y);
		y = v.y(x1, y);
	}
	this._posx = x;
	this._posy = y;
	x += tw;
	y += tw;

	this._cx.moveTo(x + tw, y + tw);
};

/**
| Draws a line.
|
| lineto(point)       -or-
| lineto(x, y)        -or-
|
| lineto(point, view) -or-
| lineto(x, y, view)
*/
Fabric.prototype.lineTo = function(a1, a2, a3) {
	var tw = this._twist, v, x, y;
	if (typeof(a1) === 'object') {
		x = a1.x;
		y = a1.y;
		v = a2;
	} else {
		x = a1;
		y = a2;
		v = a3;
	}
	ensureInteger(x, y);
	if (v) {
		var x1 = x;
		x = v.x(x,  y);
		y = v.y(x1, y);
	}
	this._posx = x;
	this._posy = y;
	this._cx.lineTo(x + tw, y + tw);
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
	var tw  = this._twist;

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

	cp1x += this._posx + tw;
	cp1y += this._posy + tw;
	cp2x += x + tw;
	cp2y += y + tw;
	this._posx = x;
	this._posy = y;
	x += tw;
	y += tw;

	this._cx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y);
};

/**
| Draws an arc.
|
| arc(p,    radius, startAngle, endAngle, anticlockwise)   -or-
| arc(x, y, radius, startAngle, endAngle, anticlockwise)   -or-
*/
Fabric.prototype.arc = function(a1, a2, a3, a4, a5, a6, a7) {
	var tw = this._twist, x, y, r, sa, ea, ac;
	if (typeof(a1) === 'object') {
		x = a1.x; y = a1.y; r = a2; sa = a3; ea = a4; ac = a5;
	} else {
		x = a1;   y = a2;   r = a3; sa = a4; ea = a5; ac = a6;
	}
	this._cx.arc(x + tw, y + tw, r, sa, ea, ac);
};

/**
| fillRect(style, rect)     -or-
| fillRect(style, pnw, pse) -or-
| fillRect(style, nwx, nwy, width, height)
*/
Fabric.prototype.fillRect = function(style, a1, a2, a3, a4) {
	var cx = this._cx;
	cx.fillStyle = style;
	
	if (typeof(p) === 'object') {
		if (a1 instanceof Rect)
			{ return this._cx.fillRect(a1.pnw.x, a1.pnw.y, a1.pse.x, a1.pse.y); }
		if (a1 instanceof Point)
			{ return this._cx.fillRect(a1.x, a1.y, a2.x, a2.y); }
		throw new Error('fillRect not a rectangle');
	}

	return this._cx.fillRect(a1, a2, a3, a4);
};

/**
| Begins a path.
*/
Fabric.prototype._begin = function(twist) {
	// lines are targed at .5 coords.
	this._twist = twist ? 0.5 : 0;
	this._cx.beginPath();
	this._posx = this.posy = null;
};

/**
| Draws an image.
|
| drawImage(image, pnw)   -or-
| drawImage(image, x, y)
*/
Fabric.prototype.drawImage = function(image, a1, a2, a3) {
	if (image instanceof Fabric) {
		if (!(image.width > 0 && image.height > 0)) return;
		image = image._canvas;
	}
	var x, y, c;
	if (typeof(a1) === 'object') {
		x = a1.x;
		y = a1.y;
		c = a2;
	} else {
		x = a1;
		y = a2;
		c = a3;
	}
	ensureInteger(x, y);
	if (is(c)) { this._cx.globalCompositeOperation = c; }
	this._cx.drawImage(image, x, y);
	if (is(c)) { this._cx.globalCompositeOperation = 'source-over'; }
};


/**
| putImageData(imagedata, p) -or-
| putImageData(imagedata, x, y)
*/
Fabric.prototype.putImageData = function(imagedata, a1, a2) {
	var x, y;
	if (typeof(a1) === 'object') {
		x = a1.x; y = a1.y;
	} else {
		x = a1;   y = a2;
	}
	ensureInteger(x, y);
	this._cx.putImageData(imagedata, x, y);
};

/**
| getImageData(rect)     -or-
| getImageData(pnw, pse) -or-
| getImageData(x1, y1, x2, y2)
*/
Fabric.prototype.getImageData = function(a1, a2, a3, a4) {
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
			shape.pnw.x, shape.pnw.y,
			shape.pnw.x + shape.width / 10, shape.pse.y);
		break;
	case 'horizontal' :
		// TODO use gradientPNW
		if (!shape.pnw || !shape.pse) throw new Error(style.gradient+' gradient misses pnw/pse');
		grad = this._cx.createLinearGradient(
			0, shape.pnw.y,
			0, shape.pse.y);
		break;
	case 'radial' :
		if (!shape.gradientPC || !shape.gradientR1)
			throw new Error(style.gradient+' gradient misses gradient[PC|R0|R1]');
		var ro = shape.gradientR0 || 0;
		grad = this._cx.createRadialGradient(
			shape.gradientPC.x, shape.gradientPC.y, ro,
			shape.gradientPC.x, shape.gradientPC.y, shape.gradientR1);
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
Fabric.prototype.fill = function(style, shape, path, view, a1, a2, a3, a4) {
	if (!(view instanceof View)) { throw new Error('view is no View'); }

	var cx = this._cx;
	this._begin(false);
	shape[path](this, 0, false, view, a1, a2, a3, a4);
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
Fabric.prototype._edge = function(style, shape, path, view, a1, a2, a3, a4) {
	var cx = this._cx;
	this._begin(true);
	shape[path](this, style.border, true, view, a1, a2, a3, a4);
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
Fabric.prototype.edge = function(style, shape, path, view, a1, a2, a3, a4) {
	if (!(view instanceof View)) { throw new Error('view is no View'); }

	var cx = this._cx;
	if (style instanceof Array) {
		for(var i = 0; i < style.length; i++) {
			this._edge(style[i], shape, path, view, a1, a2, a3, a4);
		}
	} else {
		this._edge(style, shape, path, view, a1, a2, a3, a4);
	}
};


/**
| Fills an aera and draws its borders
*/
Fabric.prototype.paint = function(style, shape, path, view, a1, a2, a3, a4) {
	if (!(view instanceof View)) { throw new Error('view is no View'); }
	var fillStyle = style.fill;
	var edgeStyle = style.edge;
	var cx = this._cx;
	this._begin(false);
	shape[path](this, 0, false, view, a1, a2, a3, a4);

	if (isnon(style.fill)) {
		cx.fillStyle = this._colorStyle(fillStyle, shape);
		cx.fill();
	}

	if (edgeStyle instanceof Array) {
		for(var i = 0; i < edgeStyle.length; i++) {
			this._edge(edgeStyle[i], shape, path, view, a1, a2, a3, a4);
		}
	} else {
		this._edge(edgeStyle, shape, path, view, a1, a2, a3, a4);
	}
};

/**
| Clips the fabric so that the shape is left out.
*/
Fabric.prototype.reverseClip = function(shape, path, view, border, a1, a2, a3, a4) {
	var cx = this._cx;
	var c  = this._canvas;
	var w  = c.width;
	var h  = c.height;

	if (!this.$clip) {
		cx.save();
		this.$clip = true;
	}

	cx.beginPath();
	cx.moveTo(0, 0);
	cx.lineTo(0, h);
	cx.lineTo(w, h);
	cx.lineTo(w, 0);
	cx.lineTo(0, 0);

	shape[path](this, border, true, view, a1, a2, a3, a4);
	cx.clip();
};

Fabric.prototype.deClip = function() {
	if (!this.$clip) { throw new Error('not clipping!'); }
	this.$clip = false;
	this._cx.restore();
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
/*
Fabric.prototype.fillRotateText = function(text, pc, phi, d) {
	var cx = this._cx;
	var t1 = cos(phi);
	var t2 = sin(phi);
	var det = t1 * t1 + t2 * t2;
	var x = pc.x + d * t2;
	var y = pc.y - d * t1;
	if (t1 < 0) {
		// turn lower segments so text isn't upside down
		t1 = -t1;
		t2 = -t2;
	}
	cx.setTransform(t1, t2, -t2, t1, 0, 0);
	var x1 = (x * t1 + y * t2) / det;
	var y1 = (y * t1 - x * t2) / det;
	cx.fillText(text, x1, y1);
	cx.setTransform(1, 0, 0, 1, 0, 0);
};
*/


/**
| Sets the fontStyle, fillStyle, textAlign, textBaseline.
|
| fontStyle(font, fill)                      -or-
| fontStyle(font, fill, align, baseline)
*/
Fabric.prototype.setFont = function(size, font, fill, align, baseline) {
	var cx = this._cx;
	cx.font         = size + 'px ' + font;
	cx.fillStyle    = fill;
	cx.textAlign    = align;
	cx.textBaseline = baseline;
};

/**
| Returns true is a point is in a path.
| Point is either of type point -or-
|    x / y
*/
Fabric.prototype.within = function(shape, path, view, a1, a2, a3, a4, a5) {
	if (!(view instanceof View)) { throw new Error('view is no View'); }

	var px, py;
	var tw = this._twist;
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

	if (typeof(px) !== 'number' || typeof(py) !== 'number')
		{ throw new Error('px|py not a number ' + px + ' ' + py); }

	px += tw;
	py += tw;

	this._begin(true);
	if (pobj) {
		shape[path](this, 0, true, view, a2, a3, a4);
	} else {
		shape[path](this, 0, true, view, a3, a4, a5);
	}

	return this._cx.isPointInPath(px, py);
};

/**
| Sets the global alpha
*/
Fabric.prototype.globalAlpha = function(a) {
	this._cx.globalAlpha = a;
};

/**
| Sets the canvas scale
*/
Fabric.prototype.scale = function(s) {
	this._cx.scale(s, s);
};

Fabric.ensureInteger = ensureInteger;
Fabric.magic         = magic;

})();
