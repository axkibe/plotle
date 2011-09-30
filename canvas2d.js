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
| but enhanced on the fly for what I need.
|
| Defines:
|  Can2D  // todo rename to C2D
|  Compass
|  Point
|  Line
|  Measure
|  Rect
|  RoundRect
|  Hexagon
|  HexagonSlice
|  HexagonFlower 
|
| Authors: Axel Kittenberger
| License: Gnu Affero GPLv3
*/
// Todo move all into the C2D namespace.

"use strict";

function C2D() {
	throw new Error('do not call directly');
}

/**
| Subclassing helper.
| 
| sub: prototype to become a subclass.
| base: prototype to become the baseclass.
*/
C2D.subclass = function(sub, base) {
   function inherit() {}
   inherit.prototype = base.prototype;
   sub.prototype = new inherit();
   sub.prototype.constructor = sub;
}

/**
| Shortcuts
*/
C2D.half = function(v) { return Math.round(v / 2); }

/**
| Just a convenience debugging tool
*/
C2D.debug = function() {
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
/** 
| Constructor.
|
| Point(x, y) or
| Point(point)
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

/**
| Shortcut for often used point at 0/0.
*/
Point.zero = new Point(0, 0);

/* Creates a point from json */
Point.jnew = function(js) {
	if (typeof(js.x) !== "number" || typeof(js.y) !== "number") {
		throw new Error("Expected a number in JSON, but isn't");
	}
	return new Point(js.x, js.y);
}

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
		if (p.x === x && p.y === y) return p;
	}
	return new Point(x, y);
}

/** 
| Returns a json object for this point.
*/
Point.prototype.jsonfy = function() {
	return { x: this.x, y: this.y };
}

/**
| Returns true if this point is equal to another.
*/
Point.prototype.eq = function(px, y) {
	return arguments.length === 1 ? 
		this.x === px.x && this.y === px.y :
		this.x === px   && this.y ===    y;
}

/** 
| Adds two points or x/y values, returns a new point.
*/
Point.prototype.add = function(a1, a2) {
	return (typeof(a1) === "object" ?
		new Point(this.x + a1.x, this.y + a1.y) :
		new Point(this.x + a1,   this.y + a2));
}

/** 
| Subtracts a points (or x/y from this), returns new point 
*/
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
/**
| Constructor.
|
| pnw: point to north west.
| pse: point to south east.
*/
function Rect(pnw, pse) {
	this.pnw = pnw;
	this.pse = pse;
	if (!pnw || !pse || pnw.x > pse.x || pnw.y > pse.y) { 
		throw new Error("not a rectangle."); 
	}
	this.otype = "rect";
	// freeze if not a father object
	if (this.constructor == Rect) Object.freeze(this);
}

/** 
| Creates a point from json 
*/
Rect.jnew = function(js) {
	// todo remove p1p2
	return new Rect(Point.jnew(js.pnw || js.p1), Point.jnew(js.pse || js.p2));
}

/** 
| Returns a json object for this rect 
*/
Rect.prototype.jsonfy = function() {
	return { pnw: this.pnw.jsonfy(), pse: this.pse.jsonfy() };
}

/** 
| Returns a rect moved by a point or x/y 
| 
| add(point)   -or-
| add(x, y)  
*/
Rect.prototype.add = function(a1, a2) {
	return new Rect(this.pnw.add(a1, a2), this.pse.add(a1, a2));
}

/**
| Returns a rect moved by a -point or -x/-y.
|
| sub(point)   -or-
| sub(x, y)  
*/
Rect.prototype.sub = function(a1, a2) {
	return new Rect(this.pnw.sub(a1, a2), this.pse.sub(a1, a2)); 
}

