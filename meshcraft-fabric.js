/**    _..._
    .-'_..._''.                                                           .-''-.   _______
  .' .'      '.\             _..._ .----.     .----.                    .' .-.  )  \  ___ `'.
 / .'                      .'     '.\    \   /    /                    / .'  / /    ' |--.\  \
. '                       .   .-.   .'   '. /'   /                    (_/   / /     | |    \  '
| |                 __    |  '   '  ||    |'    /    __                    / /      | |     |  '
| |              .:--.'.  |  |   |  ||    ||    | .:--.'.         _       / /       | |     |  |
. '             / |   \ | |  |   |  |'.   `'   .'/ |   \ |      .' |     . '        | |     ' .'
 \ '.          .`" __ | | |  |   |  | \        / `" __ | |     .   | /  / /    _.-')| |___.' /'
  '. `._____.-'/ .'.''| | |  |   |  |  \      /   .'.''| |   .'.'| |//.' '  _.'.-''/_______.'/
    `-.______ / / /   | |_|  |   |  |   '----'   / /   | |_.'.'.-'  //  /.-'_.'    \_______|/
             `  \ \._,\ '/|  |   |  |            \ \._,\ '/.'   \_.'/    _.'
                 `--'  `" '--'   '--'             `--'  `"         ( _.*/
/**
| A graphic 2D-Object library for HTML Canvas 5
|
| This is not a full blown feature complete everything library,
| but enhanced on the fly for what meshcraft needs.
|
| Defines: fabric
|
| Authors: Axel Kittenberger
| License: GNU Affero GPLv3
*/

// TODO encapsulate

'use strict';

var subclass = jools.subclass;

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  ,
  )   ,-. ,-. ,-. ,-. . .
 /    |-' | | ,-| |   | |
 `--' `-' `-| `-^ `-' `-|
~ ~ ~ ~ ~ ~,| ~ ~ ~ ~ ~/|~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
           `'         `-'

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
if (!Object.defineProperty) {
	Object.defineProperty = function(obj, label, funcs) {
		if (typeof(funcs.value) !== 'undefined') {
			obj[label] = funcs.value;
			return;
		}
		if (funcs.get) {
			obj.__defineGetter__(label, funcs.get);
		}
		if (funcs.set) {
			obj.__defineSetter__(label, funcs.set);
		}
	}
}

if (!Object.freeze) {
	Object.freeze = function(obj) {};
}

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
 Meshcrafts Canvas wrapper.

 It enhances the HTML5 Canvas Context by accpeting previously defined immutable graphic
 objects as arguments.
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
/**
| fabric()        -or-    creates new Canvas2D
| fabric(canvas)  -or-    encloses an existing HTML5 canvas
| fabric(width, height)   creates a new Canvas2D and sets its size;
*/
function fabric(a1, a2) {
	switch (typeof(a1)) {
	case 'undefined' :
		this._canvas = document.createElement('canvas');
		break;
	case 'object' :
		this._canvas = a1;
		break;
	default :
		this._canvas = document.createElement('canvas');
		this._canvas.width  = a1;
		this._canvas.height = a2;
	}
	this._cx = this._canvas.getContext('2d');
	this.pan = fabric.Point.zero;
}


/**
| sets a readonly value
*/
fabric.fixate = function(obj, key, value) {
	Object.defineProperty(obj, key, {enumerable: true, value: value});
	return value;
}
//fabric.fixate(fabric, 'fixate', fabric.fixate);

/**
* A value is computed and fixated only when needed.
*/
fabric.lazyFixate = function(proto, key, getter) {
	Object.defineProperty(proto, key, {
		// this clever overriding does not work in IE9 :-( or Android 2.2 Browser
		// get : function() { return fabric.fixate(this, key, getter.call(this)); },
		get : function() { return this['_cache_'+key] || (this['_cache_'+key] = getter.call(this)); },
	});
};

/* divides by 2 and rounds up */
fabric.fixate(fabric, 'half',  function(v) { return Math.round(v / 2); });

/* cos(30°) */

fabric.fixate(fabric, 'cos30', Math.cos(Math.PI / 6));

/* tan(30°) */
fabric.fixate(fabric, 'tan30', Math.tan(Math.PI / 6));

/**
| Returns the compass direction opposite of a direction.
*/
fabric.fixate(fabric, 'opposite', function(dir) {
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
});

/**
| Throws an error if any argument is not an integer.
*/
fabric.fixate(fabric, 'ensureInteger', function() {
	for(var a in arguments) {
		var arg = arguments[a];
		if (Math.floor(arg) - arg !== 0) {
			throw new Error(arg + ' not an integer');
		}
	}
});

/**
| Just a convenience debugging tool
*/
fabric.debug = function() {
	if (!console) return;
	var l = '';
	for(var i = 0; i < arguments.length; i++) {
		if (i > 0) {
			l += ' ';
		}
		var a = arguments[i];
		if (a == null) {
			l += '|null|';
		} else if (a.substring || typeof(a) != 'object') {
			l += a;
		} else {
			l += '{';
			var first = true;
			var p;
			for (p in a) {
				if (!first) {
					l += ', ';
				} else {
					first = false;
				}
				switch (typeof(a[p])) {
				case 'function' :
					l += p + ' : function';
					break;
				default:
					l += p  + ' : ' + a[p];
					break;
				}
			}
			l += '}';
		}
	}
	console.log(l);
}


