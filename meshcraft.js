/*                                                       _.._
                                                      .-'_.._''.
 __  __   ___       _....._              .          .' .'     '.\
|  |/  `.'   `.   .´       '.          .'|         / .'                                _.._
|   .-.  .-.   ' /   .-'"'.  \        (  |        . '            .-,.-~.              .' .._|    .|
|  |  |  |  |  |/   /______\  |        | |        | |            |  .-. |    __      | '      .' |_
|  |  |  |  |  ||   __________|    _   | | .'''-. | |            | |  | | .:-`.'.  __| |__  .'     |
|  |  |  |  |  |\  (          '  .' |  | |/.'''. \. '            | |  | |/ |   \ ||__   __|'-..  .-'
|  |  |  |  |  | \  '-.___..-~. .   | /|  /    | | \ '.         .| |  '- `" __ | |   | |      |  |
|__|  |__|  |__|  `         .'.'.'| |//| |     | |  '. `.____.-'/| |      .'.''| |   | |      |  |
                   `'-.....-.'.'.-'  / | |     | |    `-._____ / | |     / /   | |_  | |      |  '.'
                                 \_.'  | '.    | '.           `  |_|     \ \._,\ '/  | |      |   /
                                       '___'   '___'                      `~~'  `"   |_|      `'*/ 


"use strict";
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
.---.     .  .
\___  ,-. |- |- . ,-. ,-. ,-.
    \ |-' |  |  | | | | | `-.
`---' `-' `' `' ' ' ' `-| `-'
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~,| ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
                       `'
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
/* if true catches all errors and report to user,    
 * if false lets them pass through to e.g. firebug. */
var enableCatcher = false;

var settings = {
	defaultFont : "Verdana,Geneva,Kalimati,sans-serif",

	/* milliseconds after mouse down, dragging starts */
	dragtime : 400,
	/* pixels after mouse down and move, dragging starts */
	dragbox  : 10,
	
	/* factor to add to the bottom of font height */
	bottombox : 0.22,
	
	/* minimum sizes */
	noteMinWidth   : 40,
	noteMinHeight  : 40,
	labelMinWidth  : 30,
	labelMinHeight : 15,
	relationMinWidth  : 30,
	relationMinHeight : 15,
	
	/* note style */
	noteTextBorder : 10,
	noteInnerBorderWidth : 2,
	noteInnerBorderColor : "rgb(255, 188, 87)",
	noteInnerRadius      : 5,
	noteOuterBorderWidth : 1,
	noteOuterBorderColor : "black",
	noteOuterRadius      : 6,
	noteBackground1 : "rgba(255, 255, 248, 0.955)",
	noteBackground2 : "rgba(255, 255, 160, 0.955)",
	
	newNoteWidth  : 300,
	newNoteHeight : 150,
	
	/* edge menu style */
	edgeMenuOuterBorderWidth : 0.5,
	edgeMenuOuterBorderColor : "rgb(0, 0, 0)",
	edgeMenuInnerBorderWidth : 2,
	edgeMenuInnerBorderColor : "rgb(255, 200, 105)",
	edgeMenuBackground1 : "rgba(255, 255, 248, 0.90)",
	edgeMenuBackground2 : "rgba(255, 255, 190, 0.90)",	
	edgeMenuFillStyle : "rgb(255, 237, 210)",
	
	/* float menu style */
	floatMenuOuterRadius : 75,
	floatMenuInnerRadius : 30,
	floatMenuOuterBorderWidth : 0.5,
	floatMenuOuterBorderColor : "rgb(0, 0, 0)",
	floatMenuInnerBorderWidth : 2,
	floatMenuInnerBorderColor : "rgb(255, 200, 105)",
	floatMenuBackground2 : "rgba(255, 255, 243, 0.955)",
	floatMenuBackground1 : "rgba(255, 255, 168, 0.955)",
	floatMenuFillStyle : "rgb(255, 237, 210)",

	/* item menu style */
	itemMenuOuterRadius : 75,
	itemMenuInnerRadius : 30,
	itemMenuSliceHeight : 17,
	itemMenuOuterBorderWidth : 0.5,
	itemMenuOuterBorderColor1 : "rgb(0, 0, 0)",
	itemMenuOuterBorderColor2 : null && "rgb(255, 255, 255)",
	itemMenuInnerBorderWidth : 2,
	itemMenuInnerBorderColor1 : "rgb(255, 200, 105)",
	itemMenuInnerBorderColor2 : null & "rgb(255, 255, 255)",
	itemMenuBackground1 : "rgba(255, 255, 200, 0.955)",
	itemMenuBackground2 : "rgba(255, 255, 205, 0.5)",
	itemMenuFillStyle : "rgb(255, 237, 210)",
	
	/* selection */
	//selectionColor : "#8080ff",
	selectionColor  : "rgba(243, 203, 255, 0.9)",
	selectionStroke : "rgb (243, 183, 253)",
	
	/* scrollbar */
	scrollbarForm        : "hexagonh",  // 'square', 'round', 'hexagonh' or 'hexagonv'
	scrollbarFillStyle   : "rgb(255, 188, 87)",
	scrollbarStrokeStyle : "rgb(221, 154, 52)",
	scrollbarLineWidth   : 1,
	scrollbarRadius      : 4,
	scrollbarMarginX     : 7,
	scrollbarMarginY     : 5,
	
	/* size of resize handles */
	handleSize : 10,
	handleDistance : 0,
	handleColor1 : "rgb(125,120,32)",
	handleWidth1 : 3,
	handleColor2 : "rgb(255,180,90)",
	handleWidth2 : 1,
	
	/* blink speed of the caret */
	caretBlinkSpeed : 530,	
};

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  ,                       
  )   ,-. ,-. ,-. ,-. . . 
 /    |-' | | ,-| |   | | 
 `--' `-' `-| `-^ `-' `-| 
           ,|          /| 
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
if (!Object.defineProperty) {
	Object.defineProperty = function(obj, label, funcs) {
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

/* +++ Shortcuts  +++ */
var R = Math.round;
var abs = Math.abs;
var max = Math.max;
var min = Math.min;

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
.-,--.
 `\__  ,-. . . ,-,-. ,-.
  /    | | | | | | | `-.
 '`--' ' ' `-^ ' ' ' `-'
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
/* Mouse state */
var MST = {
	NONE   : 0, // button is up 
	ATWEEN : 1, // mouse just came down, unsure if click or drag 
	DRAG   : 2  // mouse is dragging 
};
Object.freeze(MST);

/* interface action active */
var ACT = {
	NONE    : 0, // idle 
	PAN     : 1, // panning the background
	IDRAG   : 2, // draggine one item
	IRESIZE : 3, // resizing one item
	SCROLLY : 4, // scrolling a note
	FMENU   : 5, // clicked the float menu (background click)
	IMENU   : 6, // clicked one item menu
	RBIND   : 7  // dragging a new relation
};
Object.freeze(ACT);
	
var TXE = {
	/* which kind of event transfix() calls for all items which intersect x/y */
	NONE       : 0,
	DRAGSTART  : 1,
	HOVER      : 2,
	RBINDHOVER : 3, 
	RBINDTO    : 4,
}
Object.freeze(TXE);

var TXR = {	
	/* bitfield return code of transfix() */
	HIT    : 0x1,
	REDRAW : 0x2
};
Object.freeze(TXR);


/* onlook() events */
var ONLOOK = {
	NONE   : 0,
	UPDATE : 1,
	REMOVE : 2,
}
Object.freeze(ONLOOK);

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 .-,--.      .
 ' |   \ ,-. |-. . . ,-.
 , |   / |-' | | | | | |
 `-^--'  `-' ^-' `-^ `-|
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ,|~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
 Prints out messages  `' and objects on the console.
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
function debug() {
	if (!console) return;
	var l = "";
	for(var i = 0; i < arguments.length; i++) {
		if (i > 0) { 
			l += " ";
		}
		var a = arguments[i];
		if (a == null) {
			l += "|null|";
		} else if (a.substring || typeof(a) != "object") {
			l += a;
		} else {
			l += "{";
			var first = true;
			var p;
			for (p in a) {
				if (!first) {
					l += ", ";
				} else {
					first = false;
				}
				switch (typeof(a[p])) {
				case "function" : 
					l += p + " : function";
					break;
				default:
					l += p  + " : " + a[p];
					break;
				}
			}
			l += "}";
		}
	}
	console.log(l);
}

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ,-,-,-.
 `,| | |   ,-. ,-. ,-. . . ,-. ,-.
   | ; | . |-' ,-| `-. | | |   |-'
   '   `-' `-' `-^ `-' `-^ '   `-'
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
 Marks a position in an element of an item.
 todo integrate to Can2D
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
var Measure = {
	init : function() {
		Measure._canvas = document.createElement("canvas");
		Measure._cx = this._canvas.getContext("2d");
	},
	
	width : function(text) {
		return Measure._cx.measureText(text).width;
	}
}