/** 
| Returns true if point is within this rect.
*/
Rect.prototype.within = function(p) {
	return p.x >= this.pnw.x && p.y >= this.pnw.y && 
	       p.x <= this.pse.x && p.y <= this.pse.y;
}

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
		pnw = Point.renew(
			this.pnw.x - half(width - this.width), 
			this.pnw.y, 
			this.pnw, this.pse);
		pse = Point.renew(
			pnw.x + width, 
			this.pnw.y + height, 
			this.pnw, this.pse);
		break;
	case 'ne' :
		pnw = Point.renew(
			this.pse.x - width, 
			this.pnw.y, 
			this.pnw, this.pse);
		pse = Point.renew(
			this.pse.x, 
			this.pnw.y + height,
			this.pnw, this.pse);
		break;
	case 'e' :
		pnw = Point.renew(
			this.pse.x - width,
			this.pnw.y - half(height - this.height), 
			this.pnw, this.pse);
		pse = Point.renew(
			this.pse.x,
			pnw.y + height,
			this.pnw, this.pse);
		break;
	case 'se' :
		pnw = Point.renew(
			this.pse.x - width,
			this.pse.y - height,
			this.pnw, this.pse);
		pse = this.pse;
		break;
	case 's' :
		pnw = Point.renew(
			this.pnw.x - half(width - this.width), 
			this.pnw.y - height, 
			this.pnw, this.pse);
		pse = Point.renew(
			pnw.x + width, 
			this.pse.y, 
			this.pnw, this.pse);
		break;
	case 'sw' :
		pnw = Point.renew(
			this.pnw.x, 
			this.pse.y - height, 
			this.pnw, this.pse);
		pse = Point.renew(
			this.pnw.x + width, 
			this.pse.y,
			this.pnw, this.pse);
		break;
	case 'w' :
		pnw = Point.renew(
			this.pnw.x,
			this.pnw.y - half(height - this.height), 
			this.pnw, this.pse);
		pse = Point.renew(
			this.pnw.x + width,
			pnw.y + height,
			this.pnw, this.pse);
		break;
	case 'nw' :
		pnw = this.pnw;
		pse = Point.renew(
			this.pnw.x + width,
			this.pnw.y + height,
			this.pnw, this.pse);
		break;
	case 'c' :
		pnw = Point.renew(
			this.pnw.x - half(width - this.width),
			this.pnw.y - half(height - this.height), 
			this.pnw, this.pse);
		pse = Point.renew(
			pnw.x + width,
			pnw.y + height,
			this.pnw, this.pse);
		break;
	default : 
		throw new Error('invalid align: '+align);
	}
	return new Rect(pnw, pse);
}

/** 
| Returns a rectangle with same size at position at p|x/y).
*/
Rect.prototype.moveto = function(a1, a2) {
	if (typeof(a1) !== 'object') a1 = new Point(a1, a2);
	return new Rect(a1, a1.add(this.width, this.height));
}

/** 
| Returns true if this rectangle is like another 
*/
Rect.prototype.eq = function(r) {
	return this.pnw.eq(r.pnw) && this.pse.eq(r.pse);
}

Object.defineProperty(Rect.prototype, "width", {
	get: function()  { return this.pse.x - this.pnw.x; }
});

Object.defineProperty(Rect.prototype, "height", {
	get: function()  { return this.pse.y - this.pnw.y; }
});

// todo replace by "pc", point center
Object.defineProperty(Rect.prototype, "mx", {
	get: function() { return C2D.half(this.pnw.x + this.pse.x); }
});

Object.defineProperty(Rect.prototype, "my", {
	get: function() { return C2D.half(this.pnw.y + this.pse.y); }
});

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 .-,--.               . .-,--.         .  
  `|__/ ,-. . . ,-. ,-|  `|__/ ,-. ,-. |- 
  )| \  | | | | | | | |  )| \  |-' |   |  
  `'  ` `-' `-^ ' ' `-^  `'  ` `-' `-' `' 
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
 A rectangle in a 2D plane with rounded corners
 Rectangles are immutable objects.
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
C2D.subclass(RoundRect, Rect);

/**
| Constructor.
| Rect(rect, crad)      -or-
| Rect(pnw, pse, crad) 
*/
function RoundRect(a1, a2, a3) {
	if (a1.otype === "point") {
		Rect.call(this, a1, a2);
		this.crad = a3;
	} else {
		Rect.call(this, a1.pnw, a1.pse);
		this.crad = a2;
	}
	this.otype = "roundrect";
	Object.freeze(this);
}