/**
| Canvas width.
*/
Object.defineProperty(fabric.prototype, 'width',  { get: function() { return this._canvas.width; }, });

/**
| Canvas height.
*/
Object.defineProperty(fabric.prototype, "height", { get: function() { return this._canvas.height; }, });

/**
| The canvas is cleared and resized to width/height (of rect).
|
| attune()               -or-
| attune(rect)           -or-
| attune(width, height)
*/
fabric.prototype.attune = function(a1, a2) {
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
}


/**
| Moves the path maker.
|
| moveTo(point, edge) -or-
| moveTo(x, y,  edge)
*/
fabric.prototype.moveTo = function(a1, a2, a3) {
	var pan = this.pan;
	var x, y, e;
	if (typeof(a1) === 'object') {
		x = a1.x; y = a1.y; e = a2;
	} else {
		x = a1;   y = a2;   e = a3;
	}
	fabric.ensureInteger(x, y);
	this._cx.moveTo(x + pan.x + (e ? 0.5 : 0), y + pan.y + (e ? 0.5 : 0));
}

/**
| Draws a line.
|
| lineto(point, edge) -or-
| lineto(x, y, edge)
*/
fabric.prototype.lineTo = function(a1, a2, a3) {
	var pan = this.pan;
	var x, y, e;
	if (typeof(a1) === 'object') {
		x = a1.x; y = a1.y; e = a2;
	} else {
		x = a1;   y = a2;   e = a3;
	}
	fabric.ensureInteger(x, y);
	this._cx.lineTo(x + pan.x + (e ? 0.5 : 0), y + pan.y + (e ? 0.5 : 0));
}

/**
| Draws an arc.
|
| arc(p,    radius, startAngle, endAngle, anticlockwise, edge)   -or-
| arc(x, y, radius, startAngle, endAngle, anticlockwise, edge)   -or-
*/
fabric.prototype.arc = function(a1, a2, a3, a4, a5, a6, a7) {
	var pan = this.pan;
	var x, y, r, sa, ea, ac, e;
	if (typeof(a1) === 'object') {
		x = a1.x; y = a1.y; r = a2; sa = a3; ea = a4; ac = a5; e = a6;
	} else {
		x = a1;   y = a2;   r = a3; sa = a4; ea = a5; ac = a6; e = a7;
	}
	this._cx.arc(x + pan.x + (e ? 0.5 : 0), y + pan.y + (e ? 0.5 : 0), r, sa, ea, ac);
}

/**
| Draws a frame around the canvas.
| Called 'path', because it is the general purpose name for object to draw themselves
| and a c2d has it defined as shortcut to frame itself.
|
| border: increase/decrease total size
*/
fabric.prototype.path = function(self, border, edge) {
	if (this !== self) throw new Error('fabric.path: self != this');
	var cx = this._cx;
	cx.beginPath();
	// todo -> moveTo lineTo
	cx.rect(
		0.5 + border, 0.5 + border,
		this._canvas.width - 1 - border, this._canvas.height - 1 - border);
}

/**
| rect(rect)     -or-
| rect(pnw, pse) -or-
| rect(nwx, nwy, w, h)
| todo remove by rect.path
*/
fabric.prototype.rect = function(a1, a2, a3, a4) {
//	throw new Error('todo');
	var pan = this.pan;
	var cx = this._cx;
	if (typeof(r) === 'object') {
		if (r instanceof fabric.Rect)
			return this._cx.rect(
				a1.pnw.x + pan.x + 0.5, a1.pnw.y + pan.y + 0.5,
				a1.width, a1.height);
		if (r instanceof fabric.Point)
			return this._cx.rect(
				a1.x + pan.x + 0.5, a1.y + pan.y + 0.5,
				a2.x - a1.x,        a2.y - a1.y);
		throw new Error('fillRect not a rectangle');
	}
	return this._cx.rect(a1 + pan.x + 0.5,  a2 + pan.y + 0.5, a3, a4);
}

/**
| fillRect(style, rect)     -or-
| fillRect(style, pnw, pse) -or-
| fillRect(style, nwx, nwy, width, height)
*/
fabric.prototype.fillRect = function(style, a1, a2, a3, a4) {
	var pan = this.pan;
	var cx = this._cx;
	cx.fillStyle = style;
	if (typeof(p) === 'object') {
		if (a1 instanceof fabric.Rect)
			return this._cx.fillRect(a1.pnw.x, a1.pnw.y, a1.pse.x, a1.pse.y);
		if (a1 instanceof fabric.Point)
			return this._cx.fillRect(a1.x, a1.y, a2.x, a2.y);
		throw new Error('fillRect not a rectangle');
	}
	return this._cx.fillRect(a1, a2, a3, a4);
}

/**
| Begins a path.
*/
fabric.prototype.beginPath = function() { this._cx.beginPath(); }

/**
| Closes a path.
*/
fabric.prototype.closePath = function() { this._cx.closePath(); }