Object.defineProperty(Measure, "font", {
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
/* Constructor.
 * Point(x, y) or
 * Point(point)
 */
function Point(p, y) {
	if (arguments.length === 1) {
		this.x = p.x;
		this.y = p.y;
	}
	this.x = p;
	this.y = y;
	this.otype = "point";
	Object.freeze(this);
}

/* Creates a point from json */
Point.jnew = function(js) {
	if (typeof(js.x) !== "number" || typeof(js.y) !== "number") {
		throw new Error("Expected a number in JSON, but isn't");
	}
	return new Point(js.x, js.y);
}

/* returns a json object for this point */
Point.prototype.jsonfy = function() {
	return { x: this.x, y: this.y };
}

Point.prototype.eq = function(px, y) {
	return arguments.length === 1 ? 
		this.x === px.x && this.y === px.y :
		this.x === px   && this.y ===    y;
}

/* add two points or x/y values, returns new point */
Point.prototype.add = function(a1, a2) {
	return (typeof(a1) === "object" ?
		new Point(this.x + a1.x, this.y + a1.y) :
		new Point(this.x + a1,   this.y + a2));
}

/* subtracts a points (or x/y from this), returns new point */
Point.prototype.sub = function(a1, a2) {
	return (typeof(a1) === "object" ?
		new Point(this.x - a1.x, this.y - a1.y) :
		new Point(this.x - a1,   this.y - a2));
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

/* Constructor.
 * Rect(rect)
 * Rect(p1, p2) 
 */
function Rect(r1, p2) {
	if (arguments.length === 1) {
		throw new Error("todo. Why do yo do this?)");
		this.p1 = r1.p1;
		this.p2 = r1.p2;
	} else {
		this.p1 = r1;
		this.p2 = p2;
	}
	if (this.p1.x > this.p2.x || this.p1.y > this.p2.y) { throw new Error("not a rectangle."); }
	this.otype = "rect";
	Object.freeze(this);
}

/* Creates a point from json */
Rect.jnew = function(js) {
	return new Rect(Point.jnew(js.p1), Point.jnew(js.p2));
}

/* returns a json object for this rect */
Rect.prototype.jsonfy = function() {
	return { p1: this.p1.jsonfy(), p2: this.p2.jsonfy() };
}

/* returns a rect moved by a point or x/y */
Rect.prototype.add = function(px, y) {
	return arguments.length === 1 ?
		new Rect(this.p1.add(px),    this.p2.add(px)) : 
		new Rect(this.p1.add(px, y), this.p2.add(px, y));
}

Rect.prototype.sub = function(p) {
	return arguments.length === 1 ?
		new Rect(this.p1.sub(px),    this.p2.sub(px)) : 
		new Rect(this.p1.sub(px, y), this.p2.sub(px, y));
}

/* returns true if point is within this rect */
Rect.prototype.within = function(p) {
	return p.x >= this.p1.x && p.y >= this.p1.y && 
	       p.x <= this.p2.x && p.y <= this.p2.y;
}

/* returns a rectangle with same p1 but size w/h or point */
Rect.prototype.resize = function(w, h, align) {
	var p1 = this.p1;
	var p2 = this.p2;
	
	if (align === "w" || align === "sw" || align === "nw") {
		p1 = new Point(p2.x - w, p1.y);
	} else {
		p2 = new Point(p1.x + w, p2.y);
	}

	if (align === "n" || align === "nw" || align === "ne") {
		p1 = new Point(p1.y, p2.y - h);
	} else {
		p2 = new Point(p2.x, p1.y + h);
	}
	
	return new Rect(p1, p2);
}

/* returns a rectangle with same size at position at p|x/y) */
Rect.prototype.atpos = function(px, y) {
	if (arguments.length !== 1) px = new Point(px, y);
	return new Rect(px, px.add(this.w, this.h));
}

/* Returns true if this rectangle is like z */
Rect.prototype.eq = function(z) {
	return this.p1.eq(z.p1) && this.p2.eq(z.p2);
}

Object.defineProperty(Rect.prototype, "w", {
	get: function()  { return this.p2.x - this.p1.x;    },
	set: function(w) { throw new Error("Rect cannot set w"); },
});

Object.defineProperty(Rect.prototype, "width", {
	get: function()  { return this.p2.x - this.p1.x;    },
	set: function(w) { throw new Error("Rect cannot set width"); },
});

Object.defineProperty(Rect.prototype, "h", {
	get: function()  { return this.p2.y - this.p1.y; },
	set: function(h) { throw new Error("Rect cannot set h"); },
});

Object.defineProperty(Rect.prototype, "height", {
	get: function()  { return this.p2.y - this.p1.y; },
	set: function(h) { throw new Error("Rect cannot set height"); },
});

Object.defineProperty(Rect.prototype, "mx", {
	get: function() { return R((this.p2.x + this.p1.x) / 2); },
	set: function() { throw new Error("Rect cannot set mx")},
});

Object.defineProperty(Rect.prototype, "my", {
	get: function() { return R((this.p2.y + this.p1.y) / 2); },
	set: function() { throw new Error("Rect cannot set my")},
});

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ++Arrow. 
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
 A directional line
 Arrows are pseuod-immutable objects.
 Differently to a rectangle p1 is not necessarily left and top of p2.
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
/* Constructor.
 * Rect(rect)
 * Rect(p1, p2) 
 */
function Arrow(p1, p2) {
	this.p1 = p1;
	this.p2 = p2;
	this.otype = "arrow";
}

/* Returns the arrow for two objects.
 * item1 to item2  -or-
 * item1 to point
 *
 * returns a.zone = the zone
 *         a.arrowcom = compass direction the arrow comes from (e.g. "nw")
 */
Arrow.create = function(item1, item2) {
	if (item2.otype === "point" && item1.zone && item1.zone.otype === "rect") {
		var p2 = item2;
		var z1 = item1.zone;
		var p1;
		if (z1.within(p2)) {
			p1 = new Point(z1.mx, z1.my);
		} else {
			p1 = new Point(
				p2.x < z1.p1.x ? z1.p1.x :
			   (p2.x > z1.p2.x ? z1.p2.x : p2.x),
				p2.y < z1.p1.y ? z1.p1.y :
			   (p2.y > z1.p2.y ? z1.p2.y : p2.y));
		}
		return new Arrow(p1, p2);
	} 
	if (item1.zone && item1.zone.otype === "rect" && item2.zone && item2.zone.otype === "rect") {
		var z1 = item1.zone;
		var z2 = item2.zone;
		var x1, y1, x2, y2;
		if (z2.p1.x > z1.p2.x) { 
			/* zone2 is clearly on the right */
			x1 = z1.p2.x;
			x2 = z2.p1.x;
		} else if (z2.p2.x < z1.p1.x) {
			/* zone2 is clearly on the left */
			x1 = z1.p1.x;
			x2 = z2.p2.x;
		} else {
			/* an intersection */
			x1 = x2 = R((max(z1.p1.x, z2.p1.x) +
			             min(z1.p2.x, z2.p2.x)) / 2);
		}
		if (z2.p1.y > z1.p2.y) { 
			/* zone2 is clearly on the bottom */
			y1 = z1.p2.y;
			y2 = z2.p1.y;
		} else if (z2.p2.y < z1.p1.y) {
			/* zone2 is clearly on the top */
			y1 = z1.p1.y;
			y2 = z2.p2.y;
		} else {
			/* an intersection */
			y1 = y2 = R((max(z1.p1.y, z2.p1.y) +
			             min(z1.p2.y, z2.p2.y)) / 2);
		}
		return new Arrow(new Point(x1, y1), new Point(x2, y2));
	}
	throw new Error("do not know how to create arrow.");
}

/* Returns the zone of the arrow.
 * Result is cached.
 */
Object.defineProperty(Arrow.prototype, "zone", {
	get: function() { 
		if (this._zone) return this._zone;
		if (this.p1.x <= this.p2.x && this.p1.y <= this.p2.y) // \v
			return new Rect(this.p1, this.p2); 
		if (this.p1.x >  this.p2.x && this.p1.y >  this.p2.y) // ^\
			return new Rect(this.p2, this.p1); 
		return new Rect(
			new Point(min(this.p1.x, this.p2.x), min(this.p1.y, this.p2.y)),
			new Point(max(this.p1.x, this.p2.x), max(this.p1.y, this.p2.y)));
	},
	set: function() { throw new Error("Cannot set zone"); }
});

/* Draws one relationship arrow
 * (space, item1_id, item2_id, null, middle) - or - 
 * (space, item1_id,        x,    y, middle)  
 *
 * mcanvas:  if not null draw this in the middle of the arrow.
 */
 /* todo 2dize*/
Arrow.prototype.draw = function(space, mcanvas) {
	var c2d = space.can2d;
	
	/* arrow size*/
	var as = 12;  
	var p1 = this.p1;
	var p2 = this.p2;
	var d = Math.atan2(p2.y - p1.y, p2.x - p1.x);
	var ad = Math.PI/12;
	var ms = 2 / Math.sqrt(3) * as;
	c2d.beginPath();
	if (mcanvas) {
		var mx = ((p1.x + p2.x) / 2);
		var my = ((p1.y + p2.y) / 2);
		var tx = R(mx - mcanvas.width  / 2) - 2;
		var ty = R(my - mcanvas.height / 2) - 2;
		var bx = R(mx + mcanvas.width  / 2) + 2;
		var by = R(my + mcanvas.height / 2) + 2;
		c2d.drawImage(mcanvas, tx, ty);
		c2d.rect(tx, ty, mcanvas.width + 4, mcanvas.height + 4);
		c2d.stroke(1, "rgba(255, 127, 0, 0.4)"); // todo settings
		c2d.beginPath();

		// calculate intersections
		var is1x, is1y; 
		var is2x, is2y;
	
		if (p1.y == p2.y) {
			var kx = mcanvas.width / 2;
			if (p1.x > p2.x) {
				is1x = R(mx + kx);
				is2x = R(mx - kx); 
				is1y = is2y = p1.y;
			} else {
				is1x = R(mx - kx);
				is2x = R(mx + kx); 
				is1y = is2y = p1.y;
			}
		} else {
			var kx = ((p2.x - p1.x) / (p2.y - p1.y) * mcanvas.height / 2);
			if (p1.y > p2.y) {
				is1x = R(mx + kx);
				is2x = R(mx - kx); 
				is1y = by;
				is2y = ty;
			} else {
				is1x = R(mx - kx);
				is2x = R(mx + kx); 
				is1y = ty;
				is2y = by;
			}
		}
		if (is1x < tx || is1x > bx) {
			var ky = ((p2.y - p1.y) / (p2.x - p1.x) * mcanvas.width  / 2);
			if (p1.x > p2.x) {
				is1x = bx;
				is2x = tx; 
				is1y = R(my + ky);
				is2y = R(my - ky);
			} else {
				is1x = tx;
				is2x = bx; 
				is1y = R(my - ky);
				is2y = R(my + ky);
			}
		}

		c2d.moveTo(p1.x, p1.y);
		c2d.lineTo(is1x, is1y);
		c2d.moveTo(is2x, is2y);
	} else {
		c2d.moveTo(p1.x, p1.y);
	}
	// draws the arrow head
	c2d.lineTo(p2.x - R(ms * Math.cos(d)),      p2.y - R(ms * Math.sin(d)));
	c2d.lineTo(p2.x - R(as * Math.cos(d - ad)), p2.y - R(as * Math.sin(d - ad)));
	c2d.lineTo(p2.x,                            p2.y);
	c2d.lineTo(p2.x - R(as * Math.cos(d + ad)), p2.y - R(as * Math.sin(d + ad)));
	c2d.lineTo(p2.x - R(ms * Math.cos(d)),      p2.y - R(ms * Math.sin(d)));
	c2d.stroke(3, "rgba(255, 225, 80, 0.5)"); // todo settings
	c2d.stroke(1, "rgba(200, 100, 0, 0.8)");  // todo settings
	c2d.fill("rgba(255, 225, 40, 0.5)");
}

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  ,--.          _  .-,--.
 | `-' ,-. ,-. ´ ) ' |   \
 |   . ,-| | |  /  , |   /
 `--'  `-^ ' ' '~` `-^--'
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
 Meshcrafts Canvas wrapper.
 
 It enhances the HTML5 Canvas Context by accpeting previously defined immutable graphic
 objects as arguments.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
/* Can2D()        -or-    creates new canvas
 * Can2D(canvas)  -or-    encloses an existing canvas
 * Can2D(width, height)   creates a new canvas and sets its size;
 */
function Can2D(a1, a2) {
	this.otype = "can2d";
	var ta1 = typeof(a1);
	if (ta1 === "undefined") {
		this._canvas = document.createElement("canvas");	
	} else if (ta1 === "object") {
		this._canvas = a1;
	} else {
		this._canvas = document.createElement("canvas");	
		this._canvas.width  = a1;
		this._canvas.height = a2;
	}
	this._cx = this._canvas.getContext("2d");
	this.pan = new Point(0, 0);
}

Can2D.ensureInteger = function() {
	for(var a in arguments) {
		var arg = arguments[a];
		if (Math.floor(arg) - arg !== 0) {
			throw new Error(arg + " not an integer");
		}
	}
}

Object.defineProperty(Can2D.prototype, "width", {
	get: function() { return this._canvas.width; },
	set: function() { throw new Error("use Can2D.resetSize()");},
});

Object.defineProperty(Can2D.prototype, "height", {
	get: function() { return this._canvas.height; },
	set: function() { throw new Error("use Can2D.resetSize()");},
});

/* attune() -or-
 * attune(rect) -or-
 * attune(width, height)
 *
 * the canvas is cleared and its size ensured to be width/height (of rect)
 */
Can2D.prototype.attune = function(a1, a2) {
	var ta1 = typeof(a1);
	var c = this._canvas;
	if (ta1 === "undefined") {
		this._cx.clearRect(0, 0, c.width, c.height);	
		return;
	}
	var w, h;
	if (ta1 === "object") {
		w = a1.width;
		h = a1.height;
	} else {
		w = a1;
		h = a2;
	}
	if (c.width === w && c.height === h) {
		// no size change, clearRect() is faster
		this._cx.clearRect(0, 0, c.width, c.height);	
		return;		
	}
	/* setting with or height clears the contents */
	if (c.width  !== w) c.width  = w;
	if (c.height !== h) c.height = h;
}

/* moveTo(point) -or-
 * moveTo(x, y)
 */
Can2D.prototype.moveTo = function(a1, a2) {
	var pan = this.pan;
	var x, y;
	if (typeof(a1) === "object") {
		x = a1.x;
		y = a1.y;
	} else {
		x = a1;
		y = a2;
	}
	Can2D.ensureInteger(x, y);
	Can2D.ensureInteger(pan.x, pan.y);
	this._cx.moveTo(x + pan.x + 0.5, y + pan.y + 0.5);
}

/* lineto(point) -or-
 * lineto(x, y)
 */
Can2D.prototype.lineTo = function(a1, a2) {
	var pan = this.pan;
	var x, y;
	if (typeof(a1) === "object") {
		x = a1.x;
		y = a1.y;
	} else {
		x = a1;
		y = a2;
	}
	Can2D.ensureInteger(x, y);
	Can2D.ensureInteger(pan.x, pan.y);
	this._cx.lineTo(x + pan.x + 0.5, y + pan.y + 0.5);
}

/* Draws an arc.
 *
 * arc(p,    radius, startAngle, endAngle, anticlockwise)   -or-
 * arc(x, y, radius, startAngle, endAngle, anticlockwise)   -or-
 */
Can2D.prototype.arc = function(a1, a2, a3, a4, a5, a6) {
	var pan = this.pan;
	if (typeof(a1) === "object") {
		this._cx.arc(a1.x + pan.x + 0.5, a1.y + pan.y + 0.5, a2, a3, a4, a5);
		return;
	} 
	this._cx.arc(a1 + pan.x + 0.5, a2 + pan.y + 0.5, a3, a4, a5, a6);
}

/* makes a stroke */
Can2D.prototype.stroke = function(lineWidth, style) {
	var cx = this._cx;
	cx.lineWidth = lineWidth;
	cx.strokeStyle = style;
	cx.stroke();
}

/* makes a fill */
Can2D.prototype.fill = function(style) {
	var cx = this._cx;
	cx.fillStyle = style;
	cx.fill();
}

/* rect(style, rect)   -or-
 * rect(style, p1, p2) -or-
 * rect(style, x1, y1, w, h)
 */
Can2D.prototype.rect = function(r) {
	var pan = this.pan;
	var cx = this._cx;
	if (typeof(r) === "object") {
		if (r.otype === "rect") {
			return this._cx.rect(
				r.p1.x + pan.x + 0.5, r.p1.y + pan.y + 0.5, 
				r.w, r.h);
		}
		if (r.otype === "point") {
			var p1 = r;
			var p2 = arguments[1];
			return this._cx.rect(
				p1.x + pan.x + 0.5, p1.y + pan.y + 0.5, 
				p2.x - p1.x,        p2.y - p1.y);
		}
		throw new Error("fillRect not a rectangle");
	}
	return this._cx.rect(
		arguments[0] + pan.x + 0.5,  arguments[1] + pan.y + 0.5, 
		arguments[2], arguments[3]);
}

/* fillRect(style, rect)   -or-
 * fillRect(style, p1, p2) -or-
 * fillRect(style, x1, y1, x2, y2)
 */
Can2D.prototype.fillRect = function(style, rect) {
	var pan = this.pan;
	var cx = this._cx;
	cx.fillStyle = style;
	if (typeof(p) === "object") {
		if (rect.otype === "rect") {
			return this._cx.fillRect(rect.p1.x, rect.p1.y, rect.p2.x, rect.p2.y);
		}
		if (rect.otype === "point") {
			var p2 = arguments[2];
			return this._cx.fillRect(rect.x, rect.y, p2.x, p2.y);
		}
		throw new Error("fillRect not a rectangle");
	}
	return this._cx.fillRect(rect, arguments[2], arguments[3], arguments[4]);
}

/* begins a path */
Can2D.prototype.beginPath = function() { this._cx.beginPath();  }

/* closes a path */
Can2D.prototype.closePath = function() { this._cx.closePath();  } 

/* drawImage(image, p) -or-
 * drawImage(image, x, y)
 */
Can2D.prototype.drawImage = function(image, p) {
	var pan = this.pan;
	if (image.otype === "can2d") image = image._canvas;
	if (typeof(p) === "object") {
		this._cx.drawImage(image, p.x + pan.x, p.y + pan.y);
		return;
	}
	this._cx.drawImage(image, p + pan.x, arguments[2] + pan.y);
}


/* putImageData(image, p) -or-
 * putImageData(image, x, y)
 */
Can2D.prototype.putImageData = function(image, p) {
	var pan = this.pan;
	if (typeof(p) === "object") {
		this._cx.putImageData(image, p.x + pan.x, p.y + pan.y);
		return;
	}
	this._cx.putImageData(image, p + pan.x, arguments[2] + pan.y);
}

/* getImageData(rect)   -or-
 * getImageData(p1, p2) -or-
 * getImageData(x1, y1, x2, y2)
 */
Can2D.prototype.getImageData = function(rect) {
	var pan = this.pan;
	if (typeof(p) === "object") {
		if (rect.otype === "rect") {
			return this._cx.getImageData(rect.p1.x, rect.p1.y, rect.p2.x, rect.p2.y);
		}
		if (rect.otype === "point") {
			var p2 = arguments[1];
			return this._cx.getImageData(rect.x, rect.y, p2.x, p2.y);
		}
		throw new Error("getImageData not a rectangle");
	}
	return this._cx.getImageData(rect, arguments[1], arguments[2], arguments[3]);
}


/* createRadialGradient(center, radius, center2, radius2) 
 */
Can2D.prototype.createRadialGradient = function(p, r, p2, r2) {
	return this._cx.createRadialGradient(p.x, p.y, r, p2.x, p2.y, r2);
}

/* createLinearGradient(p1, p2)          -or-
 * createLinearGradient(x1, y1, x2, y2) 
 */
Can2D.prototype.createLinearGradient = function(a1, a2, a3, a4) {
	if (typeof(a1) === "object") {
		return this._cx.createLinearGradient(a1.x, a1.y, a2.x, a2.y);
	}
	return this._cx.createLinearGradient(a1, a2, a3, a4);
}	

/*	 todo?
Can2D.prototype.setTransform = function(a, b, c, d, e, f) {
	this._cx.setTransform(a, b, c, d, e, f);
}*/

/* fillText */
Can2D.prototype.fillText = function(text, a1, a2) {
	if (typeof(a1) === "object") {
		return this._cx.fillText(text, a1.x, a1.y);
	}
	return this._cx.fillText(text, a1, a2);
}

/* draws a filltext rotated by phi 
 *
 * test ...  text to draw
 * p    ...  center point of rotation
 * phi  ...  rotation
 * rad  ...  distance from center
 */
Can2D.prototype.fillRotateText = function(text, p, phi, rad) {
	var cx = this._cx;
	var t1 = Math.cos(phi);
	var t2 = Math.sin(phi);
	var det = t1 * t1 + t2 * t2;
	var x = p.x + rad * t2;
	var y = p.y - rad * t1;
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

	
/* fontStyle(font, fill)                      -or-
 * fontStyle(font, fill, align, baseline)
 *
 * sets the fontStyle, fillStyle, textAlign, textBaseline  
 */
Can2D.prototype.fontStyle = function(font, fill, align, baseline) {
	var cx = this._cx;
	cx.font         = font;
	cx.fillStyle    = fill;
	cx.textAlign    = align;
	cx.textBaseline = baseline;
}


/***
 * Utilities for hexagons.
 */
/* shortcuts for often needed trigonometric values */
Can2D.cos6 = Math.cos(Math.PI / 6);
Can2D.tan6 = Math.tan(Math.PI / 6);

/* makes a hexagon path */
Can2D.prototype.makeHexagon = function(p, r) {
	var x = p.x;
	var y = p.y;
	var r2 = R(r / 2);
	var rc = R(Can2D.cos6 * r);
	this.beginPath();
	this.moveTo(x - r, y);
	this.lineTo(x - r2, y - rc);
	this.lineTo(x + r2, y - rc);
	this.lineTo(x + r, y);
	this.lineTo(x + r2, y + rc);
	this.lineTo(x - r2, y + rc);
	this.lineTo(x - r, y);
	this.closePath();
}

/* makes a double hexagon with 6 segments and center 
 * it kinda looks like a flower. 
 *
 * The Flower Hexagon:
 * 
 *                p.x
 *                 |--------->| r
 *                 |--->| ri  ' 
 *                 '    '     '
 *           *-----'----'*    '     -1
 *          / \    1    ' \   '
 *         /   \   '   /'  \  '
 *        /  6  *-----* ' 2 \ '
 *       /   '   \'    \'    \
 * p.y  *-----*    +    *-----*
 *       \     \    p  /     /
 *        \  5  *-----*   3 /
 *         \   /       \   /
 *          \ /    4    \ /
 *           *-----------*
 *
 * p     ... center
 * r     ... outer radius
 * ri    ... inner radius
 * segs  ... lists 0..6 which segments to include
 */
Can2D.prototype.makeHexagonFlower = function(p, r, ri, segs) {
	var r2  = R(r / 2);
	var rc  = R(Can2D.cos6 * r);
	var ri2 = R(ri / 2);
	var ric = R(Can2D.cos6 * ri);
	var px = p.x;
	var py = p.y;
	this.beginPath();
	/* inner hex */
	this.moveTo(px - r,  py);
	this.lineTo(px - r2, py - rc);
	this.lineTo(px + r2, py - rc);
	this.lineTo(px + r,  py);
	this.lineTo(px + r2, py + rc);
	this.lineTo(px - r2, py + rc);
	this.lineTo(px - r,  py);
	/* outer hex */
	this.moveTo(px - ri,  py);
	this.lineTo(px - ri2, py - ric);
	this.lineTo(px + ri2, py - ric);
	this.lineTo(px + ri,  py);
	this.lineTo(px + ri2, py + ric);
	this.lineTo(px - ri2, py + ric);
	this.lineTo(px - ri,  py);	
	
	if (segs[1] || segs[6]) {
		this.moveTo(px - ri2,  py - ric);
		this.lineTo(px - r2,   py - rc);
	}
	if (segs[1] || segs[2]) {
		this.moveTo(px + ri2, py - ric);
		this.lineTo(px + r2,  py - rc);
	}
	if (segs[2] || segs[3]) {
		this.moveTo(px + ri,  py);
		this.lineTo(px + r,   py);
	}
	if (segs[3] || segs[4]) {
		this.moveTo(px + ri2,  py + ric);
		this.lineTo(px + r2,   py + rc);
	}
	if (segs[4] || segs[5]) {
		this.moveTo(px - ri2, py + ric);
		this.lineTo(px - r2,  py + rc);
	}
	if (segs[5] || segs[6]) {
		this.moveTo(px - ri,  py);
		this.lineTo(px - r,   py);
	}
}


/* makes the top slice of a hexagon.
 *       ------------        ^
 *      /............\       |  h
 *     /..............\      |
 *   p*................\     v
 *   /                  \
 *  *<-------->*         *
 *   \     r    pm      /
 *    \                /
 *     \              /
 *      \            /
 *       *----------*		
 *              
 * makeHexagonSlice(c2d, p, r, h)       -or-
 * makeHexagonSlice(c2d, x, y, r, h)    
 * 
 * returns pm;
 */
Can2D.prototype.makeHexagonSlice = function(a1, a2, a3, a4) {
	var x, y, r, h;
	
	if (typeof(a1) === "object") {
		x = a1.x;
		y = a1.y;
		r = a2;
		h = a3;
	} else {
		x = a1;
		y = a2;
		r = a3;
		h = a4;	
	}
	
	var r2 = R(r / 2);
	var rc = R(Can2D.cos6 * r);
	if (h > r) throw new Error("Cannot make slice larger than radius");
	var pm = new Point(x + r - R((r * Can2D.cos6 - h) * Can2D.tan6), y + rc - h);
	
	this.beginPath();
	this.moveTo(x, y);
	this.lineTo(pm.x - r2, y - h);
	this.lineTo(pm.x + r2, y - h);
	this.lineTo(2 * pm.x - x, y);
	return pm;
}


/* makes a hexagon segment path: 
 *         r |------>| 
 *        ri |->.    '
 *       .------'.   '      -1
 *      / \  1  / \	 '
 *     / 6 .---.'2 \ '
 *    /___/  .  \___\'  
 *    \   \  0  /   /
 *     \ 5 `---´ 3 /
 *      \ /  4  \ /
 *       `-------´  
 */
Can2D.prototype.makeHexagonSegment = function(p, r, ri, seg) {
	var r2  = R(r  / 2);
	var rc  = R(Can2D.cos6 * r);
	var ri2 = R(ri / 2);
	var ric = R(Can2D.cos6 * ri);
	var px = p.x;
	var py = p.y;
	this.beginPath();
	switch(seg) {
	case 1:
		this.moveTo(px - r2,  py - rc);
		this.lineTo(px + r2,  py - rc);
		this.lineTo(px + ri2, py - ric);
		this.lineTo(px - ri2, py - ric);
		break;
	case 2:
		this.moveTo(px + r2,  py - rc);
		this.lineTo(px + r,   py);
		this.lineTo(px + ri,  py);
		this.lineTo(px + ri2, py - ric);
		break;
	case 3:
		this.moveTo(px + r,   py);
		this.lineTo(px + r2,  py + rc);
		this.lineTo(px + ri2, py + ric);
		this.lineTo(px + ri,  py);
		break;
	case 4:
		this.lineTo(px + r2,  py + rc);
		this.lineTo(px - r2,  py + rc);
		this.lineTo(px - ri2, py + ric);
		this.lineTo(px + ri2, py + ric);
		break;
	case 5:
		this.moveTo(px - r2,  py + rc);
		this.lineTo(px - r,   py);
		this.lineTo(px - ri,  py);
		this.lineTo(px - ri2, py + ric);
		break;
	case 6:
		this.moveTo(px - r,   py);
		this.lineTo(px - r2,  py - rc);
		this.lineTo(px - ri2, py- ric);
		this.lineTo(px - ri,  py);
		break;
	default :
		throw new Error("invalid segment: " + seg);
	}
	this.closePath();
}	

/* returns true if point is in hexagon with radius r */
Can2D.withinHexagon = function(p, r) {
	var rc = r * Can2D.cos6;
	var yh = p.y * Can2D.cos6;
	return	p.y >= -rc && p.y <= rc &&
	        p.x - r < -abs(yh) &&
			p.x + r >  abs(yh);
}

/* returns true if point is in hexagon slice */
Can2D.withinHexagonSlice = function(p, r, h) {
	var w  = r - (r * Can2D.cos6 - h) * Can2D.tan6;
	var rc = r * Can2D.cos6;
	var yh = p.y * Can2D.tan6;
	return p.y >=  -h &&         p.y <= 0 &&
	       p.x >= -yh && p.x - 2 * w <= yh;
}


/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  ,-,-,-.           .
 `,| | |   ,-. ,-. | , ,-. ,-.
   | ; | . ,-| |   |<  |-' |
   '   `-' `-^ '   ' ` `-' '
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
 Marks a position in an element of an item.
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
function Marker() {
	this._item = null;
	this._element = null;
	this._offset = 0;
	this._pli = null;
	this._cli = null;
}

Object.defineProperty(Marker.prototype, "item", {
	get: function() { return this._item; },
	set: function(it) { throw new Error("use set()"); }
});

Object.defineProperty(Marker.prototype, "element", {
	get: function() { return this._element; },
	set: function(e) { throw new Error("use set()"); }
});

Object.defineProperty(Marker.prototype, "offset", {
	get: function() { return this._offset; },
	set: function(o) { this._offset = o; }
});

/* "overloaded" 3-timed
 * set(marker)
 * set(element, offset)
 * set(item, element, offset)
 */
Marker.prototype.set = function(a1, a2, a3) {
	switch (arguments.length) {
	case 1 :
		this._item    = a1._item; 
		this._element = a1._element;
		this._offset  = a1._offset;
		break;
	case 2 :
		this._element = a1;
		this._offset  = a2;
		break;
	case 3 :
		this._item    = a1;
		this._element = a2;
		this._offset  = a3;
		break;
	default :
		throw new Error("wrong # of arguments");
		break;
	}
}

/* returns chunk at x/y */
Marker.prototype._getPinfoAtXY = function(flowbox, x, y) {
	var pinfo = flowbox.pinfo;
	var plen = pinfo.length;
	var li;
	for (li = 0; li < plen; li++) {
		if (y <= pinfo[li].y) {
			break;
		}
	}
	if (li >= plen) {
		li--; /* got to last line if overflow */
	}
	this._pli = li;
	var l = pinfo[li];
	var llen = l.length;
	var c;
	for (var ci = 0; ci < llen; ci++) {
		c = l[ci]; 
		if (x <= c.x + c.w) {
			this._pci = ci;
			return pinfo;
		}
	}
	/* set to last chunk if overflow */
	this._pci = llen - 1;
	return pinfo;
}

/* Gets the point of actual position, relative to dtree */
Marker.prototype.getPoint = function() {
	/* todo cache position */
	var dtree = this._item.dtree;
	Measure.font = dtree.font;
	var e = this._element;
	var t = e.text;
	var p = e.anchestor("paragraph");
	var pinfo = this.getPinfo();
	var l = pinfo[this._pli];
	var c = l[this._pci];
	return new Point( // todo improve if p.x / p.y is a Point
		p.p.x + (c ? c.x + Measure.width(t.substring(c.offset, this._offset)) : l.x),
		p.p.y + l.y - dtree.fontsize);
}
	
/* sets the marker to position closest to x, y from flowbox(para) */
Marker.prototype.setFromPoint = function(flowbox, p) {
	if (flowbox.otype != "paragraph") { throw new Error("invalid flowbox:"+flowbox.otype); }
	var pinfo = this._getPinfoAtXY(flowbox, p.x, p.y);
	var l = pinfo[this._pli];
	var c = l[this._pci]; // x,y is in this chunk
	
	if (!c) {
		/* todo? */
		this._element = flowbox.first;
		this._offset = 0;
		return;
	}
	var dx   = p.x - c.x;
	Measure.font = flowbox.anchestor("dtree").font;
	var t    = c.text;
	var tlen = t.length;
	
	var x1 = 0, x2 = 0;
	var o;
	for(o = 0; o < tlen; o++) {
		x1 = x2;
		x2 = Measure.width(t.substr(0, o));
		if (x2 > dx) {
			break;
		}
	}
	if (dx - x1 <= x2 - dx) o--;
	this._element = c.node;
	this._offset = c.offset + o;
}

/* sets the this.pline and this.pchunk according to the chunk 
 * the marker is in */
Marker.prototype.getPinfo = function() {
	var te = this._element;
	var to = this._offset;
	var para  = te.anchestor("paragraph");
	var pinfo = para.pinfo;
	var bli =  0; /* buffer for line count */
	var bci = -1; /* buffer for chunk count */
	var plen  = pinfo.length;
	for(var li= 0; li < plen; li++) {
		var l = pinfo[li];
		var llen = l.length;
		for(var ci = 0; ci < llen; ci++) {
			var c = l[ci];
			if (c.offset == to) {
				this._pli = li; this._pci = ci;
				return pinfo;
			}
			if (c.offset > to) {
				this._pli = bli; this._pci = bci;
				return pinfo;
			}
			bli = li; bci = ci;
		}
	}
	this._pli = bli; this._pci = bci;
	return pinfo;
}

/* moves the marker a line up (dir == true) or down */
/* returns true if moved */
Marker.prototype.moveUpDown = function(dir) {
	var e  = this._element;
	var o  = this._offset;
	Measure.font = e.anchestor("dtree").font;
	var p  = e.anchestor("paragraph");
	var pinfo = this.getPinfo();
	var li = this._pli;
	var ci = this._pci;
	var l = pinfo[li];
	var c = l[ci];
	var x = c ? c.x + Measure.width(c.text.substr(0, o - c.offset)) : l.x;
	if (dir) {
		if (li == 0) {
			p = p.prev;
			if (!p) return false;
			pinfo = p.pinfo;
			l = pinfo[pinfo.length - 1];
		} else {
			l = pinfo[li - 1];
		}
	} else {
		if (li + 1 >= pinfo.length) {
			p = p.next;
			if (!p) return false;
			pinfo = p.pinfo;
			l = pinfo[0];
		} else {
			l = pinfo[li + 1];
		}	
	}
	var llen = l.length;
	for(ci = 0; ci < llen && x > l[ci].x + l[ci].w; ci++);
	if (ci >= llen) {
		c = l[llen - 1];
		if (c) {
			this._element = c.node;
			this._offset  = c.offset + c.text.length;
		} else {
			this._element = p.first;
			this._offset = 0;
		}
		return true;
	}
	c = l[ci];
	
	var t = c.text;
	var tlen = t.length;
	var x1 = 0, x2 = 0;
	var dx = x - c.x;
	var o;
	for(o = 0; o < tlen; o++) {
		x1 = x2;
		x2 = Measure.width(t.substr(0, o));
		if (x2 > dx) {
			break;
		}
	}
	if (dx - x1 <= x2 - dx) o--;	
	this._element = c.node;
	this._offset  = c.offset + o;
	return true;
}

/* moves the marker a line left (dir == true) or right */
/* returns true if moved */
Marker.prototype.moveLeftRight = function(dir) {
	if (dir) {
		if (this._offset > 0) {
			this._offset--;
		} else {
			var pev = this._element.parent.prev;
			if (!pev) {
				return false;
			}
			var e = this._element = pev.last;
			this._offset = e.text.length;
		}
	} else {
		var t = this._element.text;
		if (this._offset < t.length) {
			this._offset++;
		} else {
			var pnext = this._element.parent.next;
			if (!pnext) {
				return false;
			}
			this._element = pnext.first;
			this._offset = 0;
		}
	}
	return true;
}

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  ,--.             .  
 | `-' ,-. ,-. ,-. |- 
 |   . ,-| |   |-' |  
 `--'  `-^ '   `-' `' 
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
Caret.prototype = new Marker;
Caret.prototype.constructor = Caret;
function Caret() {
	Marker.call(this);
	
	/* true if visible */
	this.shown = false;
	/* true when just blinked away */
	this.blink = false;	
}
	
/* shows the caret or resets the blink timer if already shown */
Caret.prototype.show = function() {
	this.shown = true;
	this.blink = false;
	System.startBlinker();
}
	
/* hides the caret */
Caret.prototype.hide = function() {
	this.shown = false;
	System.stopBlinker();
}

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 .---.     .          .
 \___  ,-. |  ,-. ,-. |- . ,-. ,-.
     \ |-' |  |-' |   |  | | | | |
 `---' `-' `' `-' `-' `' ' `-' ' '
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
function Selection() {
	this.active = false;
	this.mark1 = new Marker();
	this.mark2 = new Marker();
	this.begin = null;
	this.end   = null;
}

/* sets begin/end so begin is before end. */
Selection.prototype.normalize = function() {
	var e1 = this.mark1.element;
	var e2 = this.mark2.element;
	
	if (e1 == e2) {
		if (this.mark1.offset <= this.mark2.offset) {
			this.begin = this.mark1;
			this.end   = this.mark2;
		} else {
			this.begin = this.mark2;
			this.end   = this.mark1;		
		}
		return;
	} 
	
	var pn;
	for (pn = e1.parent.next; pn && pn.first != e2; pn = pn.next);
	
	if (!pn) {
		this.end   = this.mark1;
		this.begin = this.mark2;
	} else {
		this.begin = this.mark1;	
		this.end   = this.mark2;
	}
}

Selection.prototype.innerText = function() {
	if (!this.active) return "";
	this.normalize();
	var be = this.begin.element;
	var bo = this.begin.offset;
	var ee = this.end.element;
	var eo = this.end.offset;
	var bet = be.text;
	if (be == ee) {
		return bet.substring(bo, eo);
	}
	
	var buf = [bet.substring(bo, bet.length)];
	for (var n = be.parent.next.first; n != ee; n = n.parent.next.first) {
		/* ^ todo make multi child compatible */
		if (!n) { throw new Error("selection akward");}
		buf.push('\n');
		buf.push(n.text);
	}
	buf.push('\n');
	buf.push(ee.text.substring(0, eo));
	return buf.join('');
}

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
.-,--.   .   .
 `\__  ,-| . |- ,-. ,-.
  /    | | | |  | | |
 '`--' `-^ ' `' `-' '
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
function Editor() {
	this.caret     = new Caret();
	this.selection = new Selection();
	this.item      = null;
}

/* draws or erases the caret */
Editor.prototype.updateCaret = function() {
	var c2d = System.can2d;
	var caret = this.caret;
	if (caret.save) {
		/* erase the old caret */
		c2d.putImageData(caret.save, caret.sp.x - 1, caret.sp.y - 1);
		caret.save = null;
	} 

	if (caret.shown && !caret.blink) {
		var cp = caret.getPoint();
		var it = caret.item;
		var sy = it.scrolly;
		var sp = caret.sp = System.space.pan.add(
			it.zone.p1.x + cp.x,
			it.zone.p1.y + cp.y - (sy > 0 ? sy : 0));
		var th = R(it.dtree.fontsize * (1 + settings.bottombox));		
		caret.save = c2d.getImageData(sp.x - 1, sp.y - 1, 3, th + 1);
		c2d.fillRect("black", sp.x, sp.y, 1, th);
	}
}

Editor.prototype.newline = function() {
	var caret  = this.caret;
	var ce    = caret.element;
	var co    = caret.offset;			
	var ct    = ce.text;
	/* todo multi node ability */
	var opara = ce.anchestor("paragraph");
		
	ce.text = ct.substring(0, co);
	var npara = new Paragraph(ct.substring(co, ct.length));
	opara.parent.insertBefore(npara, opara.next);
	caret.set(npara.first, 0);
}
	
/* handles a special key */
/* returns true if the element needs to be redrawn. */
Editor.prototype.specialKey = function(item, keycode, shift, ctrl) {
	if (!item) return false;
	var refresh = false;
	var redraw = false;
	var caret  = this.caret;
	var select = this.selection;

	if (ctrl) {
		switch(keycode) {
		case 65 : // ctrl+a
			var pfirst = item.dtree.first;
			select.mark1.set(item, pfirst.first, 0);
			var plast = item.dtree.last;
			select.mark2.set(item, plast.first, plast.first.text.length);
			select.active = true;
			for(var n = pfirst; n; n = n.next) {
				n.listen();
			}
			caret.set(select.mark2);
			System.setInput(select.innerText());
			caret.show();
			return true;
		}
	}
	
	if (!shift && select.active) {
		switch(keycode) {
		case 35 : // end
		case 36 : // pos1
		case 37 : // left
		case 38 : // up
		case 39 : // right
		case 40 : // down		
			this.deselect();
			redraw = true;
			break;
		case  8 : // backspace
		case 46 : // del
			this.deleteSelection();
			redraw = true;
			keycode = 0;
			System.repository.updateItem(item);
			break;
		case 13 : // return
			this.deleteSelection();
			redraw = true;
			break;
		}
	} else if (shift && !select.active) {
		switch(keycode) {
		case 35 : // end
		case 36 : // pos1
		case 37 : // left
		case 38 : // up
		case 39 : // right
		case 40 : // down	
			select.mark1.set(caret);
		}
	}
	
	switch(keycode) {
	case  8 : // backspace
	{
		var co = caret.offset;
		var ce = caret.element;
		if (co > 0) {
			var t = ce.text;
			ce.text = t.substring(0, co - 1) + t.substring(co, t.length);
			caret.offset--;
			redraw = true;
		} else {
			var para = ce.anchestor("paragraph");
			redraw = para.joinToPrevious(ce, caret);
		}
		System.repository.updateItem(item);
		break;
	}
	case 13 : // return
	{
		this.newline();
		redraw = true;
		System.repository.updateItem(item);
		break;
	}
	case 35 : // end
		caret.offset = caret.element.text.length;
		refresh = true;
		break;
	case 36 : // pos1
		caret.offset = 0;
		refresh = true;
		break;
	case 37 : // left
		refresh = caret.moveLeftRight(true);
		break;
	case 38 : // up
		refresh = caret.moveUpDown(true);
		break;
	case 39 : // right
		refresh = caret.moveLeftRight(false);		
		break;
	case 40 : // down
		refresh = caret.moveUpDown(false);
		break;
	case 46 : // del
	{
		var co = caret.offset;
		var ce = caret.element;
		var ct = ce.text;
		if (co < ct.length) {
			ce.text = ct.substring(0, co) + ct.substring(co + 1, ct.length);
			redraw = true;
		} else {
			var para = ce.anchestor("paragraph");
			redraw = para.joinToNext(ce, caret);
		}
		System.repository.updateItem(item);
		break;
	}
	default :
		break;
	}


	if (shift && refresh) {
		switch(keycode) {
		case 35 : // end
		case 36 : // pos1
		case 37 : // left
		case 38 : // up
		case 39 : // right
		case 40 : // down	
			select.active = true;
			select.mark2.set(caret);
			System.setInput(select.innerText());
			/* clear item cache */
			item.listen(); 
			redraw = true;
		}
	}
	
	if (refresh || redraw) {
		caret.show();
	}
	if (refresh && !redraw) {
		this.updateCaret();
	}
	return redraw;
}

/* blinks the caret away or into visiblity */
Editor.prototype.blink = function() {
	if (this.caret.shown) {
		this.caret.blink = !this.caret.blink;
		this.updateCaret();			
	}
}

/* deletes the selection */
Editor.prototype.deleteSelection = function() {
	var select = this.selection;
	select.normalize();
	var b = select.begin;
	var e = select.end;
	var be = b.element;
	var bo = b.offset;
	var ee = e.element;
	var eo = e.offset;
	if (be == ee) {
		var bet = be.text;
		be.text = bet.substring(0, bo) + bet.substring(eo, bet.length);
	} else {
		var eet = ee.text;
		be.text = be.text.substring(0, bo) + eet.substring(eo, eet.length);
		var pn;
		for (pn = be.parent.next; pn.first != ee; pn = pn.next) {
			/* ^ todo make multi child compatible */
			pn.parent.remove(pn);
		}
		pn.parent.remove(pn);
	}
	be.listen();
	this.caret.set(b);
	select.active = false;
	/* setInput("") is done by System */
}

/* clears the selection */
Editor.prototype.deselect = function() {
	if (!this.selection.active) return;
	var item = this.selection.mark1.item;
	this.selection.active = false;
	System.setInput("");
	/* clear item cache */
	item.listen(); 
}

/* got character input from user */
/* returns redraw needs */
Editor.prototype.input = function(item, text) {
	if (!item) return false;
	var caret = this.caret;
	if (this.selection.active) {
		this.deleteSelection();
	}
	var reg = /([^\n]+)(\n?)/g;
	for(var ca = reg.exec(text); ca != null; ca = reg.exec(text)) {
		var line = ca[1];
		var ce = caret.element;
		var co = caret.offset;
		var ct = ce.text;
		ce.text = ct.substring(0, co) + line + ct.substring(co, ct.length);
		this.caret.offset += text.length;
		if (ca[2]) {
			this.newline();
		}
	}
	System.repository.updateItem(item);
	return true;
}
						
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 .---.         .
 \___  . . ,-. |- ,-. ,-,-.
     \ | | `-. |  |-' | | |
 `---' `-| `-' `' `-' ' ' '
~ ~ ~ ~ /|~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
  Base-`-'-system for Meshcraft. 
  All system events arrive here.
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
var System = { 

/* Catches all errors for a function */
makeCatcher : function(that, fun) {
	return function() {
		"use strict";
		if (enableCatcher) {
			try {
				fun.apply(that, arguments);
			} catch(err) {
				alert("Internal failure, " + err.name + ": " + err.message + "\n\n" + 
				      "file: " + err.fileName + "\n" + 
					  "line: " + err.lineNumber + "\n" + 
					  "stack: " + err.stack);
			}
		} else {
			fun.apply(that, arguments);
		}
	};
},

init : function() {
	System.makeCatcher(System, System._init)();
},

_init : function() {
	if (this != System) {
		throw new Error("System has wrong this pointer");
	}
	var canvas = this.canvas = document.getElementById("canvas");
	canvas.width  = window.innerWidth - 1;
	canvas.height = window.innerHeight - 1;
	this.can2d = new Can2D(canvas);
	Measure.init();
	
	/* the space that currently is displayed */
	this.space = null;

	/* if true use browser supported setCapture() call
	 * if false work around */
	var useCapture = canvas.setCapture != null;

	/* mouse state */
	var mst = MST.NONE;
	/* position the mouse went down to atween state */
	var msp = null;
	/* latest mouse position seen in atween state */
	var mmp = null;
	/* latest shift/ctrl key status in atween state */
	var mms = null;
	var mmc = null; 
	/* timer for atween state */
	var atweenTimer = null;

	var editor = this.editor = new Editor();
	
	/* hidden input that forwards all events */
	var hiddenInput = document.getElementById("input");
	
	/* remembers last SpecialKey pressed, to hinder double events.
	 * Opera is behaving stupid here. */
	var lastSpecialKey = -1;
	
	/* a special key is pressed */
	function specialKey(keyCode, shift, ctrl) {
		if (ctrl) {
			switch(keyCode) {
			case 65 : // ctrl+a
				this.space.specialKey(keyCode, shift, ctrl);
				return false;		
			default : 
				return true;
			}
		}
		switch(keyCode) {
		case  8 : // backspace
		case 13 : // return
		case 35 : // end
		case 36 : // pos1
		case 37 : // left
		case 38 : // up
		case 39 : // right
		case 40 : // down
		case 46 : // del
			this.space.specialKey(keyCode, shift, ctrl);
			return false;
		default : 
			return true;
		}
	}

	/* captures all mouseevents event beyond the canvas (for dragging) */ 
	function captureEvents() {
		if (useCapture) {
			canvas.setCapture(canvas);
		} else {
			document.onmouseup   = canvas.onmouseup;
			document.onmousemove = canvas.onmousemove;
		}
	}
	
	/* stops capturing all mouseevents */
	function releaseEvents() {
		if (useCapture) {
			canvas.releaseCapture(canvas);
		} else {
			document.onmouseup = null;
			document.onmousemove = null;
		}
	}
	
	/* the value that is expected to be input.
	 * either nothing or the text selection
	 * if it changes the user did something 
	 */
	var inputval = "";
	
	/*-- Functions the browser calls --*/
	
	/* tests if the hidden input field got data */
	function testinput() {
		var text = hiddenInput.value;
		if (text == inputval) {
			return;
		}
		hiddenInput.value = inputval = "";
		System.space.input(text);
	}
	
	/* do a blink */
	function blink() {
		/* hackish, also look into the hidden input field, 
		 * maybe the user pasted something using the browser menu. */
		testinput();
		editor.blink();
	}
	
	/* key down in hidden input field */
	function onkeydown(event) {
		if (!specialKey.call(this, 
			lastSpecialKey = event.keyCode, event.shiftKey, event.ctrlKey || event.metaKey
		)) event.preventDefault();
	}
		
	/* hidden input key press */
	function onkeypress(event) {
		var ew = event.which;
		var ek = event.keyCode;
		if (((ek > 0 && ek < 32) || ew == 0) && lastSpecialKey != ek) {
			lastSpecialKey = -1;
			return specialKey.call(this, ek, event.shiftKey, event.ctrlKey || event.metaKey);
		}
		lastSpecialKey = -1;
		testinput();
		setTimeout("System.ontestinput();", 0);
		return true;
	}

	/* hidden input key up */
	function onkeyup(event) {
		testinput();
		return true;
	}
	
	/* hidden input lost focus */
	function onblur(event) {
		this.space.systemBlur();
	}

	/* hidden input got focus */
	function onfocus(event) {
		this.space.systemFocus();
	}
		
	/* view window resized */
	function onresize(event) {
		canvas.width  = window.innerWidth - 1;
		canvas.height = window.innerHeight - 1;	
		this.space && this.space.redraw();
	}
	
	/* mouse move event */
	function onmousemove(event) {
		var p = new Point(event.pageX - canvas.offsetLeft, event.pageY - canvas.offsetTop);

		switch(mst) {
		case MST.NONE :
			this.space.mousehover(p);
			return true;
		case MST.ATWEEN :
			var dragbox = settings.dragbox;
			if ((abs(p.x - msp.x) > dragbox) || (abs(p.y - msp.y) > dragbox)) {
				/* moved out of dragbox -> start dragging */
				clearTimeout(atweenTimer);
				atweenTimer = null;
				mst = MST.DRAG;
				this.space.dragstart(msp, event.shiftKey, event.ctrlKey || event.metaKey);
				if (!p.eq(msp)) {
					this.space.dragmove(p, event.shiftKey, event.ctrlKey || event.metaKey);
				}
				captureEvents();
			} else {
				/* saves position for possible atween timeout */
				mmp = p;
				mms = event.shiftKey;
				mmc = event.ctrlKey || event.metaKey;
			}
			return true;
		case MST.DRAG :
			this.space.dragmove(p, event.shiftKey, event.ctrlKey || event.metaKey);
			return true;
		default :
			throw new Error("invalid mst");
		}
	}
	
	/* mouse down event */
	function onmousedown(event) {
		event.preventDefault();
		hiddenInput.focus();
		var p = new Point (event.pageX - canvas.offsetLeft, event.pageY - canvas.offsetTop);
		/* asks the space if it forces this to be a drag or click, or yet unknown */
		mst = this.space.mousedown(p);
		switch(mst) {
		case MST.ATWEEN :
			msp = mmp = p;
			mms = event.shiftKey;
			mmc = event.ctrlKey || event.metaKey;
			atweenTimer = setTimeout("System.onatweentime();", settings.dragtime);
			break;
		case MST.DRAG :
			captureEvents();
			break;
		}	
		return false;
	}

	/* mouse up event */
	function onmouseup(event) {
		event.preventDefault();
		releaseEvents();
		var p = new Point(event.pageX - canvas.offsetLeft, event.pageY - canvas.offsetTop);
		
		switch (mst) {
		case MST.NONE :
			/* console.log("mouse up, without down?"); */
			return false;
		case MST.ATWEEN :
			/* this was a click */
			clearTimeout(atweenTimer);
			atweenTimer = null;
			this.space.click(p, event.shiftKey, event.ctrlKey || event.metaKey);
			mst = MST.NONE;
			return false;
		case MST.DRAG :
			this.space.dragstop(p, event.shiftKey, event.ctrlKey || event.metaKey);
			mst = MST.NONE;
			return false;
		}
	}

	/* mouse down event */
	function onmousewheel(event) {
		var wheel = event.wheelDelta || event.detail;
		wheel = wheel > 0 ? 1 : -1;
		this.space.mousewheel(wheel);
	}
	
	/* timeout after mouse down so dragging starts */
	function onatweentime() {
		if (mst != MST.ATWEEN) {
			console.log("dragTime() in wrong action mode");
			return;
		}
		mst = MST.DRAG;
		atweenTimer = null;
		this.space.dragstart(msp, mms, mmc);
		if (!mmp.eq(msp)) {
			this.space.dragmove(mmp, mms, mmc);
		}
	}
		
	canvas.onmouseup       = this.makeCatcher(this, onmouseup);
	canvas.onmousemove     = this.makeCatcher(this, onmousemove);
	canvas.onmousedown     = this.makeCatcher(this, onmousedown);
	canvas.onmousewheel    = this.makeCatcher(this, onmousewheel);
	canvas.addEventListener('DOMMouseScroll', canvas.onmousewheel, false); // Firefox.
	window.onresize        = this.makeCatcher(this, onresize);
	hiddenInput.onfocus    = this.makeCatcher(this, onfocus);
	hiddenInput.onblur     = this.makeCatcher(this, onblur);
	hiddenInput.onkeydown  = this.makeCatcher(this, onkeydown);
	hiddenInput.onkeypress = this.makeCatcher(this, onkeypress);
	hiddenInput.onkeyup    = this.makeCatcher(this, onkeyup);
	this.ontestinput       = this.makeCatcher(this, testinput);
	this.onatweentime      = this.makeCatcher(this, onatweentime);
	this.onblink           = this.makeCatcher(this, blink);
		
	/* sets the mouse cursor */
	this.setCursor = function(cursor) {
		canvas.style.cursor = cursor;
	}		
	
	/*-- Meshcraft System calls --*/
	
	/* sets the input (text selection) */
	this.setInput = function(text) {	
		hiddenInput.value = inputval = text;
		if (text != "") {
			hiddenInput.selectionStart = 0;
			hiddenInput.selectionEnd = text.length;			
		}
	}
		
	/* the blink (and check input) timer */
	var blinkTimer = null;
	
	/* (re)starts the blink timer */
	this.startBlinker = function() {
		if (blinkTimer) {
			clearInterval(blinkTimer);
		} 
		testinput();
		blinkTimer = setInterval("System.onblink()", settings.caretBlinkSpeed);		
	}
	
	/* stops the blink timer */
	this.stopBlinker = function() {
		if (blinkTimer) {
			clearInterval(blinkTimer);
		} 		
	}

	this.repository = new Repository();
	var space = this.space = new Space();
	this.startBlinker();
	/* hinders init to be called another time */
	delete this.init; 
	delete this._init;
	System.repository.loadLocalStorage();	
	System.space.redraw();
}};
	
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  ,-_/,.
 ' |_|/ ,-. . , ,-,-. ,-. ,-. . .
  /| |  |-'  X  | | | |-' | | | |
  `' `' `-' ' ` ' ' ' `-' ' ' `-^
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
		   r |------>| 
          ri |->.    '
         .------'.   '      -1
		/ \  1  / \	 '
	   / 6 .---.'2 \ '
	  /___/  .  \___\'  
	  \   \  0  /   /
	   \ 5 `---´ 3 /
 	    \ /  4  \ /
         `-------´  
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
function Hexmenu(r, ri, labels) {
	this.p  = null;
	this.r  = r;
	this.ri = ri;
	this.labels = labels;
	this.mousepos = -1;
}

Hexmenu.prototype.set = function(p) {
	this.p = p;
	this.mousepos = 0;
}

Hexmenu.prototype.draw = function() {
	var c2d = System.can2d;
	var p  = this.p;
	var r  = this.r;
	var ri = this.ri;
	
	var grad = c2d.createRadialGradient(p, 0, p, (r + ri) / 2);
	grad.addColorStop(0, settings.floatMenuBackground1);
	grad.addColorStop(1, settings.floatMenuBackground2);
	c2d.makeHexagon(p, r);
	c2d.fill(grad);

	if (this.mousepos > 0) {
		c2d.makeHexagonSegment(p, r, ri, this.mousepos);
		c2d.fill(settings.floatMenuFillStyle);
	}
	
	c2d.makeHexagonFlower(p, r, ri, this.labels, false);	
	if (settings.floatMenuInnerBorderWidth > 0) {
		c2d.stroke(settings.floatMenuInnerBorderWidth, settings.floatMenuInnerBorderColor);
	}
	if (settings.floatMenuOuterBorderWidth > 0) {
		c2d.stroke(settings.floatMenuOuterBorderWidth, settings.floatMenuOuterBorderColor);
	}	

	c2d.fontStyle("12px " + settings.defaultFont, "black", "center", "middle");
	var labels = this.labels;
	var llen = labels.length;
	
	var dist = r / 3.5;
	switch (llen) {
	default:
	case 7: // segment 6
		c2d.fillRotateText(labels[6], this.p, Math.PI / 3 * 5, r - dist);
		/* fall */
	case 6: // segment 5
		c2d.fillRotateText(labels[5], this.p, Math.PI / 3 * 4, r - dist);
		/* fall */
	case 5: // segment 4
		c2d.fillRotateText(labels[4], this.p, Math.PI / 3 * 3, r - dist);
		/* fall */
	case 4: // segment 3
		c2d.fillRotateText(labels[3], this.p, Math.PI / 3 * 2, r - dist);
		/* fall */
	case 3: // segment 2
		c2d.fillRotateText(labels[2], this.p, Math.PI / 3 * 1, r - dist);
		/* fall */
	case 2: // segment 1
		c2d.fillRotateText(labels[1], this.p, Math.PI / 3 * 6, r - dist);
		/* fall */
	case 1: // segment 0
		c2d.fillText(labels[0], this.p);
		/* fall */
	case 0: // nothing 
	}
}

Hexmenu.prototype._getMousepos = function(p) {
	var dp = p.sub(this.p);
	if (!Can2D.withinHexagon(dp, this.r)) {
		/* out of menu */
		return this.mousepos = -1;
	} else if (Can2D.withinHexagon(dp, this.ri)) {
		return this.mousepos = 0;
	} else {
		var lor = dp.x <= -dp.y * Can2D.tan6; // left of right diagonal
		var rol = dp.x >=  dp.y * Can2D.tan6; // right of left diagonal
		var aom = dp.y <= 0;                  // above of middle line
		if (lor && rol)        return this.mousepos = 1;
		else if (!lor && aom)  return this.mousepos = 2;
		else if (rol && !aom)  return this.mousepos = 3;
		else if (!rol && !lor) return this.mousepos = 4;
		else if (lor && !aom)  return this.mousepos = 5;
		else if (!rol && aom)  return this.mousepos = 6;
		else return this.mousepos = 0;
	}
}

/* returns true if this.mousepos has changed */
Hexmenu.prototype.mousehover = function(p) {
	var omp = this.mousepos;
	return omp != this._getMousepos(p);
}

Hexmenu.prototype.mousedown = function(p) {
	return this._getMousepos(p);
}

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
.-,--.   .
 `\__  ,-| ,-. ,-. ,-,-. ,-. ,-. . .
  /    | | | | |-' | | | |-' | | | |
 '`--' `-^ `-| `-' ' ' ' `-' ' ' `-^
~ ~ ~ ~ ~ ~ ,|~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
  The menu  `' at the screen edge.
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
function Edgemenu() {
	this.mousepos = -1;
	this.width  = 160;
	this.bwidth = 70;
	this.height = 30;
}

Edgemenu.prototype._stroke = function(c2d) {
	if (settings.edgeMenuInnerBorderWidth > 0) {
		c2d.stroke(settings.edgeMenuInnerBorderWidth, settings.edgeMenuInnerBorderColor);
	}
	if (settings.edgeMenuOuterBorderWidth > 0) {
		c2d.stroke(settings.edgeMenuOuterBorderWidth, settings.edgeMenuOuterBorderColor);
	}
}

Edgemenu.prototype.draw = function(x, y) {
	var c2d = System.can2d;
	var x = R(c2d.width / 2);
	var y = c2d.height;
	var w = this.width;
	var bw = this.bwidth;
	var h =  this.height;
	var ew = R(h * Can2D.tan6);
	var xl = x - w - ew;
	var xr = x + w + ew;
	
	c2d.beginPath();
	c2d.moveTo(xl, y);
	c2d.lineTo(x - w, y - h);
	c2d.lineTo(x + w, y - h);
	c2d.lineTo(xr, y);
	var grad = c2d.createLinearGradient(0, y - h, 0, y);
	grad.addColorStop(0, settings.edgeMenuBackground1);
	grad.addColorStop(1, settings.edgeMenuBackground2);
	c2d.fill(grad);
	c2d.moveTo(xl + bw, y - h);
	c2d.lineTo(xl + bw + ew, y);
	c2d.moveTo(xr - bw, y - h);
	c2d.lineTo(xr - bw - ew, y);
	this._stroke(c2d);
		
	switch(this.mousepos) {
	case 0 :
		c2d.beginPath();
		c2d.moveTo(xl + bw + ew, y);
		c2d.lineTo(xl + bw, y - h);
		c2d.lineTo(xr - bw, y - h);
		c2d.lineTo(xr - bw - ew, y);
		c2d.fill(settings.edgeMenuFillStyle);
		this._stroke(c2d);
		break;
	case 1 :
		c2d.beginPath();
		c2d.moveTo(xl, y);
		c2d.lineTo(x - w, y - h);
		c2d.lineTo(xl + bw, y - h);
		c2d.lineTo(xl + bw + ew, y);
		c2d.fill(settings.edgeMenuFillStyle);
		this._stroke(c2d);
		break;
	case 2 :
		c2d.beginPath();
		c2d.moveTo(xr - bw - ew, y);
		c2d.lineTo(xr - bw, y - h);
		c2d.lineTo(x + w, y - h);
		c2d.lineTo(xr, y);
		c2d.fill(settings.edgeMenuFillStyle);
		this._stroke(c2d);
		break;
	}

	c2d.fontStyle("12px " + settings.defaultFont, "black", "center", "middle");
	c2d.fillText("Meshcraft Demospace", x, y - R(h / 2));
	c2d.fillText("Export", xl + R((bw + ew) / 2), y - R(h / 2));
	c2d.fillText("Import", xr - R((bw + ew) / 2), y - R(h / 2));
}

Edgemenu.prototype._getMousepos = function(p) {
	var canvas = System.canvas;
	var h  = this.height;
	var ty = canvas.height;
	if (p.y < ty - h) return this.mousepos = -1;
	var tx = R(canvas.width / 2) + 0.5;
	var w  = this.width;
	var bw = this.bwidth;
	var ew = R(h * Can2D.tan6);
	var xl = tx - w - ew;
	var xr = tx + w + ew;
	if ((p.x - xl <= -(p.y - ty) * Can2D.tan6))             return this.mousepos = -1;
	if ((p.x - xr >=  (p.y - ty) * Can2D.tan6))             return this.mousepos = -1;
	if ((p.x - (xl + bw + ew) <=  (p.y - ty) * Can2D.tan6)) return this.mousepos =  1;
	if ((p.x - (xr - bw - ew) >= -(p.y - ty) * Can2D.tan6)) return this.mousepos =  2;
	return this.mousepos = 0;
}

/* returns true if this.mousepos has changed*/
Edgemenu.prototype.mousehover = function(p) {	
	var omp = this.mousepos;
	return omp != this._getMousepos(p);
}

Edgemenu.prototype.mousedown = function(x, y) {
	return this._getMousepos(x, y);
}

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  ,--.         .         .
 | `-' ,-. ,-. | , ,-. . |-
 |   . | | |   |<  | | | |
 `--'  `-' `-' ' ` |-' ' `'
                   |
                   '
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
 The unmoving interface.      
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
function Cockpit() {


}		
		
		
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
.---.                 
\___  ,-. ,-. ,-. ,-. 
    \ | | ,-| |   |-' 
`---' |-' `-^ `-' `-' 
~ ~ ~ | ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
 The  '  place     
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
function Space() {
	this._floatmenu = new Hexmenu(settings.floatMenuOuterRadius, settings.floatMenuInnerRadius,
		["new", "Note", "Label"]);
	this._itemmenu = new Hexmenu(settings.itemMenuOuterRadius, settings.itemMenuInnerRadius,
		["", "Remove"])
	this.edgemenu = new Edgemenu();
	
	this.iaction = {
		act : ACT.NONE,
	};
	
	/* panning offset */
	this.can2d = new Can2D(System.canvas);
	this.pan = new Point(0, 0);
	this.can2d.pan = this.pan;
	
	this.zoom = 1;
}

/* redraws the complete space */
Space.prototype.redraw = function() {
	var items = System.repository.items;
	var zidx  = System.repository.zidx;
	var editor = System.editor;
	var canvas = System.canvas;
	var c2d = this.can2d;
	editor.caret.save = null;
	var c2d = this.can2d;
	this.selection = editor.selection;
	this.canvas = System.canvas;
	c2d.attune();

	for(var i = zidx.length - 1; i >= 0; i--) {
		var it = items[zidx[i]]; // todo shorten
		it.draw(this);
	}
	if (this.focus) this.focus.drawHandles(this);
	
	var ia = this.iaction;
	switch(ia.act) {
	case ACT.FMENU :
		this._floatmenu.draw();
		break;
	case ACT.IMENU :
		this._itemmenu.draw();
		break;
	case ACT.RBIND :
		if (ia.item2) {
			Arrow.create(ia.item, ia.item2).draw(this, null);
			ia.item2.highlight(c2d);
		} else {
			Arrow.create(ia.item, ia.smp).draw(this, null);
		}
	}
	this.edgemenu.draw();
	editor.updateCaret();
}

/* user pressed a special key */
Space.prototype.specialKey = function(keyCode, shift, ctrl) {
	var rv = System.editor.specialKey(this.focus, keyCode, shift, ctrl);
	if (rv) {
		this.redraw();
	}
}

/* user entered normal text (one character or more) */
Space.prototype.input = function(text) {
	if (System.editor.input(this.focus, text)) {
		this.redraw();		
	}
}

/* the canvas/space got focus from the system*/
Space.prototype.systemFocus = function() {
	if (!this.focus) {
		return
	}
	System.editor.caret.show();
	System.editor.updateCaret();
}

/* the canvas/space lost system focus */
Space.prototype.systemBlur = function() {
	System.editor.caret.hide();
}

/* sets the focussed item or loses it if null*/
Space.prototype.setFoci = function(item) {
	this.focus = item;
	var caret = System.editor.caret;
	if (item) {
		caret.set(item, item.dtree.first.first, 0);
		caret.show();
	} else {
		caret.hide();
		caret.set(null, null, null);
	}
}

/* mouse hover */
Space.prototype.mousehover = function(p) {
	var pp = p.sub(this.pan);
	var com = null;
	var editor = System.editor;
	var redraw = this.edgemenu.mousehover(p);
	if (this.edgemenu.mousepos >= 0) {
		/* mouse floated on edge menu, no need to look further */
		System.setCursor("default");
		if (redraw) this.redraw();
		return;
	}
	
	switch(this.iaction.act) {
	case ACT.FMENU :
		redraw = redraw || this._floatmenu.mousehover(p);
		if (this._floatmenu.mousepos >= 0) {
			/* mouse floated on float menu, no need to look further */
			System.setCursor("default");
			if (redraw) this.redraw();
			return;
		}
		break;
	case ACT.IMENU :
		redraw = redraw || this._itemmenu.mousehover(p);
		if (this._itemmenu.mousepos >= 0) {
			/* mouse floated on item menu, no need to look further */
			System.setCursor("default");
			if (redraw) this.redraw();
			return;
		}
		break;	
	}

	if (this.focus) {
		/* todo move into items */
		if (this.focus.withinItemMenu(pp)) {
			System.setCursor("pointer");
			if (redraw) this.redraw();
			return;
		}

		if ((com = this.focus.checkItemCompass(pp))) {
			System.setCursor(com + "-resize");
			if (redraw) this.redraw();
			return;
		}
	}

	/* todo remove nulls by shiftKey, ctrlKey */
	var tx = System.repository.transfix(TXE.HOVER, this, pp, null, null);
	redraw = redraw || (tx & TXR.REDRAW);
	if (!(tx & TXR.HIT)) { System.setCursor("crosshair");} 
	if (redraw) this.redraw();
}

/* starts creating a new relation */
Space.prototype.actionSpawnRelation = function(item, p) {
	var ia = this.iaction;
	ia.act = ACT.RBIND;
	ia.item = item;
	ia.sp = ia.smp = p;
	System.setCursor("not-allowed");
}

/* starts a scrolling action */
Space.prototype.actionScrollY = function(item, scrollY, startY) {
	var ia  = this.iaction;
	ia.act  = ACT.SCROLLY;
	ia.item = item;
	ia.sy   = scrollY;
	ia.ssy  = startY;
}

/* starts dragging an item */
Space.prototype.actionIDrag = function(item, sp) {
	var ia  = this.iaction;
	ia.act  = ACT.IDRAG;
	ia.item = item;
	ia.sp   = sp;
	System.setCursor("move");
}

Space.prototype.actionRBindTo = function(toItem) {
	if (toItem.id === this.iaction.item.id) {
		console.log("not binding to itself");
		System.setCursor("default");
		return;
	}
	var rel = new Relation(null, null, this.iaction.item.id, toItem.id);
	rel.dtree.append(new Paragraph("relates to"));
	System.repository.updateItem(rel);
}

Space.prototype.actionRBindHover = function(toItem) {
	if (toItem.id === this.iaction.item.id) {
		System.setCursor("not-allowed");
		return;
	}
	System.setCursor("default");
	this.iaction.item2 = toItem;
}


/* starts an operation with the mouse held down */
Space.prototype.dragstart = function(p, shift, ctrl) {
	var pp = p.sub(this.pan);
	var editor  = System.editor;
	var iaction = this.iaction;
	
	if (this.focus && this.focus.withinItemMenu(pp)) {
		this.actionSpawnRelation(this.focus, pp);
		this.redraw();
		return;
	} 

	var tfx = System.repository.transfix(TXE.DRAGSTART, this, pp, shift, ctrl);
	if (!(tfx & TXR.HIT)) {
		/* panning */
		iaction.act = ACT.PAN;
		iaction.sp = pp;
		System.setCursor("crosshair");
		return;
	} 
	if (tfx & TXR.REDRAW) this.redraw();
}

/* a click is a mouse down followed within dragtime by 'mouseup' and
 * not having moved out of 'dragbox'. */
Space.prototype.click = function(p, shift, ctrl) {
	var pp = p.sub(this.pan);

	var focus = this.focus;
	if (focus && focus.withinItemMenu(pp)) {
		focus.setItemMenu(this._itemmenu, this.pan);
		this.iaction.act = ACT.IMENU;
		this.redraw();
		return;
	}

	var tfx = System.repository.transfix(TXE.CLICK, this, pp, shift, ctrl);
	if (!(tfx & TXR.HIT)) {
		this.iaction.act = ACT.FMENU;
		this._floatmenu.set(p);
		System.setCursor("default");
		this.setFoci(null);
		this.redraw();
		return;
	}
	if (tfx & TXR.REDRAW) this.redraw();
}

/* stops an operation with the mouse held down */
Space.prototype.dragstop = function(p, shift, ctrl) {
	var pp = p.sub(this.pan);
	var editor = System.editor;
	var iaction = this.iaction;
	var redraw = false;
	switch (iaction.act) {
	case ACT.IDRAG :
		var w = iaction.item.zone.w;
		var h = iaction.item.zone.h;
		iaction.item.moveto(pp.sub(iaction.sp));
		System.repository.updateItem(iaction.item);
		iaction.item = null;
		System.setCursor("default");
		redraw = true;
		break;
	case ACT.PAN :
		break;
	case ACT.IRESIZE :
		iaction.com  = null;
		iaction.item = null;		
		iaction.sip  = null;
		iaction.siz  = null;
		break;
	case ACT.SCROLLY :
		iaction.ssy  = null;
		break;
	case ACT.RBIND :
		iaction.smp = null;
		System.repository.transfix(TXE.RBINDTO, this, pp, shift, ctrl);
		redraw = true;
		break;
	default :
		throw new Error("Invalid action in 'Space.dragstop'");
	}
	iaction.act = ACT.NONE;
	iaction.sp  = null;
	if (redraw) this.redraw();
	return;
}

/* moving during an operation with the mouse held down */
Space.prototype.dragmove = function(p, shift, ctrl) {
	var pp = p.sub(this.pan);
	var iaction = this.iaction;
	var redraw = false;
	
	switch(iaction.act) {
	case ACT.PAN :
		this.pan = this.can2d.pan = p.sub(iaction.sp);
		System.repository.savePan(this.pan);
		this.redraw();
		return;
	case ACT.IDRAG :
		iaction.item.moveto(pp.sub(iaction.sp));
		System.repository.updateItem(iaction.item);
		this.redraw();
		return;
	case ACT.IRESIZE :
	{
		// todo no splitup
		var p1 = iaction.siz.p1;
		var p2 = iaction.siz.p2;
		var it = iaction.item;
		switch (iaction.com) {
		case "e"  : 
		case "ne" :
		case "se" :
			p2 = new Point(max(p2.x + p.x - iaction.sp.x, p1.x), p2.y);
			break;
		case "w"  :
		case "nw" :
		case "sw" :	
			p1 = new Point(min(p1.x + p.x - iaction.sp.x, p1.x), p1.y);
			break;
		}
		switch (iaction.com) {
		case "s"  : 
		case "sw" :
		case "se" :
			p2 = new Point(p2.x, max(p2.y + p.y - iaction.sp.y, p1.y));
			break;
		case "n"  : 
		case "nw" :
		case "ne" :
			p1 = new Point(p1.x, min(p1.y + p.y - iaction.sp.y, p2.y));	
			break;
		}
		redraw = it.setZone(new Rect(p1, p2), iaction.com); 
		
		/* adapt scrollbar position, todo x move into item */
		var dtreeHeight = it.dtree.height;
		var smaxy = dtreeHeight - ((it.zone.w) - 2 * it.textBorder);
		if (smaxy > 0 && it.scrolly > smaxy) {
			it.scrolly = smaxy;
			redraw = true;;
		}
		if (redraw) this.redraw();
		System.repository.updateItem(iaction.item);
		return;
	}
	case ACT.SCROLLY:
	{
		var dy = pp.y - iaction.sy;
		var it = iaction.item;
		var h = it.zone.h;
		var scrollRange = h - settings.scrollbarMarginY * 2;
		var dtreeHeight = it.dtree.height;
		var innerHeight = h - 2 * it.textBorder;
		var scrollSize  = scrollRange * innerHeight / dtreeHeight;
		var srad = settings.scrollbarRadius;
		if (scrollSize < srad * 2) {
			/* minimum size of scrollbar */
			scrollSize = srad * 2;
		}		
		var sy = iaction.ssy + 
			dy * (dtreeHeight - innerHeight) / (scrollRange - scrollSize);
		var smaxy = dtreeHeight - innerHeight;
		if (sy < 0) {
			sy = 0;
		} else if (sy > smaxy) {
			sy = smaxy;
		}

		it.scrolly = sy;
		this.redraw();
		return true;		
	}
	case ACT.RBIND :
		iaction.item2 = null;
		System.repository.transfix(TXE.RBINDHOVER, this, pp, shift, ctrl);
		iaction.smp = pp;
		this.redraw();
		return true;
	default :
		throw new Error("unknown action code in Space.dragging: "+iaction.act);
	}
}

/* shows the export dialog */
Space.prototype._exportDialog = function() {
	var div = document.createElement("div");
	div.style.position = "absolute";
	div.style.width    = "100%";
	div.style.height   = "100%";
	div.style.top      = 0;
	div.style.left     = 0;
	div.style.zIndex   = 10;
	div.style.background = "rgba(248, 237, 105, 0.9)";
	div.style.overflow   = "auto";
	document.body.appendChild(div);
	var label = document.createElement("div");
	label.style.width = "100%";
	label.style.textAlign = "center";
	label.style.marginTop = "20px";
	label.style.fontWeight = "bold";
	label.appendChild(document.createTextNode(
		"Copy/paste this to a text file (e.g.notepad) and save it there."
	));
	div.appendChild(label);
	var label2 = document.createElement("div");
	label2.style.width = "100%";
	label2.style.textAlign = "center";
	label2.appendChild(document.createTextNode(
		"Sorry for this, current browsers do not yet allow file creation for offline repositories.")
	);
	div.appendChild(label2);
	var ta = document.createElement("textarea");
	ta.style.width =  "90%";
	ta.style.height = (div.offsetHeight - label.offsetHeight - 150) + "px";
	ta.style.display = "block";
	ta.style.marginLeft = "auto";
	ta.style.marginRight = "auto";
	ta.style.marginTop = "20px";
	ta.value = System.repository.exportToJString();
	ta.readOnly = true;

	div.appendChild(ta);
	div.appendChild(document.createElement("br"));
	var button = document.createElement("button");
	button.appendChild(document.createTextNode("Dismiss"));
	button.style.width  = "100px";			
	button.style.height = "30px";
	button.style.display = "block";
	button.style.marginLeft = "auto";
	button.style.marginRight = "auto";
	button.onclick = function() {
		document.body.removeChild(div);
	}
	div.appendChild(button);
}

/* shows the export dialog */
Space.prototype._importDialog = function() {
	var div = document.createElement("div");
	div.style.position = "absolute";
	div.style.width    = "100%";
	div.style.height   = "100%";
	div.style.top      = 0;
	div.style.left     = 0;
	div.style.zIndex   = 10;
	div.style.background = "rgba(248, 237, 105, 0.9)";
	div.style.overflow   = "auto";
	document.body.appendChild(div);
	var label = document.createElement("div");
	label.style.width = "100%";
	label.style.textAlign = "center";
	label.style.marginTop = "20px";
	label.style.fontWeight = "bold";
	label.appendChild(document.createTextNode("Warning. Current Repository will be erased!"));
	var label2 = document.createElement("div");
	label2.style.width = "100%";
	label2.style.textAlign = "center";
	label2.appendChild(document.createTextNode(
		"Paste the repository save in the textbox and press 'Import'."
	));
	div.appendChild(label);
	div.appendChild(label2);
	var ta = document.createElement("textarea");
	ta.style.width =  "90%";
	ta.style.height = (div.offsetHeight - label.offsetHeight - 150) + "px";
	ta.style.display = "block";
	ta.style.marginLeft = "auto";
	ta.style.marginRight = "auto";
	ta.style.marginTop = "20px";
	div.appendChild(ta);
	div.appendChild(document.createElement("br"));
	
	var bd = document.createElement("div");
	bd.style.display = "block";
	bd.style.width = "100%";
	div.appendChild(bd);
	var bdl = document.createElement("div");
	bdl.style.width = "50%";
	bdl.style.cssFloat = "left";
	bd.appendChild(bdl);
	var bdr = document.createElement("div");
	bdr.style.width = "50%";
	bdr.style.cssFloat = "left";
	bd.appendChild(bdr);
	
	var okb = document.createElement("button");
	okb.appendChild(document.createTextNode("Import"));
	okb.style.width  = "100px";			
	okb.style.height = "30px";
	okb.style.marginRight = "20px";
	okb.style.cssFloat  = "right";
	var space = this;
	okb.onclick = function() {
		System.repository.importFromJString(ta.value);
		document.body.removeChild(div);
		space.redraw();
	}
	bdl.appendChild(okb);

	var okc = document.createElement("button");
	okc.appendChild(document.createTextNode("Cancel"));
	okc.style.width  = "100px";			
	okc.style.height = "30px";
	okc.style.marginLeft = "20px";
	okc.style.cssFloat  = "left";
	okc.onclick = function() {
		document.body.removeChild(div);
	}
	bdr.appendChild(okc);
}

/* shows the export dialog */
Space.prototype._revertDialog = function() {
	var div = document.createElement("div");
	div.style.position = "absolute";
	div.style.width    = "100%";
	div.style.height   = "100%";
	div.style.top      = 0;
	div.style.left     = 0;
	div.style.zIndex   = 10;
	div.style.background = "rgba(248, 237, 105, 0.9)";
	div.style.overflow   = "auto";
	document.body.appendChild(div);
	var label = document.createElement("div");
	label.style.width = "100%";
	label.style.textAlign = "center";
	label.style.marginTop = "20px";
	label.style.fontWeight = "bold";
	label.appendChild(document.createTextNode("Warning. Current Repository will be erased!"));
	var label2 = document.createElement("div");
	label2.style.width = "100%";
	label2.style.textAlign = "center";
	label2.appendChild(document.createTextNode("Revert to default demo state?"));
	div.appendChild(label);
	div.appendChild(label2);
	div.appendChild(document.createElement("br"));
	div.appendChild(document.createElement("br"));
	div.appendChild(document.createElement("br"));
	div.appendChild(document.createElement("br"));
	var bd = document.createElement("div");
	bd.style.display = "block";
	bd.style.width = "100%";
	div.appendChild(bd);
	var bdl = document.createElement("div");
	bdl.style.width = "50%";
	bdl.style.cssFloat = "left";
	bd.appendChild(bdl);
	var bdr = document.createElement("div");
	bdr.style.width = "50%";
	bdr.style.cssFloat = "left";
	bd.appendChild(bdr);
	
	var okb = document.createElement("button");
	okb.appendChild(document.createTextNode("Revert"));
	okb.style.width  = "100px";			
	okb.style.height = "30px";
	okb.style.marginRight = "20px";
	okb.style.cssFloat  = "right";
	var space = this;
	okb.onclick = function() {
		System.repository.importFromJString(demoRepository);
		document.body.removeChild(div);
		space.redraw();
	}
	bdl.appendChild(okb);

	var okc = document.createElement("button");
	okc.appendChild(document.createTextNode("Cancel"));
	okc.style.width  = "100px";			
	okc.style.height = "30px";
	okc.style.marginLeft = "20px";
	okc.style.cssFloat  = "left";
	okc.onclick = function() {
		document.body.removeChild(div);
	}
	bdr.appendChild(okc);
}


/* mouse down event */
Space.prototype.mousedown = function(p) {
	var pp = p.sub(this.pan);
	var iaction = this.iaction;
	var editor = System.editor;
	var redraw = false;

	var md = this.edgemenu.mousedown(p);
	if (md >= 0) {
		iaction.act = ACT.NONE;
		redraw = true;
		switch(md) {
		case 0:
			this._revertDialog();
			break;
		case 1:
			this._exportDialog();
			break;
		case 2:
			this._importDialog();
			break;
		}
		if (redraw) this.redraw();
		return MST.NONE;
	}
	
	switch (iaction.act) {
	case ACT.FMENU :
		var md = this._floatmenu.mousedown(p);
		iaction.act = ACT.NONE;
		var fm = this._floatmenu;
		if (md < 0) {
			break;
		}
		switch(md) {
		case 1 : // note
			var nw = settings.newNoteWidth;
			var nh = settings.newNoteHeight;
			// todo, beautify point logic.
			var p1 = fm.p.sub(R(nw / 2) + this.pan.x, R(nh / 2) + this.pan.y);
			var p2 = p1.add(nw, nh);
			var note = new Note(null, null, new Rect( p1, p2));
			this.setFoci(note);
			break;
		case 2 : // label
			var label = new Label(null, null, fm.p.sub(this.pan));
			label.moveto(label.zone.p1.sub(R(label.zone.w / 2), R(label.zone.h / 2)));
			this.setFoci(label);
			break;
		}
		this.redraw();
		return MST.NONE;
	case ACT.IMENU :
		var md = this._itemmenu.mousedown(p);
		iaction.act = ACT.NONE;
		redraw = true;
		if (md >= 0) {
			switch(md) {
			case 1:
				System.repository.removeItem(this.focus);
				this.setFoci(null);
				break;
			}
			if (redraw) this.redraw();
			return MST.NONE;
		}
		break;
	}
	
	if (this.focus) {
		if (this.focus && this.focus.withinItemMenu(p)) {
			if (redraw) this.redraw();
			return MST.ATWEEN;
		}
		var com;
		if ((com = this.focus.checkItemCompass(pp))) {
			/* resizing */
			iaction.act  = ACT.IRESIZE;
			iaction.com  = com;
			iaction.item = this.focus;
			iaction.sp   = p;
			iaction.siz  = this.focus.zone;
			System.setCursor(com + "-resize");
			if (redraw) this.redraw();
			return MST.DRAG;
		}
	}
	
	if (redraw) this.redraw();
	return MST.ATWEEN;
}

Space.prototype.mousewheel = function(wheel) {
	if (wheel > 0) {
		this.zoom *= 1.1;
	} else {
		this.zoom /= 1.1;
	}
	if (abs(this.zoom - 1) < 0.0001) {
		this.zoom = 1;
	}
}

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ,--,--'                    .
 `- | ,-. ,-. ,-. ,-. ,-. ,-| ,-.
  , | |   |-' |-' | | | | | | |-'
  `-' '   `-' `-' ' ' `-' `-^ `-'
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
 Part of a tree-structure.
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
function Treenode(otype) {
	this.otype = otype;
}

/* appends tnode to list of children */
Treenode.prototype.append = function(tnode) {
	if (tnode.parent) {
		throw new Error("append() on a node already part of a tree");
	}
	tnode.parent = this;
	if (!this.last) {
		this.first = this.last = tnode;
		tnode.prev = tnode.next = null;
	} else {
		this.last.next = tnode;
		tnode.prev = this.last;
		this.last = tnode;
		tnode.next = null;
	}
	this.listen();
}

/* default pass to parent */
Treenode.prototype.listen = function() {
	if (this.parent) this.parent.listen();
}

/* inserts tnode before child bnode */
Treenode.prototype.insertBefore = function(tnode, bnode) {
	if (!bnode) {
		this.append(tnode);
		return
	}
	
	if (tnode.parent) {
		throw new Error("Treenode.append() on a node already part of a tree");
	}
	tnode.parent = this;
	
	if (bnode == this.first) {
		this.first.prev = tnode;
		tnode.next = this.first;
		this.first = tnode;
		tnode.prev = null;
	}
	
	tnode.next = bnode;
	tnode.prev = bnode.prev;
	bnode.prev.next = tnode;
	bnode.prev = tnode;
	this.listen();
}

/* removes child tnode */
Treenode.prototype.remove = function(tnode) {
	if (tnode == this.first) this.first = tnode.next;
	if (tnode == this.last) this.last = tnode.prev;
	if (tnode.next) tnode.next.prev = tnode.prev;
	if (tnode.prev) tnode.prev.next = tnode.next;
	tnode.parent = null;
	this.listen();
}

/* returns first anchestor of 'type' */
Treenode.prototype.anchestor = function(otype) {
	var n;
	for(n = this; n && n.otype != otype; n = n.parent);
	if (!n) throw new Error("anchestor not there");
	return n;
}

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ,--,--'      .            .
 `- | ,-. . , |- ,-. ,-. ,-| ,-.
  , | |-'  X  |  | | | | | | |-'
  `-' `-' ' ` `' ' ' `-' `-^ `-'
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
Textnode.prototype = new Treenode;
Textnode.prototype.constructor = Textnode;
function Textnode(text)
{
	Treenode.call(this, "text");
	this._text = text ? text : "";
}

Object.defineProperty(Textnode.prototype, "text", {
	get: function() { 
		return this._text;
	},
	
	set: function(text) {
		if (this._text != text) {
			this._text = text;
			this.listen();
		}
	}
});

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 .-,--.                             .
  '|__/ ,-. ,-. ,-. ,-. ,-. ,-. ,-. |-.
  ,|    ,-| |   ,-| | | |   ,-| | | | |
  `'    `-^ '   `-^ `-| '   `-^ |-' ' '
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~,| ~ ~ ~ ~ | ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
                     `'         '
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
Paragraph.prototype = new Treenode;
Paragraph.prototype.constructor = Paragraph;
function Paragraph(text)
{
	Treenode.call(this, "paragraph");
	this._pcan2d = new Can2D(0 ,0);
	this._canvasActual = false; // todo rename
	this.append(new Textnode(text));
	this._flowWidth = null;	
	this.p = null;
}

/* (re)flows the Paragraph, positioning all chunks  */
Paragraph.prototype._flow = function() {
	if (this._flowActual) {
		return;
	}

	/* build position informations */
	this._flowActual = true;
	var pinfo = this._pinfo = [];
	var flowWidth = this._flowWidth;
	var width = 0;
	var dtree = this.anchestor("dtree");
	/* canvas is needed for font measurement */
	var fontsize = dtree.fontsize;
	var x = 0;
	var y = fontsize;	
	Measure.font = dtree.font;
	var space = Measure.width(" ");
	var pline = 0;
	{
		var l = pinfo[pline] = [];
		l.x = x;
		l.y = y;
	}

	for(var node = this.first; node; node = node.next) {
		var t = node.text;
		var pchunk = 0;
		//var reg = !dtree.pre ? (/(\s*\S+)\s?(\s*)/g) : (/(.+)()$/g);
		/* also match only spaces, todo check if more performance if hand coding exception */
		var reg = !dtree.pre ? (/(\s*\S+|\s+$)\s?(\s*)/g) : (/(.+)()$/g);
		var stol = true; /* at start of line */
		for(var ca = reg.exec(t); ca != null; ca = reg.exec(t)) {
			/* text is a word plus hard spaces */
			var text = ca[1] + ca[2];
			var w = Measure.width(text);
			if (flowWidth > 0 && x + w + space > flowWidth) {
				if (!stol) {
					/* soft break */
					if (x > width) {
						/* stores maximum width used */
						width = x;
					}
					x = 0;
					y += R(dtree.fontsize * (dtree.pre ? 1 : 1 + settings.bottombox));
					pline++;
					{
						var l = pinfo[pline] = [];
						l.x = x;
						l.y = y;
						pchunk = 0;
					}
					stol = true;
				} else {
					/* horizontal overflow */
				}
			}
			pinfo[pline][pchunk++] = {
				x: x, 
				w: w,
				node: node,
				offset: ca.index, 
				text: text,
			};
			x += w + space;
			stol = false;
		}
		if (x > width) {
			/* stores maximum width used */
			width = x;
		}
	}
	/* stores metrics */
	/* logical height (excluding letters bottombox) */
	this._softHeight = y;
	this._width = width;
}

Object.defineProperty(Paragraph.prototype, "x", {
	get: function() { 
		throw new Error(":("); 
	},
	set: function() { 
		throw new Error(":("); 
	},
});

Object.defineProperty(Paragraph.prototype, "y", {
	get: function() { 
		throw new Error(":("); 
	},
	set: function() { 
		throw new Error(":("); 
	},
});

/* returns the logical height 
 * (without addition of box below last line base line ofr gpq etc.) */
Object.defineProperty(Paragraph.prototype, "softHeight", {
	get: function() { 
		this._flow();
		return this._softHeight;
	},
	set: function(s) { throw new Error("Cannot set paragraph softHeight."); }
});

Object.defineProperty(Paragraph.prototype, "width", {
	get: function() { 
		this._flow();
		return this._width;f
	},
	set: function(s) { throw new Error("Cannot set paragraph width."); }
});

/* returns the computes size of the paragraph */
Object.defineProperty(Paragraph.prototype, "height", {
	get: function() { 
		this._flow();
		var dtree = this.anchestor("dtree");
		return this._softHeight + R(dtree.fontsize * settings.bottombox);
	},
	set: function(s) { throw new Error("Cannot set paragraph height."); }
});

/* return the position information arrays for all chunks */
Object.defineProperty(Paragraph.prototype, "pinfo", {
	get: function() { 
		this._flow();
		return this._pinfo;
	},
	set: function(s) { throw new Error("Cannot set pinfo");	}
});

Object.defineProperty(Paragraph.prototype, "flowWidth", {
	get: function() { 
		return this._flowWidth;
	},
	set: function(fw) {
		if (this._flowWidth != fw) {
			this._flowWidth = fw;
			this._flowActual = false;
			this._canvasActual = false;
		}
	}
});

/* draws the paragraph in its cache and returns it */
Paragraph.prototype.getCan2D = function() {
	var c2d = this._pcan2d;
	if (this._canvasActual) {
		return c2d;
	}
	this._flow();
	this._canvasActual = true;
			
	/* todo: work out exact height for text below baseline */
	/* set the canvas height */
	var dtree = this.anchestor("dtree");
	c2d.attune(this);
	c2d.fontStyle(dtree.font, "black", "start", "alphabetic");
	
	/* draws text into the canvas */
	var pinfo = this._pinfo;
	var plines = pinfo.length;
	for(var il = 0; il < plines; il++) {
		var pl = pinfo[il];
		var plen = pl.length;
		for(var ic = 0; ic < plen; ic++) {
			var pc = pl[ic];
			c2d.fillText(pc.text, pc.x, pl.y);
		}
	}
	return c2d;
}
		
/* drops the canvas cache (cause something has changed */
Paragraph.prototype.listen = function() {
	this._flowActual   = false;
	this._canvasActual = false;
	if (this.parent) this.parent.listen();
}

/* join a child node to its next sibling, 
 * or joins this paragraph to its next sibling */
 /* todo, this doesnt belong here */
Paragraph.prototype.joinToNext = function(node, caret) {
	var next = node.next;
	if (next) {
		alert("joinToNext, not yet implemented");
	}
	var nextPara = this.next;
	if (nextPara == null) {
		/* end of document */
		return false;
	}
	node.text = node.text + nextPara.first.text;
	/* todo take over siblings */
	this.parent.remove(nextPara);
	return true;
}
	
/* join a child node to its previous sibling, 
 * or joins this paragraph to its previos sibling */
Paragraph.prototype.joinToPrevious = function(node, caret) {
	var prev = node.prev;
	if (prev) {
		alert("joinToPrevious, not yet implemented");
	}
	var prevPara = this.prev;
	if (prevPara == null) {
		return false;
	}
	var nt = node.text;
	var plc = prevPara.last;
	if (caret) {
		caret.set(plc, plc.text.length);
	}
	plc.text = plc.text + nt; 
	this.parent.remove(this);
	return true;
}
	
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 .-,--.  ,--,--'
 ' |   \ `- | ,-. ,-. ,-.
 , |   /  , | |   |-' |-'
 `-^--'   `-' '   `-' `-'
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
 A document with nodes in tree structure.
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
DTree.prototype = new Treenode;
DTree.prototype.constructor = DTree;
/* constructor
 * DTree(js, parent)
 * Dtree(null, parent, fontsize)
 */
function DTree(js, parent, fontsize) {
	Treenode.call(this, "dtree");
	
	/* json import */
	if (js) {
		var d = js.d;
		var dlen = d.length;
		for(var i = 0; i < dlen; i++) {
			this.append(new Paragraph(d[i]));
		}
		this._fontsize = js.fs || 13;
	} else {
		this._fontsize = fontsize || 13;
	}
	this.parent = parent;
}

Object.defineProperty(DTree.prototype, "font", {
	get: function() { 
		return this._fontsize + 'px ' + settings.defaultFont;
	},
	set: function() { throw new Error("Cannot set font. Set fontsize/fontface"); }
});

/* turns the document tree into an object for JSON stringify */
DTree.prototype.jsonfy = function() {
	var js = {fs : this._fontsize, d: []};
	var d = js.d;
	for (var n = this.first; n; n = n.next) {
		d.push(n.first.text);
	}
	return js;
}
		
/* returns the chunk at x,y xxx*/
DTree.prototype.paraAtP = function(p) {
	var para = this.first;
	while (para && p.y > para.p.y + para.softHeight) {
		para = para.next;
	}
	return para;
}

/* draws the content in a buffer canvas */
/* acanvas  ... canvas to draw upon */
/* todo rename */
DTree.prototype.draw = function(c2d, select, offsetX, offsetY, scrolly) { 
	var y = offsetY;
	var pi = 0;
	var h = 0;
	var parasep = this.pre ? 0 : this._fontsize;

	/* draws the selection */
	if (select.active && select.mark1.item == this.parent) {
		/* todo make part of selection to use shortcut with XY */
		var b = select.mark1;
		var e = select.mark2;
		var bp = b.getPoint();
		var ep = e.getPoint();
		if (ep.y < bp.y || (ep.y == bp.y && ep.x < bp.x)) {
			b = select.mark2;
			e = select.mark1;
			{ var _ = bp; bp = ep; ep = _; }
		}
			
		c2d.beginPath();
		var psy = scrolly >= 0 ? scrolly : 0;
		var lh = R(this.fontsize * (1 + settings.bottombox));
		var bx = R(bp.x);
		var by = R(bp.y - psy);
		var ex = R(ep.x);
		var ey = R(ep.y - psy);
		var rx = R(this.width + offsetX / 2);
		var lx = R(offsetX / 2);
		if ((abs(by - ey) < 2)) {
			// ***
			c2d.moveTo(bx, by);
			c2d.lineTo(bx, by + lh);
			c2d.lineTo(ex, ey + lh);
			c2d.lineTo(ex, ey);
			c2d.lineTo(bx, by);
			c2d.stroke(1, settings.selectionStroke);
			c2d.fill(settings.selectionColor);
		} else if (abs(by + lh - ey) < 2 && (bx >= ex))  {
			//      ***
			// ***
			c2d.moveTo(rx, by + lh);
			c2d.lineTo(bx, by + lh);
			c2d.lineTo(bx, by);
			c2d.lineTo(rx, by);
			
			c2d.moveTo(lx, ey);
			c2d.lineTo(ex, ey);
			c2d.lineTo(ex, ey + lh);
			c2d.lineTo(lx, ey + lh);
			c2d.stroke(1, settings.selectionStroke);
			c2d.fill(settings.selectionColor);
		} else {
			//    *****
			// *****
			for(var i = 0; i < 2; i++) {
				c2d.beginPath();
				var edge = i ? c2d.moveTo : c2d.lineTo;
				c2d.moveTo(rx, ey);
				c2d.lineTo(ex, ey);
				c2d.lineTo(ex, ey + lh);
				c2d.lineTo(lx, ey + lh);
				edge.call(c2d, lx, by + lh);
				c2d.lineTo(bx, by + lh);
				c2d.lineTo(bx, by);
				c2d.lineTo(rx, by);
				edge.call(c2d, rx, ey);
				if (i) {
					c2d.stroke(1, settings.selectionStroke); 
				} else {
					c2d.fill(settings.selectionColor);
				}
			}
		}
	}
	
	/* draws tha paragraphs */
	for(var para = this.first; para; para = para.next) {
		var pc2d = para.getCan2D();
		para.p = new Point(offsetX, y);
		if (pc2d.width > 0 && pc2d.height > 0) {
			c2d.drawImage(pc2d, offsetX, y - scrolly);
		}
		y += para.softHeight + parasep;
	}
}

/* Overloads Treenodes append to set the paragraph width */
DTree.prototype.append = function(tnode) {
	if (this._flowWidth) {
		tnode.flowWidth = this._flowWidth;
	}
	return Treenode.prototype.append.call(this, tnode);
}


/* Overloads Treenodes insertBefore to set the paragraph width */
DTree.prototype.insertBefore = function(tnode, bnode) {
	if (this._flowWidth && bnode) { 
		/* if not bnode append will be called */
		tnode.flowWidth = this._flowWidth;
	}
	return Treenode.prototype.insertBefore.call(this, tnode, bnode);
}

Object.defineProperty(DTree.prototype, "fontsize", {
	get: function() { return this._fontsize; },
	set: function(fs) {
		if (this._fonsize == fs) return;
		this._fontsize = fs; 
		for(var para = this.first; para; para = para.next) {
			para.listen();
		}
	}
});

Object.defineProperty(DTree.prototype, "flowWidth", {
	get: function() { return this._flowWidth; },
	set: function(fw) {
		if (this._flowWidth == fw) return;
		this._flowWidth = fw;
		for(var para = this.first; para; para = para.next) {
			para.flowWidth = fw;
		}
	}
});

Object.defineProperty(DTree.prototype, "width", {
	get: function() { 
		/* todo caching */
		var w = 0;
		for(var para = this.first; para; para = para.next) {
			if (para.width > w) w = para.width;
		}
		return w;
	},
	set: function(width) { throw new Error("Cannot set width of DTree"); }
});

Object.defineProperty(DTree.prototype, "height", {
	get: function() { 
		/* todo caching */
		var h = 0;
		var parasep = this.pre ? 0 : this._fontsize;
		var first = true;
		for(var para = this.first; para; para = para.next) {
			if (!first) h += parasep; else first = false;
			h += para.softHeight;
		}
		return h;
	},
	set: function(width) { throw new Error("Cannot set height of DTree"); }
});

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ,-_/ .
 '  | |- ,-. ,-,-.
 .^ | |  |-' | | |
 `--' `' `-' ' ' '
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ 
 Something on a canvas.
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
function Item(otype, id) {
	this.otype = otype;
	this.id = id;
}

/* set a hex menu to be this items menu */
Item.prototype.setItemMenu = function(menu, pan) {
	var r = settings.itemMenuInnerRadius;
	var h = settings.itemMenuSliceHeight;
	menu.set(new Point(
		R(this.zone.p1.x + pan.x + r - (r * Can2D.cos6 - h) * Can2D.tan6), 
		R(this.zone.p1.y + pan.y + r * Can2D.cos6 - h) - 1));
}

/* returns if coords are within the item menu */
Item.prototype.withinItemMenu = function(p) {
	return Can2D.withinHexagonSlice(p.sub(this.zone.p1), 
		settings.itemMenuInnerRadius, 
		settings.itemMenuSliceHeight);
}

/* returns the compass of the resize handles of an item 
 * 
 * rhs .. bitwise resize handle selector:
 * 
 * 128  1  2
 *  64     4
 *  32 16  8
 */
Item.prototype._checkItemCompass = function(p, rhs) { 
	if (rhs == 0) return;
	var d  = settings.handleSize;         // inner distance
	var d2 = settings.handleSize * 3 / 4; // outer distance
	
	var n = p.y >= this.zone.p1.y - d2 && p.y <= this.zone.p1.y + d;
	var e = p.x >= this.zone.p2.x - d  && p.x <= this.zone.p2.x + d2;
	var s = p.y >= this.zone.p2.y - d  && p.y <= this.zone.p2.y + d2;
	var w = p.x >= this.zone.p1.x - d2 && p.x <= this.zone.p1.x + d;	

	if (n) {
		if (w && rhs & 128) { 
			return "nw";
		} else if (e && rhs & 2) {
			return "ne";
		} else if (rhs & 1) {
			var mx = this.zone.mx;
			if (p.x >= mx - d && p.x <= mx + d) {
				return "n";
			}
		}
	} else if (s) {
		if (w && rhs & 32) {
			return "sw";
		} else if (e && rhs & 8) {
			return "se";
		} else if (rhs & 16) {
			var mx = this.zone.mx;
			if (p.x >= mx - d && p.x <= mx + d) {
				return "s";
			}
		}
	} else if (w && rhs & 64) {
		var my = this.zone.my;
		if (p.y >= my - d && p.y <= my + d) {
			return "w";
		}
	} else if (e && rhs & 4) {
		var my = this.zone.my;
		if (p.y >= my - d && p.y <= my + d) {
			return "e";
		}
	}
	return null;
}

/* draws the edit handles of an item (resize, itemmenu) */
/* rhs ... resize  handles selector */
Item.prototype._drawHandles = function(space, rhs) {
	var c2d = space.can2d;
	var ds = settings.handleDistance; 			
	var hs = settings.handleSize;
	var hs2 = hs / 2;
			
	var x1 = this.zone.p1.x - ds;
	var y1 = this.zone.p1.y - ds;
	var x2 = this.zone.p2.x + ds;
	var y2 = this.zone.p2.y + ds;
	var xm = R((x1 + x2) / 2);
	var ym = R((y1 + y2) / 2);
	
	c2d.beginPath(); 
	if (rhs &   1) { c2d.moveTo(xm - hs2, y1); c2d.lineTo(xm + hs2, y1);                    }
	if (rhs &   2) { c2d.moveTo(x2 - hs,  y1); c2d.lineTo(x2, y1); c2d.lineTo(x2, y1 + hs); }
	if (rhs &   4) { c2d.moveTo(x2, ym - hs2); c2d.lineTo(x2, ym + hs2);                    }
	if (rhs &   8) { c2d.moveTo(x2, y2 - hs);  c2d.lineTo(x2, y2); c2d.lineTo(x2 - hs, y2); }
	if (rhs &  16) { c2d.moveTo(xm - hs2, y2); c2d.lineTo(xm + hs2, y2);                    }
	if (rhs &  32) { c2d.moveTo(x1 + hs, y2);  c2d.lineTo(x1, y2); c2d.lineTo(x1, y2 - hs); }
	if (rhs &  64) { c2d.moveTo(x1, ym - hs2); c2d.lineTo(x1, ym + hs2);                    }
	if (rhs & 128) { c2d.moveTo(x1, y1 + hs);  c2d.lineTo(x1, y1); c2d.lineTo(x1 + hs, y1); }
			
	if (rhs > 0 && settings.handleWidth1 > 0) {
		c2d.stroke(settings.handleWidth1, settings.handleColor1);
	}
	if (rhs > 0 && settings.handleWidth2 > 0) {
		c2d.stroke(settings.handleWidth2, settings.handleColor2);
	}
	
	/* draws item menu handler */
	// todo
	var p1 = this.zone.p1;
	var pm = c2d.makeHexagonSlice(p1,settings.itemMenuInnerRadius, settings.itemMenuSliceHeight);
	var grad = c2d.createLinearGradient(
		0, p1.y - settings.itemMenuSliceHeight - 1, 
		0, p1.y - settings.itemMenuSliceHeight + settings.itemMenuInnerRadius * Can2D.cos6
	);
	grad.addColorStop(0, settings.itemMenuBackground1);
	grad.addColorStop(1, settings.itemMenuBackground2);	
	c2d.fill(grad);
	
	// todo make this more elegent?
	if (settings.itemMenuInnerBorderWidth > 0) {
		var style;
		if (settings.itemMenuInnerBorderColor2) {
			grad.addColorStop(0, settings.itemMenuInnerBorderColor1);
			grad.addColorStop(1, settings.itemMenuInnerBorderColor2);	
			style = grad;
		} else {
			style = settings.itemMenuInnerBorderColor1;
		}
		c2d.stroke(settings.itemMenuInnerBorderWidth, style);
	}
			
	if (settings.itemMenuOuterBorderWidth > 0) {
		c2d.makeHexagonSlice(p1.x - 1, p1.y, 
			settings.itemMenuInnerRadius + 1, settings.itemMenuSliceHeight + 1);
		var style;
		if (settings.itemMenuOuterBorderColor2) {
			grad.addColorStop(0, settings.itemMenuOuterBorderColor1);
			grad.addColorStop(1, settings.itemMenuOuterBorderColor2);	
			style = grad;
		} else {
			style = settings.itemMenuOuterBorderColor1;
		}
		c2d.stroke(settings.itemMenuOuterBorderWidth, style);
	}
}


/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ,-,-.       .      
 ` | |   ,-. |- ,-. 
   | |-. | | |  |-' 
  ,' `-' `-' `' `-' 
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
 An item with text and a scrollbar.
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
Note.prototype = new Item;
Note.prototype.constructor = Note;

/* constructor
 * Note(json, [id])  or
 * Note(null, [id], zone) 
 *
 * zone ... of type Rect, reference kept, so new() on call.
 */
function Note(js, id, zone) {
	if (js) {
		this.zone = Rect.jnew(js.z);
		this.dtree = new DTree(js.d, this);
	} else {
		this.zone = zone;
		this.dtree  = new DTree(null, this);
	}
	Item.call(this, "note", id);
	this._bcan2d = new Can2D();
	this.textBorder = settings.noteTextBorder;
	this._canvasActual = false;
	this._scrollx = -8833;
	this._scrolly = -8833;
	if (!this.dtree.first) {
		this.dtree.append(new Paragraph(""));
	}
	/* todo, don't add here */
	System.repository.addItem(this, true);
}

/* called when item is removed */
Note.prototype.removed = function() {
	/* nothing */
}

/* highlets the note. */		
Note.prototype.highlight = function(c2d) {
	c2d.beginPath();
	c2d.rect(this.zone);
	c2d.stroke(3, "rgba(255, 183, 15, 0.5)"); // todo settings
}

/* turns the note into a string */
Note.prototype.jsonfy = function() {
	var js = {
	     t : "note",
		 z : this.zone.jsonfy(),
		 d  : this.dtree.jsonfy(),
	}
	return js;
}

/* returns the para at y */
Note.prototype.paraAtP = function(p) {
	if (p.y < this.textBorder) {
		return null;
	}
	return this.dtree.paraAtP(p);
}

/* drops the cached canvas */
Note.prototype.listen = function() {
	this._canvasActual = false;
	/* end of chain */
}
	
/* checks if this items reacts on an event 
 * returns transfix code
 */
Note.prototype.transfix = function(txe, space, p, z, shift, ctrl) {
	if (!this.zone.within(p)) return 0;
	switch (txe) {
	case TXE.HOVER : 
		System.setCursor("default");
		return TXR.HIT;
	case TXE.DRAGSTART :
		var txr = TXR.HIT;
		if (ctrl) {
			space.actionSpawnRelation(this, p);
			return txr | TXR.REDRAW;
		}
		if (z > 0) {
			System.repository.moveToTop(z);
			txr |= TXR.REDRAW; /* todo full redraw */
		}
		if (space.focus != this) {
			space.setFoci(this);
			txr |= TXR.REDRAW;
		}

		var srad = settings.scrollbarRadius;
		var sbmx = settings.scrollbarMarginX;
		if (this.scrolly >= 0 && abs(p.x - this.zone.p2.x + srad + sbmx) <= srad + 1)  {
			space.actionScrollY(this, p.y, this.scrolly);
		} else {
			/* todo pointify */
			space.actionIDrag(this, p.sub(this.zone.p1));
		}
		return txr;
	case TXE.CLICK :
		var txr = TXR.HIT;
		if (z > 0) {
			System.repository.moveToTop(z);
			txr |= TXR.REDRAW; /* todo full redraw */
		}
		if (space.focus != this) {
			space.setFoci(this);
			txr |= TXR.REDRAW;
		}

		var op = new Point(
			p.x - this.zone.p1.x, 
			p.y - this.zone.p1.y + (this.scrolly > 0 ? this.scrolly : 0));
		var para = this.paraAtP(op);
		if (para) {
			var editor = System.editor;
			editor.caret.setFromPoint(para, op.sub(para.p));
			editor.caret.show();
			editor.deselect();
			txr |= TXR.REDRAW;
		}
		return txr;
	case TXE.RBINDHOVER :
		space.actionRBindHover(this);
		return TXR.HIT | TXR.REDRAW;
	case TXE.RBINDTO :
		space.actionRBindTo(this);
		return TXR.HIT | TXR.REDRAW;
	default :
		throw new Error("Unknown transfix code:" + txe);
	}
}

/* sets the notes position and size
 * the note does not have to accept the full zone.
 * e.g. it will refuse to go below minimum size.
 * returns true if something changed
 */
Note.prototype.setZone = function(zone, align) {
	if (zone.w < settings.noteMinWidth || zone.h < settings.noteMinHeight) {
		zone = zone.resize(
			max(zone.w, settings.noteMinWidth),
			max(zone.h, settings.noteMinHeight), align);
	}
	if (this.zone.eq(zone)) return false;
	this.zone = zone;
	this._canvasActual = false;
	return true;
}

/* sets new position retaining height */
/* rename to moveto */
Note.prototype.moveto = function(p) {
	if (this.zone.p1.eq(p)) return false;
	this.zone = this.zone.atpos(p);
	return this;
}

/* returns or set the vertical scroll position */
Object.defineProperty(Note.prototype, "scrolly", {
	get: function() { 
		return this._scrolly;
	},
	
	set: function(sy) {
		if (sy < 0 && sy != -8833) {
			throw new Error("Invalid scrolly position");
		}
		if (this._scrolly != sy) {
			this._scrolly = sy;
			this._canvasActual = false;
		}
	}
});

/* draws the items handles */
Note.prototype.drawHandles = function(space) {
	return this._drawHandles(space, 255);
}

/* returns which handle the point might be floating over */
/* todo rename */
Note.prototype.checkItemCompass = function(p) { 
	return this._checkItemCompass(p, 255);
}

/* draws a bevel.
 *
 * c2d  ... canvas 2d
 * zone ... zone to zake the size from.
 */
function Note_bevel(c2d, zone, border, radius) {
	var x1 = border;
	var y1 = border;
	var x2 = zone.w - border;
	var y2 = zone.h - border;
	c2d.beginPath();
	c2d.moveTo(x1 + radius, y1);
	c2d.arc(x2 - radius, y1 + radius, radius, -Math.PI / 2, 0, false);
	c2d.arc(x2 - radius, y2 - radius, radius, 0, Math.PI / 2, false);
	c2d.arc(x1 + radius, y2 - radius, radius, Math.PI / 2, Math.PI, false);
	c2d.arc(x1 + radius, y1 + radius, radius, Math.PI, -Math.PI / 2, false);
}
	
/* draws the item.
 *
 * space   to draw 
 */
Note.prototype.draw = function(space) {
	var bc2d = this._bcan2d;
	var dtree   = this.dtree;
	if (this._canvasActual) {
		/* buffer hit */
		space.can2d.drawImage(bc2d, this.zone.p1);
		return;
	}

	bc2d.attune(this.zone);
	Note_bevel(bc2d, this.zone, 2, 3); // todo
	var grad = bc2d.createLinearGradient(0, 0, this.zone.w / 10, this.zone.h);
	grad.addColorStop(0, settings.noteBackground1);
	grad.addColorStop(1, settings.noteBackground2);
	bc2d.fill(grad);
	
	/* calculates if a scrollbar is needed */
	var sy = this._scrolly;
	var innerHeight = this.zone.h - 2 * this.textBorder;
	dtree.flowWidth = 
		this.zone.w - 2 * this.textBorder - (sy >= 0 ? settings.scrollbarRadius * 2 : 0);
	var dtreeHeight = dtree.height;
	if (sy < 0) {
		if (dtreeHeight > innerHeight) {
			/* does not use a scrollbar but should */
			sy = this._scrolly = 0;		
			dtree.flowWidth = 
				this.zone.w - 2 * this.textBorder - (sy >= 0 ? settings.scrollbarRadius * 2 : 0);
			dtreeHeight = dtree.height;
			if (dtreeHeight <= innerHeight) {
				throw new Error("note doesnt fit with and without scrollbar.");			
			}
		}
	} else if (dtreeHeight <= innerHeight) {
		/* uses a scrollbar but should */
		sy = this._scrolly = -8833;
		dtree.flowWidth = this.zone.w - 2 * this.textBorder - (sy >= 0 ? settings.scrollbarRadius * 2 : 0);
		dtreeHeight = dtree.height;
		if (dtreeHeight > innerHeight) {
			throw new Error("note doesnt fit with and without scrollbar.");			
		}
	}
	
	/* draws selection and text */	
	dtree.draw(bc2d, space.selection, this.textBorder, this.textBorder, sy < 0 ? 0 : R(sy));
	
	if (sy >= 0) {
		/* draws the vertical scroll bar */
	
		var srad   = settings.scrollbarRadius;
		var srad05 = R(settings.scrollbarRadius * 0.5);
		var spx  = this.zone.w - settings.scrollbarMarginX - srad;
		var scrollRange = this.zone.h - settings.scrollbarMarginY * 2;
		var scrollSize  = scrollRange * innerHeight / dtreeHeight;
		if (scrollSize < srad * 2) {
			/* minimum size of scrollbar */
			scrollSize = srad * 2;
		}
						
		var spy = R(settings.scrollbarMarginY + 
			sy / (dtreeHeight - innerHeight) * (scrollRange - scrollSize));
		
		switch (settings.scrollbarForm) {
		case 'round' :
			bc2d.beginPath();
			bc2d.arc(spx, spy + srad, srad, Math.PI, 0, false);
			bc2d.arc(spx, spy + scrollSize - srad, srad, 0, Math.PI, false);
			bc2d.closePath();
			bc2d.fill(settings.scrollbarFillStyle);
			bc2d.stroke(settings.scrollbarLineWidth, settings.scrollbarStrokeStyle);
			break;
		case 'square' :
			bc2d.fillRect(settings.scrollbarFillStyle, spx, spy, srad + 2, scrollSize);
			break;
		case 'hexagonh' :
			bc2d.beginPath();
			bc2d.moveTo(spx - srad,   R(spy + Can2D.cos6 * srad));
			bc2d.lineTo(spx - srad05, spy);
			bc2d.lineTo(spx + srad05, spy);
			bc2d.lineTo(spx + srad,   R(spy + Can2D.cos6 * srad));
			bc2d.lineTo(spx + srad,   R(spy + scrollSize - Can2D.cos6 * srad));
			bc2d.lineTo(spx + srad05, R(spy + scrollSize));
			bc2d.lineTo(spx - srad05, R(spy + scrollSize));
			bc2d.lineTo(spx - srad,   R(spy + scrollSize - Can2D.cos6 * srad));
			bc2d.closePath();
			bc2d.fill(settings.scrollbarFillStyle);
			bc2d.stroke(settings.scrollbarLineWidth, settings.scrollbarStrokeStyle);
			break;
		case 'hexagonv' :
			bc2d.beginPath();
			bc2d.moveTo(spx - srad, R(spy + Can2D.cos6 * srad));
			bc2d.lineTo(spx           , spy);
			bc2d.lineTo(spx + srad, spy + Can2D.cos6 * srad);
			bc2d.lineTo(spx + srad, R(spy + scrollSize - Can2D.cos6 * srad));
			bc2d.lineTo(spx           , R(spy + scrollSize));
			bc2d.closePath();
			bc2d.lineTo(spx - srad, R(spy + scrollSize - Can2D.cos6 * srad));
			bc2d.fill(settings.scrollbarFillStyle);
			bc2d.stroke(settings.scrollbarLineWidth, settings.scrollbarStrokeStyle);
			break;
		default :
			throw new Error("invalid settings.scrollbarForm");
		}
	}

	/* draws the border */
	Note_bevel(bc2d, this.zone, 2, settings.noteInnerRadius); // todo moveto can2d
	bc2d.stroke(settings.noteInnerBorderWidth, settings.noteInnerBorderColor);	
	Note_bevel(bc2d, this.zone, 1, settings.noteOuterRadius);
	bc2d.stroke(settings.noteOuterBorderWidth, settings.noteOuterBorderColor); 
	bc2d.beginPath();
	this._canvasActual = true;
	space.can2d.drawImage(bc2d, this.zone.p1);
}

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  ,       .       .  
  )   ,-. |-. ,-. |  
 /    ,-| | | |-' |  
 `--' `-^ ^-' `-' `' 
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
 An sizeable item with sizing text 
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
Label.prototype = new Item;
Label.prototype.constructor = Note;

/* constructor
 * Label(js, [id])  or
 * Label(null, [id], p1) 
 *
 * todo make creation as Rect.
 */
function Label(js, id, p1) {
	if (js) {
		this.zone = Rect.jnew(js.z);
		this.dtree = new DTree(js.d, this);
	} else {
		this.zone = new Rect(p1, p1.add(100, 50));
		this.dtree = new DTree(null, this, 20);
	}
	Item.call(this, "label", id);
	if (!this.dtree.first) this.dtree.append(new Paragraph("Label"));
	/* buffer canvas 2D */
	this._bc2d = new Can2D();  
	this._canvasActual = false;  // todo rename
	if (typeof(this.zone.p2.x) === "undefined")  {
		throw new Error("Invalid label");
		//this.zone = new Rect(this.zone.p1, this.zone.p1.add(this.dtree.width, this.dtree.height));
	}
	System.repository.addItem(this, true);
}

/* called when item is removed */
Label.prototype.removed = function() {
	/* nothing */
}

/* An event happened at p.
 * returns transfix code.
 */
Label.prototype.transfix = function(txe, space, p, z, shift, ctrl) {
	if (!this.zone.within(p)) return 0;
	switch(txe) {
	case TXE.HOVER :
		System.setCursor("default");
		return TXR.HIT;
	case TXE.DRAGSTART :
		var txr = TXR.HIT;
		if (ctrl) {
			space.actionSpawnRelation(this, p);
			return txr | TXR.REDRAW;
		}
		if (z > 0) {
			System.repository.moveToTop(z);
			txr |= TXR.REDRAW; /* todo full redraw */
		}
		if (space.focus != this) {
			space.setFoci(this);
			txr |= TXR.REDRAW;
		}

		space.actionIDrag(this, p.sub(this.zone.p1));
		return txr;
	case TXR.CLICK: 
		var txr = TXR.HIT;
		if (z > 0) {
			System.repository.moveToTop(z);
			txr |= TXR.REDRAW; /* todo full redraw */
		}
		if (space.focus != this) {
			space.setFoci(this);
			txr |= TXR.REDRAW;
		}
		var op = p.sub(this.zone.p1);
		var para = this.paraAtP(op);
		if (para) {
			var editor = System.editor;
			editor.caret.setFromPoint(para, op.sub(para.p));
			editor.caret.show();
			editor.deselect();
			txr |= TXR.REDRAW;
		}
		return txr;	
	case TXE.RBINDHOVER :
		space.actionRBindHover(this);
		return TXR.HIT | TXR.REDRAW;
	case TXE.RBINDTO :
		space.actionRBindTo(this);
		return TXR.HIT | TXR.REDRAW;
	default :
		throw new Error("Unknown transfix code:" + txe);
	}
}

/* highlets the label. */		
Label.prototype.highlight = function(c2d) {
	c2d.beginPath();
	c2d.rect(this.zone);
	c2d.stroke(3, "rgba(255, 183, 15, 0.5)"); // todo settings
}

/* turns the label into a string */
Label.prototype.jsonfy = function() {
	var js = {
	    t: "label",
		z: this.zone.jsonfy(),
		d: this.dtree.jsonfy(),
	}
	return js;
}

/* sets the zone the label is 
 * also determines fontsize indirectly 
 * returns true if something changed 
 *
 * zone  ... a rectangle
 * align ... compass point
 */
Label.prototype.setZone = function(zone, align) {
	if (this.zone.eq(zone)) return false;
	var dtree = this.dtree;
	var zh = zone.h;
	var th = R(this.dtree.height * (1 + settings.bottombox));
	var dfs = dtree.fontsize;
	var fs = max(dfs * zh / th, 8);
	if (dfs === fs) return false;
	dtree.fontsize = fs;
	dtree.flowWidth = -1;
	th = R(this.dtree.height * (1 + settings.bottombox));
	if (align === "sw" || align === "w" || align === "nw") {
		/* align right */
		this.zone = new Rect(zone.p2.add(-this.dtree.width, -th), zone.p2);
	} else {
		/* align left */
		this.zone = new Rect(zone.p1, zone.p1.add(this.dtree.width, th));
	}
	this._canvasActual = false;
	return true;
}

/* sets new position retaining height */
Label.prototype.moveto = function(p) {
	if (this.zone.p1.eq(p)) return false;
	this.zone = this.zone.atpos(p);
	return this;
}

/* returns the para at y */
Label.prototype.paraAtP = function(p) {
	return this.dtree.paraAtP(p);
}

/* drops the cached canvas */
Label.prototype.listen = function() {
	this._canvasActual = false;
	this.zone = this.zone.resize(
		this.dtree.width, 
		R(this.dtree.height * (1 + settings.bottombox)));
	/* end of listen-chain */
}

/* draws the items handles */
Label.prototype.drawHandles = function(space) {
	this._drawHandles(space, 170);
}

Label.prototype.checkItemCompass = function(p, rhs) { 
	return this._checkItemCompass(p, 170);
}

/* draws the item
   space  : to draw upon  */
Label.prototype.draw = function(space) { // todo replace space by space.can2d
	var bc2d = this._bc2d;
	var dtree = this.dtree;
	if (this._canvasActual) {
		/* buffer hit */
		space.can2d.drawImage(bc2d, this.zone.p1);
		return;
	}
	bc2d.attune(this.zone);
	/* draws text */	
	dtree.draw(bc2d, space.selection, 0, 0, 0);
	/* draws the border */
	bc2d.beginPath(); 
	bc2d.rect(0, 0, bc2d.width - 1, bc2d.height - 1);  
	bc2d.stroke(1, "rgba(128,128,128,1)"); // todo settings
	this._canvasActual = true;
	space.can2d.drawImage(bc2d, this.zone.p1);
}

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 .-,--.     .      .
  `|__/ ,-. |  ,-. |- . ,-. ,-.
  )| \  |-' |  ,-| |  | | | | |
  `'  ` `-' `' `-^ `' ' `-' ' '
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
 Relates two items (or other relations)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
Relation.prototype = new Item;
Relation.prototype.constructor = Note;

/* constructor
 * Relation(js, [id])
 * Relation(js, [id], i1id, i2id) 
 */
function Relation(js, id, i1id, i2id) {
	var dtree;
	if (js) {
		this.dtree  = dtree = new DTree(js.d, this);
		this.i1id   = js.i1;
		this.i2id   = js.i2;
	} else {
		this.dtree  = dtree = new DTree(null, this, 14);
		this.i1id   = i1id;
		this.i2id   = i2id;
	}
	dtree.flowWidth = -1;
	Item.call(this, "rel", id);
	this._bc2d = new Can2D();
	this._canvasActual = false;
	
	System.repository.addItem(this, true);
	System.repository.addOnlook(this.id, this.i1id);
	System.repository.addOnlook(this.id, this.i2id);
}

/* called when item is removed */
Relation.prototype.removed = function() {
	System.repository.removeOnlook(this.id, this.i1id);
	System.repository.removeOnlook(this.id, this.i2id);	
}

Relation.prototype.jsonfy = function() {
	var js = {
	    t: "rel",
		i1: this.i1id,
		i2: this.i2id,
		d: this.dtree.jsonfy(true),
	}
	return js;
}

/* returns the arrow object of this relation */
Object.defineProperty(Relation.prototype, "arrow", {
	get: function() { 
		if (this._arrow) return this._arrow;
		var i1 = System.repository.items[this.i1id];  // todo make funcall
		var i2 = System.repository.items[this.i2id];
		/* caches the zones, so the relation knows when one its anchors moved */
		this.i1zone = i1.zone;
		this.i2zone = i2.zone;
		return this._arrow = Arrow.create(i1, i2);
	}
});

/* returns transfix code */
Relation.prototype.transfix = function(txe, space, p, z, shift, ctrl) {
	var arrow = this.arrow;
	var zone  = arrow.zone;
	if (p.x < zone.p1.x - 80 || p.x > zone.p2.x + 80 ||
	    p.y < zone.p1.y - 80 || p.y > zone.p2.y + 80) {
		return 0;
	}
	switch (txe) {
	case TXE.HOVER : 
		/* difference of point to arrow */
		var dx = (p.x - arrow.p1.x);
		var dy = (p.y - arrow.p1.y);
		var onLine = false;
		if (abs(dx) < 8 && abs(dy) < 8) {
			onLine = true;
		} else if (abs(dx) < 8) {
			onLine = abs(dx - (arrow.p2.x - arrow.p1.x) / (arrow.p2.y - arrow.p1.y) * dy) < 8;
		} else {
			onLine = abs(dy - (arrow.p2.y - arrow.p1.y) / (arrow.p2.x - arrow.p1.x) * dx) < 8;
		}
		if (onLine) {
			System.setCursor("move");
			return TXR.HIT;
		} else {
			return 0;
		}
	case TXE.DRAGSTART :
/*		var txr = TXR.HIT;
		if (ctrl) {
			space.actionSpawnRelation(this, p);
			return txr | TXR.REDRAW;
		}
		if (z > 0) {
			System.repository.moveToTop(z);
			txr |= TXR.REDRAW; 
		}
		if (space.focus != this) {
			space.setFoci(this);
			txr |= TXR.REDRAW;
		}

		var srad = settings.scrollbarRadius;
		var sbmx = settings.scrollbarMarginX;
		if (this.scrolly >= 0 && abs(p.x - this.zone.p2.x + srad + sbmx) <= srad + 1)  {
			space.actionScrollY(this, p.y, this.scrolly);
		} else {
			space.actionIDrag(this, p.sub(this.zone.p1));
		}
		return txr;*/
		return 0;
	case TXE.CLICK :
	/*
		var txr = TXR.HIT;
		if (z > 0) {
			System.repository.moveToTop(z);
			txr |= TXR.REDRAW; 
		}
		if (space.focus != this) {
			space.setFoci(this);
			txr |= TXR.REDRAW;
		}

		var op = new Point(
			p.x - this.zone.p1.x, 
			p.y - this.zone.p1.y + (this.scrolly > 0 ? this.scrolly : 0));
		var para = this.paraAtP(op);
		if (para) {
			var editor = System.editor;
			editor.caret.setFromPoint(para, op.sub(para.p));
			editor.caret.show();
			editor.deselect();
			txr |= TXR.REDRAW;
		}
		return txr;*/
	case TXE.RBINDHOVER :
		/* space.actionRBindHover(this);
		return TXR.HIT | TXR.REDRAW; */
		return 0;
	case TXE.RBINDTO :
		/* space.actionRBindTo(this);
		return TXR.HIT | TXR.REDRAW; */
		return 0;
	default :
		throw new Error("Unknown transfix code:" + txe);
	}
}

/* drops the cached canvas */
Relation.prototype.listen = function() {
	this._canvasActual = false;
	/* end of listen chain */
}

Relation.prototype.resize = function(width, height) {
	var dtree = this.dtree;
	var fs = max(dtree.fontsize * height / this.height, 8);
	if (dtree._fontsize == fs) return false;
	dtree.fontsize = fs;
	this._canvasActual = false;
	return true;
}

/* draws the items handles */
Relation.prototype.drawHandles = function(space) {
	this._drawHandles(space, 170);
}

Relation.prototype.checkItemCompass = function(p, rhs) { 
	return this._checkItemCompass(p, 170);
}

/* draws the item       * 
 * space, to draw upon  */
Relation.prototype.draw = function(space) {
	var bc2d = this._bc2d;
	var dtree = this.dtree;
	var it1 = System.repository.items[this.i1id]; // todo funcall
	var it2 = System.repository.items[this.i2id];
	if (this._canvasActual) {
		/* buffer hit */
		this.arrow.draw(space, bc2d);
		return;
	}
	/* draws text */
	bc2d.attune(dtree); 
	dtree.draw(bc2d, space.selection, 0, 0, 0);
	this._canvasActual = true;
	this.arrow.draw(space, bc2d);
}

/* something happend an item onlooked */
Relation.prototype.onlook = function(event, item) {
	switch(event) {
	case ONLOOK.REMOVE :
		if (item.id != this.i1id && item.id != this.i2id) {
			throw new Error("Got onlook for not my item?");
		}
		System.repository.removeItem(this);
		/* todo check for cycles */
		break;
	case ONLOOK.UPDATE : 
		if ((item.id === this.i1id && !item.zone.eq(this.i1zone)) ||
		    (item.id === this.i2id && !item.zone.eq(this.i2zone))) {
			this._arrow = null;		
		}
		break;
	default :
		throw new Error("unknown unlook event");
	}
}

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
,.   ,.       .          ,---.              .
`|  / ,-. ,-. |- ,-. ,-. |  -'  ,-. ,-. ,-. |-.
 | /  |-' |   |  | | |   |  ,-' |   ,-| | | | |
 `'   `-' `-' `' `-' '   `---|  '   `-^ |-' ' '
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ,-.|~ ~ ~ ~ ~ | ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
 Something that draws     `-+' vectors  '
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
/*function VectorGraph(width, height, doc)
{
	this.bcanvas = document.createElement("canvas");
	this.width  = bcanvas.width  =  width;
	this.height = bcanvas.height = height;
	this.doc = doc;
}

// gets the canvas buffer for this item 
// if caret != null draws the caret into the canvas 
VectorGraph.prototype.getCanvas = function() {
	var cx = this.bcanvas.getContext("2d");
	cx.beginPath();
	cx.clearRect(0, 0, bcanvas.width, bcanvas.height);
	draw = "";
	for(var para = doc.getFirstPara(); para; para = para.next) {
		var cmd = para.first.text;
		draw += cmd + "\n";
*///		var reg = /(\S+)\s*/g;
/*		var cc = [];
		var ci = 0;
		for(var ca = reg.exec(cmd); ca != null; ca = reg.exec(cmd)) {
			/* text is a word plus hard spaces *
			cc[ci++] = ca[1]; 
		}
		switch (cc[0]) {
		case 'A' :
			var a1 = parseFloat(cc[1]);
			var a2 = parseFloat(cc[2]);
			var a3 = parseFloat(cc[3]);
			var a4 = parseFloat(cc[4]);
			var a5 = parseFloat(cc[5]);
			var a6 = parseFloat(cc[6]);
			if (typeof(a1) != "number" || 
			    typeof(a2) != "number" ||
			    typeof(a3) != "number" ||
			    typeof(a4) != "number" ||
			    typeof(a5) != "number" ||
			    typeof(a6) != "number"
			) {
				//msg("Arguments not numbers: " + cmd);
				break;
			}
			cx.arc(a1, a2, a3, a4 * Math.PI / 4, a5 * Math.PI / 4, a6 > 0 ? true : false);
			break;
		case '.' :			
			cx.closePath();
			break;
			case 'F' :			
			cx.fill();
			cx.beginPath();
			break;
		case 'B' :
			var a1 = parseFloat(cc[1]);
			var a2 = parseFloat(cc[2]);
			var a3 = parseFloat(cc[3]);
			var a4 = parseFloat(cc[4]);
			var a5 = parseFloat(cc[5]);
			var a6 = parseFloat(cc[6]);
			if (typeof(a1) != "number" || 
			    typeof(a2) != "number" ||
			    typeof(a3) != "number" ||
			    typeof(a4) != "number" ||
			    typeof(a5) != "number" ||
			    typeof(a6) != "number"
			) {
				//msg("Arguments not numbers: " + cmd);
				break;
			}
			cx.bezierCurveTo(a1, a2, a3, a4, a5, a6);
			break;
		case 'Q' :
			var a1 = parseFloat(cc[1]);
			var a2 = parseFloat(cc[2]);
			var a3 = parseFloat(cc[3]);
			var a4 = parseFloat(cc[4]);
			if (typeof(a1) != "number" || 
			    typeof(a2) != "number" ||
			    typeof(a3) != "number" ||
			    typeof(a4) != "number" 
			) {
				//msg("Arguments not numbers: " + cmd);
				break;
			}
			cx.quadraticCurveTo(a1, a2, a3, a4, a5, a6);
			break;
		case 'M' :
			var a1 = parseFloat(cc[1]);
			var a2 = parseFloat(cc[2]);
			if (typeof(a1) != "number" || 
			    typeof(a2) != "number"
			) {
				//msg("Arguments not numbers: " + cmd);
				break;
			}
			cx.moveTo(a1, a2);
			break;
		case 'L' :
			var a1 = parseFloat(cc[1]);
			var a2 = parseFloat(cc[2]);
			if (typeof(a1) != "number" || 
			    typeof(a2) != "number"
			) {
				//msg("Arguments not numbers: " + cmd);
				break;
			}
			cx.lineTo(a1, a2);
			break;
		case 'S' :
			cx.stroke();
			cx.beginPath();
			break;
		case 'c' :
			var a1 = parseFloat(cc[1]);
			var a2 = parseFloat(cc[2]);
			var a3 = parseFloat(cc[3]);
			if (typeof(a1) != "number" || 
			    typeof(a2) != "number" ||
			    typeof(a3) != "number"
			) {
				//msg("Arguments not numbers: " + cmd);
				break;
			}
			cx.strokeStyle = "rgb(" + a1 + "," + a2 + "," + a3 +")";
			break;
		case 'C' :
			var a1 = parseFloat(cc[1]);
			var a2 = parseFloat(cc[2]);
			var a3 = parseFloat(cc[3]);
			if (typeof(a1) != "number" || 
			    typeof(a2) != "number" ||
			    typeof(a3) != "number"
			) {
				//msg("Arguments not numbers: " + cmd);
				break;
			}
			cx.fillStyle = "rgb(" + a1 + "," + a2 + "," + a3 +")";
			break;
		case 'W' :
			var a1 = parseFloat(cc[1]);
			if (typeof(a1) != "number") {
				//msg("Arguments not numbers: " + cmd);
				break;
			}				
			cx.lineWidth = a1;
		case '' :
			break;
		default :
			//msg("Unknown command: " + cmd);
			break;
		}
	}			
	return bcanvas;
}
	
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 .-,--.                   .
  `|__/ ,-. ,-. ,-. ,-. . |- ,-. ,-. . .
  )| \  |-' | | | | `-. | |  | | |   | |
  `'  ` `-' |-' `-' `-' ' `' `-' '   `-|
~ ~ ~ ~ ~ ~ | ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ /|~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~                                  
            '                        `-'
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
function Repository() {
	this.reset();
}

Repository.prototype.reset = function() {
	/* all items */
	this.items = {};
	/* z information of the items, 0 is topmost */
	this.zidx = [];
	
	/* do not save changes, used during loadup */
	this._nosave    = false;
	/* do not notify onlookers, used during import */
	this._noonlooks = false;
	
	this.onlookeds = {};
	this.onlookers = {};
}

/* loads the repository from HTML5 localStorage */
Repository.prototype.loadLocalStorage = function() {
	this.reset();
	var idfjs = window.localStorage.getItem("idf");
	if (idfjs) {
		try {
			this._idFactory = JSON.parse(idfjs);
		} catch(err) {
			this._idFactory = null;
			console.log("JSON error reading idfactory", err.name, err.message);
		}
	}
	if (!this._idFactory) {
		console.log("no repository found. (no idf)");
		this._idFactory = {nid: 1};
		return;
	}
	
	System.space.pan = System.space.can2d.pan = this._getPan(); // todo space setFunction
	var zjs = window.localStorage.getItem("zidx");
	if (!zjs) {
		console.log("no repository found. (no zidx)");
		return;
	}
	var zidx = JSON.parse(zjs);
	this._nosave = true;
	this._noonlooks = true;
	for (var i = zidx.length - 1; i >= 0; i--) {
		var id = zidx[i];
		var itstr = window.localStorage.getItem(id);
		var itjs;
		try {
			itjs = JSON.parse(itstr);
		} catch (err) {
			this._nosave = false;
			this._noonlooks = false;
			throw err;
		} 		
		this._loadItem(id, itjs);
	}
	this._nosave = false;
	this._noonlooks = false;
}

/* erases the local repository */
Repository.prototype.eraseLocalStorage = function() {
	var items = this.items;
	window.localStorage.setItem("idf", "");
	window.localStorage.setItem("zidx", "");
	for(var id in items) {
		window.localStorage.setItem(id, "");
	}
}

/* shoots throw x/y and asks every item that intersects if it feels reponsible */ 
Repository.prototype.transfix = function(txe, space, p, shift, ctrl) {
	var zidx  = this.zidx;
	var items = this.items;
	var fx = 0;
	for(var z = 0, zlen = zidx.length; z < zlen; z++) {
		var it = items[zidx[z]];
		fx |= it.transfix(txe, space, p, z, shift, ctrl);
		if (fx & TXR.HIT) break;
	}
	return fx;	
}

/* saves this repository into a JSON-String that is returned */
Repository.prototype.exportToJString = function() {
	var js = {}
	js.formatversion = 0;
	js.idf = this._idFactory;
	var items = this.items;
	var jitems = js.items = {};
	for (var id in items) {
		jitems[id] = items[id].jsonfy();
	}
	js.z = this.zidx;
	js.pan = System.space.pan.jsonfy();
	return JSON.stringify(js, null, 1);
}

/* moves an item top */
Repository.prototype.moveToTop = function(z) {
	var zidx = this.zidx;
	var id = zidx[z];
	zidx.splice(z, 1);
	zidx.unshift(id);
	this._saveZIDX();
	return 0; 
}

/* one item wants to watch another item */
Repository.prototype.addOnlook = function(onlooker, onlooked) {
	var its = this.items;
	if (!this._noonlooks && (!its[onlooker] || !its[onlooked])) {
		throw new Error("adding Onlook to invalid item ids:");
	}
	var od = this.onlookeds[onlooked];
	var or = this.onlookers[onlooker];
	if (!od) this.onlookeds[onlooked] = od = [];
	if (!or) this.onlookers[onlooker] = or = [];
	if (od.indexOf(onlooker) < 0) od.push(onlooker);
	if (or.indexOf(onlooked) < 0) or.push(onlooked);	
}

/* one item stops to watch another item */
Repository.prototype.removeOnlook = function(onlooker, onlooked) {
	var od = this.onlookeds[onlooked];
	var odi = od.indexOf(onlooker);
	if (odi >= 0) od.splice(odi, 1);

	var or = this.onlookers[onlooker];
	var ori = or.indexOf(onlooked);
	if (ori >= 0) or.splice(ori, 1);
}

/* loads the repository from a JSON string */
Repository.prototype.importFromJString = function(str) {
	try {
		var js = JSON.parse(str);
	} catch (err) {
		window.alert("Repository save not valid JSON.");
		return;
	}
	if (js.formatversion != 0 || !js.idf || !js.items || !js.z) {
		window.alert("Repository not recognized.");	
		return;
	}
	this.reset();
	this.eraseLocalStorage();
	/* erase current local repository */
	var items = this.items;
	var zidx  = js.z;
	this._idFactory = js.idf;	
	window.localStorage.setItem("idf", JSON.stringify(this._idFactory));
	this._noonlooks = true;
	for (var i = zidx.length - 1; i >= 0; i--) {
		var id = zidx[i];
		if (typeof zidx[i] != "number") id = parseInt(id);
		this._loadItem(id, js.items[id]);
	}
	this._saveZIDX();
	this._noonlooks = false;

	System.space.setFoci(null);
	System.space.pan = System.space.can2d.pan = js.pan ? Point.jnew(js.pan) : new Point(0, 0); // todo
	this.savePan(System.space.pan);
}

Repository.prototype._newItemID = function() {
	var idf = this._idFactory;
	idf.nid++;
	window.localStorage.setItem("idf", JSON.stringify(idf));
	return idf.nid;
}

Repository.prototype._loadItem = function(id, itjs) {
	if (!itjs || !itjs.t) throw new Error("JSON error: attributes missing from " + id + ":");
	switch(itjs.t) {
	case "note"  : return new Note(itjs, id);
	case "label" : return new Label(itjs, id);
	case "rel"   : return new Relation(itjs, id);
	default      : throw new Error("unknown item type");
	}
}

Repository.prototype._saveZIDX = function() {
	window.localStorage.setItem("zidx", JSON.stringify(this.zidx));
}

/* adds an item to the space */
Repository.prototype.addItem = function(item, top) {
	if (!item.id) item.id  = this._newItemID(item.otype);
	this.items[item.id] = item;
	if (top) {
		this.zidx.unshift(item.id);
	} else {
		this.zidx.push(item.id);
	}
	
	if (!this._nosave) {
		this._saveItem(item);
		this._saveZIDX();
	}
}

/* removes an item from the repository. */
Repository.prototype.removeItem = function(item) {
	var zidx = this.zidx;
	var id = item.id;
	zidx.splice(zidx.indexOf(id), 1);
	delete this.items[id];
	item.removed();
	
	/* notifies onlookers */
	if (!this._noonlooks) {	
		var od = this.onlookeds[id];
		if (od) {
			/* copies the array so it can be changed during traversal */
			var odc = od.slice();
			for (var i = 0; i < odc.length; i++) {
				var it = this.items[odc[i]];
				if (it) it.onlook(ONLOOK.REMOVE, item);
			}
		}
	}
	
	if (!this._nosave) {
		window.localStorage.setItem(item.id, "");
		this._saveZIDX();
	}
}

Repository.prototype._saveItem = function(item) {
	window.localStorage.setItem(item.id, JSON.stringify(item.jsonfy()));
}

Repository.prototype.updateItem = function(item) {
	if (!this._nosave) this._saveItem(item);
	
	/* notifies onlookers */
	if (this._noonlooks) return;
	var od = this.onlookeds[item.id];
	if (!od) return;
	for (var i = 0; i < od.length; i++) {
		var it = this.items[od[i]];
		if (it) it.onlook(ONLOOK.UPDATE, item);
	}
}


/* loads panning offsets  */
Repository.prototype._getPan = function() {
	var jstr = window.localStorage.getItem("pan");
	var js   = JSON.parse(jstr);
	return js ? Point.jnew(js) : new Point(0, 0);
}

Repository.prototype.savePan = function(pan) {
	if (!this._nosave) window.localStorage.setItem("pan", JSON.stringify(pan.jsonfy()));
}

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ,.   ,   ,.       .
 `|  /|  / . ,-. ,-| ,-. . , ,
  | / | /  | | | | | | | |/|/
  `'  `'   ' ' ' `-^ `-' ' '
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
var demoRepository = null;
window.onload = function() {
	var request = document.location.search;
	if (request.indexOf("reset") >= 0) {
		console.log("Clearing localStorage");
		window.localStorage.clear();
	}
	// loads the demoRepository JSON String
	var demotag = "DEMOREPOSITORY";
	for(var node = document.body.lastChild; node; node = node.previousSibling) {
		if (node.nodeName != "#comment") continue;
		var data = node.data;
		if (data.substring(0, demotag.length) != demotag) continue;
		demoRepository = data.substring(demotag.length);
		break;
	}
	System.init();
}