/**
| Draws a bevel.
|
| c2d: Canvas2D area to draw upon.
| border: additional distance.
*/
// todo doesnt use pnw!
RoundRect.prototype.path = function(c2d, border) {
	var x1 = border;
	var y1 = border;
	var x2 = this.width - border;
	var y2 = this.height - border;
	var cr = this.crad + border;
	var pi = Math.PI;
	var ph = Math.PI / 2;
	c2d.beginPath();
	c2d.moveTo(x1 + cr, y1);
	c2d.arc(x2 - cr, y1 + cr, cr, -ph,   0, false);
	c2d.arc(x2 - cr, y2 - cr, cr,   0,  ph, false);
	c2d.arc(x1 + cr, y2 - cr, cr,  ph,  pi, false);
	c2d.arc(x1 + cr, y1 + cr, cr,  pi, -ph, false);
}


/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ,-_/,.                         
 ' |_|/ ,-. . , ,-. ,-. ,-. ,-. 
  /| |  |-'  X  ,-| | | | | | | 
  `' `' `-' ' ` `-^ `-| `-' ' ' 
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~,| ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
 A hexagon in a 2D   `' plane.
 Hexagons are immutable objects.
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

/**
| Constructor.
| Hexagon(p: center, r: radius) 
*/
function Hexagon(p, r) {
	this.otype = "hexagon";
	if (typeof(p) !== "object" || p.otype !== "point") throw new Error("invalid p");
	this.p = p;
	this.r = r;
	Object.freeze(this);
}

/**
| shortcuts for often needed trigonometric values 
*/
Hexagon.cos6 = Math.cos(Math.PI / 6);
Hexagon.tan6 = Math.tan(Math.PI / 6);

/** 
| Creates a hexgon from json.
*/
Hexagon.jnew = function(js) {
	return new Hexagon(js.p, js.r);
}

/**
| Returns a json object for this rect.
*/
Hexagon.prototype.jsonfy = function() {
	return { p: this.p, j: this.j };
}

/**
| Returns a hexagon moved by a point or x/y.
*/
Hexagon.prototype.add = function(a1, a2) {
	return new Hexagon(this.p.add(a1, a2), this.r);
}

/**
| Returns true if point is within this hexagon.
*/
Hexagon.prototype.within = function(p) {
	var rc = this.r * Hexagon.cos6;
	var dy = this.p.y - p.y;
	var dx = this.p.x - p.x;
	var yhc6 = Math.abs(dy * Hexagon.cos6);
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
 The top slice of a  `' hexagon.

       ------------        ^
      /............\       |  h
     /..............\      |
 psw*................\     v
   /                  \
  *<-------->*         *
   \     r    pm      /
    \                /
     \              /
      \            /
       *----------*		
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
/**
| Constructor.
|
| psw: Point to south west.
| rad: radius.
| height: slice height.
*/
function HexagonSlice(psw, rad, height) {
	this.psw    = psw;
	this.rad    = rad;
	this.height = height;
	
	if (height > rad) throw new Error("Cannot make slice larger than radius");
	this.pm = new Point(
		psw.x + rad - Math.round((rad * Hexagon.cos6 - height) * Hexagon.tan6), 
		psw.y + Math.round(rad * Hexagon.cos6) - height);
	/* for gradients only */
	/* todo rename to gradientP1, so less confuse */
	this.pnw = new Point(psw.x, psw.y - height);
	this.pse = new Point(this.pm.x + rad, psw.y);
}

