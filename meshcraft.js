/**                                                      _.._
                                                      .-'_.._''.
 __  __   ___       _....._              .          .' .'     '.\
|  |/  `.'   `.   .´       '.          .'|         / .'                                _.._
|   .-.  .-.   ' /   .-'"'.  \        (  |        . '            .-,.-~.             .' .._|    .|
|  |  |  |  |  |/   /______\  |        | |        | |            |  .-. |    __      | '      .' |_
|  |  |  |  |  ||   __________|    _   | | .'''-. | |            | |  | | .:-`.'.  __| |__  .'     |
|  |  |  |  |  |\  (          '  .' |  | |/.'''. \. '            | |  | |/ |   \ ||__   __|'-..  .-'
|  |  |  |  |  | \  '-.___..-~. .   | /|  /    | | \ '.         .| |  '- `" __ | |   | |      |  |
|__|  |__|  |__|  `         .'.'.'| |//| |     | |  '. `.____.-'/| |      .'.''| |   | |      |  |
                   `'-.....-.'.'.-'  / | |     | |    `-._____ / | |     / /   | |_  | |      |  '.'
                                 \_.'  | '.    | '.           `  |_|     \ \._,\ '/  | |      |   /
                                       '___'   '___'                      `~~'  `"   |_|      `'*/ 


"use strict";

/**
| Subclassing helper.
| 
| sub: prototype to become a subclass.
| base: prototype to become the baseclass.
*/
function subclass(sub, base) {
   function inherit() {}
   inherit.prototype = base.prototype;
   sub.prototype = new inherit();
   sub.prototype.constructor = sub;
}

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
.---.     .  .
\___  ,-. |- |- . ,-. ,-. ,-.
    \ |-' |  |  | | | | | `-.
`---' `-' `' `' ' ' ' `-| `-'
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~,| ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
                       `'
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
/** 
| if true catches all errors and report to user.
| if false lets them pass through to e.g. firebug. 
*/
var enableCatcher = false;

