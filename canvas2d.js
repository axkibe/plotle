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
| Defines: C2D
|
| Authors: Axel Kittenberger
| License: GNU Affero GPLv3
*/

"use strict";

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  ,--.  _  .-,--.
 | `-' ´ ) ' |   \
 |   .  /  , |   /
 `--'  '~` `-^--'
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
 Meshcrafts Canvas wrapper.
 
 It enhances the HTML5 Canvas Context by accpeting previously defined immutable graphic
 objects as arguments.
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
/**
| C2D()        -or-    creates new Canvas2D
| C2D(canvas)  -or-    encloses an existing HTML5 canvas
| C2D(width, height)   creates a new Canvas2D and sets its size;
*/
function C2D(a1, a2) {
	switch (typeof(a1)) {
	case 'undefined' :
		this._canvas = document.createElement("canvas");
		break;
	case 'object' :
		this._canvas = a1;
		break;
	default :
		this._canvas = document.createElement("canvas");	
		this._canvas.width  = a1;
		this._canvas.height = a2;
	}
	this._cx = this._canvas.getContext("2d");
	this.pan = C2D.Point.zero;
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
| sets a readonly value 
*/
C2D.fixate = function(obj, key, value) { 
	Object.defineProperty(obj, key, {enumerable: true, value: value}); 
	return value;
}
C2D.fixate(C2D, 'fixate', C2D.fixate);

/* divides by 2 and rounds up */
C2D.fixate(C2D, 'half',  function(v) { return Math.round(v / 2); });

/* cos(30°) */

C2D.fixate(C2D, 'cos30', Math.cos(Math.PI / 6));

/* tan(30°) */
C2D.fixate(C2D, 'tan30', Math.tan(Math.PI / 6));

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
C2D.Measure = {
	init : function() {
		Measure._canvas = document.createElement("canvas");
		Measure._cx = this._canvas.getContext("2d");
	},
	
	width : function(text) {
		return Measure._cx.measureText(text).width;
	}
}

Object.defineProperty(C2D.Measure, "font", {
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
C2D.Point = function(a1, a2) {
	if (typeof(a1) === 'object') {
		C2D.fixate(this, 'x', a1.x);
		C2D.fixate(this, 'y', a1.y);
	} else {
		C2D.fixate(this, 'x', a1);
		C2D.fixate(this, 'y', a2);
	}
}

/**
| Shortcut for point at 0/0.
*/
C2D.Point.zero = new C2D.Point(0, 0);

/** 
| Creates a point from json 
*/
C2D.Point.jnew = function(js) {
	if (typeof(js.x) !== 'number' || typeof(js.y) !== 'number') {
		throw new Error('JSON malformed point.');
	}
	return new C2D.Point(js);
}

/**
| Creates a new point.
| However it will look through a list of points to see if 
| this point has already this x/y to save creation of yet
| another object
|
| Point.renew(x, y, p1, p2, p3, ...)
*/
C2D.Point.renew = function(x, y) {
	for(var a = 2; a < arguments.length; a++) {
		var p = arguments[a];
		if (p.x === x && p.y === y) return p;
	}
	return new C2D.Point(x, y);
}

/** 
| Returns a json object for this point.
*/
C2D.Point.prototype.jsonfy = function() {
	return this._json || (this._json = { x: this.x, y: this.y });
}

/**
| Returns true if this point is equal to another.
*/
C2D.Point.prototype.eq = function(a1, a2) {
	return typeof(a1) === 'object' ? 
		this.x === a1.x && this.y === a1.y :
		this.x === a1   && this.y === a2;
}

/** 
| Adds two points or x/y values, returns a new point.
*/
C2D.Point.prototype.add = function(a1, a2) {
	return typeof(a1) === "object" ?
		new C2D.Point(this.x + a1.x, this.y + a1.y) :
		new C2D.Point(this.x + a1,   this.y + a2);
}

/** 
| Subtracts a points (or x/y from this), returns new point 
*/
C2D.Point.prototype.sub = function(a1, a2) {
	return typeof(a1) === "object" ?
		new C2D.Point(this.x - a1.x, this.y - a1.y) :
		new C2D.Point(this.x - a1,   this.y - a2);
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
C2D.Rect = function(pnw, pse) {
	if (!pnw || !pse || pnw.x > pse.x || pnw.y > pse.y) { 
		throw new Error("not a rectangle."); 
	}
	C2D.fixate(this, 'pnw',    pnw);
	C2D.fixate(this, 'pse',    pse);
	C2D.fixate(this, 'width',  pse.x - pnw.x);
	C2D.fixate(this, 'height', pse.y - pnw.y);
}

/** 
| Creates a point from json 
*/
C2D.Rect.jnew = function(js) {
	return new C2D.Rect(C2D.Point.jnew(js.pnw), C2D.Point.jnew(js.pse));
}

/** 
| Returns a json object for this rect 
*/
C2D.Rect.prototype.jsonfy = function() {
	return this._json || (this._json = { pnw: this.pnw.jsonfy(), pse: this.pse.jsonfy() });
}

/** 
| Returns a rect moved by a point or x/y 
| 
| add(point)   -or-
| add(x, y)  
*/
C2D.Rect.prototype.add = function(a1, a2) {
	return new C2D.Rect(this.pnw.add(a1, a2), this.pse.add(a1, a2));
}

/**
| Returns a rect moved by a -point or -x/-y.
|
| sub(point)   -or-
| sub(x, y)  
*/
C2D.Rect.prototype.sub = function(a1, a2) {
	return new C2D.Rect(this.pnw.sub(a1, a2), this.pse.sub(a1, a2)); 
}

/** 
| Returns true if point is within this rect.
*/
C2D.Rect.prototype.within = function(p) {
	return p.x >= this.pnw.x && p.y >= this.pnw.y && 
	       p.x <= this.pse.x && p.y <= this.pse.y;
}

/**
| Draws the rectangle.
*/
C2D.Rect.prototype.path = function(c2d, border) {
	c2d.beginPath();
	c2d.moveTo(this.pnw.x + border, this.pnw.y + border);
	c2d.lineTo(this.pse.x - border, this.pnw.y + border);
	c2d.lineTo(this.pse.x - border, this.pse.y - border);
	c2d.lineTo(this.pnw.x + border, this.pse.y - border);
	c2d.closePath();
}

/** 
| Returns a resized rectangle.
|
| width:  new width
| height: new height
| align:  compass direction which point will be identical to this rectangle.
*/
C2D.Rect.prototype.resize = function(width, height, align) {
	if (this.width === width && this.height === height) return this;
	var pnw, pse;
	switch(align) {
	case 'n' :
		pnw = C2D.Point.renew(
			this.pnw.x - half(width - this.width), 
			this.pnw.y, 
			this.pnw, this.pse);
		pse = C2D.Point.renew(
			pnw.x + width, 
			this.pnw.y + height, 
			this.pnw, this.pse);
		break;
	case 'ne' :
		pnw = C2D.Point.renew(
			this.pse.x - width, 
			this.pnw.y, 
			this.pnw, this.pse);
		pse = C2D.Point.renew(
			this.pse.x, 
			this.pnw.y + height,
			this.pnw, this.pse);
		break;
	case 'e' :
		pnw = C2D.Point.renew(
			this.pse.x - width,
			this.pnw.y - half(height - this.height), 
			this.pnw, this.pse);
		pse = C2D.Point.renew(
			this.pse.x,
			pnw.y + height,
			this.pnw, this.pse);
		break;
	case 'se' :
		pnw = C2D.Point.renew(
			this.pse.x - width,
			this.pse.y - height,
			this.pnw, this.pse);
		pse = this.pse;
		break;
	case 's' :
		pnw = C2D.Point.renew(
			this.pnw.x - half(width - this.width), 
			this.pnw.y - height, 
			this.pnw, this.pse);
		pse = C2D.Point.renew(
			pnw.x + width, 
			this.pse.y, 
			this.pnw, this.pse);
		break;
	case 'sw' :
		pnw = C2D.Point.renew(
			this.pnw.x, 
			this.pse.y - height, 
			this.pnw, this.pse);
		pse = C2D.Point.renew(
			this.pnw.x + width, 
			this.pse.y,
			this.pnw, this.pse);
		break;
	case 'w' :
		pnw = C2D.Point.renew(
			this.pnw.x,
			this.pnw.y - half(height - this.height), 
			this.pnw, this.pse);
		pse = C2D.Point.renew(
			this.pnw.x + width,
			pnw.y + height,
			this.pnw, this.pse);
		break;
	case 'nw' :
		pnw = this.pnw;
		pse = C2D.Point.renew(
			this.pnw.x + width,
			this.pnw.y + height,
			this.pnw, this.pse);
		break;
	case 'c' :
		pnw = C2D.Point.renew(
			this.pnw.x - half(width - this.width),
			this.pnw.y - half(height - this.height), 
			this.pnw, this.pse);
		pse = C2D.Point.renew(
			pnw.x + width,
			pnw.y + height,
			this.pnw, this.pse);
		break;
	default : 
		throw new Error('invalid align: '+align);
	}
	return new C2D.Rect(pnw, pse);
}

/** 
| Returns a rectangle with same size at position.
| 
| moveto(p)   -or-
| moveto(x, y)
*/
C2D.Rect.prototype.moveto = function(a1, a2) {
	if (typeof(a1) !== 'object') a1 = new C2D.Point(a1, a2);
	return new C2D.Rect(a1, a1.add(this.width, this.height));
}

/** 
| Returns true if this rectangle is the same as another 
*/
C2D.Rect.prototype.eq = function(r) {
	return this.pnw.eq(r.pnw) && this.pse.eq(r.pse);
}

/**
| Point in the center.
*/
Object.defineProperty(C2D.Rect.prototype, 'pc', {
	get: function() {
		// caches the result, so this function wont be called again for this Rect.
		return C2D.fixate(this, 'pc', new Point(
			half(this.pse.x + this.pnw.x), half(this.pse.y, this.pnw.y)));
	}
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

/**
| Constructor.
|
| Rect(rect, crad)      -or-
| Rect(pnw, pse, crad) 
*/
C2D.RoundRect = function(a1, a2, a3) {
	if (a1.constructor === C2D.Point) {
		C2D.Rect.call(this, a1, a2);
		C2D.fixate(this, 'crad', a3);
	} else {
		C2D.Rect.call(this, a1.pnw, a1.pse);
		C2D.fixate(this, 'crad', a2);
	}
}
C2D.subclass(C2D.RoundRect, C2D.Rect);

/**
| Draws the roundrect.
|
| c2d: Canvas2D area to draw upon.
| border: additional distance.
*/
C2D.RoundRect.prototype.path = function(c2d, border) {
	var nwx = this.pnw.x + border;
	var nwy = this.pnw.y + border;
	var sex = this.pse.x - border;
	var sey = this.pse.y - border;
	var cr  = this.crad  + border;
	var pi = Math.PI;
	var ph = pi / 2;
	c2d.beginPath();
	c2d.moveTo(nwx + cr, nwy);
	c2d.arc(sex - cr, nwy + cr, cr, -ph,   0, false);
	c2d.arc(sex - cr, sey - cr, cr,   0,  ph, false);
	c2d.arc(nwx + cr, sey - cr, cr,  ph,  pi, false);
	c2d.arc(nwx + cr, nwy + cr, cr,  pi, -ph, false);
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
|
| Hexagon(p, r) 
| pc: center
| r: radius
*/
C2D.Hexagon = function(pc, r) {
	if (typeof(pc) !== 'object' || pc.constructor !== C2D.Point) throw new Error('invalid pc');
	C2D.fixate(this, 'pc', pc);
	C2D.fixate(this, 'r', r);
	Object.freeze(this);
}


/** 
| Creates a hexgon from json.
*/
C2D.Hexagon.jnew = function(js) {
	return new C2D.Hexagon(js.pc, js.r);
}

/**
| Returns a json object for this rect.
*/
C2D.Hexagon.prototype.jsonfy = function() {
	return this._json || (this._json = { pc: this.pc, r: this.r });
}

/**
| Returns a hexagon moved by a point or x/y.
*/
C2D.Hexagon.prototype.add = function(a1, a2) {
	return new C2D.Hexagon(this.pc.add(a1, a2), this.r);
}

/**
| Returns true if point is within this hexagon.
*/
C2D.Hexagon.prototype.within = function(p) {
	var rc = this.r * C2D.cos30;
	var dy = this.p.y - p.y;
	var dx = this.p.x - p.x;
	var yhc6 = Math.abs(dy * C2D.cos30);
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
C2D.HexagonSlice = function(psw, rad, height) {
	C2D.fixate(this, 'psw', psw);
	C2D.fixate(this, 'rad', rad);
	C2D.fixate(this, 'height', height);
	
	if (height > rad) throw new Error('Cannot make slice larger than radius');
}

/**
| Middle(center) point of Hexagon.
*/
Object.defineProperty(C2D.HexagonSlice.prototype, 'pm', {
	get: function() {
		return C2D.fixate(this, 'pm', new Point(
			this.psw.x + this.rad - Math.round((this.rad * C2D.cos30 - this.height) * C2D.tan30), 
			this.psw.y + Math.round(this.rad * C2D.cos30) - this.height));
	}
});

/**
| pnw (used by gradients)
*/
Object.defineProperty(C2D.HexagonSlice.prototype, 'pnw', {
	get: function() { 
		return C2D.fixate(this, 'pnw', new Point(this.psw.x, this.psw.y - this.height)); 
	}
});


/**
| pse (used by gradients)
*/
Object.defineProperty(C2D.HexagonSlice.prototype, 'pse', {
	get: function() { 
		return C2D.fixate(this, 'pse', new Point(this.pm.x + this.rad, this.psw.y)); 
	}
});
	

/**
| Draws the hexagon.
*/
C2D.HexagonSlice.prototype.path = function(c2d, border) {
	var r2 = C2D.half(this.rad);
	c2d.beginPath();
	c2d.moveTo(this.psw.x                 + border, this.psw.y               - border);
	c2d.lineTo(this.pm.x - r2             + border, this.psw.y - this.height + border);
	c2d.lineTo(this.pm.x + r2             - border, this.psw.y - this.height + border);
	c2d.lineTo(2 * this.pm.x - this.psw.x - border, this.psw.y               - border);
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

 additional "segments":  todo
 	 0: inner hex
	-1: outer hex
	-2: structure

// todo replace numbers with compass names.
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
C2D.HexagonFlower = function(pc, ri, ro, segs) {
	if (ri > ro) throw new Error('inner radius > outer radius');
	C2D.fixate(this, 'pc', pc);
	C2D.fixate(this, 'ri', ri);
	C2D.fixate(this, 'ro', ro);
	C2D.fixate(this, 'gradientPC', pc);
	C2D.fixate(this, 'gradientR1', ro);
	C2D.fixate(this, 'segs', segs);
}

/**
| Makes the flower-hex-6 path.
*/
C2D.HexagonFlower.prototype.path = function(c2d, border, segment) {
	var ri  = this.ri;
	var ri2 = C2D.half(this.ri);
	var ric = Math.round(this.ri * C2D.cos30);
	var ro  = this.ro;
	var ro2 = C2D.half(this.ro);
	var roc = Math.round(this.ro * C2D.cos30);
	var pc  = this.pc;
	var pcx = pc.x, pcy = pc.y;
	var b   = border;
	var b2  = C2D.half(border);
	var bc6 = Math.round(border * C2D.cos30);
	var segs = this.segs;
	c2d.beginPath();
	/* inner hex */
	if (segment === 'innerHex' || segment === 'structure') {
		c2d.moveTo(pcx - ri  - b,  pcy             );
		c2d.lineTo(pcx - ri2 - b2, pcy - ric - bc6 );
		c2d.lineTo(pcx + ri2 + b2, pcy - ric - bc6 );
		c2d.lineTo(pcx + ri  + b,  pcy             );
		c2d.lineTo(pcx + ri2 + b2, pcy + ric + bc6 );
		c2d.lineTo(pcx - ri2 - b2, pcy + ric + bc6 );
		c2d.lineTo(pcx - ri  - b,  pcy             );	
	}

	/* outer hex */
	if (segment === 'outerHex' || segment === 'structure') {
		c2d.moveTo(pcx - ro  + b,  pcy             );
		c2d.lineTo(pcx - ro2 + b2, pcy - roc + bc6 );
		c2d.lineTo(pcx + ro2 - b2, pcy - roc + bc6 );
		c2d.lineTo(pcx + ro  - b,  pcy             );
		c2d.lineTo(pcx + ro2 - b2, pcy + roc - bc6 );
		c2d.lineTo(pcx - ro2 + b2, pcy + roc - bc6 );
		c2d.lineTo(pcx - ro  + b,  pcy             );
	}

	switch (segment) {
	case 'structure' :
		if (segs.n || segs.nw) {
			c2d.moveTo(pcx - ri2,  pcy - ric);
			c2d.lineTo(pcx - ro2,  pcy - roc);
		}
		if (segs.n  || segs.ne) {
			c2d.moveTo(pcx + ri2, pcy - ric);
			c2d.lineTo(pcx + ro2, pcy - roc);
		}
		if (segs.ne || segs.se) {
			c2d.moveTo(pcx + ri,  pcy);
			c2d.lineTo(pcx + ro,  pcy);
		}
		if (segs.se || segs.s) {
			c2d.moveTo(pcx + ri2, pcy + ric + bc6);
			c2d.lineTo(pcx + ro2, pcy + roc - bc6);
		}
		if (segs.s || segs.sw) {
			c2d.moveTo(pcx - ri2, pcy + ric + bc6);
			c2d.lineTo(pcx - ro2, pcy + roc - bc6);
		}
		if (segs.sw || segs.nw) {
			c2d.moveTo(pcx - ri, pcy);
			c2d.lineTo(pcx - ro, pcy);
		}
		break;
	case 'n':
		c2d.moveTo(pcx - ro2 + b2, pcy - roc + bc6);
		c2d.lineTo(pcx + ro2 - b2, pcy - roc + bc6);
		c2d.lineTo(pcx + ri2 + b2, pcy - ric - bc6);
		c2d.lineTo(pcx - ri2 - b2, pcy - ric - bc6);
		c2d.lineTo(pcx - ro2 + b2, pcy - roc + bc6);
		break;
	case 'ne':
		c2d.moveTo(pcx + ro2 - b2, pcy - roc + bc6);
		c2d.lineTo(pcx + ro  - b,  pcy);
		c2d.lineTo(pcx + ri  + b,  pcy);
		c2d.lineTo(pcx + ri2 + b2, pcy - ric - bc6);
		c2d.lineTo(pcx + ro2 - b2, pcy - roc + bc6);
		break;
	case 'se':
		c2d.moveTo(pcx + ro  - b,  pcy);
		c2d.lineTo(pcx + ro2 - b2, pcy + roc - bc6);
		c2d.lineTo(pcx + ri2 + b2, pcy + ric + bc6);
		c2d.lineTo(pcx + ri  + b,  pcy);
		c2d.lineTo(pcx + ro  - b,  pcy);
		break;
	case 's':
		c2d.moveTo(pcx + ro2 - b2, pcy + roc - bc6);
		c2d.lineTo(pcx - ro2 + b2, pcy + roc - bc6);
		c2d.lineTo(pcx - ri2 - b2, pcy + ric + bc6);
		c2d.lineTo(pcx + ri2 + b2, pcy + ric + bc6);
		c2d.lineTo(pcx + ro2 - b2, pcy + roc - bc6);
		break;
	case 'sw':
		c2d.moveTo(pcx - ro2 + b2, pcy + roc - bc6);
		c2d.lineTo(pcx - ro  + b,  pcy);
		c2d.lineTo(pcx - ri  - b,  pcy);
		c2d.lineTo(pcx - ri2 - b2, pcy + ric + bc6);
		c2d.lineTo(pcx - ro2 + b2, pcy + roc - bc6);
		break;
	case 'nw':
		c2d.moveTo(pcx - ro  + b,  pcy);
		c2d.lineTo(pcx - ro2 + b2, pcy - roc + bc6);
		c2d.lineTo(pcx - ri2 - b2, pcy - ric - bc6);
		c2d.lineTo(pcx - ri  - b,  pcy);
		c2d.lineTo(pcx - ro  + b,  pcy);
		break;
	}
}

/** 
| Returns the segment the point is within. 
*/
C2D.HexagonFlower.prototype.within = function(p) {
	var roc6 = this.ro * C2D.cos30;
	var dy = p.y - this.pc.y;
	var dx = p.x - this.pc.x;
	var dyc6 = Math.abs(dy * C2D.tan30);
	
	if (dy <  -roc6 || dy >  roc6 || dx - this.ro >= -dyc6 || dx + this.ro <= dyc6) {
		return null;
	}
	
	var ric6 = this.ri * C2D.cos30;
	if (dy >= -ric6 && dy <= ric6 && dx - this.ri <  -dyc6 && dx + this.ri >  dyc6) {
		return 'center';
	}

	var lor = dx <= -dy * C2D.tan30; // left of right diagonal
	var rol = dx >=  dy * C2D.tan30; // right of left diagonal
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
C2D.Line = function(p1, p1end, p2, p2end) {
	this.p1 = p1;
	this.p1end = p1end;
	this.p2 = p2;
	this.p2end = p2end;
}

/** 
| Returns the line connecting entity1 to entity2
| shape1: a Rect or Point
| end1: 'normal' or 'arrow'
| shape2: a Rect or Point
| end2: 'normal' or 'arrow'
*/
C2D.Line.connect = function(shape1, end1, shape2, end2) {
	if (!shape1 || !shape2) {
		throw new Error('error');
	}
	if (shape1.constructor === C2D.Rect && shape2.constructor === C2D.Point) {
		var p2 = shape2;
		var z1 = shape1;
		var p1;
		if (z1.within(p2)) {
			p1 = z1.pc; 
		} else {
			// todo min max
			p1 = new Point(
				p2.x < z1.pnw.x ? z1.pnw.x : (p2.x > z1.pse.x ? z1.pse.x : p2.x),
				p2.y < z1.pnw.y ? z1.pnw.y : (p2.y > z1.pse.y ? z1.pse.y : p2.y));
		}
		return new C2D.Line(p1, end1, p2, end2);
	} 
	if (shape1.constructor === C2D.Rect && shape2.constructor === C2D.Rect) {
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
		return new C2D.Line(new Point(x1, y1), end1, new Point(x2, y2), end2);
	}
	throw new Error("do not know how to create connection.");
}

/** 
| Returns the zone of the arrow.
| Result is cached.
*/
Object.defineProperty(C2D.Line.prototype, "zone", {
	get: function() { 
		if (this._zone) return this._zone;
		if (this.p1.x <= this.p2.x && this.p1.y <= this.p2.y) 
			return new C2D.Rect(this.p1, this.p2); 
		if (this.p1.x >  this.p2.x && this.p1.y >  this.p2.y) 
			return new C2D.Rect(this.p2, this.p1); 
		return new C2D.Rect(
			new Point(Math.min(this.p1.x, this.p2.x), Math.min(this.p1.y, this.p2.y)),
			new Point(Math.max(this.p1.x, this.p2.x), Math.max(this.p1.y, this.p2.y)));
	},
});

/**
| Draws the path of the line.
|
| c2d: Canvas2D to draw upon.
*/
C2D.Line.prototype.path = function(c2d) {
	var p1 = this.p1;
	var p2 = this.p2;

	c2d.beginPath();
	// todo, multiple lineend types
	switch(this.p1end) {
	case 'normal':
		c2d.moveTo(p1);
		break;
	default : 
		throw new Error('unknown line end');
	}
	
	switch(this.p2end) {
	case 'normal' :
		c2d.lineTo(p2);
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
		c2d.lineTo(
			p2.x - Math.round(ms * Math.cos(d)),
			p2.y - Math.round(ms * Math.sin(d)));
		c2d.lineTo(
			p2.x - Math.round(as * Math.cos(d - ad)), 
			p2.y - Math.round(as * Math.sin(d - ad)));
		c2d.lineTo(p2);
		c2d.lineTo(
			p2.x - Math.round(as * Math.cos(d + ad)), 
			p2.y - Math.round(as * Math.sin(d + ad)));
		c2d.lineTo(
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
C2D.Line.prototype.draw = function(c2d) {
	c2d.fills(settings.relation.style.fill, this);
	c2d.edges(settings.relation.style.edge, this);
}


/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  ,--.  _  .-,--.
 | `-' ´ ) ' |   \
 |   .  /  , |   /
 `--'  '~` `-^--'
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
 Statics and Prototype.
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

/**
| Returns the compass direction opposite of a direction.
*/
C2D.opposite = function(dir) {
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

/**
| Returns true if point is in hexagon slice.
| todo remove
*/
C2D.withinHexagonSlice = function(p, r, h) {
	var w  = r - (r * C2D.cos30 - h) * C2D.tan30;
	var rc = r * C2D.cos30;
	var yh = p.y * C2D.tan30;
	return p.y >=  -h &&         p.y <= 0 &&
	       p.x >= -yh && p.x - 2 * w <= yh;
}

/**
| Returns true if p is near the line spawned by p1 and p2.
*/
C2D.isNearLine = function(p, dis, p1, p2) {
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
C2D.ensureInteger = function() {
	for(var a in arguments) {
		var arg = arguments[a];
		if (Math.floor(arg) - arg !== 0) {
			throw new Error(arg + " not an integer");
		}
	}
}

Object.defineProperty(C2D.prototype, "width", {
	get: function() { return this._canvas.width; },
});

Object.defineProperty(C2D.prototype, "height", {
	get: function() { return this._canvas.height; },
});

/**
| The canvas is cleared and its size ensured to be width/height (of rect).
| border is an additional increase/decrease added.
|
| attune()               -or-
| attune(rect)           -or-
| attune(width, height)
*/
// todo remove resizeW resizeH again if not used.
C2D.prototype.attune = function(a1, a2) {
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
| moveTo(point) -or-
| moveTo(x, y)
*/
C2D.prototype.moveTo = function(a1, a2) {
	var pan = this.pan;
	var x, y;
	if (typeof(a1) === "object") {
		x = a1.x;
		y = a1.y;
	} else {
		x = a1;
		y = a2;
	}
	C2D.ensureInteger(x, y);
	C2D.ensureInteger(pan.x, pan.y);
	this._cx.moveTo(x + pan.x + 0.5, y + pan.y + 0.5);
}

/** 
| lineto(point) -or-
| lineto(x, y)
*/
C2D.prototype.lineTo = function(a1, a2) {
	var pan = this.pan;
	var x, y;
	if (typeof(a1) === "object") {
		x = a1.x;
		y = a1.y;
	} else {
		x = a1;
		y = a2;
	}
	C2D.ensureInteger(x, y);
	C2D.ensureInteger(pan.x, pan.y);
	this._cx.lineTo(x + pan.x + 0.5, y + pan.y + 0.5);
}

/**
| Draws an arc.
| arc(p,    radius, startAngle, endAngle, anticlockwise)   -or-
| arc(x, y, radius, startAngle, endAngle, anticlockwise)   -or-
*/
C2D.prototype.arc = function(a1, a2, a3, a4, a5, a6) {
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
| and a c2d has it defined as shortcut to frame itself.
|
| border: increase/decrease total size
*/
C2D.prototype.path = function(self, border) {
	if (this !== self) throw new Error("C2D.path: self != this");
	var cx = this._cx;
	cx.beginPath(); 
	cx.rect(
		0.5 + border, 0.5 + border, 
		this._canvas.width - 1 - border, this._canvas.height - 1 - border);
}

/** 
| Makes a stroke. todo remove
*/
C2D.prototype.stroke = function(lineWidth, style) {
//	throw new Error("stroke");
	var cx = this._cx;
	cx.lineWidth = lineWidth;
	cx.strokeStyle = style;
	cx.stroke();
}

/** 
| Makes a fill. todo remove
*/
C2D.prototype.fill = function(style) { 
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
C2D.prototype.rect = function(a1, a2, a3, a4) {
	var pan = this.pan;
	var cx = this._cx;
	if (typeof(r) === "object") {
		if (r.constructor === C2D.Rect)
			return this._cx.rect(
				a1.pnw.x + pan.x + 0.5, a1.pnw.y + pan.y + 0.5, 
				a1.width, a1.height);
		if (r.constructor === C2D.Point)
			return this._cx.rect(
				a1.x + pan.x + 0.5, a1.y + pan.y + 0.5, 
				a2.x - a1.x,        a2.y - a1.y);
		throw new Error("fillRect not a rectangle");
	}
	return this._cx.rect(a1 + pan.x + 0.5,  a2 + pan.y + 0.5, a3, a4);
}

/** 
| fillRect(style, rect)     -or-
| fillRect(style, pnw, pse) -or-
| fillRect(style, nwx, nwy, width, height)
*/
C2D.prototype.fillRect = function(style, a1, a2, a3, a4) {
	var pan = this.pan;
	var cx = this._cx;
	cx.fillStyle = style;
	if (typeof(p) === "object") {
		if (a1.constructor === C2D.Rect) 
			return this._cx.fillRect(a1.pnw.x, a1.pnw.y, a1.pse.x, a1.pse.y);
		if (a1.constructor === C2D.Point) 
			return this._cx.fillRect(a1.x, a1.y, a2.x, a2.y);
		throw new Error("fillRect not a rectangle");
	}
	return this._cx.fillRect(a1, a2, a3, a4);
}

/**
| Begins a path 
*/
C2D.prototype.beginPath = function() { this._cx.beginPath();  }

/** 
| Closes a path 
*/
C2D.prototype.closePath = function() { this._cx.closePath();  } 

/** 
| Draws an image.
|
| drawImage(image, pnw)   -or-
| drawImage(image, x, y)
*/
C2D.prototype.drawImage = function(image, a1, a2) {
	var pan = this.pan;
	if (image.constructor === C2D) image = image._canvas;
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
C2D.prototype.putImageData = function(imagedata, a1, a2) {
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
C2D.prototype.getImageData = function(a1, a2, a3, a4) {
	var pan = this.pan;
	if (typeof(p) === 'object') {
		if (a1.constructor === C2D.Rect) 
			return this._cx.getImageData(a1.pnw.x, a1.pnw.y, a1.pse.x, a1.pse.y);
		if (a1.constructor === C2D.Point) 
			return this._cx.getImageData(a1.x, a1.y, a2.x, a2.y);
		throw new Error('getImageData not a rectangle');
	}
	return this._cx.getImageData(a1, a2, a3, a4);
}

/**
| Returns a HTML5 color style for a meshcraft style notation.
*/
C2D.prototype._colorStyle = function(style, shape) {
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
C2D.prototype.fills = function(style, shape, path, a1, a2, a3) {
	var cx = this._cx;
	shape[path](this, 0, a1, a2, a3);
	cx.fillStyle = this._colorStyle(style, shape);
	cx.fill();
}

/**
| Draws a single edge.
|
| style: the style formated in meshcraft style notation.
| shape: an object which has path() defined
*/
C2D.prototype._edge = function(style, shape, path, a1, a2, a3) {
	var cx = this._cx;
	shape[path](this, style.border, a1, a2, a3);
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
C2D.prototype.edges = function(style, shape, path, a1, a2, a3) {
	var cx = this._cx;
	if (style instanceof Array) {
		for(var i = 0; i < style.length; i++) {
			this._edge(style[i], shape, path, a1, a2, a3);
		}
	} else {
		this._edge(style[i], shape, path, a1, a2, a3);
	}
}

/**
| Fills an aera and draws its borders 
*/
C2D.prototype.draw = function(style, spahe, path, a1, a2, a3) {
	throw new Error('todo');
}

/**
| Draws some text.
*/
C2D.prototype.fillText = function(text, a1, a2) {
	if (typeof(a1) === "object") {
		return this._cx.fillText(text, a1.x, a1.y);
	}
	return this._cx.fillText(text, a1, a2);
}

/**
| Draws some text rotated by phi 
| text: text to draw
| p: center point of rotation // todo pc
| phi: rotation angle
| rad:  distance from center // todo rename
*/
C2D.prototype.fillRotateText = function(text, p, phi, rad) {
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

	
/**
| Sets the fontStyle, fillStyle, textAlign, textBaseline.
|
| fontStyle(font, fill)                      -or-
| fontStyle(font, fill, align, baseline)
*/
C2D.prototype.fontStyle = function(font, fill, align, baseline) {
	var cx = this._cx;
	cx.font         = font;
	cx.fillStyle    = fill;
	cx.textAlign    = align;
	cx.textBaseline = baseline;
}