/**
| Draws the hexagon.
*/
HexagonSlice.prototype.path = function(can2d, border) {
	var r2 = C2D.half(this.rad);
	can2d.beginPath();
	can2d.moveTo(this.psw.x                 + border, this.psw.y               - border);
	can2d.lineTo(this.pm.x - r2             + border, this.psw.y - this.height + border);
	can2d.lineTo(this.pm.x + r2             - border, this.psw.y - this.height + border);
	can2d.lineTo(2 * this.pm.x - this.psw.x - border, this.psw.y               - border);
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
           / \    1    ' \   '
          /   \   '   /'  \  '
         /  6  *-----* ' 2 \ '
        /   '   \'    \'    \
 pc.y  *-----*    +    *-----*
        \     \    p  /     /
         \  5  *-----*   3 /
          \   /       \   /
           \ /    4    \ /
            *-----------*

 pc:   center
 r:    outer radius
 ri:   inner radius
 segs: lists 0..6 which segments to include

 additional "segments":
 	 0: inner hex
	-1: outer hex
	-2: structure

// todo replace numbers with compass names.
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
function HexagonFlower(pc, ri, ro, segs) {
	this.pc = pc;
	if (ri > ro) throw new Error("inner radius > outer radius");
	this.ri = ri;
	this.ro = ro;
	this.gradientPC = pc;
	this.gradientR1 = ro;
	this.segs = segs;
	Object.freeze(this);
}

/**
| Makes the flower-hex-6 path.
*/
HexagonFlower.prototype.path = function(can2d, border, segment) {
	var ri  = this.ri;
	var ri2 = C2D.half(this.ri);
	var ric = Math.round(this.ri * Hexagon.cos6);
	var ro  = this.ro;
	var ro2 = C2D.half(this.ro);
	var roc = Math.round(this.ro * Hexagon.cos6);
	var pc  = this.pc;
	var pcx = pc.x, pcy = pc.y;
	var b   = border;
	var b2  = C2D.half(border);
	var bc6 = Math.round(border * Hexagon.cos6);
	var segs = this.segs;
	can2d.beginPath();
	/* inner hex */
	if (segment === 0 || segment === -2) {
		can2d.moveTo(pcx - ri  - b,  pcy             );
		can2d.lineTo(pcx - ri2 - b2, pcy - ric - bc6 );
		can2d.lineTo(pcx + ri2 + b2, pcy - ric - bc6 );
		can2d.lineTo(pcx + ri  + b,  pcy             );
		can2d.lineTo(pcx + ri2 + b2, pcy + ric + bc6 );
		can2d.lineTo(pcx - ri2 - b2, pcy + ric + bc6 );
		can2d.lineTo(pcx - ri  - b,  pcy             );	
	}

	/* outer hex */
	if (segment === -1 || segment === -2) {
		can2d.moveTo(pcx - ro  + b,  pcy             );
		can2d.lineTo(pcx - ro2 + b2, pcy - roc + bc6 );
		can2d.lineTo(pcx + ro2 - b2, pcy - roc + bc6 );
		can2d.lineTo(pcx + ro  - b,  pcy             );
		can2d.lineTo(pcx + ro2 - b2, pcy + roc - bc6 );
		can2d.lineTo(pcx - ro2 + b2, pcy + roc - bc6 );
		can2d.lineTo(pcx - ro  + b,  pcy             );
	}

	switch (segment) {
	case -2 :
		if (segs[1] || segs[6]) {
			can2d.moveTo(pcx - ri2,  pcy - ric);
			can2d.lineTo(pcx - ro2,  pcy - roc);
		}
		if (segs[1] || segs[2]) {
			can2d.moveTo(pcx + ri2, pcy - ric);
			can2d.lineTo(pcx + ro2, pcy - roc);
		}
		if (segs[2] || segs[3]) {
			can2d.moveTo(pcx + ri,  pcy);
			can2d.lineTo(pcx + ro,  pcy);
		}
		if (segs[3] || segs[4]) {
			can2d.moveTo(pcx + ri2, pcy + ric + bc6);
			can2d.lineTo(pcx + ro2, pcy + roc - bc6);
		}
		if (segs[4] || segs[5]) {
			can2d.moveTo(pcx - ri2, pcy + ric + bc6);
			can2d.lineTo(pcx - ro2, pcy + roc - bc6);
		}
		if (segs[5] || segs[6]) {
			can2d.moveTo(pcx - ri, pcy);
			can2d.lineTo(pcx - ro, pcy);
		}
		break;
	case 1:
		can2d.moveTo(pcx - ro2 + b2, pcy - roc + bc6);
		can2d.lineTo(pcx + ro2 - b2, pcy - roc + bc6);
		can2d.lineTo(pcx + ri2 + b2, pcy - ric - bc6);
		can2d.lineTo(pcx - ri2 - b2, pcy - ric - bc6);
		can2d.lineTo(pcx - ro2 + b2, pcy - roc + bc6);
		break;
	case 2:
		can2d.moveTo(pcx + ro2 - b2, pcy - roc + bc6);
		can2d.lineTo(pcx + ro  - b,  pcy);
		can2d.lineTo(pcx + ri  + b,  pcy);
		can2d.lineTo(pcx + ri2 + b2, pcy - ric - bc6);
		can2d.lineTo(pcx + ro2 - b2, pcy - roc + bc6);
		break;
	case 3:
		can2d.moveTo(pcx + ro  - b,  pcy);
		can2d.lineTo(pcx + ro2 - b2, pcy + roc - bc6);
		can2d.lineTo(pcx + ri2 + b2, pcy + ric + bc6);
		can2d.lineTo(pcx + ri  + b,  pcy);
		can2d.lineTo(pcx + ro  - b,  pcy);
		break;
	case 4:
		can2d.moveTo(pcx + ro2 - b2, pcy + roc - bc6);
		can2d.lineTo(pcx - ro2 + b2, pcy + roc - bc6);
		can2d.lineTo(pcx - ri2 - b2, pcy + ric + bc6);
		can2d.lineTo(pcx + ri2 + b2, pcy + ric + bc6);
		can2d.lineTo(pcx + ro2 - b2, pcy + roc - bc6);
		break;
	case 5:
		can2d.moveTo(pcx - ro2 + b2, pcy + roc - bc6);
		can2d.lineTo(pcx - ro  + b,  pcy);
		can2d.lineTo(pcx - ri  - b,  pcy);
		can2d.lineTo(pcx - ri2 - b2, pcy + ric + bc6);
		can2d.lineTo(pcx - ro2 + b2, pcy + roc - bc6);
		break;
	case 6:
		can2d.moveTo(pcx - ro  + b,  pcy);
		can2d.lineTo(pcx - ro2 + b2, pcy - roc + bc6);
		can2d.lineTo(pcx - ri2 - b2, pcy - ric - bc6);
		can2d.lineTo(pcx - ri  - b,  pcy);
		can2d.lineTo(pcx - ro  + b,  pcy);
		break;
	}
}

/** 
| Returns the segment the point is within. 
*/
HexagonFlower.prototype.within = function(p) {
	var roc6 = this.ro * Hexagon.cos6;
	var dy = p.y - this.pc.y;
	var dx = p.x - this.pc.x;
	var dyc6 = Math.abs(dy * Hexagon.tan6);
	
	if (dy <  -roc6 || dy >  roc6 || dx - this.ro >= -dyc6 || dx + this.ro <= dyc6) {
		return -1;
	}
	
	var ric6 = this.ri * Hexagon.cos6;
	if (dy >= -ric6 && dy <= ric6 && dx - this.ri <  -dyc6 && dx + this.ri >  dyc6) {
		return 0;
	}

	var lor = dx <= -dy * Hexagon.tan6; // left of right diagonal
	var rol = dx >=  dy * Hexagon.tan6; // right of left diagonal
	var aom = dy <= 0;                  // above of middle line
	if (lor && rol)        return 1;
	else if (!lor && aom)  return 2;
	else if (rol && !aom)  return 3;
	else if (!rol && !lor) return 4;
	else if (lor && !aom)  return 5;
	else if (!rol && aom)  return 6;
	else return 0;
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
function Line(p1, p1end, p2, p2end) {
	this.p1 = p1;
	this.p1end = p1end;
	this.p2 = p2;
	this.p2end = p2end;
	this.otype = "line";
}

/** 
| Returns the line connecting entity1 to entity2
| shape1: a Rect or Point
| end1: 'normal' or 'arrow'
| shape2: a Rect or Point
| end2: 'normal' or 'arrow'
*/
Line.connect = function(shape1, end1, shape2, end2) {
	if (!shape1 || !shape2) {
		throw new Error('error');
	}
	if (shape1.otype === 'rect' && shape2.otype === 'point') {
		var p2 = shape2;
		var z1 = shape1;
		var p1;
		if (z1.within(p2)) {
			p1 = new Point(z1.mx, z1.my); // todo rename mx/my
		} else {
			// todo min max
			p1 = new Point(
				p2.x < z1.pnw.x ? z1.pnw.x : (p2.x > z1.pse.x ? z1.pse.x : p2.x),
				p2.y < z1.pnw.y ? z1.pnw.y : (p2.y > z1.pse.y ? z1.pse.y : p2.y));
		}
		return new Line(p1, end1, p2, end2);
	} 
	if (shape1.otype === 'rect' && shape2.otype === 'rect') {
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
			x1 = x2 = C2D.half(Math.max(z1.pnw.x, z2.pnw.x) + Math.min(z1.pse.x, z2.pse.x));
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
			y1 = y2 = C2D.half(Math.max(z1.pnw.y, z2.pnw.y) + Math.min(z1.pse.y, z2.pse.y));
		}
		return new Line(new Point(x1, y1), end1, new Point(x2, y2), end2);
	}
	throw new Error("do not know how to create connection.");
}

/** 
| Returns the zone of the arrow.
| Result is cached.
*/
Object.defineProperty(Line.prototype, "zone", {
	get: function() { 
		if (this._zone) return this._zone;
		if (this.p1.x <= this.p2.x && this.p1.y <= this.p2.y) 
			return new Rect(this.p1, this.p2); 
		if (this.p1.x >  this.p2.x && this.p1.y >  this.p2.y) 
			return new Rect(this.p2, this.p1); 
		return new Rect(
			new Point(Math.min(this.p1.x, this.p2.x), Math.min(this.p1.y, this.p2.y)),
			new Point(Math.max(this.p1.x, this.p2.x), Math.max(this.p1.y, this.p2.y)));
	},
});

/**
| Draws the path of the line.
|
| can2d: Canvas2D to draw upon.
*/
Line.prototype.path = function(can2d) {
	var p1 = this.p1;
	var p2 = this.p2;

	can2d.beginPath();
	// todo, multiple lineend types
	switch(this.p1end) {
	case 'normal':
		can2d.moveTo(p1);
		break;
	default : 
		throw new Error('unknown line end');
	}
	
	switch(this.p2end) {
	case 'normal' :
		can2d.lineTo(p2);
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
		can2d.lineTo(
			p2.x - Math.round(ms * Math.cos(d)),
			p2.y - Math.round(ms * Math.sin(d)));
		can2d.lineTo(
			p2.x - Math.round(as * Math.cos(d - ad)), 
			p2.y - Math.round(as * Math.sin(d - ad)));
		can2d.lineTo(p2);
		can2d.lineTo(
			p2.x - Math.round(as * Math.cos(d + ad)), 
			p2.y - Math.round(as * Math.sin(d + ad)));
		can2d.lineTo(
			p2.x - Math.round(ms * Math.cos(d)),
			p2.y - Math.round(ms * Math.sin(d)));
		break;
	default : 
		throw new Error('unknown line end');
	}

}

/** 
| Draws the line.
*/
Line.prototype.draw = function(can2d) {
	can2d.fills(settings.relation.style.fill, this);
	can2d.edges(settings.relation.style.edge, this);
}

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 Compass+++
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
function Compass() {
	throw new Error("instancing a static object");
}

/**
| Returns the compass direction opposite of a direction.
*/
Compass.opposite = function(dir) {
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
/**
| Can2D()        -or-    creates new Canvas2D
| Can2D(canvas)  -or-    encloses an existing HTML5 canvas
| Can2D(width, height)   creates a new Canvas2D and sets its size;
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

/**
| Returns true if point is in hexagon slice.
*/
Can2D.withinHexagonSlice = function(p, r, h) {
	var w  = r - (r * Hexagon.cos6 - h) * Hexagon.tan6;
	var rc = r * Hexagon.cos6;
	var yh = p.y * Hexagon.tan6;
	return p.y >=  -h &&         p.y <= 0 &&
	       p.x >= -yh && p.x - 2 * w <= yh;
}

/**
| Returns true if p is near the line spawned by p1 and p2.
*/
Can2D.isNearLine = function(p, dis, p1, p2) {
	throw new Error('unimplemented');
	// todo
	var dx = (p.x - p1.x);
	var dy = (p.y - p1.y);
	if (Math.abs(dx) < 8 && Math.abs(dy) < 8) {
		return true;
	}
	if (Math.abs(dx) < dis) {
		return Math.abs(dx - (p2.x - p1.x) / (p2.y - p1.y) * dy) < dis;
	} else {
		return Math.abs(dy - (p2.y - p1.y) / (p2.x - p1.x) * dx) < dis;
	}
}

/**
| Throws an error if any argument is not an integer.
*/
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
});