/**
| Draws an image.
|
| drawImage(image, pnw)   -or-
| drawImage(image, x, y)
*/
fabric.prototype.drawImage = function(image, a1, a2) {
	var pan = this.pan;
	if (image instanceof fabric) image = image._canvas;
	if (typeof(a1) === 'object') {
		this._cx.drawImage(image, a1.x + pan.x, a1.y + pan.y);
		return;
	}
	this._cx.drawImage(image, a1 + pan.x, a2 + pan.y);
}


/**
| putImageData(imagedata, p) -or-
| putImageData(imagedata, x, y)
*/
fabric.prototype.putImageData = function(imagedata, a1, a2) {
	var pan = this.pan;
	if (typeof(p) === 'object') {
		this._cx.putImageData(imagedata, a1.x + pan.x, a2.y + pan.y);
		return;
	}
	this._cx.putImageData(imagedata, a1 + pan.x, a2 + pan.y);
}

/**
| getImageData(rect)     -or-
| getImageData(pnw, pse) -or-
| getImageData(x1, y1, x2, y2)
*/
fabric.prototype.getImageData = function(a1, a2, a3, a4) {
	var pan = this.pan;
	if (typeof(p) === 'object') {
		if (a1 instanceof fabric.Rect)
			return this._cx.getImageData(a1.pnw.x, a1.pnw.y, a1.pse.x, a1.pse.y);
		if (a1 instanceof fabric.Point)
			return this._cx.getImageData(a1.x, a1.y, a2.x, a2.y);
		throw new Error('getImageData not a rectangle');
	}
	return this._cx.getImageData(a1, a2, a3, a4);
}