var settings = {
	/* standard font */
	defaultFont : "Verdana,Geneva,Kalimati,sans-serif",
	
	/* milliseconds after mouse down, dragging starts */
	dragtime : 400,

	/* pixels after mouse down and move, dragging starts */
	dragbox  : 10,
	
	/* factor to add to the bottom of font height */
	bottombox : 0.22,
	
	/* standard note in space */
	note : {
		minWidth     : 40,
		minHeight    : 40,
		newWidth     : 300,
		newHeight    : 150,
		             
		textBorder   : 10,

		style : {
			fill : {
				gradient : 'askew',
				steps : [
					[0, "rgba(255, 255, 248, 0.955)"],
				    [1, "rgba(255, 255, 160, 0.955)"],
				],
			},
			edge : [
				{ border: 2, width : 1, color : "rgb(255, 188, 87)" },
				{ border: 1, width : 1, color : "black" },
			],
		},

		cornerRadius     : 6,
	},
	
	/* menu at the bottom of cockpit */
	edgemenu : {
		style : {
			fill : {
				gradient : 'horizontal',
				steps : [
					[ 0, "rgba(255, 255, 200, 0.90)" ],
					[ 1, "rgba(255, 255, 160, 0.90)" ], 
				],
			},
			edge : [
				{ border: 1, width :   2, color : "rgb(255, 200, 105)" },
				{ border: 0, width : 0.5, color : "black" },
			],
			select : {
				gradient : 'horizontal',
				steps : [
					[0, "rgb(255, 237, 210)" ],
					[1, "rgb(255, 185, 81)"  ],
				],
			},
		},
	},


	/* float menu */
	floatmenu : {
		outerRadius : 75,
		innerRadius : 30,
		style : {
			edge : [
				{ border: 1, width :   2, color : "rgb(255, 200, 105)" },
				{ border: 0, width : 0.5, color : "black" },
			],
			fill : {
				gradient : "radial",
				steps : [
					[ 0, "rgba(255, 255, 168, 0.955)" ], 
					[ 1, "rgba(255, 255, 243, 0.955)" ],
				],
			},
			select : {
				gradient : 'radial',
				steps : [
					[0, "rgb(255, 185, 81)"  ],
					[1, "rgb(255, 237, 210)" ],
				],
			},
		},
	},

	/* item menu  */
	itemmenu : {
		outerRadius : 75,
		innerRadius : 30,
		slice : {
			height : 17,
			style : {
				fill : {
					gradient : 'horizontal',
					steps : [
						[ 0, 'rgba(255, 255, 200, 0.9)' ],
						[ 1, 'rgba(255, 255, 205, 0.9)' ],
					],
				},
				edge : [
					{ border: 1, width :   1, color : 'rgb(255, 200, 105)' },
					{ border: 0, width : 0.7, color : 'black' },
				],
			},
		},
	},

	/* selection */
	selection : {
		color  : 'rgba(243, 203, 255, 0.9)', // todo
		stroke : 'rgb (243, 183, 253)',
	},
	
	/* scrollbar */
	scrollbar : {
		form        : 'hexagonh',  // 'square', 'round', 'hexagonh' or 'hexagonv'
		fillStyle   : 'rgb(255, 188, 87)',
		strokeStyle : 'rgb(221, 154, 52)',
		lineWidth   : 1,
		radius      : 4,
		marginX     : 7,
		marginY     : 5,
	},
	
	/* size of resize handles */
	handle : {
		size      : 10,
		distance  : 0,
		color1    : 'rgb(125,120,32)',
		width1    : 3,
		color2    : 'rgb(255,180,90)',
		width2    : 1,
	},
	
	relation : {
		style : {
			fill : 'rgba(255, 225, 40, 0.5)',
			edge : [
				{ border: 0, width : 3, color : 'rgba(255, 225, 80, 0.5)' },
				{ border: 0, width : 1, color : 'rgba(200, 100, 0, 0.8)' },
			],
		},
	},
	
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
| Rect(p1, p2) 
*/
function Rect(p1, p2) {
	this.p1 = p1;
	this.p2 = p2;
	if (p1.x > p2.x || p1.y > p2.y) { throw new Error("not a rectangle."); }
	this.otype = "rect";
	// freeze if not a father object
	if (this.constructor == Rect) Object.freeze(this);
}

/** 
| Creates a point from json 
*/
Rect.jnew = function(js) {
	return new Rect(Point.jnew(js.p1), Point.jnew(js.p2));
}

/** 
| Returns a json object for this rect 
*/
Rect.prototype.jsonfy = function() {
	return { p1: this.p1.jsonfy(), p2: this.p2.jsonfy() };
}

/** 
| Returns a rect moved by a point or x/y 
*/
Rect.prototype.add = function(px, y) {
	return arguments.length === 1 ?
		new Rect(this.p1.add(px),    this.p2.add(px)) : 
		new Rect(this.p1.add(px, y), this.p2.add(px, y));
}

/**
| Returns a rect moved by a -point or -x/-y.
*/
Rect.prototype.sub = function(p) {
	return arguments.length === 1 ?
		new Rect(this.p1.sub(px),    this.p2.sub(px)) : 
		new Rect(this.p1.sub(px, y), this.p2.sub(px, y));
}

/** 
| Returns true if point is within this rect.
*/
Rect.prototype.within = function(p) {
	return p.x >= this.p1.x && p.y >= this.p1.y && 
	       p.x <= this.p2.x && p.y <= this.p2.y;
}

/** 
| Returns a rectangle with same p1 but size w/h or point.
*/
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

/** 
| Returns a rectangle with same size at position at p|x/y).
*/
Rect.prototype.atpos = function(px, y) {
	if (arguments.length !== 1) px = new Point(px, y);
	return new Rect(px, px.add(this.w, this.h));
}

/** 
| Returns true if this rectangle is like another 
*/
Rect.prototype.eq = function(r) {
	return this.p1.eq(r.p1) && this.p2.eq(r.p2);
}

/* todo remove */
Object.defineProperty(Rect.prototype, "w", { 
	get: function()  { return this.p2.x - this.p1.x; }
});

Object.defineProperty(Rect.prototype, "width", {
	get: function()  { return this.p2.x - this.p1.x; }
});

/* todo remove */
Object.defineProperty(Rect.prototype, "h", {
	get: function()  { return this.p2.y - this.p1.y; }
});

Object.defineProperty(Rect.prototype, "height", {
	get: function()  { return this.p2.y - this.p1.y; }
});

Object.defineProperty(Rect.prototype, "mx", {
	get: function() { return R((this.p2.x + this.p1.x) / 2); }
});

Object.defineProperty(Rect.prototype, "my", {
	get: function() { return R((this.p2.y + this.p1.y) / 2); }
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
subclass(RoundRect, Rect);

/**
| Constructor.
| Rect(rect, crad)      -or-
| Rect(p1, p2, crad) 
*/
function RoundRect(a1, a2, a3) {
	if (a1.otype === "point") {
		Rect.call(this, a1, a2);
		this.crad = a3;
	} else {
		Rect.call(this, a1.p1, a1.p2);
		this.crad = a2;
	}
	this.otype = "roundrect";
	Object.freeze(this);
}

/* draws a bevel.
 *
 * c2d  ... canvas 2d
 * zone ... zone to zake the size from.
 */
RoundRect.prototype.path = function(c2d, border) {
	var x1 = border;
	var y1 = border;
	var x2 = this.w - border;
	var y2 = this.h - border;
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
	var yhc6 = abs(dy * Hexagon.cos6);
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
/*
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
		psw.x + rad - R((rad * Hexagon.cos6 - height) * Hexagon.tan6), 
		psw.y + R(rad * Hexagon.cos6) - height);
	/* for gradients only */
	/* todo rename to gradientP1, so less confuse */
	this.p1 = new Point(psw.x, psw.y - height);
	this.p2 = new Point(this.pm.x + rad, psw.y);
}

HexagonSlice.prototype.path = function(can2d, border) {
	var r2 = R(this.rad / 2);
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
	var ri2 = R(this.ri / 2);
	var ric = R(this.ri * Hexagon.cos6);
	var ro  = this.ro;
	var ro2 = R(this.ro / 2);
	var roc = R(this.ro * Hexagon.cos6);
	var pc  = this.pc;
	var pcx = pc.x, pcy = pc.y;
	var b   = border;
	var b2  = R(border / 2);
	var bc6 = R(border * Hexagon.cos6);
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


/* 
| returns the segment a point is within 
*/
HexagonFlower.prototype.within = function(p) {
	var roc6 = this.ro * Hexagon.cos6;
	var dy = p.y - this.pc.y;
	var dx = p.x - this.pc.x;
	var dyc6 = abs(dy * Hexagon.tan6);
	
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
		debug(shape1, '|-|', shape2);
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
				p2.x < z1.p1.x ? z1.p1.x : (p2.x > z1.p2.x ? z1.p2.x : p2.x),
				p2.y < z1.p1.y ? z1.p1.y : (p2.y > z1.p2.y ? z1.p2.y : p2.y));
		}
		return new Line(p1, end1, p2, end2);
	} 
	if (shape1.otype === 'rect' && shape2.otype === 'rect') {
		var z1 = shape1;
		var z2 = shape2;
		var x1, y1, x2, y2;
		if (z2.p1.x > z1.p2.x) { 
			// zone2 is clearly on the right 
			x1 = z1.p2.x;
			x2 = z2.p1.x;
		} else if (z2.p2.x < z1.p1.x) {
			// zone2 is clearly on the left 
			x1 = z1.p1.x;
			x2 = z2.p2.x;
		} else {
			// an intersection 
			x1 = x2 = R((max(z1.p1.x, z2.p1.x) +
			             min(z1.p2.x, z2.p2.x)) / 2);
		}
		if (z2.p1.y > z1.p2.y) { 
			// zone2 is clearly on the bottom 
			y1 = z1.p2.y;
			y2 = z2.p1.y;
		} else if (z2.p2.y < z1.p1.y) {
			// zone2 is clearly on the top 
			y1 = z1.p1.y;
			y2 = z2.p2.y;
		} else {
			// an intersection 
			y1 = y2 = R((max(z1.p1.y, z2.p1.y) +
			             min(z1.p2.y, z2.p2.y)) / 2);
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
			new Point(min(this.p1.x, this.p2.x), min(this.p1.y, this.p2.y)),
			new Point(max(this.p1.x, this.p2.x), max(this.p1.y, this.p2.y)));
	},
});