Object.defineProperty(Can2D.prototype, "height", {
	get: function() { return this._canvas.height; },
});

/**
| The canvas is cleared and its size ensured to be width/height (of rect).
| border is an additional increase/decrease added.
|
| attune()                                    -or-
| attune(rect, [resizeW], [resizeH])          -or-
| attune(width, height, [resizeW], [resizeH])
*/
// todo remove resizeW resizeH again if not used.
Can2D.prototype.attune = function(a1, a2, a3, a4) {
	var ta1 = typeof(a1);
	var c = this._canvas;
	if (ta1 === "undefined") {
		this._cx.clearRect(0, 0, c.width, c.height);	
		return;
	}
	var w, h, rw, rh;
	if (ta1 === "object") {
		w  = a1.width;
		h  = a1.height;
		rw = a2 || 0;
		rh = a3 || 0;
	} else {
		w  = a1;
		h  = a2;
		rw = a3 || 0;
		rh = a4 || 0;
	}
	if (c.width === w + rw && c.height === h + rh) {
		// no size change, clearRect() is faster
		this._cx.clearRect(0, 0, c.width, c.height);
		return;	
	}
	/* setting width or height clears the contents */
	if (c.width  !== w + rw) c.width  = w + rw;
	if (c.height !== h + rh) c.height = h + rh;
}