/**
| Returns a HTML5 color style for a meshcraft style notation.
*/
fabric.prototype._colorStyle = function(style, shape) {
	if (style.substring) {
		return style;
	} else if (!style.gradient) {
		throw new Error('unknown style');
	}

	var grad;
	switch (style.gradient) {
	case 'askew' :
		// todo use gradientPNW
		if (!shape.pnw || !shape.pse)
			throw new Error(style.gradient+' gradiend misses pnw/pse');
		grad = this._cx.createLinearGradient(
			shape.pnw.x + this.pan.x, shape.pnw.y + this.pan.y,
			shape.pnw.x + shape.width / 10 + this.pan.x, shape.pse.y + this.pan.y);
		break;
	case 'horizontal' :
		// todo use gradientPNW
		if (!shape.pnw || !shape.pse)
			throw new Error(style.gradient+' gradient misses pnw/pse');
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
}

/**
| Draws a filled area.
|
| style: the style formated in meshcraft style notation.
| shape: an object which has path() defined
*/
fabric.prototype.fill = function(style, shape, path, a1, a2, a3, a4) {
	var cx = this._cx;
	shape[path](this, 0, false, a1, a2, a3, a4);
	cx.fillStyle = this._colorStyle(style, shape);
	cx.fill();
}

/**
| Draws a single edge.
|
| style: the style formated in meshcraft style notation.
| shape: an object which has path() defined
*/
fabric.prototype._edge = function(style, shape, path, a1, a2, a3, a4) {
	var cx = this._cx;
	shape[path](this, style.border, true, a1, a2, a3, a4);
	cx.strokeStyle = this._colorStyle(style.color, shape);
	cx.lineWidth = style.width;
	cx.stroke();
}

/**
| Draws an edge.
|
| style: the style formated in meshcraft style notation.
| shape: an object which has path() defined
*/
fabric.prototype.edge = function(style, shape, path, a1, a2, a3, a4) {
	var cx = this._cx;
	if (style instanceof Array) {
		for(var i = 0; i < style.length; i++) {
			this._edge(style[i], shape, path, a1, a2, a3, a4);
		}
	} else {
		this._edge(style[i], shape, path, a1, a2, a3, a4);
	}
}

/**
| Fills an aera and draws its borders
*/
fabric.prototype.paint = function(fillStyle, edgeStyle, shape, path, a1, a2, a3, a4) {
	var cx = this._cx;
	shape[path](this, 0, false, a1, a2, a3, a4);
	cx.fillStyle = this._colorStyle(fillStyle, shape);
	cx.fill();
	var cx = this._cx;
	if (edgeStyle instanceof Array) {
		for(var i = 0; i < edgeStyle.length; i++) {
			this._edge(edgeStyle[i], shape, path, a1, a2, a3, a4);
		}
	} else {
		this._edge(edgeStyle[i], shape, path, a1, a2, a3, a4);
	}
}

/**
| Draws some text.
*/
fabric.prototype.fillText = function(text, a1, a2) {
	if (typeof(a1) === 'object') {
		return this._cx.fillText(text, a1.x, a1.y);
	}
	return this._cx.fillText(text, a1, a2);
}

/**
| Draws some text rotated by phi
| text: text to draw
| p: center point of rotation
| phi: rotation angle
| d: distance from center // todo rename
*/
fabric.prototype.fillRotateText = function(text, pc, phi, d) {
	var cx = this._cx;
	var t1 = Math.cos(phi);
	var t2 = Math.sin(phi);
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
}


/**
| Sets the fontStyle, fillStyle, textAlign, textBaseline.
|
| fontStyle(font, fill)                      -or-
| fontStyle(font, fill, align, baseline)
*/
fabric.prototype.fontStyle = function(font, fill, align, baseline) {
	var cx = this._cx;
	cx.font         = font;
	cx.fillStyle    = fill;
	cx.textAlign    = align;
	cx.textBaseline = baseline;
}

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ,-,-,-.
 `,| | |   ,-. ,-. ,-. . . ,-. ,-.
   | ; | . |-' ,-| `-. | | |   |-'
   '   `-' `-' `-^ `-' `-^ '   `-'
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
fabric.Measure = {
	init : function() {
		Measure._canvas = document.createElement('canvas');
		Measure._cx = this._canvas.getContext('2d');
	},

	width : function(text) {
		return Measure._cx.measureText(text).width;
	}
}

Object.defineProperty(fabric.Measure, 'font', {
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
fabric.Point = function(a1, a2) {
	if (typeof(a1) === 'object') {
		fabric.fixate(this, 'x', a1.x);
		fabric.fixate(this, 'y', a1.y);
	} else {
		fabric.ensureInteger(a1, a2);
		fabric.fixate(this, 'x', a1);
		fabric.fixate(this, 'y', a2);
	}
}

/**
| Shortcut for point at 0/0.
*/
fabric.Point.zero = new fabric.Point(0, 0);

/**
| Creates a point from json.
*/
fabric.Point.jnew = function(js) {
	if (typeof(js.x) !== 'number' || typeof(js.y) !== 'number') {
		throw new Error('JSON malformed point.');
	}
	return new fabric.Point(js);
}

/**
| Creates a new point.
| However it will look through a list of points to see if
| this point has already this x/y to save creation of yet
| another object
|
| Point.renew(x, y, p1, p2, p3, ...)
*/
fabric.Point.renew = function(x, y) {
	for(var a = 2; a < arguments.length; a++) {
		var p = arguments[a];
		if (p instanceof Point && p.x === x && p.y === y) return p;
	}
	return new fabric.Point(x, y);
}

/**
| Returns a json object for this point.
*/
fabric.Point.prototype.jsonfy = function() {
	return this._json || (this._json = { x: this.x, y: this.y });
}

/**
| Returns true if this point is equal to another.
*/
fabric.Point.prototype.eq = function(a1, a2) {
	return typeof(a1) === 'object' ?
		this.x === a1.x && this.y === a1.y :
		this.x === a1   && this.y === a2;
}

/**
| Adds two points or x/y values, returns a new point.
*/
fabric.Point.prototype.add = function(a1, a2) {
	return typeof(a1) === 'object' ?
		new fabric.Point(this.x + a1.x, this.y + a1.y) :
		new fabric.Point(this.x + a1,   this.y + a2);
}

/**
| Subtracts a points (or x/y from this), returns new point
*/
fabric.Point.prototype.sub = function(a1, a2) {
	return typeof(a1) === 'object' ?
		new fabric.Point(this.x - a1.x, this.y - a1.y) :
		new fabric.Point(this.x - a1,   this.y - a2);
}

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
fabric.Rect = function(pnw, pse) {
	if (!pnw || !pse || pnw.x > pse.x || pnw.y > pse.y) {
		throw new Error('not a rectangle.');
	}
	fabric.fixate(this, 'pnw',    pnw);
	fabric.fixate(this, 'pse',    pse);
	fabric.fixate(this, 'width',  pse.x - pnw.x);
	fabric.fixate(this, 'height', pse.y - pnw.y);
}

/**
| Creates a point from json
*/
fabric.Rect.jnew = function(js) {
	return new fabric.Rect(fabric.Point.jnew(js.pnw), fabric.Point.jnew(js.pse));
}

/**
| Returns a json object for this rect
*/
fabric.Rect.prototype.jsonfy = function() {
	return this._json || (this._json = { pnw: this.pnw.jsonfy(), pse: this.pse.jsonfy() });
}

/**
| Returns a rect moved by a point or x/y
|
| add(point)   -or-
| add(x, y)
*/
fabric.Rect.prototype.add = function(a1, a2) {
	return new fabric.Rect(this.pnw.add(a1, a2), this.pse.add(a1, a2));
}

/**
| Returns a rect moved by a -point or -x/-y.
|
| sub(point)   -or-
| sub(x, y)
*/
fabric.Rect.prototype.sub = function(a1, a2) {
	return new fabric.Rect(this.pnw.sub(a1, a2), this.pse.sub(a1, a2));
}

/**
| Returns true if point is within this rect.
*/
fabric.Rect.prototype.within = function(p) {
	return p.x >= this.pnw.x && p.y >= this.pnw.y &&
	       p.x <= this.pse.x && p.y <= this.pse.y;
}

/**
| Draws the rectangle.
*/
fabric.Rect.prototype.path = function(c2d, border, edge) {
	c2d.beginPath();
	c2d.moveTo(this.pnw.x + border, this.pnw.y + border, edge);
	c2d.lineTo(this.pse.x - border, this.pnw.y + border, edge);
	c2d.lineTo(this.pse.x - border, this.pse.y - border, edge);
	c2d.lineTo(this.pnw.x + border, this.pse.y - border, edge);
	c2d.closePath();
}

/**
| Returns a resized rectangle.
|
| width:  new width
| height: new height
| align:  compass direction which point will be identical to this rectangle.
*/
fabric.Rect.prototype.resize = function(width, height, align) {
	if (this.width === width && this.height === height) return this;
	var pnw, pse;
	switch(align) {
	case 'n' :
		pnw = fabric.Point.renew(
			this.pnw.x - half(width - this.width),
			this.pnw.y,
			this.pnw, this.pse);
		pse = fabric.Point.renew(
			pnw.x + width,
			this.pnw.y + height,
			this.pnw, this.pse);
		break;
	case 'ne' :
		pnw = fabric.Point.renew(
			this.pse.x - width,
			this.pnw.y,
			this.pnw, this.pse);
		pse = fabric.Point.renew(
			this.pse.x,
			this.pnw.y + height,
			this.pnw, this.pse);
		break;
	case 'e' :
		pnw = fabric.Point.renew(
			this.pse.x - width,
			this.pnw.y - half(height - this.height),
			this.pnw, this.pse);
		pse = fabric.Point.renew(
			this.pse.x,
			pnw.y + height,
			this.pnw, this.pse);
		break;
	case 'se' :
		pnw = fabric.Point.renew(
			this.pse.x - width,
			this.pse.y - height,
			this.pnw, this.pse);
		pse = this.pse;
		break;
	case 's' :
		pnw = fabric.Point.renew(
			this.pnw.x - half(width - this.width),
			this.pse.y - height,
			this.pnw, this.pse);
		pse = fabric.Point.renew(
			pnw.x + width,
			this.pse.y,
			this.pnw, this.pse);
		break;
	case 'sw' :
		pnw = fabric.Point.renew(
			this.pnw.x,
			this.pse.y - height,
			this.pnw, this.pse);
		pse = fabric.Point.renew(
			this.pnw.x + width,
			this.pse.y,
			this.pnw, this.pse);
		break;
	case 'w' :
		pnw = fabric.Point.renew(
			this.pnw.x,
			this.pnw.y - half(height - this.height),
			this.pnw, this.pse);
		pse = fabric.Point.renew(
			this.pnw.x + width,
			pnw.y + height,
			this.pnw, this.pse);
		break;
	case 'nw' :
		pnw = this.pnw;
		pse = fabric.Point.renew(
			this.pnw.x + width,
			this.pnw.y + height,
			this.pnw, this.pse);
		break;
	case 'c' :
		pnw = fabric.Point.renew(
			this.pnw.x - half(width - this.width),
			this.pnw.y - half(height - this.height),
			this.pnw, this.pse);
		pse = fabric.Point.renew(
			pnw.x + width,
			pnw.y + height,
			this.pnw, this.pse);
		break;
	default :
		throw new Error('invalid align: '+align);
	}
	return new fabric.Rect(pnw, pse);
}

/**
| Returns a rectangle with same size at position.
|
| moveto(p)   -or-
| moveto(x, y)
*/
fabric.Rect.prototype.moveto = function(a1, a2) {
	if (typeof(a1) !== 'object') a1 = new fabric.Point(a1, a2);
	return new fabric.Rect(a1, a1.add(this.width, this.height));
}

/**
| Returns true if this rectangle is the same as another
*/
fabric.Rect.prototype.eq = function(r) {
	return this.pnw.eq(r.pnw) && this.pse.eq(r.pse);
}

/**
| Point in the center.
*/
fabric.lazyFixate(fabric.Rect.prototype, 'pc', function() {
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
| n: north margin
| e: east margin
| s: south margin
| w: west margin
*/
fabric.Margin = function(n, e, s, w) {
	fabric.fixate(this, 'n', n);
	fabric.fixate(this, 'e', e);
	fabric.fixate(this, 's', s);
	fabric.fixate(this, 'w', w);
}

/**
| A margin with all distances 0.
*/
fabric.Margin.zero = new fabric.Margin(0, 0, 0, 0);

/**
| Creates a margin from json.
*/
fabric.Margin.jnew = function(js) {
	return new fabric.Margin(js.n, js.e, js.s, js.w);
}

/**
| Returns a json object for this margin
*/
fabric.Margin.prototype.jsonfy = function() {
	return this._json || (this._json = { n: this.n, e: this.e, s: this.s, w: this.w });
}

/**
| East + west margin = x
*/
fabric.lazyFixate(fabric.Margin.prototype, 'x', function() { return this.e + this.w; });

/**
| North + south margin = y
*/
fabric.lazyFixate(fabric.Margin.prototype, 'y', function() { return this.n + this.s; });

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
fabric.RoundRect = function(a1, a2, a3) {
	if (a1 instanceof fabric.Point) {
		fabric.Rect.call(this, a1, a2);
		fabric.fixate(this, 'crad', a3);
	} else {
		fabric.Rect.call(this, a1.pnw, a1.pse);
		fabric.fixate(this, 'crad', a2);
	}
}
subclass(fabric.RoundRect, fabric.Rect);

/**
| Draws the roundrect.
|
| c2d: Canvas2D area to draw upon.
| border: additional distance.
*/
fabric.RoundRect.prototype.path = function(c2d, border, edge) {
	var nwx = this.pnw.x + border;
	var nwy = this.pnw.y + border;
	var sex = this.pse.x - border - 1;
	var sey = this.pse.y - border - 1;
	var cr  = this.crad  - border;
	var pi = Math.PI;
	var ph = pi / 2;
	c2d.beginPath();
	c2d.moveTo(nwx + cr, nwy);
	c2d.arc(sex - cr, nwy + cr, cr, -ph,   0, false, edge);
	c2d.arc(sex - cr, sey - cr, cr,   0,  ph, false, edge);
	c2d.arc(nwx + cr, sey - cr, cr,  ph,  pi, false, edge);
	c2d.arc(nwx + cr, nwy + cr, cr,  pi, -ph, false, edge);
}


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
fabric.Hexagon = function(pc, r) {
	if (typeof(pc) !== 'object' || !(pc instanceof fabric.Point)) throw new Error('invalid pc');
	fabric.fixate(this, 'pc', pc);
	fabric.fixate(this, 'r', r);
	Object.freeze(this);
}


/**
| Creates a hexgon from json.
*/
fabric.Hexagon.jnew = function(js) {
	return new fabric.Hexagon(js.pc, js.r);
}

/**
| Returns a json object for this rect.
*/
fabric.Hexagon.prototype.jsonfy = function() {
	return this._json || (this._json = { pc: this.pc, r: this.r });
}

/**
| Returns a hexagon moved by a point or x/y.
*/
fabric.Hexagon.prototype.add = function(a1, a2) {
	return new fabric.Hexagon(this.pc.add(a1, a2), this.r);
}

/**
| Returns true if point is within this hexagon.
*/
fabric.Hexagon.prototype.within = function(p) {
	var rc = this.r * fabric.cos30;
	var dy = this.p.y - p.y;
	var dx = this.p.x - p.x;
	var yhc6 = Math.abs(dy * fabric.cos30);
	return dy >= -rc && dy <= rc &&
           dx - this.r < -yhc6 &&
           dx + this.r >  yhc6;
}

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
fabric.HexagonSlice = function(psw, rad, height) {
	fabric.fixate(this, 'psw', psw);
	fabric.fixate(this, 'rad', rad);
	fabric.fixate(this, 'height', height);

	if (height > rad) throw new Error('Cannot make slice larger than radius');
}

/**
| Middle(center) point of Hexagon.
*/
fabric.lazyFixate(fabric.HexagonSlice.prototype, 'pm', function() {
	return new Point(
		this.psw.x + this.rad - Math.round((this.rad * fabric.cos30 - this.height) * fabric.tan30),
		this.psw.y + Math.round(this.rad * fabric.cos30) - this.height);
});

/**
| pnw (used by gradients)
*/
fabric.lazyFixate(fabric.HexagonSlice.prototype, 'pnw', function() {
	return new Point(this.psw.x, this.psw.y - this.height);
});

/**
| pnw (used by gradients)
*/
fabric.lazyFixate(fabric.HexagonSlice.prototype, 'width', function() {
	return 2 * Math.round(this.rad - (this.rad * fabric.cos30 - this.height) * fabric.tan30);
});

/**
| pse (used by gradients)
*/
fabric.lazyFixate(fabric.HexagonSlice.prototype, 'pse', function() {
	return new Point(this.psw.x + this.width, this.psw.y);
});

/**
| Draws the hexagon.
*/
fabric.HexagonSlice.prototype.path = function(c2d, border, edge) {
	var r05 = fabric.half(this.rad);
	c2d.beginPath();
	c2d.moveTo(this.psw.x                 + border, this.psw.y               - border, edge);
	c2d.lineTo(this.pm.x - r05            + border, this.psw.y - this.height + border, edge);
	c2d.lineTo(this.pm.x + r05            - border, this.psw.y - this.height + border, edge);
	c2d.lineTo(2 * this.pm.x - this.psw.x - border, this.psw.y               - border, edge);
}

/**
| Returns true if point is within the slice.
*/
fabric.HexagonSlice.prototype.within = function(p) {
	var dy = p.y - this.psw.y;
	var dx = p.x - this.psw.x;
	var hy = dy * fabric.tan30;
	return dy >= -this.height && dy <= 0 &&
	       dx >= -hy && dx - this.width <= hy;
}

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
fabric.HexagonFlower = function(pc, ri, ro, segs) {
	if (ri > ro) throw new Error('inner radius > outer radius');
	fabric.fixate(this, 'pc', pc);
	fabric.fixate(this, 'ri', ri);
	fabric.fixate(this, 'ro', ro);
	fabric.fixate(this, 'gradientPC', pc);
	fabric.fixate(this, 'gradientR1', ro);
	fabric.fixate(this, 'segs', segs);
}

/**
| Makes the flower-hex-6 path.
*/
fabric.HexagonFlower.prototype.path = function(c2d, border, edge, segment) {
	var ri  = this.ri;
	var ri2 = fabric.half(this.ri);
	var ric = Math.round(this.ri * fabric.cos30);
	var ro  = this.ro;
	var ro2 = fabric.half(this.ro);
	var roc = Math.round(this.ro * fabric.cos30);
	var pc  = this.pc;
	var pcx = pc.x, pcy = pc.y;
	var b   = border;
	var b2  = fabric.half(border);
	var bc6 = Math.round(border * fabric.cos30);
	var segs = this.segs;
	c2d.beginPath();
	/* inner hex */
	if (segment === 'innerHex' || segment === 'structure') {
		c2d.moveTo(pcx - ri  - b,  pcy,             edge);
		c2d.lineTo(pcx - ri2 - b2, pcy - ric - bc6, edge);
		c2d.lineTo(pcx + ri2 + b2, pcy - ric - bc6, edge);
		c2d.lineTo(pcx + ri  + b,  pcy,             edge);
		c2d.lineTo(pcx + ri2 + b2, pcy + ric + bc6, edge);
		c2d.lineTo(pcx - ri2 - b2, pcy + ric + bc6, edge);
		c2d.lineTo(pcx - ri  - b,  pcy,             edge);
	}

	/* outer hex */
	if (segment === 'outerHex' || segment === 'structure') {
		c2d.moveTo(pcx - ro  + b,  pcy,             edge);
		c2d.lineTo(pcx - ro2 + b2, pcy - roc + bc6, edge);
		c2d.lineTo(pcx + ro2 - b2, pcy - roc + bc6, edge);
		c2d.lineTo(pcx + ro  - b,  pcy,             edge);
		c2d.lineTo(pcx + ro2 - b2, pcy + roc - bc6, edge);
		c2d.lineTo(pcx - ro2 + b2, pcy + roc - bc6, edge);
		c2d.lineTo(pcx - ro  + b,  pcy,             edge);
	}

	switch (segment) {
	case 'structure' :
		if (segs.n || segs.nw) {
			c2d.moveTo(pcx - ri2,  pcy - ric, edge);
			c2d.lineTo(pcx - ro2,  pcy - roc, edge);
		}
		if (segs.n  || segs.ne) {
			c2d.moveTo(pcx + ri2, pcy - ric, edge);
			c2d.lineTo(pcx + ro2, pcy - roc, edge);
		}
		if (segs.ne || segs.se) {
			c2d.moveTo(pcx + ri,  pcy, edge);
			c2d.lineTo(pcx + ro,  pcy, edge);
		}
		if (segs.se || segs.s) {
			c2d.moveTo(pcx + ri2, pcy + ric + bc6, edge);
			c2d.lineTo(pcx + ro2, pcy + roc - bc6, edge);
		}
		if (segs.s || segs.sw) {
			c2d.moveTo(pcx - ri2, pcy + ric + bc6, edge);
			c2d.lineTo(pcx - ro2, pcy + roc - bc6, edge);
		}
		if (segs.sw || segs.nw) {
			c2d.moveTo(pcx - ri, pcy, edge);
			c2d.lineTo(pcx - ro, pcy, edge);
		}
		break;
	case 'n':
		c2d.moveTo(pcx - ro2 + b2, pcy - roc + bc6, edge);
		c2d.lineTo(pcx + ro2 - b2, pcy - roc + bc6, edge);
		c2d.lineTo(pcx + ri2 + b2, pcy - ric - bc6, edge);
		c2d.lineTo(pcx - ri2 - b2, pcy - ric - bc6, edge);
		c2d.lineTo(pcx - ro2 + b2, pcy - roc + bc6, edge);
		break;
	case 'ne':
		c2d.moveTo(pcx + ro2 - b2, pcy - roc + bc6, edge);
		c2d.lineTo(pcx + ro  - b,  pcy, edge);
		c2d.lineTo(pcx + ri  + b,  pcy, edge);
		c2d.lineTo(pcx + ri2 + b2, pcy - ric - bc6, edge);
		c2d.lineTo(pcx + ro2 - b2, pcy - roc + bc6, edge);
		break;
	case 'se':
		c2d.moveTo(pcx + ro  - b,  pcy, edge);
		c2d.lineTo(pcx + ro2 - b2, pcy + roc - bc6, edge);
		c2d.lineTo(pcx + ri2 + b2, pcy + ric + bc6, edge);
		c2d.lineTo(pcx + ri  + b,  pcy, edge);
		c2d.lineTo(pcx + ro  - b,  pcy, edge);
		break;
	case 's':
		c2d.moveTo(pcx + ro2 - b2, pcy + roc - bc6, edge);
		c2d.lineTo(pcx - ro2 + b2, pcy + roc - bc6, edge);
		c2d.lineTo(pcx - ri2 - b2, pcy + ric + bc6, edge);
		c2d.lineTo(pcx + ri2 + b2, pcy + ric + bc6, edge);
		c2d.lineTo(pcx + ro2 - b2, pcy + roc - bc6, edge);
		break;
	case 'sw':
		c2d.moveTo(pcx - ro2 + b2, pcy + roc - bc6, edge);
		c2d.lineTo(pcx - ro  + b,  pcy, edge);
		c2d.lineTo(pcx - ri  - b,  pcy, edge);
		c2d.lineTo(pcx - ri2 - b2, pcy + ric + bc6, edge);
		c2d.lineTo(pcx - ro2 + b2, pcy + roc - bc6, edge);
		break;
	case 'nw':
		c2d.moveTo(pcx - ro  + b,  pcy, edge);
		c2d.lineTo(pcx - ro2 + b2, pcy - roc + bc6, edge);
		c2d.lineTo(pcx - ri2 - b2, pcy - ric - bc6, edge);
		c2d.lineTo(pcx - ri  - b,  pcy, edge);
		c2d.lineTo(pcx - ro  + b,  pcy, edge);
		break;
	}
}

/**
| Returns the segment the point is within.
*/
fabric.HexagonFlower.prototype.within = function(p) {
	var roc6 = this.ro * fabric.cos30;
	var dy = p.y - this.pc.y;
	var dx = p.x - this.pc.x;
	var dyc6 = Math.abs(dy * fabric.tan30);

	if (dy <  -roc6 || dy >  roc6 || dx - this.ro >= -dyc6 || dx + this.ro <= dyc6) {
		return null;
	}

	var ric6 = this.ri * fabric.cos30;
	if (dy >= -ric6 && dy <= ric6 && dx - this.ri <  -dyc6 && dx + this.ri >  dyc6) {
		return 'center';
	}

	var lor = dx <= -dy * fabric.tan30; // left of right diagonal
	var rol = dx >=  dy * fabric.tan30; // right of left diagonal
	var aom = dy <= 0;               // above of middle line
	if (lor && rol)        return 'n';
	else if (!lor && aom)  return 'ne';
	else if (rol && !aom)  return 'se';
	else if (!rol && !lor) return 's';
	else if (lor && !aom)  return 'sw';
	else if (!rol && aom)  return 'nw';
	else return 'center';
}

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  ,
  )   . ,-. ,-.
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
fabric.Line = function(p1, p1end, p2, p2end) {
	fabric.fixate(this, 'p1', p1);
	fabric.fixate(this, 'p1end', p1end);
	fabric.fixate(this, 'p2', p2);
	fabric.fixate(this, 'p2end', p2end);
}

/**
| Returns the line connecting entity1 to entity2
|
| shape1: a Rect or Point
| end1: 'normal' or 'arrow'
| shape2: a Rect or Point
| end2: 'normal' or 'arrow'
*/
fabric.Line.connect = function(shape1, end1, shape2, end2) {
	if (!shape1 || !shape2) throw new Error('error');
	if (shape1 instanceof fabric.Rect && shape2 instanceof fabric.Point) {
		var p2 = shape2;
		var z1 = shape1;
		var p1;
		if (z1.within(p2)) {
			p1 = z1.pc;
		} else {
			p1 = new Point(
				Math.max(z1.pnw.x, Math.min(p2.x, z1.pse.x)),
				Math.max(z1.pnw.y, Math.min(p2.y, z1.pse.y)));
		}
		return new fabric.Line(p1, end1, p2, end2);
	}
	if (shape1 instanceof fabric.Rect && shape2 instanceof fabric.Rect) {
		var z1 = shape1;
		var z2 = shape2;
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
			x1 = x2 = fabric.half(Math.max(z1.pnw.x, z2.pnw.x) + Math.min(z1.pse.x, z2.pse.x));
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
			y1 = y2 = fabric.half(Math.max(z1.pnw.y, z2.pnw.y) + Math.min(z1.pse.y, z2.pse.y));
		}
		return new fabric.Line(new Point(x1, y1), end1, new Point(x2, y2), end2);
	}
	throw new Error('do not know how to create connection.');
}

/**
| Returns the zone of the arrow.
| Result is cached.
*/
Object.defineProperty(fabric.Line.prototype, 'zone', {
	get: function() {
		return fabric.fixate(this, 'zone', new fabric.Rect(
			fabric.Point.renew(
				Math.min(this.p1.x, this.p2.x), Math.min(this.p1.y, this.p2.y),
				this.p1, this.p2),
			fabric.Point.renew(
				Math.max(this.p1.x, this.p2.x), Math.max(this.p1.y, this.p2.y),
				this.p1, this.p2)));
	}
});

/**
| Draws the path of the line.
|
| c2d: Canvas2D to draw upon.
*/
fabric.Line.prototype.path = function(c2d, border, edge) {
	var p1 = this.p1;
	var p2 = this.p2;

	c2d.beginPath();
	// todo, multiple lineend types
	switch(this.p1end) {
	case 'normal':
		if (edge) c2d.moveTo(p1, edge);
		break;
	default :
		throw new Error('unknown line end');
	}

	switch(this.p2end) {
	case 'normal' :
		if (edge) c2d.lineTo(p2, edge);
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
		if (edge) {
			c2d.lineTo(
				p2.x - Math.round(ms * Math.cos(d)),
				p2.y - Math.round(ms * Math.sin(d)), edge);
		} else {
			c2d.moveTo(
				p2.x - Math.round(ms * Math.cos(d)),
				p2.y - Math.round(ms * Math.sin(d)), edge);
		}
		c2d.lineTo(
			p2.x - Math.round(as * Math.cos(d - ad)),
			p2.y - Math.round(as * Math.sin(d - ad)), edge);
		c2d.lineTo(p2, edge);
		c2d.lineTo(
			p2.x - Math.round(as * Math.cos(d + ad)),
			p2.y - Math.round(as * Math.sin(d + ad)), edge);
		c2d.lineTo(
			p2.x - Math.round(ms * Math.cos(d)),
			p2.y - Math.round(ms * Math.sin(d)), edge);
		break;
	default :
		throw new Error('unknown line end');
	}

}

/**
| Draws the line.
*/
fabric.Line.prototype.draw = function(c2d) {
	var style = settings.relation.style;
	c2d.paint(style.fill, style.edge, this, 'path');
}

/**
| Returns true if p is near the line spawned by p1 and p2.
*/
fabric.Line.prototype.isNear = function(p, dis) {
	throw new Error('unimplemented');
	// todo
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