/**
| todo
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
		can2d.lineTo(p2.x - R(ms * Math.cos(d)),      p2.y - R(ms * Math.sin(d)));
		can2d.lineTo(p2.x - R(as * Math.cos(d - ad)), p2.y - R(as * Math.sin(d - ad)));
		can2d.lineTo(p2);
		can2d.lineTo(p2.x - R(as * Math.cos(d + ad)), p2.y - R(as * Math.sin(d + ad)));
		can2d.lineTo(p2.x - R(ms * Math.cos(d)),      p2.y - R(ms * Math.sin(d)));
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

/*
| returns true if point is in hexagon slice
*/
Can2D.withinHexagonSlice = function(p, r, h) {
	var w  = r - (r * Hexagon.cos6 - h) * Hexagon.tan6;
	var rc = r * Hexagon.cos6;
	var yh = p.y * Hexagon.tan6;
	return p.y >=  -h &&         p.y <= 0 &&
	       p.x >= -yh && p.x - 2 * w <= yh;
}

/*
| returns true if p is near the line spawned by p1 and p2
*/
Can2D.isNearLine = function(p, dis, p1, p2) {
	var dx = (p.x - p1.x);
	var dy = (p.y - p1.y);
	if (abs(dx) < 8 && abs(dy) < 8) {
		return true;
	}
	if (abs(dx) < dis) {
		return abs(dx - (p2.x - p1.x) / (p2.y - p1.y) * dy) < dis;
	} else {
		return abs(dy - (p2.y - p1.y) / (p2.x - p1.x) * dx) < dis;
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

/*
| attune()                   -or-
| attune(rect)               -or-
| attune(width, height)
| 
| The canvas is cleared and its size ensured to be width/height (of rect).
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
*/
Can2D.prototype.path = function(border) {
	var cx = this._cx;
	cx.beginPath(); 
	cx.rect(0.5, 0.5, this._canvas.width - 1, this._canvas.height - 1);
}

/** 
| Makes a stroke. 
*/
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
| drawImage(image, p)      -or-
| drawImage(image, x, y)
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


/** 
| putImageData(image, p) -or-
| putImageData(image, x, y)
*/
Can2D.prototype.putImageData = function(image, p) {
	var pan = this.pan;
	if (typeof(p) === "object") {
		this._cx.putImageData(image, p.x + pan.x, p.y + pan.y);
		return;
	}
	this._cx.putImageData(image, p + pan.x, arguments[2] + pan.y);
}

/**
| getImageData(rect)   -or-
| getImageData(p1, p2) -or-
| getImageData(x1, y1, x2, y2)
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
		// todo use gradientP1
		if (!shape.p1 || !shape.p2) throw new Error(style.gradient+' gradiend misses p1/p2');
		grad = this._cx.createLinearGradient(
			shape.p1.x + this.pan.x, shape.p1.y + this.pan.y, 
			shape.p1.x + (shape.p2.x - shape.p1.x) / 10 + this.pan.x, shape.p2.y + this.pan.y);
		break;
	case 'horizontal' :
		// todo use gradientP1
		if (!shape.p1 || !shape.p2) throw new Error(style.gradient+' gradient misses p1/p2');
		grad = this._cx.createLinearGradient(
			0, this.pan.y + shape.p1.y, 
			0, this.pan.y + shape.p2.y);
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

/* createRadialGradient(center, radius, center2, radius2) 
 */
Can2D.prototype.createRadialGradient = function(p, r, p2, r2) {
	return this._cx.createRadialGradient(p.x, p.y, r, p2.x, p2.y, r2);
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

/* makes a hexagon path */
Can2D.prototype.makeHexagon = function(p, r) {
	var x = p.x;
	var y = p.y;
	var r2 = R(r / 2);
	var rc = R(Hexagon.cos6 * r);
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
		rado |------>| 
        radi |->.    '
         .------'.   '      -1
		/ \  1  / \	 '
	   / 6 .---.'2 \ '
	  /___/  .  \___\'  
	  \   \  0  /   /
	   \ 5 `---´ 3 /
 	    \ /  4  \ /
         `-------´  
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
function Hexmenu(p, radi, rado, labels) {
	this.p = p;
	this.radi = radi;
	this.rado = rado;
	this.hflower = new HexagonFlower(p, radi, rado, labels);

	this.hi = new Hexagon(p, radi);
	this.ho = new Hexagon(p, rado);
	this.labels = labels;
	this.mousepos = -1;
}

Hexmenu.prototype.draw = function() {
	var c2d = System.can2d; // todo?

	c2d.fills(settings.floatmenu.style.fill, this.hflower, -1);
	if (this.mousepos > 0) {
		c2d.fills(settings.floatmenu.style.select, this.hflower, this.mousepos);
	}
	c2d.edges(settings.floatmenu.style.edge, this.hflower, -2); 

	c2d.fontStyle("12px " + settings.defaultFont, "black", "center", "middle");
	var labels = this.labels;
	var llen = labels.length;
	
	var rd = this.ho.r * (1 - 1 / 3.5);
	switch (llen - 1) {
	default:
	case 6: c2d.fillRotateText(labels[6], this.p, Math.PI / 3 * 5, rd); 
	/* fall */
	case 5: c2d.fillRotateText(labels[5], this.p, Math.PI / 3 * 4, rd);
	/* fall */
	case 4: c2d.fillRotateText(labels[4], this.p, Math.PI / 3 * 3, rd);
	/* fall */
	case 3: c2d.fillRotateText(labels[3], this.p, Math.PI / 3 * 2, rd);
	/* fall */
	case 2: c2d.fillRotateText(labels[2], this.p, Math.PI / 3 * 1, rd);
	/* fall */
	case 1: c2d.fillRotateText(labels[1], this.p, Math.PI / 3 * 6, rd);
	/* fall */
	case 0: c2d.fillText(labels[0], this.p);
	}
}

// todo remove.
Hexmenu.prototype._getMousepos = function(p) {
	return this.mousepos = this.hflower.within(p);
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
	/* section mouse hovers over/clicks */
	this.mousepos = -1;

	/* widths of buttons (meassured on bottom) */
	this.buttonWidths = [100, 150, 100];

	/* label texts */
	this.labels = ["Export", "Meshcraft Demospace", "Import"];

	/* total width */
	this.width = 0;
	for(var b in this.buttonWidths) {
		this.width += this.buttonWidths[b];
	}
	
	/* total height */
	this.height = 30;
}

/**
| Makes the edgemenus path.
|
| c2d : canvas2d area
| border: additional inward distance
| section: 
|   -2 structure frame
|   -1 outer frame
|   >0 buttons
*/
Edgemenu.prototype.path = function(c2d, border, section) {
	var b =  border;
	/* width half */
	var w2 = R(this.width / 2);
	/* x in the middle */
	var xm = R((this.p1.x + this.p2.x) / 2);
	/* edge width (diagonal extra) */
	var ew  = R((this.p2.y - this.p1.y) * Hexagon.tan6);

	c2d.beginPath();
	if (section === -2) {
		/* structure frame */
		c2d.moveTo(this.p1.x + b,      this.p2.y);
		c2d.lineTo(this.p1.x + ew + b, this.p1.y + b);
		c2d.lineTo(this.p2.x - ew - b, this.p1.y + b);
		c2d.lineTo(this.p2.x - b,      this.p2.y);
	
		/* x-position of button */
		var bx = this.p1.x;
		for(var b = 0; b < this.buttonWidths.length - 1; b++) {
			bx += this.buttonWidths[b];
			c2d.moveTo(bx, this.p2.y);
			if (b % 2 === 0) { 
				c2d.lineTo(bx - ew, this.p1.y);
			} else {
				c2d.lineTo(bx + ew, this.p1.y);
			}
		}
	} else if (section === -1) {
		/* outer frame */
		c2d.moveTo(this.p1.x + b,      this.p2.y);
		c2d.lineTo(this.p1.x + ew + b, this.p1.y + b);
		c2d.lineTo(this.p2.x - ew - b, this.p1.y + b);
		c2d.lineTo(this.p2.x - b,      this.p2.y);
	} else {
		if (section < 0) throw new Error("invalid section");
		var bx = this.p1.x;
		for(var b = 0; b < section; b++) {
			bx += this.buttonWidths[b];
		}
		c2d.moveTo(bx, this.p2.y);
		if (section % 2 === 0) {
			c2d.lineTo(bx + ew, this.p1.y);
			bx += this.buttonWidths[section];
			c2d.lineTo(bx - ew, this.p1.y);
			c2d.lineTo(bx,      this.p2.y);
		} else {
			c2d.lineTo(bx - ew, this.p1.y);
			bx += this.buttonWidths[section];
			c2d.lineTo(bx + ew, this.p1.y);
			c2d.lineTo(bx,      this.p2.y);
		}
	}
}

Edgemenu.prototype.draw = function() {
	var c2d = System.can2d;
	var xm  = R(c2d.width / 2);
	var w2  = R(this.width / 2);

	{
		var px1 = xm - w2, py1 = c2d.height - this.height;
		var px2 = xm + w2, py2 = c2d.height;
		if (!this.p1 || this.p1.x !== px1 || this.p1.y !== py1) 
			this.p1 = new Point(px1, py1);
		if (!this.p2 || this.p2.x !== px2 || this.p2.y !== py2) 
			this.p2 = new Point(px2, py2);
	}

	c2d.fills(settings.edgemenu.style.fill, this, -1);
	if (this.mousepos >= 0) {
		c2d.fills(settings.edgemenu.style.select, this, this.mousepos);
	}
	c2d.edges(settings.edgemenu.style.edge, this, -2); 

	c2d.fontStyle("12px " + settings.defaultFont, "black", "center", "middle");
	var bx = this.p1.x;
	var my = R((this.p1.y + this.p2.y) / 2);
	for(var i = 0; i < this.labels.length; i++) {
		c2d.fillText(this.labels[i], bx + R(this.buttonWidths[i] / 2), my);
		bx += this.buttonWidths[i];
	}
}

Edgemenu.prototype._getMousepos = function(p) {
	var c2d = System.can2d;
	if (!this.p1 || !this.p2) return this.mousepos = -1;
	if (p.y < this.p1.y) return this.mousepos = -1;
	var mx = R(canvas.width / 2);
	var ew = R((this.p2.y - this.p1.y) * Hexagon.tan6);
	/* shortcut name = letters for formula */
	var pymcht6 = (p.y - c2d.height) * Hexagon.tan6;

	if (p.x - this.p1.x < -pymcht6) return this.mousepos = -1;
	if (p.x - this.p2.x >  pymcht6) return this.mousepos = -1;
	var bx = this.p1.x;
	for(var mp = 0; mp < this.buttonWidths.length; mp++) {
		bx += this.buttonWidths[mp];
		if (mp % 2 === 0) {
			if (p.x - bx < pymcht6) return this.mousepos = mp;
		} else {
			if (p.x - bx < -pymcht6) return this.mousepos = mp;
		}
	}
	throw new Error("this code should not be reached");
	return this.mousepos = -1;
}

/* returns true if this.mousepos has changed*/
Edgemenu.prototype.mousehover = function(p) {	
	var omp = this.mousepos;
	return omp != this._getMousepos(p);
}

Edgemenu.prototype.mousedown = function(x, y) { // todo why x,y
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
 The  '  are where all the items are in.     
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
function Space() {
	this._floatMenuLabels = ["new", "Note", "Label"];
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
	var can2d = this.can2d;
	editor.caret.save = null;
	this.selection = editor.selection;
	this.canvas = System.canvas;
	can2d.attune();

	for(var i = zidx.length - 1; i >= 0; i--) {
		var it = items[zidx[i]]; // todo shorten
		it.draw(can2d, this.selection);
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
		var arrow = Line.connect(
			ia.item.zone, 'normal', 
			(ia.item2 && ia.item2.zone) || ia.smp , 'arrow');
		if (ia.item2) ia.item2.highlight(can2d);
		arrow.draw(can2d);
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
	var rel = Relation.create(this.iaction.item, toItem);
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
		this._itemmenu = focus.newItemMenu(this.pan);
		this.iaction.act = ACT.IMENU;
		this.redraw();
		return;
	}

	var tfx = System.repository.transfix(TXE.CLICK, this, pp, shift, ctrl);
	if (!(tfx & TXR.HIT)) {
		this.iaction.act = ACT.FMENU;
		this._floatmenu = new Hexmenu(p, 
			settings.floatmenu.innerRadius,
			settings.floatmenu.outerRadius,
			this._floatMenuLabels);

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
		var scrollRange = h - settings.scrollbar.marginY * 2;
		var dtreeHeight = it.dtree.height;
		var innerHeight = h - 2 * it.textBorder;
		var scrollSize  = scrollRange * innerHeight / dtreeHeight;
		var srad = settings.scrollbar.radius;
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
			this._exportDialog();
			break;
		case 1:
			this._revertDialog();
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
			var nw = settings.note.newWidth;
			var nh = settings.note.newHeight;
			// todo, beautify point logic.
			var p1 = fm.p.sub(R(nw / 2) + this.pan.x, R(nh / 2) + this.pan.y);
			var p2 = p1.add(nw, nh);
			var note = new Note(null, null, new Rect(p1, p2));
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
/**
| Constructor.
*/
function DTree(fontsize) {
	Treenode.call(this, "dtree");
	this._fontsize = fontsize || 13;
}

/**
| Creates a Dtree from json representation.
*/
DTree.jnew = function(js) {
	var o = new DTree(js.fs);
	var d = js.d;
	for(var i = 0, dlen = d.length; i < dlen; i++) {
		o.append(new Paragraph(d[i]));
	}
	return o;
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
		
/* returns the chunk at x,y */
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
			c2d.stroke(1, settings.selection.stroke);
			c2d.fill(settings.selection.color);
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
			c2d.stroke(1, settings.selection.stroke);
			c2d.fill(settings.selection.color);
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
					c2d.fill(settings.selection.color);
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
	this._h6slice = null;
}

/**
| Return the hexgon slice that is the handle
*/
Object.defineProperty(Item.prototype, "h6slice", {
	get: function() { 
		if (this._h6slice && this._h6slice.psw.eq(this.zone.p1)) return this._h6slice;
		return this._h6slice = new HexagonSlice(
			this.zone.p1, settings.itemmenu.innerRadius, settings.itemmenu.slice.height);
	},
});

/* set a hex menu to be this items menu */
Item.prototype.newItemMenu = function(pan) {
	var r = settings.itemmenu.innerRadius;
	var h = settings.itemmenu.slice.height;
	var labels = this._itemMenuLabels = ["", "Remove"];
	// todo why pan?
	var p = new Point(
		R(this.zone.p1.x + pan.x + r - (r * Hexagon.cos6 - h) * Hexagon.tan6), 
		R(this.zone.p1.y + pan.y + r * Hexagon.cos6 - h) - 1);
	return new Hexmenu(p, settings.itemmenu.innerRadius, settings.itemmenu.outerRadius, labels);
}

/* returns if coords are within the item menu */
/* todo xxx */
Item.prototype.withinItemMenu = function(p) {
	return Can2D.withinHexagonSlice(p.sub(this.zone.p1), 
		settings.itemmenu.innerRadius, 
		settings.itemmenu.slice.height);
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
	var d  = settings.handle.size;         // inner distance
	var d2 = settings.handle.size * 3 / 4; // outer distance
	
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
	var ds = settings.handle.distance; 			
	var hs = settings.handle.size;
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
			
	if (rhs > 0 && settings.handle.width1 > 0) {
		c2d.stroke(settings.handle.width1, settings.handle.color1);
	}
	if (rhs > 0 && settings.handle.width2 > 0) {
		c2d.stroke(settings.handle.width2, settings.handle.color2);
	}
	
	/* draws item menu handler */
	var h6slice = this.h6slice;
	c2d.fills(settings.itemmenu.slice.style.fill, h6slice);
	c2d.edges(settings.itemmenu.slice.style.edge, h6slice);
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
// todo split jnew
function Note(js, id, zone) {
	if (js) {
		var rect  = Rect.jnew(js.z);
		this.zone = zone = Rect.jnew(js.z);
		this.dtree = DTree.jnew(js.d);
	} else {
		this.zone  = zone;
		this.dtree = new DTree();
	}
	this.dtree.parent = this;
	this.silhoutte = new RoundRect(
		Point.zero, new Point(zone.width, zone.height), settings.note.cornerRadius); 
	Item.call(this, "note", id);
	this._bcan2d = new Can2D();
	this.textBorder = settings.note.textBorder;
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

		var srad = settings.scrollbar.radius;
		var sbmx = settings.scrollbar.marginX;
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
	if (zone.w < settings.note.minWidth || zone.h < settings.note.minHeight) {
		zone = zone.resize(
			max(zone.w, settings.note.minWidth),
			max(zone.h, settings.note.minHeight), align);
	}
	if (this.zone.eq(zone)) return false;
	this.zone      = zone;
	this.silhoutte = new RoundRect(
		Point.zero, new Point(zone.width, zone.height), this.silhoutte.crad);
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
	
/**
| Draws the note.
|
| can2d: canvas-2d to draw upon.
| selection: current selection to highlight.
*/
Note.prototype.draw = function(can2d, selection) {
	var bc2d  = this._bcan2d;
	var dtree = this.dtree;
	if (this._canvasActual) {
		/* buffer hit */
		can2d.drawImage(bc2d, this.zone.p1);
		return;
	}

	bc2d.attune(this.zone);
	bc2d.fills(settings.note.style.fill, this.silhoutte);

	/* calculates if a scrollbar is needed */
	var sy = this._scrolly;
	var innerHeight = this.zone.h - 2 * this.textBorder;
	dtree.flowWidth = 
		this.zone.w - 2 * this.textBorder - (sy >= 0 ? settings.scrollbar.radius * 2 : 0);
	var dtreeHeight = dtree.height;
	if (sy < 0) {
		if (dtreeHeight > innerHeight) {
			/* does not use a scrollbar but should */
			sy = this._scrolly = 0;		
			dtree.flowWidth = 
				this.zone.w - 2 * this.textBorder - (sy >= 0 ? settings.scrollbar.radius * 2 : 0);
			dtreeHeight = dtree.height;
			if (dtreeHeight <= innerHeight) {
				throw new Error("note doesnt fit with and without scrollbar.");			
			}
		}
	} else if (dtreeHeight <= innerHeight) {
		/* uses a scrollbar but should */
		sy = this._scrolly = -8833;
		dtree.flowWidth = this.zone.w - 
			2 * this.textBorder - 
			(sy >= 0 ? settings.scrollbar.radius * 2 : 0);
		dtreeHeight = dtree.height;
		if (dtreeHeight > innerHeight) {
			throw new Error("note doesnt fit with and without scrollbar.");			
		}
	}
	
	/* draws selection and text */	
	dtree.draw(bc2d, selection, this.textBorder, this.textBorder, sy < 0 ? 0 : R(sy));
	
	if (sy >= 0) {
		/* draws the vertical scroll bar */
		var srad   = settings.scrollbar.radius;
		var srad05 = R(settings.scrollbar.radius * 0.5);
		var spx  = this.zone.w - settings.scrollbar.marginX - srad;
		var scrollRange = this.zone.h - settings.scrollbar.marginY * 2;
		var scrollSize  = scrollRange * innerHeight / dtreeHeight;
		if (scrollSize < srad * 2) {
			/* minimum size of scrollbar */
			scrollSize = srad * 2;
		}
						
		var spy = R(settings.scrollbar.marginY + 
			sy / (dtreeHeight - innerHeight) * (scrollRange - scrollSize));
		
		switch (settings.scrollbar.form) {
		case 'round' :
			bc2d.beginPath();
			bc2d.arc(spx, spy + srad, srad, Math.PI, 0, false);
			bc2d.arc(spx, spy + scrollSize - srad, srad, 0, Math.PI, false);
			bc2d.closePath();
			bc2d.fill(settings.scrollbar.fillStyle);
			bc2d.stroke(settings.scrollbar.lineWidth, settings.scrollbar.strokeStyle);
			break;
		case 'square' :
			bc2d.fillRect(settings.scrollbar.fillStyle, spx, spy, srad + 2, scrollSize);
			break;
		case 'hexagonh' :
			bc2d.beginPath();
			bc2d.moveTo(spx - srad,   R(spy + Hexagon.cos6 * srad));
			bc2d.lineTo(spx - srad05, spy);
			bc2d.lineTo(spx + srad05, spy);
			bc2d.lineTo(spx + srad,   R(spy + Hexagon.cos6 * srad));
			bc2d.lineTo(spx + srad,   R(spy + scrollSize - Hexagon.cos6 * srad));
			bc2d.lineTo(spx + srad05, R(spy + scrollSize));
			bc2d.lineTo(spx - srad05, R(spy + scrollSize));
			bc2d.lineTo(spx - srad,   R(spy + scrollSize - Hexagon.cos6 * srad));
			bc2d.closePath();
			bc2d.fill(settings.scrollbar.fillStyle);
			bc2d.stroke(settings.scrollbar.lineWidth, settings.scrollbar.strokeStyle);
			break;
		case 'hexagonv' :
			bc2d.beginPath();
			bc2d.moveTo(spx - srad, R(spy + Hexagon.cos6 * srad));
			bc2d.lineTo(spx, spy);
			bc2d.lineTo(spx + srad, spy + Hexagon.cos6 * srad);
			bc2d.lineTo(spx + srad, R(spy + scrollSize - Hexagon.cos6 * srad));
			bc2d.lineTo(spx, R(spy + scrollSize));
			bc2d.closePath();
			bc2d.lineTo(spx - srad, R(spy + scrollSize - Hexagon.cos6 * srad));
			bc2d.fill(settings.scrollbar.fillStyle);
			bc2d.stroke(settings.scrollbar.lineWidth, settings.scrollbar.strokeStyle);
			break;
		default :
			throw new Error("invalid settings.scrollbar.form");
		}
	}

	/* draws the border */
	bc2d.edges(settings.note.style.edge, this.silhoutte);
	
	this._canvasActual = true;
	can2d.drawImage(bc2d, this.zone.p1);
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
// todo split jnew
function Label(js, id, p1) {
	if (js) {
		this.zone = Rect.jnew(js.z);
		this.dtree = DTree.jnew(js.d);
	} else {
		this.zone = new Rect(p1, p1.add(100, 50));
		this.dtree = new DTree(20);
	}
	this.dtree.parent = this;
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
Label.prototype.draw = function(can2d, selection) {
	var bc2d = this._bc2d;
	var dtree = this.dtree;
	if (this._canvasActual) {
		/* buffer hit */
		can2d.drawImage(bc2d, this.zone.p1);
		return;
	}
	bc2d.attune(this.zone);
	/* draws text */	
	dtree.draw(bc2d, selection, 0, 0, 0);
	/* draws the border */
	bc2d.beginPath(); 
	bc2d.rect(0, 0, bc2d.width - 1, bc2d.height - 1);  
	bc2d.stroke(1, "rgba(128,128,128,1)"); // todo settings
	this._canvasActual = true;
	can2d.drawImage(bc2d, this.zone.p1);
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

/**
| Constructor.
| Do not call directly, but Relation.jnew() or Relation.create()
| Relation(id, i1id, i2id, textZone, [dtree]) 
*/
function Relation(id, i1id, i2id, textZone, dtree) {
	this.i1id     = i1id;
	this.i2id     = i2id;
	this.textZone = textZone;
	this.dtree    = dtree;
	this.dtree.parent = this;	
	this.dtree.flowWidth = -1;
	Item.call(this, 'rel', id);
	this._bc2d = new Can2D();
	this._canvasActual = false;
	
	System.repository.addItem(this, true);
	System.repository.addOnlook(this.id, this.i1id);
	System.repository.addOnlook(this.id, this.i2id);
}

/**
| Creates a relation from json representation.
*/
Relation.jnew = function(js) {
	var tz;
	if (js.tz) {
		tz = Rect.jnew(js.tz);
	} else {
		// todo remove
		tz = new Rect(new Point(0, 0), new Point(100, 100));
	}
	var dtree = DTree.jnew(js.d);
	var o = new Relation(js.id, js.i1, js.i2, tz, dtree);
}

/**
| Creates a new Relation.
*/
Relation.create = function(item1, item2) {
	var dtree = new DTree();
	dtree.append(new Paragraph("relates to"));
	dtree.flowWidth = -1;
	var cline = Line.connect(item1.zone, null, item2.zone, null);
	var mx = (cline.p1.x + cline.p2.x) / 2;
	var my = (cline.p1.y + cline.p2.y) / 2;
	var textZone = new Rect(
		new Point(R(mx - dtree.width / 2), R(my - dtree.height / 2)),
		new Point(R(mx + dtree.width / 2), R(my + dtree.height / 2)));
	return new Relation(null, item1.id, item2.id, textZone, dtree);

/*
	xxx
	if (mcanvas) {
	var it1 = System.repository.items[this.i1id]; // todo funcall
	var it2 = System.repository.items[this.i2id];
		var mx = ((p1.x + p2.x) / 2);
		var my = ((p1.y + p2.y) / 2);
		var tx = R(mx - mcanvas.width  / 2) - 2;
		var ty = R(my - mcanvas.height / 2) - 2;
		var bx = R(mx + mcanvas.width  / 2) + 2;
		var by = R(my + mcanvas.height / 2) + 2;
		can2d.drawImage(mcanvas, tx, ty);
		can2d.rect(tx, ty, mcanvas.width + 4, mcanvas.height + 4);
		can2d.stroke(1, "rgba(255, 127, 0, 0.4)"); // todo settings
		can2d.beginPath();

		// calculates intersections
		var isp1, isp2;	
		if (p1.y == p2.y) {
			var kx = mcanvas.width / 2;
			if (p1.x > p2.x) {
				isp1 = new Point(R(mx + kx), p1.y);
				isp2 = new Point(R(mx - kx), p1.y);
			} else {
				isp1 = new Point(R(mx - kx), p1.y);
				isp2 = new Point(R(mx + kx), p1.y);
			}
		} else {
			var kx = ((p2.x - p1.x) / (p2.y - p1.y) * mcanvas.height / 2);
			if (p1.y > p2.y) {
				isp1 = new Point(R(mx + kx), by);
				isp2 = new Point(R(mx - kx), ty);
			} else {
				isp1 = new Point(R(mx - kx), ty);
				isp2 = new Point(R(mx + kx), by);
			}
		}
		if (isp1.x < tx || isp1.x > bx) {
			var ky = ((p2.y - p1.y) / (p2.x - p1.x) * mcanvas.width  / 2);
			if (p1.x > p2.x) {
				isp1 = new Point(bx, R(my + ky));
				isp2 = new Point(tx, R(my - ky));
			} else {
				isp1 = new Point(tx, R(my - ky));
				isp2 = new Point(by, R(my + ky));
			}
		}

		can2d.moveTo(p1);
		can2d.lineTo(isp1);
		can2d.stroke(3, "rgba(255, 225, 80, 0.5)"); // todo settings
		can2d.stroke(1, "rgba(200, 100, 0, 0.8)");  // todo settings
		
		po = isp2;
	} else {
		po = p1;
	}*/
}



/** 
| Called when ab item is removed.
*/
Relation.prototype.removed = function() {
	System.repository.removeOnlook(this.id, this.i1id);
	System.repository.removeOnlook(this.id, this.i2id);	
}


/**
| Returns json representation.
*/
Relation.prototype.jsonfy = function() {
	var js = {
	    t: "rel",
		i1: this.i1id,
		i2: this.i2id,
		d: this.dtree.jsonfy(true),
	}
	return js;
}

/** 
| Returns the arrow object of this relation 
*/
/*
Object.defineProperty(Relation.prototype, "arrow", {
	get: function() { 
		if (this._arrow) return this._arrow;
		var i1 = System.repository.items[this.i1id];  // todo make funcall
		var i2 = System.repository.items[this.i2id];
		// caches the zones, so the relation knows when one its anchors moved 
		this.i1zone = i1.zone;
		this.i2zone = i2.zone;
		return this._arrow = Arrow.create(i1, i2);
	}
});*/

/** 
| An action happend.
| Returns transfix code.
*/
Relation.prototype.transfix = function(txe, space, p, z, shift, ctrl) {
	return 0;
	/*
	var arrow = this.arrow;
	var zone  = arrow.zone;
	// distance to line recognized as hit 
	var dis   = 8;
	if (p.x < zone.p1.x - dis || p.x > zone.p2.x + dis ||
	    p.y < zone.p1.y - dis || p.y > zone.p2.y + dis) {
		return 0;
	}
	switch (txe) {
	case TXE.HOVER : 
		if (Can2D.isNearLine(p, dis, arrow.p1, arrow.p1)) {
			System.setCursor("move");
			return TXR.HIT;
		} else {
			return 0;
		}
	case TXE.DRAGSTART :
		var txr = TXR.HIT;
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

		var srad = settings.scrollbar.radius;
		var sbmx = settings.scrollbar.marginX;
		if (this.scrolly >= 0 && abs(p.x - this.zone.p2.x + srad + sbmx) <= srad + 1)  {
			space.actionScrollY(this, p.y, this.scrolly);
		} else {
			space.actionIDrag(this, p.sub(this.zone.p1));
		}
		return txr;
		return 0;
	case TXE.CLICK :
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
		return txr;
	case TXE.RBINDHOVER :
		// space.actionRBindHover(this);
		return TXR.HIT | TXR.REDRAW; 
		return 0;
	case TXE.RBINDTO :
		// space.actionRBindTo(this);
		return TXR.HIT | TXR.REDRAW; 
		return 0;
	default :
		throw new Error("Unknown transfix code:" + txe);
	}*/
}

/** 
| Drops the cached canvas.
*/
Relation.prototype.listen = function() {
	this._canvasActual = false;
	// end of listen chain 
}

Relation.prototype.resize = function(width, height) {
	/*var dtree = this.dtree;
	var fs = max(dtree.fontsize * height / this.height, 8);
	if (dtree._fontsize == fs) return false;
	dtree.fontsize = fs;
	this._canvasActual = false;
	return true;*/
	throw new Error('unimplemented');
}

/* draws the items handles */
Relation.prototype.drawHandles = function(space) {
	this._drawHandles(space, 170);
}

Relation.prototype.checkItemCompass = function(p, rhs) { 
	return this._checkItemCompass(p, 170);
}

/**
| Draws the item.
*/
Relation.prototype.draw = function(can2d, selection) {
	var bc2d = this._bc2d;
	var dtree = this.dtree;
	var it1 = System.repository.items[this.i1id]; // todo funcall
	var it2 = System.repository.items[this.i2id];
	if (!this._canvasActual) {
		bc2d.attune(dtree); 
		bc2d.edges(settings.relation.style.edge, bc2d);
		dtree.draw(bc2d, selection, 0, 0, 0);
		this._canvasActual = true;
	}
	var l1 = Line.connect(it1.zone,     'normal', this.textZone, 'normal');
	var l2 = Line.connect(this.textZone,'normal', it2.zone,      'arrow');
	//can2d.draw(bc2d, xx
	can2d.drawImage(bc2d, this.textZone.p1);
	// todo combine into one call;
	can2d.fills(settings.relation.style.fill, l1);
	can2d.edges(settings.relation.style.edge, l1);
	can2d.fills(settings.relation.style.fill, l2); 
	can2d.edges(settings.relation.style.edge, l2);
	// draws text 
}

/**
| Something happend on an item onlooked. 
*/
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
		/*if ((item.id === this.i1id && !item.zone.eq(this.i1zone)) ||
		    (item.id === this.i2id && !item.zone.eq(this.i2zone))) {
			this._arrow = null;		
		}*/
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
	case "rel"   : return Relation.jnew(itjs, id);
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