/**
| moveTo(point) -or-
| moveTo(x, y)
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

/** 
| lineto(point) -or-
| lineto(x, y)
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

/**
| Draws an arc.
| arc(p,    radius, startAngle, endAngle, anticlockwise)   -or-
| arc(x, y, radius, startAngle, endAngle, anticlockwise)   -or-
*/
Can2D.prototype.arc = function(a1, a2, a3, a4, a5, a6) {
	var pan = this.pan;
	if (typeof(a1) === "object") {
		this._cx.arc(a1.x + pan.x + 0.5, a1.y + pan.y + 0.5, a2, a3, a4, a5);
		return;
	} 
	this._cx.arc(a1 + pan.x + 0.5, a2 + pan.y + 0.5, a3, a4, a5, a6);
}
		
/**
| Draws a frame around the canvas.
| Called 'path', because it is the general purpose name for object to draw themselves
| and a can2d has it defined as shortcut to frame itself.
|
| border: increase/decrease total size
*/
Can2D.prototype.path = function(self, border) {
	if (this !== self) throw new Error("Can2D.path: self != this");
	var cx = this._cx;
	cx.beginPath(); 
	cx.rect(
		0.5 + border, 0.5 + border, 
		this._canvas.width - 1 - border, this._canvas.height - 1 - border);
}

/** 
| Makes a stroke. todo remove
*/
Can2D.prototype.stroke = function(lineWidth, style) {
	var cx = this._cx;
	cx.lineWidth = lineWidth;
	cx.strokeStyle = style;
	cx.stroke();
}

/** 
| Makes a fill. todo remove
*/
Can2D.prototype.fill = function(style) { 
	var cx = this._cx;
	cx.fillStyle = style;
	cx.fill();
}

/** 
| rect(rect)     -or-
| rect(pnw, pse) -or-
| rect(nwx, nwy, w, h)
| todo remove by rect.path
*/
Can2D.prototype.rect = function(a1, a2, a3, a4) {
	var pan = this.pan;
	var cx = this._cx;
	if (typeof(r) === "object") {
		switch(r.otype) {
		case "rect":
			return this._cx.rect(
				a1.pnw.x + pan.x + 0.5, a1.pnw.y + pan.y + 0.5, 
				a1.width, a1.height);
		case "point":
			return this._cx.rect(
				a1.x + pan.x + 0.5, a1.y + pan.y + 0.5, 
				a2.x - a1.x,        a2.y - a1.y);
		default:
			throw new Error("fillRect not a rectangle");
		}
	}
	return this._cx.rect(a1 + pan.x + 0.5,  a2 + pan.y + 0.5, a3, a4);
}

/** 
| fillRect(style, rect)     -or-
| fillRect(style, pnw, pse) -or-
| fillRect(style, nwx, nwy, width, height)
*/
Can2D.prototype.fillRect = function(style, a1, a2, a3, a4) {
	var pan = this.pan;
	var cx = this._cx;
	cx.fillStyle = style;
	if (typeof(p) === "object") {
		switch(rect.otype) {
		case 'rect':
			return this._cx.fillRect(a1.pnw.x, a1.pnw.y, a1.pse.x, a1.pse.y);
		case 'point':
			return this._cx.fillRect(a1.x, a1.y, a2.x, a2.y);
		}
		throw new Error("fillRect not a rectangle");
	}
	return this._cx.fillRect(a1, a2, a3, a4);
}

/**
| Begins a path 
*/
Can2D.prototype.beginPath = function() { this._cx.beginPath();  }

/** 
| Closes a path 
*/
Can2D.prototype.closePath = function() { this._cx.closePath();  } 

/** 
| Draws an image.
|
| drawImage(image, pnw)   -or-
| drawImage(image, x, y)
*/
Can2D.prototype.drawImage = function(image, a1, a2) {
	var pan = this.pan;
	if (image.otype === "can2d") image = image._canvas;
	if (typeof(a1) === "object") {
		this._cx.drawImage(image, a1.x + pan.x, a1.y + pan.y);
		return;
	}
	this._cx.drawImage(image, a1 + pan.x, a2 + pan.y);
}


/** 
| putImageData(imagedata, p) -or-
| putImageData(imagedata, x, y)
*/
Can2D.prototype.putImageData = function(imagedata, a1, a2) {
	var pan = this.pan;
	if (typeof(p) === "object") {
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
Can2D.prototype.getImageData = function(a1, a2, a3, a4) {
	var pan = this.pan;
	if (typeof(p) === "object") {
		switch (a1.otype) {
		case "rect":
			return this._cx.getImageData(a1.pnw.x, a1.pnw.y, a1.pse.x, a1.pse.y);
		case "point":
			return this._cx.getImageData(a1.x, a1.y, a2.x, a2.y);

		}
		throw new Error("getImageData not a rectangle");
	}
	return this._cx.getImageData(a1, a2, a3, a4);
}

/**
| Returns a HTML5 color style for a meshcraft style notation.
*/
Can2D.prototype._colorStyle = function(style, shape) {
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
Can2D.prototype.fills = function(style, shape, a1, a2, a3) {
	var cx = this._cx;
	shape.path(this, 0, a1, a2, a3);
	cx.fillStyle = this._colorStyle(style, shape);
	cx.fill();
}

/**
| Draws a single edge.
|
| style: the style formated in meshcraft style notation.
| shape: an object which has path() defined
*/
Can2D.prototype._edge = function(style, shape, a1, a2, a3) {
	var cx = this._cx;
	shape.path(this, style.border, a1, a2, a3);
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
Can2D.prototype.edges = function(style, shape, a1, a2, a3) {
	var cx = this._cx;
	if (style instanceof Array) {
		for(var i = 0; i < style.length; i++) {
			this._edge(style[i], shape, a1, a2, a3);
		}
	} else {
		this._edge(style[i], shape, a1, a2, a3);
	}
}

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
// todo remove!
/* makes a hexagon path */
Can2D.prototype.makeHexagon = function(p, r) {
	var x = p.x;
	var y = p.y;
	var r2 = C2D.half(r);
	var rc = Math.round(Hexagon.cos6 * r);
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

