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
	scrollbarLineWidth   : 2,
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

/* shortcuts */
var R = Math.round;

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
	
var TXE = {
	/* which kind of event transfix() calls for all items which intersect x/y */
	NONE       : 0,
	DRAGSTART  : 1,
	HOVER      : 2,
	RBINDHOVER : 3, 
	RBINDTO    : 4,
}

var TXR = {	
	/* bitfield return code of transfix() */
	HIT    : 0x1,
	REDRAW : 0x2
};

/* onlook() events */
var ONLOOK = {
	NONE   : 0,
	REMOVE : 1,
}


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

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ,-,-,-.
 `,| | |   ,-. ,-. ,-. . . ,-. ,-.
   | ; | . |-' ,-| `-. | | |   |-'
   '   `-' `-' `-^ `-' `-^ '   `-'
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
 Marks a position in an element of an item.
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
	/* todo needed? */
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

/* Sets .x and .y to coordinates of actual position, relative to dtree */
Marker.prototype.getXY = function() {
	/* todo cache position */
	var dtree = this._item.dtree;
	Measure.font = dtree.font;
	var e = this._element;
	var t = e.text;
	var p = e.anchestor("paragraph");
	var pinfo = this.getPinfo();
	var l = pinfo[this._pli];
	var c = l[this._pci];
	this.x = p.x + (c ? c.x + Measure.width(t.substring(c.offset, this._offset)) : l.x);
	this.y = p.y + l.y - dtree.fontsize; /* todo baseline? */
}
	
/* sets the marker to position closest to x, y from flowbox(para) */
Marker.prototype.setFromXY = function(flowbox, x, y) {
	if (flowbox.type != "paragraph") { throw new Error("invalid flowbox."); }
	var pinfo = this._getPinfoAtXY(flowbox, x, y);
	var l = pinfo[this._pli];
	var c = l[this._pci]; // x,y is in this chunk
	
	if (!c) {
		/* todo? */
		this._element = flowbox.first;
		this._offset = 0;
		return;
	}
	var dx   = x - c.x;
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
	var cx = System.canvas.getContext("2d");
	var caret = this.caret;
	if (caret.save) {
		/* erase the old caret */
		cx.putImageData(caret.save, caret.sx - 1, caret.sy - 1);
		caret.save = null;
	} 
		
	if (caret.shown && !caret.blink) {
		caret.getXY();
		var it = caret.item;
		var sy = it.scrolly;
		var x = System.space.pox + it.x1 + caret.x;
		var y = System.space.poy + it.y1 + caret.y - (sy > 0 ? sy : 0);
		var th = R(it.dtree.fontsize * (1 + settings.bottombox));
		
		caret.save = cx.getImageData(
			(caret.sx = x) - 1, 
			(caret.sy = y) - 1, 
			caret.sh = 3, 
			caret.sw = th + 1);
		cx.fillStyle = "black";
		cx.fillRect(x, y, 1, th);
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
			select.active = false;
			System.setInput("");
			item.listen(); /* make not actual */
			redraw = true;
			break;
		case  8 : // backspace
		case 46 : // del
			this.deleteSelection();
			redraw = true;
			keycode = 0;
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
	{
		caret.offset = caret.element.text.length;
		refresh = true;
		break;
	}
	case 36 : // pos1
	{
		caret.offset = 0;
		refresh = true;
		break;
	}
	case 37 : // left
	{
		var change = caret.moveLeftRight(true);
		refresh = change;
		break;
	}
	case 38 : // up
		refresh = caret.moveUpDown(true);
		break;
	case 39 : // right
	{	
		refresh = caret.moveLeftRight(false);		
		break;
	}
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
			item.listen(); /* make not actual */
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
	var cx = canvas.getContext("2d");
	Measure.init();
	
	/* the space that currently is displayed */
	this.space = null;

	/* if true use browser supported setCapture() call
	 * if false work around */
	var useCapture = canvas.setCapture != null;

	/* mouse state */
	var mst = MST.NONE;
	/* position the mouse went down to atween state */
	var msx = null;
	var msy = null;
	/* latest mouse position seen in atween state */
	var mmx = null;
	var mmy = null;
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
		var x = event.pageX - canvas.offsetLeft;
		var y = event.pageY - canvas.offsetTop;

		switch(mst) {
		case MST.NONE :
			this.space.mousehover(x, y);
			return true;
		case MST.ATWEEN :
		{
			var dragbox = settings.dragbox;
			if ((Math.abs(x - msx) > dragbox) || (Math.abs(y - msy) > dragbox)) {
				/* moved out of dragbox -> start dragging */
				clearTimeout(atweenTimer);
				atweenTimer = null;
				mst = MST.DRAG;
				this.space.dragstart(msx, msy, event.shiftKey, event.ctrlKey || event.metaKey);
				if (x != msx || y != msy) {
					this.space.dragmove(x, y, event.shiftKey, event.ctrlKey || event.metaKey);
				}
				captureEvents();
			} else {
				/* saves position for possible atween timeout */
				mmx = x;
				mmy = y;
				mms = event.shiftKey;
				mmc = event.ctrlKey || event.metaKey;
			}
			return true;
		}
		case MST.DRAG :
			this.space.dragmove(x, y, event.shiftKey, event.ctrlKey || event.metaKey);
			return true;
		default :
			throw new Error("invalid mst");
		}
	}
	
	/* mouse down event */
	function onmousedown(event) {
		event.preventDefault();
		hiddenInput.focus();
		var x = event.pageX - canvas.offsetLeft;
		var y = event.pageY - canvas.offsetTop;
		/* asks the space if it forces this to be a drag or click, or yet unknown */
		mst = this.space.mousedown(x, y);
		switch(mst) {
		case MST.ATWEEN :
			msx = mmx = x;
			msy = mmy = y;
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
		var x = event.pageX - canvas.offsetLeft;
		var y = event.pageY - canvas.offsetTop;
		
		switch (mst) {
		case MST.NONE :
			/* console.log("mouse up, without down?"); */
			return false;
		case MST.ATWEEN :
			/* this was a click */
			clearTimeout(atweenTimer);
			atweenTimer = null;
			this.space.click(x, y, event.shiftKey, event.ctrlKey || event.metaKey);
			mst = MST.NONE;
			return false;
		case MST.DRAG :
			this.space.dragstop(x, y, event.shiftKey, event.ctrlKey || event.metaKey);
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
		this.space.dragstart(msx, msy, mms, mmc);
		if (mmx != msx || mmy != msy) {
			this.space.dragmove(mmx, mmy, mms, mmc);
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

	/* clears the canvas */
	this.canvasClear = function() {
		cx.clearRect(0, 0, canvas.width, canvas.height);
		//canvas.width = canvas.width;
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
 ' |_|/ ,-. . ,
  /| |  |-'  X
  `' `' `-' ' `
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
 Utilities for hexagons.

The Flower Hexagon:

              X
		      |--------->| r
              |--->      ' ri
        *-----'----'*    '     -1
	   / \    1    ' \   '
      /   \   '   /'  \  '
	 /  6  *-----* ' 2 \ '
	/     /   '   \'    \'
Y- *-----*    +    *-----*
	\     \       /     /
	 \  5  *-----*   3 /
 	  \   /       \   /
	   \ /    4    \ /
        *-----------*		
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
var Hex = {
	c6  : Math.cos(Math.PI / 6),
	t6  : Math.tan(Math.PI / 6),
}

/* make a hexagon path */
Hex.makePath = function(cx, x, y, r) {
	var r2 = R(r / 2);
	var rc = R(Hex.c6 * r);
	cx.beginPath();
	cx.moveTo(x - r, y);
	cx.lineTo(x - r2, y - rc);
	cx.lineTo(x + r2, y - rc);
	cx.lineTo(x + r, y);
	cx.lineTo(x + r2, y + rc);
	cx.lineTo(x - r2, y + rc);
	cx.lineTo(x - r, y);
	cx.closePath();
}
 
/* draws the top slice
		------------- 
	   /.............\
      /...............\
	 +.................\
	/                   \
   *          .          *
	\                   /
	 \                 /
 	  \               /
	   \             /
        *-----------*		
*/
Hex.makeSlicePath = function(cx, x, y, r, h) {
	var r2 = R(r / 2);
	var rc = R(Hex.c6 * r);
	if (h > r) throw new Error("Cannot make slice larger than radius");
	var ym = y + rc - h;
	var xm = x + r - (r * Hex.c6 - h) * Hex.t6;	
	
	cx.beginPath();
	cx.moveTo(x, y);
	cx.lineTo(xm - r2, y - h);
	cx.lineTo(xm + r2, y - h);
	cx.lineTo(xm - x + xm, y);
	return xm;
}


/* draws a filltext rotated by phi */
Hex.fillText = function(cx, text, x, y, phi, rad) {
	var t1 = Math.cos(phi);
	var t2 = Math.sin(phi);
	var det = t1 * t1 + t2 * t2;
	x += rad * t2;
	y -= rad * t1;
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

/* returns true if x/y is in hexagon */
Hex.within = function(x, y, r) {
	var rc = r * Hex.c6;
	var yh = y * Hex.t6;

	return !(
		y < - rc || y > rc ||
	    x - r >= -yh ||
		x + r <= -yh ||
		x - r >=  yh ||
		x + r <=  yh
	);
}

/* returns true if x/y is in hexagon */
Hex.withinSlice = function(x, y, r, h) {
	var w  = r - (r * Hex.c6 - h) * Hex.t6;
	var rc = r * Hex.c6;
	var yh = y * Hex.t6;
	return !(
		y < -h || 
		y > 0 ||
	    x < -yh ||
		x - 2 * w > yh
	);
}


/* makes a double hex with 6 segments and center */
/* it kinda looks like a flower. */
Hex.makeFlowerPath = function(cx, x, y, r, ri, segs) {
	var r2  = R(r / 2);
	var rc  = R(Hex.c6 * r);
	var ri2 = R(ri / 2);
	var ric = R(Hex.c6 * ri);
	/* inner hex */
	cx.moveTo(x - r, y);
	cx.lineTo(x - r2, y - rc);
	cx.lineTo(x + r2, y - rc);
	cx.lineTo(x + r, y);
	cx.lineTo(x + r2, y + rc);
	cx.lineTo(x - r2, y + rc);
	cx.lineTo(x - r, y);
	/* outer hex */
	cx.moveTo(x - ri, y);
	cx.lineTo(x - ri2, y - ric);
	cx.lineTo(x + ri2, y - ric);
	cx.lineTo(x + ri, y);
	cx.lineTo(x + ri2, y + ric);
	cx.lineTo(x - ri2, y + ric);
	cx.lineTo(x - ri, y);	
	
	if (segs[1] || segs[6]) {
		cx.moveTo(x - ri2,  y - ric);
		cx.lineTo(x - r2,   y - rc);
	}
	if (segs[1] || segs[2]) {
		cx.moveTo(x + ri2, y - ric);
		cx.lineTo(x + r2,  y - rc);
	}
	if (segs[2] || segs[3]) {
		cx.moveTo(x + ri,  y);
		cx.lineTo(x + r,   y);
	}
	if (segs[3] || segs[4]) {
		cx.moveTo(x + ri2,  y + ric);
		cx.lineTo(x + r2,   y + rc);
	}
	if (segs[4] || segs[5]) {
		cx.moveTo(x - ri2, y + ric);
		cx.lineTo(x - r2,  y + rc);
	}
	if (segs[5] || segs[6]) {
		cx.moveTo(x - ri,  y);
		cx.lineTo(x - r,   y);
	}
	cx.closePath();	
}

/* makes a hexagon segment path: */
Hex.makePathSegment = function(cx, x, y, r, ri, seg) {
	var r2  = R(r  / 2);
	var rc  = R(Hex.c6 * r);
	var ri2 = R(ri / 2);
	var ric = R(Hex.c6 * ri);
	switch(seg) {
	case 1:
		cx.beginPath();
		cx.moveTo(x - r2,  y - rc);
		cx.lineTo(x + r2,  y - rc);
		cx.lineTo(x + ri2, y - ric);
		cx.lineTo(x - ri2, y - ric);
		cx.closePath();
		break;
	case 2:
		cx.beginPath();
		cx.moveTo(x + r2,  y - rc);
		cx.lineTo(x + r, y);
		cx.lineTo(x + ri, y);
		cx.lineTo(x + ri2, y - ric);
		cx.closePath();
		break;
	case 3:
		cx.beginPath();
		cx.moveTo(x + r, y);
		cx.lineTo(x + r2, y + rc);
		cx.lineTo(x + ri2, y + ric);
		cx.lineTo(x + ri, y);
		cx.closePath();
		break;
	case 4:
		cx.beginPath();
		cx.lineTo(x + r2, y + rc);
		cx.lineTo(x - r2, y + rc);
		cx.lineTo(x - ri2, y + ric);
		cx.lineTo(x + ri2, y + ric);
		cx.closePath();
		break;
	case 5:
		cx.beginPath();
		cx.moveTo(x - r2, y + rc);
		cx.lineTo(x - r, y);
		cx.lineTo(x - ri, y);
		cx.lineTo(x - ri2, y + ric);
		cx.closePath();
		break;
	case 6:
		cx.beginPath();
		cx.moveTo(x - r, y);
		cx.lineTo(x - r2, y - rc);
		cx.lineTo(x - ri2, y- ric);
		cx.lineTo(x - ri, y);
		cx.closePath();
		break;
	default :
		throw new Error("invalid segment: " + seg);
	}
}	


	
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
	this.x  = null;
	this.y  = null;
	this.r  = r;
	this.ri = ri;
	this.labels = labels;
	this.mousepos = -1;
}

Hexmenu.prototype.set = function(x, y) {
	this.x = x;
	this.y = y;
	this.mousepos = 0;
}

Hexmenu.prototype.draw = function() {
	var canvas = System.canvas;
	var cx = canvas.getContext("2d");
	var x = this.x + 0.5;
	var y = this.y + 0.5;
	var r = this.r;
	var ri = this.ri;

	var grad = cx.createRadialGradient(x, y, 0, x, y, (r + ri) / 2);
	grad.addColorStop(0, settings.floatMenuBackground1);
	grad.addColorStop(1, settings.floatMenuBackground2);
	
	Hex.makePath(cx, x, y, r);
	cx.fillStyle = grad;
	cx.fill();

	if (this.mousepos > 0) {
		Hex.makePathSegment(cx, x, y, r, ri, this.mousepos);	
		cx.fillStyle = settings.floatMenuFillStyle;
		cx.fill();
	}
	Hex.makeFlowerPath(cx, x, y, r, ri, this.labels, false);	
	if (settings.floatMenuInnerBorderWidth > 0) {
		cx.lineWidth = settings.floatMenuInnerBorderWidth;
		cx.strokeStyle = settings.floatMenuInnerBorderColor;
		cx.stroke(); 
	}
	if (settings.floatMenuOuterBorderWidth > 0) {
		cx.lineWidth = settings.floatMenuOuterBorderWidth;
		cx.strokeStyle = settings.floatMenuOuterBorderColor;
		cx.stroke(); 
	}	
	
	cx.fillStyle = "black";
	cx.font = "12px " + settings.defaultFont;
	cx.textAlign = "center";
	cx.textBaseline = "middle";
	
	var labels = this.labels;
	var llen = labels.length;	
	
	var dist = r / 3.5;
	switch (llen) {
	default:
	case 7: // segment 6
		Hex.fillText(cx, labels[6], this.x, this.y, Math.PI / 3 * 5, r - dist);
		/* fall */
	case 6: // segment 5
		Hex.fillText(cx, labels[5], this.x, this.y, Math.PI / 3 * 4, r - dist);
		/* fall */
	case 5: // segment 4
		Hex.fillText(cx, labels[4], this.x, this.y, Math.PI / 3 * 3, r - dist);
		/* fall */
	case 4: // segment 3
		Hex.fillText(cx, labels[3], this.x, this.y, Math.PI / 3 * 2, r - dist);
		/* fall */
	case 3: // segment 2
		Hex.fillText(cx, labels[2], this.x, this.y, Math.PI / 3 * 1, r - dist);
		/* fall */
	case 2: // segment 1
		Hex.fillText(cx, labels[1], this.x, this.y, Math.PI / 3 * 6, r - dist);
		/* fall */
	case 1: // segment 0
		cx.fillText(labels[0], this.x, this.y);
		/* fall */
	case 0:
		/* nothing */
	}
}

Hexmenu.prototype._getMousepos = function(x, y) {
	var dx = x - this.x;
	var dy = y - this.y;
		
	if (!Hex.within(dx, dy, this.r)) {
		/* out of menu */
		return this.mousepos = -1;
	} else if (Hex.within(dx, dy, this.ri)) {
		return this.mousepos = 0;
	} else {
		var lor = dx <= -dy * Hex.t6;
		var rol = dx >= +dy * Hex.t6;
		var aom = dy <= 0;
		if (lor && rol)        return this.mousepos = 1;
		else if (!lor && aom)  return this.mousepos = 2;
		else if (rol && !aom)  return this.mousepos = 3;
		else if (!rol && !lor) return this.mousepos = 4;
		else if (lor && !aom)  return this.mousepos = 5;
		else if (!rol && aom)  return this.mousepos = 6;
		else return this.mousepos = 0;
	}
}

Hexmenu.prototype.mousehover = function(x, y) {
	var omp = this.mousepos;
	return omp != this._getMousepos(x, y);
}

Hexmenu.prototype.mousedown = function(x, y) {
	return this._getMousepos(x, y);
}

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
.-,--.   .
 `\__  ,-| ,-. ,-. ,-,-. ,-. ,-. . .
  /    | | | | |-' | | | |-' | | | |
 '`--' `-^ `-| `-' ' ' ' `-' ' ' `-^
~ ~ ~ ~ ~ ~ ,|~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
            `'
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
function Edgemenu() {
	this.mousepos = -1;
	this.width  = 160;
	this.bwidth = 70;
	this.height = 30;
}

Edgemenu.prototype._stroke = function(cx) {
	if (settings.edgeMenuInnerBorderWidth > 0) {
		cx.lineWidth   = settings.edgeMenuInnerBorderWidth;
		cx.strokeStyle = settings.edgeMenuInnerBorderColor;
		cx.stroke();
	}
	if (settings.edgeMenuOuterBorderWidth > 0) {
		cx.lineWidth   = settings.edgeMenuOuterBorderWidth;
		cx.strokeStyle = settings.edgeMenuOuterBorderColor;
		cx.stroke();
	}
}

Edgemenu.prototype.draw = function(x, y) {
	var canvas = System.canvas;
	var cx = canvas.getContext("2d");
	var x = R(canvas.width / 2) + 0.5;
	var y = canvas.height + 0.5;
	var w = this.width;
	var bw = this.bwidth;
	var h =  this.height;
	var ew = R(h * Hex.t6);
	var xl = x - w - ew;
	var xr = x + w + ew;
	
	cx.beginPath();
	cx.moveTo(xl, y);
	cx.lineTo(x - w, y - h);
	cx.lineTo(x + w, y - h);
	cx.lineTo(xr, y);
	var grad = cx.createLinearGradient(0, y - h, 0, y);
	grad.addColorStop(0, settings.edgeMenuBackground1);
	grad.addColorStop(1, settings.edgeMenuBackground2);
	cx.fillStyle = grad;
	cx.fill();
	cx.moveTo(xl + bw, y - h);
	cx.lineTo(xl + bw + ew, y);
	cx.moveTo(xr - bw, y - h);
	cx.lineTo(xr - bw - ew, y);
	this._stroke(cx);
		
	switch(this.mousepos) {
	case 0 :
		cx.beginPath();
		cx.moveTo(xl + bw + ew, y);
		cx.lineTo(xl + bw, y - h);
		cx.lineTo(xr - bw, y - h);
		cx.lineTo(xr - bw - ew, y);
		cx.fillStyle = settings.edgeMenuFillStyle;
		cx.fill();
		this._stroke(cx);
		break;
	case 1 :
		cx.beginPath();
		cx.moveTo(xl, y);
		cx.lineTo(x - w, y - h);
		cx.lineTo(xl + bw, y - h);
		cx.lineTo(xl + bw + ew, y);
		cx.fillStyle = settings.edgeMenuFillStyle;
		cx.fill();
		this._stroke(cx);
		break;
	case 2 :
		cx.beginPath();
		cx.moveTo(xr - bw - ew, y);
		cx.lineTo(xr - bw, y - h);
		cx.lineTo(x + w, y - h);
		cx.lineTo(xr, y);
		cx.fillStyle = settings.edgeMenuFillStyle;
		cx.fill();
		this._stroke(cx);
		break;
	}
	
	cx.fillStyle = "black";
	cx.font = "12px " + settings.defaultFont;
	cx.textAlign = "center";
	cx.textBaseline = "middle";
	cx.fillText("Meshcraft Demospace", x, y - R(h / 2));
	cx.fillText("Export", xl + R((bw + ew) / 2), y - R(h / 2));
	cx.fillText("Import", xr - R((bw + ew) / 2), y - R(h / 2));
}

Edgemenu.prototype._getMousepos = function(x, y) {
	var canvas = System.canvas;
	var h  = this.height;
	var ty = canvas.height;
	if (y < ty - h) {
		return this.mousepos = -1;
	}
	var tx = R(canvas.width / 2) + 0.5;
	var w  = this.width;
	var bw = this.bwidth;
	var ew = R(h * Hex.t6);
	var xl = tx - w - ew;
	var xr = tx + w + ew;
	var tx = R(canvas.width / 2) + 0.5;
	
	if ((x - xl <= -(y - ty) * Hex.t6)) {
		return this.mousepos = -1;
	}
	if ((x - xr >= +(y - ty) * Hex.t6)) {
		return this.mousepos = -1;
	}
	if ((x - (xl + bw + ew) <= +(y - ty) * Hex.t6)) {
		return this.mousepos = 1;
	}
	if ((x - (xr - bw - ew) >= -(y - ty) * Hex.t6)) {
		return this.mousepos = 2;
	}
	return this.mousepos = 0;
}

Edgemenu.prototype.mousehover = function (x, y) {	
	var omp = this.mousepos;
	return omp != this._getMousepos(x, y);
}

Edgemenu.prototype.mousedown = function(x, y) {
	return this._getMousepos(x, y);
}

		
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
.---.                 
\___  ,-. ,-. ,-. ,-. 
    \ | | ,-| |   |-' 
`---' |-' `-^ `-' `-' 
~ ~ ~ | ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
      ' 
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
function Space() {
	this.repository = System.repository;

	this._floatmenu = new Hexmenu(settings.floatMenuOuterRadius, settings.floatMenuInnerRadius,
		["new", "Note", "Label"]);
	this._itemmenu = new Hexmenu(settings.itemMenuOuterRadius, settings.itemMenuInnerRadius,
		["", "Remove"])
	this.edgemenu = new Edgemenu();
	
	this.iaction = {
		act : ACT.NONE,
	};
	
	/* panning offset */
	this.pox = parseInt(window.localStorage.getItem("pox")) || 0;
	this.poy = parseInt(window.localStorage.getItem("poy")) || 0;
	this.zoom = 1;
}

/* redraws the complete space */
Space.prototype.redraw = function() {
	var items = this.repository.items;
	var zidx  = this.repository.zidx;
	var editor = System.editor;
	var canvas = System.canvas;
	System.canvasClear();
	editor.caret.save = null;
	var cx = canvas.getContext("2d");
	this.selection = editor.selection;
	this.canvas = System.canvas;

	for(var i = zidx.length - 1; i >= 0; i--) {
		var it = items[zidx[i]]; // todo shorten
		it.draw(this);
	}
	if (this.foci) this.foci.drawHandles(this);
	
	var ia = this.iaction;
	switch(ia.act) {
	case ACT.FMENU :
		this._floatmenu.draw();
		break;
	case ACT.IMENU :
		this._itemmenu.draw();
		break;
	case ACT.RBIND :
		cx.beginPath(); /* todo remove? */
		if (ia.item2) {
			Relation_drawLabeledArrow(this, ia.item, ia.item2, null, null, true);
		} else {
			Relation_drawLabeledArrow(this, ia.item, ia.smx, ia.smy, null, false);
		}
	}
	this.edgemenu.draw();
	editor.updateCaret();
}

/* user pressed a special key */
Space.prototype.specialKey = function(keyCode, shift, ctrl) {
	var rv = System.editor.specialKey(this.foci, keyCode, shift, ctrl);
	if (rv) {
		this.redraw();
	}
}

/* user entered normal text (one character or more) */
Space.prototype.input = function(text) {
	if (System.editor.input(this.foci, text)) {
		this.redraw();		
	}
}

/* the canvas/space got focus from the system*/
Space.prototype.systemFocus = function() {
	if (!this.foci) {
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
	this.foci = item;
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
Space.prototype.mousehover = function(x, y) {
	var px = x - this.pox;
	var py = y - this.poy;
	var com = null;
	var editor = System.editor;
	var redraw = this.edgemenu.mousehover(x, y);
	if (this.edgemenu.mousepos >= 0) {
		/* mouse floated on edge menu, no need to look further */
		System.setCursor("default");
		if (redraw) this.redraw();
		return;
	}
	
	switch(this.iaction.act) {
	case ACT.FMENU :
		redraw = redraw || this._floatmenu.mousehover(x, y);
		if (this._floatmenu.mousepos >= 0) {
			/* mouse floated on float menu, no need to look further */
			System.setCursor("default");
			if (redraw) this.redraw();
			return;
		}
		break;
	case ACT.IMENU :
		redraw = redraw || this._itemmenu.mousehover(x, y);
		if (this._itemmenu.mousepos >= 0) {
			/* mouse floated on item menu, no need to look further */
			System.setCursor("default");
			if (redraw) this.redraw();
			return;
		}
		break;	
	}

	if (this.foci) {
		/* todo move into items */
		if (this.foci.withinItemMenu(px, py)) {
			System.setCursor("pointer");
			if (redraw) this.redraw();
			return;
		}

		if ((com = this.foci.checkItemCompass(px, py))) {
			System.setCursor(com + "-resize");
			if (redraw) this.redraw();
			return;
		}
	}

	/* todo remove nulls by shiftKey, ctrlKey */
	var tx = this.repository.transfix(TXE.HOVER, this, px, py, null, null);
	redraw = redraw || (tx & TXR.REDRAW);
	if (!(tx & TXR.HIT)) { System.setCursor("crosshair");} 
	if (redraw) this.redraw();
}

/* starts creating a new relation */
Space.prototype.actionSpawnRelation = function(item, x, y) {
	var ia = this.iaction;
	ia.act = ACT.RBIND;
	ia.item = item;
	ia.sx = ia.smx = x;
	ia.sy = ia.smy = y;
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
Space.prototype.actionIDrag = function(item, sx, sy) {
	var ia  = this.iaction;
	ia.act  = ACT.IDRAG;
	ia.item = item;
	ia.sx   = sx;
	ia.sy   = sy;	
	System.setCursor("move");
}

Space.prototype.actionRBindTo = function(toItem) {
	var rel = new Relation(null, null, this.iaction.item.id, toItem.id);
	rel.dtree.append(new Paragraph("relates to"));
	System.repository.updateItem(rel);
}

Space.prototype.actionRBindHover = function(item) {
	this.iaction.item2 = item;
}


/* starts an operation with the mouse held down */
Space.prototype.dragstart = function(x, y, shift, ctrl) {
	x -= this.pox;
	y -= this.poy;
	var editor  = System.editor;
	var iaction = this.iaction;
	
	if (this.foci && this.foci.withinItemMenu(x, y)) {
		this.actionSpawnRelation(this.foci, x, y);
		this.redraw();
		return;
	} 

	var tfx = this.repository.transfix(TXE.DRAGSTART, this, x, y, shift, ctrl);
		
	if (!(tfx & TXR.HIT)) {
		/* panning */
		iaction.act = ACT.PAN;
		iaction.sx = x;
		iaction.sy = y;
		System.setCursor("crosshair");
		return;
	} 
	
	if (tfx & TXR.REDRAW) this.redraw();
}

/* a click is a mouse down followed within dragtime by 'mouseup' and
 * not having moved out of 'dragbox'. */
Space.prototype.click = function(x, y, shift, ctrl) {
	var px = x - this.pox;
	var py = y - this.poy;
			
	var foci = this.foci;
	if (foci && foci.withinItemMenu(px, py)) {
		foci.setItemMenu(this._itemmenu, this.pox, this.poy);
		this.iaction.act = ACT.IMENU;
		this.redraw();
		return;
	}

	var tfx = this.repository.transfix(TXE.CLICK, this, px, py, shift, ctrl);
	if (!(tfx & TXR.HIT)) {
		this.iaction.act = ACT.FMENU;
		this._floatmenu.set(x, y);
		System.setCursor("default");
		this.setFoci(null);
		this.redraw();
		return;
	}
	
	if (tfx & TXR.REDRAW) this.redraw();
}

/* stops an operation with the mouse held down */
Space.prototype.dragstop = function(x, y, shift, ctrl) {
	x -= this.pox;
	y -= this.poy;
	var editor = System.editor;
	var iaction = this.iaction;
	var redraw = false;
	switch (iaction.act) {
	case ACT.IDRAG :
		var w = iaction.item.x2 - iaction.item.x1;
		var h = iaction.item.y2 - iaction.item.y1;
		iaction.item.x1 = x - iaction.sx;
		iaction.item.y1 = y - iaction.sy;
		iaction.item.x2 = x - iaction.sx + w;
		iaction.item.y2 = y - iaction.sy + h;
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
		iaction.six  = null;
		iaction.siy  = null;
		iaction.six1 = null;
		iaction.siy1 = null;
		iaction.six2 = null;
		iaction.siy2 = null;
		break;
	case ACT.SCROLLY :
		iaction.ssy  = null;
		break;
	case ACT.RBIND :
		iaction.smx = null;
		iaction.smy = null;
		this.repository.transfix(TXE.RBINDTO, this, x, y, shift, ctrl);
		redraw = true;
		break;
	default :
		throw new Error("Invalid action in 'Space.dragstop'");
	}
	iaction.act = ACT.NONE;
	iaction.sx  = null;
	iaction.sy  = null;
	if (redraw) this.redraw();
	return;
}

/* moving during an operation with the mouse held down */
Space.prototype.dragmove = function(x, y, shift, ctrl) {
	x -= this.pox;
	y -= this.poy;
	var iaction = this.iaction;
	var redraw = false;
	
	switch(iaction.act) {
	case ACT.PAN :
		this.pox += x - iaction.sx;
		this.poy += y - iaction.sy;
		window.localStorage.setItem("pox", this.pox);
		window.localStorage.setItem("poy", this.poy);		
		this.redraw();
		return;
	case ACT.IDRAG :
		/* todo move into items */
		var w = iaction.item.x2 - iaction.item.x1;
		var h = iaction.item.y2 - iaction.item.y1;
		iaction.item.x1 = x - iaction.sx;
		iaction.item.y1 = y - iaction.sy;
		iaction.item.x2 = x - iaction.sx + w;
		iaction.item.y2 = y - iaction.sy + h;
		System.repository.updateItem(iaction.item);
		this.redraw();
		return;
	case ACT.IRESIZE :
	{
		var x1 = iaction.six1;
		var y1 = iaction.siy1;
		var x2 = iaction.six2;
		var y2 = iaction.siy2;
		var it = iaction.item;
		switch (iaction.com) {
		case "e"  : 
		case "ne" :
		case "se" :
			x2 = iaction.six2 + x - iaction.sx;
			break;
		case "w"  :
		case "nw" :
		case "sw" :	
			x1 = iaction.six1 + x - iaction.sx;
			break;
		}
		switch (iaction.com) {
		case "s"  : 
		case "sw" :
		case "se" :
			y2 = iaction.siy2 + y - iaction.sy;
			break;
		case "n"  : 
		case "nw" :
		case "ne" :
			y1 = iaction.siy1 + y - iaction.sy;	
			break;			
		}
		redraw = it.setZone(x1, y1, x2, y2); 
		
		/* adapt scrollbar position, todo x move into item */
		var dtreeHeight = it.dtree.height;
		var smaxy = dtreeHeight - ((it.x2 - it.x1) - 2 * it.textBorder);
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
		var dy = y - iaction.sy;
		var it = iaction.item;
		var h = it.y2 - it.y1;
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
		this.repository.transfix(TXE.RBINDHOVER, this, x, y, shift, ctrl);
		iaction.smx = x;
		iaction.smy = y;
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
	ta.value = System.repository.saveToJString();
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
		System.repository.loadFromJString(ta.value);
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
		System.repository.loadFromJString(demoRepository);
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
Space.prototype.mousedown = function(x, y) {
	var px = x - this.pox;
	var py = y - this.poy;
	
	var iaction = this.iaction;
	var editor = System.editor;
	var redraw = false;

	var md = this.edgemenu.mousedown(x, y);
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
		var md = this._floatmenu.mousedown(x, y);
		iaction.act = ACT.NONE;
		var fm = this._floatmenu;
		if (md < 0) {
			break;
		}
		switch(md) {
		case 1 : // note
			var nw = settings.newNoteWidth;
			var nh = settings.newNoteHeight;
			var x1 = R(fm.x - nw / 2 - this.pox);
			var y1 = R(fm.y - nh / 2 - this.poy);
			var note = new Note(null, null, x1, y1, x1 + nw, y1 + nh);
			this.setFoci(note);
			break;
		case 2 : // label
			var label = new Label(null, null, fm.x - this.pox, fm.y - this.poy);
			label.setPos(R(label.x1 - (label.x2 - label.x1) / 2),
			             R(label.y1 - (label.y2 - label.y1) / 2));
			this.setFoci(label);
			break;
		}
		this.redraw();
		return MST.NONE;
	case ACT.IMENU :
		var md = this._itemmenu.mousedown(x, y);
		iaction.act = ACT.NONE;
		redraw = true;
		if (md >= 0) {
			switch(md) {
			case 1:
				this.repository.removeItem(this.foci);
				this.setFoci(null);
				break;
			}
			if (redraw) this.redraw();
			return MST.NONE;
		}
		break;
	}
	
	if (this.foci) {
		if (this.foci && this.foci.withinItemMenu(px, py)) {
			if (redraw) this.redraw();
			return MST.ATWEEN;
		}
		var com;
		if ((com = this.foci.checkItemCompass(px, py))) {
			/* resizing */
			iaction.act  = ACT.IRESIZE;
			iaction.com  = com;
			iaction.item = this.foci;
			iaction.sx   = px;
			iaction.sy   = py;
			iaction.six1  = this.foci.x1;
			iaction.siy1  = this.foci.y1;
			iaction.six2  = this.foci.x2;
			iaction.siy2  = this.foci.y2;
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
	if (Math.abs(this.zoom - 1) < 0.0001) {
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
function Treenode(type) {
	this.type = type;
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
Treenode.prototype.anchestor = function(type) {
	var n;
	for(n = this; n && n.type != type; n = n.parent);
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
	var pcanvas = this._pcanvas = document.createElement("canvas");
	pcanvas.width = pcanvas.height = 0;
	this._canvasActual = false;
	this.append(new Textnode(text));
	this._flowWidth = null;	
	this.x = null;
	this.y = null;
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
Paragraph.prototype.getCanvas = function() {
	var pcanvas = this._pcanvas;
	if (this._canvasActual) {
		return pcanvas;
	}
	var cx = pcanvas.getContext("2d");
	this._flow();
	this._canvasActual = true;
			
	/* todo: work out exact height for text below baseline */
	/* set the canvas height */
	var dtree = this.anchestor("dtree");
	{
		var equalHeight = pcanvas.height == this.height;
		var equalWidth  = pcanvas.width  == this.width;
		if (equalHeight && equalWidth) {
			cx.clearRect(0, 0, this.width, this.height);
		} else {
			if (!equalHeight) {
				pcanvas.height = this.height;
			}
			if (!equalWidth) {
				pcanvas.width = this.width;
			}
		}
	}
	
	cx.font = dtree.font;	
	cx.fillStyle = "black";
	/* draws text into the canvas */
	var pinfo = this._pinfo;
	var plines = pinfo.length;
	for(var il = 0; il < plines; il++) {
		var pl = pinfo[il];
		var plen = pl.length;
		for(var ic = 0; ic < plen; ic++) {
			var pc = pl[ic];
			cx.fillText(pc.text, pc.x, pl.y);
		}
	}
	return pcanvas;
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
		
/* returns the chunk at x,y */
DTree.prototype.paraAtY = function(y) {
	var p = this.first;
	while (p && y > p.y + p.softHeight) {
		p = p.next;
	}
	return p;
}

/* draws the content in a buffer canvas */
/* acanvas  ... canvas to draw upon */
/* todo rename */
DTree.prototype.drawCanvas = function(acanvas, select, offsetX, offsetY, scrolly) {
	var cx = acanvas.getContext("2d");
	var y = offsetY;
	var pi = 0;
	var h = 0;
	var parasep = this.pre ? 0 : this._fontsize;

	/* draws the selection */
	if (select.active && select.mark1.item == this.parent) {
		/* todo make part of selection to use shortcut with XY */
		var b = select.mark1;
		var e = select.mark2;
		b.getXY();
		e.getXY();
		if (e.y < b.y || (e.y == b.y && e.x < b.x)) {
			b = select.mark2;
			e = select.mark1;
		}
		
		cx.fillStyle   = settings.selectionColor;
		cx.strokeStyle = settings.selectionStroke;
		cx.beginPath();
		var psy = scrolly >= 0 ? scrolly : 0;
		var lh = R(this.fontsize * (1 + settings.bottombox));
		var bx = R(b.x) + 0.5;
		var by = R(b.y - psy) + 0.5;
		var ex = R(e.x) + 0.5;
		var ey = R(e.y - psy) + 0.5;
		var rx = R(this.width + offsetX / 2) + 0.5;
		var lx = R(offsetX / 2) + 0.5;
		if ((Math.abs(by - ey) < 2)) {
			// ***
			cx.moveTo(bx, by);
			cx.lineTo(bx, by + lh);
			cx.lineTo(ex, ey + lh);
			cx.lineTo(ex, ey);
			cx.lineTo(bx, by);
			cx.stroke();
			cx.fill();			
		} else if (Math.abs(by + lh - ey) < 2 && (bx >= ex))  {
			//      ***
			// ***
			cx.moveTo(rx, by + lh);
			cx.lineTo(bx, by + lh);
			cx.lineTo(bx, by);
			cx.lineTo(rx, by);
			
			cx.moveTo(lx, ey);
			cx.lineTo(ex, ey);
			cx.lineTo(ex, ey + lh);
			cx.lineTo(lx, ey + lh);
			cx.stroke();
			cx.fill();
		} else {
			//    *****
			// *****
			for(var i = 0; i < 2; i++) {
				cx.beginPath();
				var edge = i ? cx.moveTo : cx.lineTo;
				cx.moveTo(rx, ey);
				cx.lineTo(ex, ey);
				cx.lineTo(ex, ey + lh);
				cx.lineTo(lx, ey + lh);
				edge.call(cx, lx, by + lh);
				cx.lineTo(bx, by + lh);
				cx.lineTo(bx, by);
				cx.lineTo(rx, by);
				edge.call(cx, rx, ey);
				if (i) cx.stroke(); else cx.fill();
			}			
		}
		cx.beginPath();
	}	
	
	/* draws tha paragraphs */
	for(var para = this.first; para; para = para.next) {
		var pcanvas = para.getCanvas();
		para.x = offsetX;
		para.y = y;
		if (pcanvas.width > 0 && pcanvas.height > 0) {
			cx.drawImage(pcanvas, offsetX, y - scrolly);
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
function Item(type, id) {
	this.type = type;
	this.id = id;
}

/* set a hex menu to be this items menu */
Item.prototype.setItemMenu = function(menu, pox, poy) {
	var r = settings.itemMenuInnerRadius;
	var h = settings.itemMenuSliceHeight;
	menu.set(R(this.x1 + pox + r - (r * Hex.c6 - h) * Hex.t6), R(this.y1 + poy + r * Hex.c6 - h) - 1);
}

/* returns if coords are within the item menu */
Item.prototype.withinItemMenu = function(x, y) {
	return Hex.withinSlice(x - this.x1, y - this.y1 - 1, 
		settings.itemMenuInnerRadius, settings.itemMenuSliceHeight);
}

/* returns the compass of the resize handles of an item 
 * 
 * rhs .. bitwise resize handle selector:
 * 
 * 128  1  2
 *  64     4
 *  32 16  8
 */
Item.prototype._checkItemCompass = function(x, y, rhs) { 
	if (rhs == 0) {
		return;
	}
	var d = settings.handleSize;          // inner distance
	var d2 = settings.handleSize * 3 / 4; // outer distance
	
	var n = y >= this.y1 - d2 && y <= this.y1 + d;
	var e = x >= this.x2 - d  && x <= this.x2 + d2;
	var s = y >= this.y2 - d  && y <= this.y2 + d2;
	var w = x >= this.x1 - d2 && x <= this.x1 + d;
	
	if (n) {
		if (w && rhs & 128) { 
			return "nw";
		} else if (e && rhs & 2) {
			return "ne";
		} else if (rhs & 1) {
			var mx = (this.x1 + this.x2) / 2;
			if (x >= mx - d && x <= mx + d) {
				return "n";
			}
		}
	} else if (s) {
		if (w && rhs & 32) {
			return "sw";
		} else if (e && rhs & 8) {
			return "se";
		} else if (rhs & 16) {
			var mx = (this.x1 + this.x2) / 2;
			if (x >= mx - d && x <= mx + d) {
				return "s";
			}
		}
	} else if (w && rhs & 64) {
		var my = (this.y1 + this.y2) / 2;
		if (y >= my - d && y <= my + d) {
			return "w";
		}
	} else if (e && rhs & 4) {
		var my = (this.y1 + this.y2) / 2;
		if (y >= my - d && y <= my + d) {
			return "e";
		}
	}
	return null;
}

/* draws the edit handles of an item (resize, itemmenu) */
/* rhs ... resize  handles selector */
Item.prototype._drawHandles = function(space, rhs) {
	var cx = space.canvas.getContext("2d");
	var ds = settings.handleDistance; 			
	var hs = settings.handleSize;
	var hs2 = hs / 2;
			
	var x1 = this.x1 + 0.5 - ds + space.pox;
	var y1 = this.y1 + 0.5 - ds + space.poy;
	var x2 = this.x2 - 0.5 + ds + space.pox;
	var y2 = this.y2 - 0.5 + ds + space.poy;
	var xm = R((x1 + x2) / 2) + 0.5;
	var ym = R((y1 + y2) / 2) + 0.5;
	
	cx.beginPath(); 
	if (rhs &   1) { cx.moveTo(xm - hs2, y1); cx.lineTo(xm + hs2, y1);                   }
	if (rhs &   2) { cx.moveTo(x2 - hs,  y1); cx.lineTo(x2, y1); cx.lineTo(x2, y1 + hs); }
	if (rhs &   4) { cx.moveTo(x2, ym - hs2); cx.lineTo(x2, ym + hs2);                   }
	if (rhs &   8) { cx.moveTo(x2, y2 - hs);  cx.lineTo(x2, y2); cx.lineTo(x2 - hs, y2); }
	if (rhs &  16) { cx.moveTo(xm - hs2, y2); cx.lineTo(xm + hs2, y2);                   }
	if (rhs &  32) { cx.moveTo(x1 + hs, y2);  cx.lineTo(x1, y2); cx.lineTo(x1, y2 - hs); }
	if (rhs &  64) { cx.moveTo(x1, ym - hs2); cx.lineTo(x1, ym + hs2);                   }
	if (rhs & 128) { cx.moveTo(x1, y1 + hs);  cx.lineTo(x1, y1); cx.lineTo(x1 + hs, y1); }
			
	if (rhs > 0 && settings.handleWidth1 > 0) {
		cx.strokeStyle = settings.handleColor1;
		cx.lineWidth = settings.handleWidth1;
		cx.stroke(); 
	}
	if (rhs > 0 && settings.handleWidth2 > 0) {
		cx.strokeStyle = settings.handleColor2;
		cx.lineWidth = settings.handleWidth2;
		cx.stroke(); 
	}
		
	cx.beginPath(); 
	/* draws item menu handler */
	x1 = this.x1 + space.pox + 0.5;
	y1 = this.y1 + space.poy + 0.5;
	var xim = Hex.makeSlicePath(cx, x1, y1 - 1, 
		settings.itemMenuInnerRadius, settings.itemMenuSliceHeight);
	var grad = cx.createLinearGradient(
		0, y1 - settings.itemMenuSliceHeight - 1, 
		0, y1 - settings.itemMenuSliceHeight + settings.itemMenuInnerRadius * Hex.c6
	);
	grad.addColorStop(0, settings.itemMenuBackground1);
	grad.addColorStop(1, settings.itemMenuBackground2);	
	cx.fillStyle = grad;
	cx.fill();	
	if (settings.itemMenuInnerBorderWidth > 0) {
		if (settings.itemMenuInnerBorderColor2) {
			grad.addColorStop(0, settings.itemMenuInnerBorderColor1);
			grad.addColorStop(1, settings.itemMenuInnerBorderColor2);	
			cx.strokeStyle = grad;
		} else {
			cx.strokeStyle = settings.itemMenuInnerBorderColor1;
		}
		cx.lineWidth = settings.itemMenuInnerBorderWidth;
		cx.stroke();
	}
			
	if (settings.itemMenuOuterBorderWidth > 0) {
		if (settings.itemMenuOuterBorderColor2) {
			grad.addColorStop(0, settings.itemMenuOuterBorderColor1);
			grad.addColorStop(1, settings.itemMenuOuterBorderColor2);	
			cx.lineWidth = settings.itemMenuInnerBorderWidth;
			cx.strokeStyle = grad;
		} else {
			cx.strokeStyle = settings.itemMenuOuterBorderColor1;
		}
		cx.lineWidth = settings.itemMenuOuterBorderWidth;
		cx.stroke();
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
 * Note(null, [id], x1, y1, x2, y2) */
function Note(js, id, x1, y1, x2, y2) {
	if (js) {
		this.x1    = js.x1 || js.x; // todo
		this.y1    = js.y1 || js.y; // todo
		this.x2    = js.x2 || (js.x + js.w); // todo
		this.y2    = js.y2 || (js.y + js.h); // todo 
		this.dtree = new DTree(js.d, this);
	} else {
		this.x1   = x1;
		this.y1   = y1;
		this.x2   = x2;
		this.y2   = y2;
		this.dtree  = new DTree(null, this);
	}
	Item.call(this, "note", id);
	this.bcanvas = document.createElement("canvas");
	this.textBorder = settings.noteTextBorder;
	this._canvasActual = false;
	this._scrollx = -8833;
	this._scrolly = -8833;
	this.bcanvas.width  = this.x2 - this.x1; /* todo, need to set it so early? */
	this.bcanvas.height = this.y2 - this.y1;
	
	if (!this.dtree.first) {
		this.dtree.append(new Paragraph(""));
	}
	
	System.repository.addItem(this, true);
}

/* called when item is removed */
Note.prototype.removed = function() {
	/* nothing */
}

/* turns the note into a string */
Note.prototype.jsonfy = function() {
	var js = {
	     t : "note",
 		 x1 : this.x1,
		 y1 : this.y1,
		 x2 : this.x2,
		 y2 : this.y2,
		 d  : this.dtree.jsonfy(),
	}
	return js;
}

/* returns the para at y */
Note.prototype.paraAtY = function(y) {
	if (y < this.textBorder) {
		return null;
	}
	return this.dtree.paraAtY(y);
}

/* drops the cached canvas */
Note.prototype.listen = function() {
	this._canvasActual = false;
	/* end of chain */
}
	
/* checks if this items reacts on an event 
 * returns transfix code
 */
Note.prototype.transfix = function(txe, space, x, y, z, shift, ctrl) {
	if (x < this.x1 || y < this.y1 || x > this.x2 || y > this.y2) return 0;
	switch (txe) {
	case TXE.HOVER : 
		System.setCursor("default");
		return TXR.HIT;
	case TXE.DRAGSTART :
		var txr = TXR.HIT; // todo
		if (ctrl) {
			space.actionSpawnRelation(this, x, y);
			return txr | TXR.REDRAW;
		}
		if (z > 0) {
			space.repository.moveToTop(z);
			txr |= TXR.REDRAW; /* todo full redraw */
		}
		if (space.foci != this) {
			space.setFoci(this);
			txr |= TXR.REDRAW;
		}

		var srad = settings.scrollbarRadius;
		var sbmx = settings.scrollbarMarginX;
		if (this.scrolly >= 0 && Math.abs(x - this.x2 + srad + sbmx) <= srad +1)  {
			space.actionScrollY(this, y, this.scrolly);
		} else {
			space.actionIDrag(this, x - this.x1, y - this.y1);
		}
		return txr;
	case TXE.CLICK :
		var txr = TXR.HIT;
		if (z > 0) {
			space.repository.moveToTop(z);
			txr |= TXR.REDRAW; /* todo full redraw */
		}
		if (space.foci != this) {
			space.setFoci(this);
			txr |= TXR.REDRAW;
		}

		var ox = x - this.x1;
		var oy = y - this.y1 + (this.scrolly > 0 ? this.scrolly : 0);
		var p = this.paraAtY(oy);
		if (p) {
			var editor = System.editor;
			editor.caret.setFromXY(p, ox - p.x, oy - p.y);
			editor.caret.show();
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
 * returns true if something changed
 */
Note.prototype.setZone = function(x1, y1, x2, y2) {
	var w = x2 - x1;
	var h = y2 - y1;
	if (w < settings.noteMinWidth)  x2 = x1 + (w = settings.noteMinWidth);
	if (h < settings.noteMinHeight) y2 = y1 + (h = settings.noteMinHeight);
	if (this.x1 === x1 && this.y1 === y1 && this.x2 === x2 && this.y2 === y2) {
		return false;
	}
	if (w != this.x2 - this.x1 || h != this.y2 - this.y1) {
		var bcanvas = this.bcanvas;
		bcanvas.width  = w; /* todo, not yet do sizing */
		bcanvas.height = h;
		this._canvasActual = false;
	}
	this.x1 = x1;
	this.y1 = y1;
	this.x2 = x2;
	this.y2 = y2;
	return true;
}

/* sets new position retaining height */
Note.prototype.setPos = function(x1, y1) {
	if (this.x1 == x1 && this.y1 == y1) return false;
	this.x2 = x1 + (this.x2 - this.x1);
	this.y2 = y1 + (this.y2 - this.y1);
	this.x1 = x1;
	this.y1 = y1;
	return true;
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

/* todo */
Object.defineProperty(Note.prototype, "x", {
	get: function() { 
		throw new Error("x:(");
	},
	set: function(sy) {
		throw new Error("x:((");
	}
});

/* todo */
Object.defineProperty(Note.prototype, "y", {
	get: function() { 
		throw new Error("y:(");
	},
	set: function(sy) {
		throw new Error("y:((");
	}
});

/* todo */
Object.defineProperty(Note.prototype, "width", {
	get: function() { 
		throw new Error("w:(");
	},
	set: function(sy) {
		throw new Error("w:((");
	}
});

/* todo */
Object.defineProperty(Note.prototype, "height", {
	get: function() { 
		throw new Error("h:(");
	},
	set: function(sy) {
		throw new Error("h:((");
	}
});

/* draws the items handles */
Note.prototype.drawHandles = function(space) {
	return this._drawHandles(space, 255);
}

Note.prototype.checkItemCompass = function(x, y) { 
	return this._checkItemCompass(x, y, 255);
}

/* draws a bevel */
function Note_bevel(cx, x1, y1, x2, y2, border, radius) {
	var xb1 = x1 + border;
	var yb1 = y1 + border;
	var xb2 = x2 - border;
	var yb2 = y2 - border;
	
	cx.beginPath();
	cx.moveTo(xb1 + radius, yb1);
	cx.arc(xb2 - radius, yb1 + radius, radius, -Math.PI / 2, 0, false);
	cx.arc(xb2 - radius, yb2 - radius, radius, 0, Math.PI / 2, false);
	cx.arc(xb1 + radius, yb2 - radius, radius, Math.PI / 2, Math.PI, false);
	cx.arc(xb1 + radius, yb1 + radius, radius, Math.PI, -Math.PI / 2, false);
}
	
/* draws the item       
 * space  : to draw upon 
 */
Note.prototype.draw = function(space) {
	var bcanvas = this.bcanvas;
	var dtree = this.dtree;
	var cx = bcanvas.getContext("2d");
	if (this._canvasActual) {
		/* buffer hit */
		space.canvas.getContext("2d").drawImage(bcanvas, this.x1 + space.pox, this.y1 + space.poy);
		return;
	}

	/* draws the background */
	var w = this.x2 - this.x1; // width
	var h = this.y2 - this.y1; // height
	/* todo - resize here */
	cx.clearRect(0, 0, bcanvas.width, bcanvas.height);	
	Note_bevel(cx, 0, 0, w, h, 2.5, 3);
	var grad = cx.createLinearGradient(0, 0, w / 10, h);
	grad.addColorStop(0, settings.noteBackground1);
	grad.addColorStop(1, settings.noteBackground2);
	cx.fillStyle = grad;
	cx.fill();
	cx.fillStyle = "#000000";

	/* calculates if a scrollbar is needed */
	var sy = this._scrolly;
	var innerHeight = h - 2 * this.textBorder;
	dtree.flowWidth = w - 2 * this.textBorder - (sy >= 0 ? settings.scrollbarRadius * 2 : 0);
	var dtreeHeight = dtree.height;
	if (sy < 0) {
		if (dtreeHeight > innerHeight) {
			/* does not use a scrollbar but should */
			sy = this._scrolly = 0;		
			dtree.flowWidth = w - 2 * this.textBorder - (sy >= 0 ? settings.scrollbarRadius * 2 : 0);
			dtreeHeight = dtree.height;
			if (dtreeHeight <= innerHeight) {
				throw new Error("note doesnt fit with and without scrollbar.");			
			}
		}
	} else if (dtreeHeight <= innerHeight) {
		/* uses a scrollbar but should */
		sy = this._scrolly = -8833;
		dtree.flowWidth = w - 2 * this.textBorder - (sy >= 0 ? settings.scrollbarRadius * 2 : 0);
		dtreeHeight = dtree.height;
		if (dtreeHeight > innerHeight) {
			throw new Error("note doesnt fit with and without scrollbar.");			
		}
	}
	
	/* draws selection and text */	
	dtree.drawCanvas(bcanvas, space.selection,
		this.textBorder, this.textBorder,
		sy < 0 ? 0 : R(sy)
	);

	if (sy >= 0) {
		if (dtreeHeight <= innerHeight) {
			/* should not use a scrollbar */
			/* todo remove */
			return null;
		}

		/* draws the vertical scroll bar */
		cx.fillStyle   = settings.scrollbarFillStyle;
		cx.strokeStyle = settings.scrollbarStrokeStyle;
		cx.lineWidth   = settings.scrollbarLineWidth;
		
		var srad = settings.scrollbarRadius;
		var spx  = w - settings.scrollbarMarginX - srad;
		var scrollRange = h - settings.scrollbarMarginY * 2;
		var scrollSize  = scrollRange * innerHeight / dtreeHeight;
		if (scrollSize < srad * 2) {
			/* minimum size of scrollbar */
			scrollSize = srad * 2;
		}
						
		var spy = settings.scrollbarMarginY + 
			sy / (dtreeHeight - innerHeight) * (scrollRange - scrollSize);
			sy / (dtreeHeight - innerHeight) * (scrollRange - scrollSize);
		
		switch (settings.scrollbarForm) {
		case 'round' :
			cx.beginPath();
			cx.arc(spx, spy + srad, srad, Math.PI, 0, false);
			cx.arc(spx, spy + scrollSize - srad, srad, 0, Math.PI, false);
			cx.closePath();
			cx.stroke();
			cx.fill();
			break;
		case 'square' :
			cx.fillRect(spx, spy, srad + 2, scrollSize);
			break;
		case 'hexagonh' :
			cx.beginPath();
			cx.moveTo(spx -   1 * srad, spy + Hex.c6 * srad);
			cx.lineTo(spx - 0.5 * srad, spy);
			cx.lineTo(spx + 0.5 * srad, spy);
			cx.lineTo(spx +   1 * srad, spy + Hex.c6 * srad);
			cx.lineTo(spx +   1 * srad, spy + scrollSize - Hex.c6 * srad);
			cx.lineTo(spx + 0.5 * srad, spy + scrollSize);
			cx.lineTo(spx - 0.5 * srad, spy + scrollSize);
			cx.lineTo(spx -   1 * srad, spy + scrollSize - Hex.c6 * srad);
			cx.closePath();
			cx.stroke();
			cx.fill();
			break;
		case 'hexagonv' :
			cx.beginPath();
			cx.moveTo(spx - 1 * srad, spy + Hex.c6 * srad);
			cx.lineTo(spx           , spy);
			cx.lineTo(spx + 1 * srad, spy + Hex.c6 * srad);
			cx.lineTo(spx + 1 * srad, spy + scrollSize - Hex.c6 * srad);
			cx.lineTo(spx           , spy + scrollSize);
			cx.lineTo(spx - 1 * srad, spy + scrollSize - Hex.c6 * srad);
			cx.closePath();
			cx.stroke();
			cx.fill();
			break;
		default :
			throw new Error("invalid settings.scrollbarForm");
		}
	}

	/* draws the border */
	cx.lineWidth = settings.noteInnerBorderWidth;
	cx.strokeStyle = settings.noteInnerBorderColor;
	Note_bevel(cx, 0, 0, w, h, 1.5, settings.noteInnerRadius);
	cx.stroke(); cx.beginPath(); cx.closePath(); // todo
	cx.lineWidth = settings.noteOuterBorderWidth;
	cx.strokeStyle = settings.noteOuterBorderColor;
	Note_bevel(cx, 0, 0, w, h, 0.5, settings.noteOuterRadius);
	cx.stroke(); cx.beginPath(); cx.closePath(); // todo
	cx.restore();
	this._canvasActual = true;
	space.canvas.getContext("2d").drawImage(bcanvas, this.x1 + space.pox, this.y1 + space.poy);
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
 * Label(null, [id], x1, y1) 
 */
function Label(js, id, x1, y1) {
	if (js) {
		this.dtree = new DTree(js.d, this);
		if (!this.dtree.first) this.dtree.append(new Paragraph("Label"));
		this.setZone(js.x1 || js.x, js.y1 || js.x, js.x2 || js.x + 100, js.y2 || js.y + 100);
	} else {
		this.dtree = new DTree(null, this, 20);
		if (!this.dtree.first) this.dtree.append(new Paragraph("Label"));
		this.setZone(x1, y1, x1 + 100, y1 + 50);
	}
	Item.call(this, "label", id);
	this.bcanvas = document.createElement("canvas");
	this._canvasActual = false;
	System.repository.addItem(this, true);
}

/* called when item is removed */
Label.prototype.removed = function() {
	/* nothing */
}

/* mouse hovers at x/y 
 * returns transfix code
 */
Label.prototype.transfix = function(txe, space, x, y, z, shift, ctrl) {
	if (x < this.x1 || y < this.y1 ||  x > this.x2 || y > this.y2) {
		return 0;
	}
	switch(txe) {
	case TXE.HOVER :
		System.setCursor("default");
		return TXR.HIT;
	case TXE.DRAGSTART :
		var txr = TXR.HIT;
		if (ctrl) {
			space.actionSpawnRelation(this, x, y);
			return txr | TXR.REDRAW;
		}
		if (z > 0) {
			space.repository.moveToTop(z);
			txr |= TXR.REDRAW; /* todo full redraw */
		}
		if (space.foci != this) {
			space.setFoci(this);
			txr |= TXR.REDRAW;
		}

		space.actionIDrag(this, x - this.x1, y - this.y1);
		return txr;
	case TXR.CLICK: 
		var txr = TXR.HIT;
		if (z > 0) {
			space.repository.moveToTop(z);
			txr |= TXR.REDRAW; /* todo full redraw */
		}
		if (space.foci != this) {
			space.setFoci(this);
			txr |= TXR.REDRAW;
		}
		var ox = x - this.x1;
		var oy = y - this.y1 + (this.scrolly > 0 ? this.scrolly : 0);
		var p = this.paraAtY(oy);
		if (p) {
			var editor = System.editor;
			editor.caret.setFromXY(p, ox - p.x, oy - p.y);
			editor.caret.show();
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

/* turns the label into a string */
Label.prototype.jsonfy = function() {
	var js = {
	    t: "label",
		x1: this.x1,
		y1: this.y1,
		y2: this.y2,
		 d: this.dtree.jsonfy(),
	}
	return js;
}

/* todo */
Object.defineProperty(Label.prototype, "x", {
	get: function() { 
		throw new Error("x:(");
	},
	set: function(sy) {
		throw new Error("x:((");
	}
});

/* todo */
Object.defineProperty(Label.prototype, "y", {
	get: function() { 
		throw new Error("y:(");
	},
	set: function(sy) {
		throw new Error("y:((");
	}
});

/* todo */
Object.defineProperty(Label.prototype, "height", {
	get: function() { 
		throw new Error("h:(");
	},
	set: function(sy) {
		throw new Error("h:((");
	}
});

/* todo */
Object.defineProperty(Label.prototype, "width", {
	get: function() { 
		throw new Error("w:(");
	},
	set: function(sy) {
		throw new Error("w:((");
	}
});


/*Object.defineProperty(Label.prototype, "width", {
	get: function() { return Math.max(this.dtree.width, settings.labelMinWidth);           },
	set: function() { throw new Error("Cannot set width of Label, set fontsize instead."); }
});

Object.defineProperty(Label.prototype, "height", {
	get: function() { 
		var mh = R(this.dtree.height * (1 + settings.bottombox));
		return Math.max(mh, settings.labelMinHeight);          
	},
	set: function() { throw new Error("Cannot set height of Label, set fontsize instead."); }
});*/


/* sets the zone the label is 
 * also determines fontsize indirectly 
 * returns true if something changed */
Label.prototype.setZone = function(x1, y1, x2, y2) {
	if (this.x1 === x1 && this.y1 === y1 && this.x2 === x2 && this.y2 === y2) return false;
	var dtree = this.dtree;
	var zh = y2 - y1;
	var th = R(this.dtree.height * (1 + settings.bottombox));
	var dfs = dtree.fontsize;
	var fs = Math.max(dfs * zh / th, 8);
	var keepx2 = this.x2 == x2 ? x2 : Number.NAN;
	this.x1 = x1;
	this.y1 = y1;
	dtree.fontsize = fs;
	dtree.flowWidth = -1;
	if (keepx2 !== Number.NAN) {
		this.x1 = keepx2 - (this.x2 - this.x1);
		this.x2 = keepx2;
	}
	this._canvasActual = false;
//	this.x2 = x1 + dtree.width;	
//	this.y2 = y1 + R(this.dtree.height * (1 + settings.bottombox));
	return dfs !== fs;
}

/* sets new position retaining height */
Label.prototype.setPos = function(x1, y1) {
	if (this.x1 === x1 && this.y1 === y1) {
		return false;
	}
	this.x2 = x1 + (this.x2 - this.x1);
	this.y2 = y1 + (this.y2 - this.y1);
	this.x1 = x1;
	this.y1 = y1;
	return true;
}


/* returns the para at y */
Label.prototype.paraAtY = function(y) {
	return this.dtree.paraAtY(y);
}

/* drops the cached canvas */
Label.prototype.listen = function() {
	this._canvasActual = false;
	this.x2 = this.x1 + this.dtree.width;
	this.y2 = this.y1 + R(this.dtree.height * (1 + settings.bottombox));
	/* end of chain */
}

/* draws the items handles */
Label.prototype.drawHandles = function(space) {
	this._drawHandles(space, 170);
}

Label.prototype.checkItemCompass = function(x, y, rhs) { 
	return this._checkItemCompass(x, y, 170);
}

/* draws the item
   space  : to draw upon  */
Label.prototype.draw = function(space) {
	var bcanvas = this.bcanvas;
	var dtree = this.dtree;
	if (this._canvasActual) {
		/* buffer hit */
		space.canvas.getContext("2d").drawImage(bcanvas, this.x1 + space.pox, this.y1 + space.poy);
		return;
	}
	var w = this.x2 - this.x1;
	var h = this.y2 - this.y1;
	//cx.clearRect(0, 0, bcanvas.width, bcanvas.height); todo
	bcanvas.height = h;
	bcanvas.width  = w;
	/* draws text */	
	var cx = bcanvas.getContext("2d");
	dtree.drawCanvas(bcanvas, space.selection, 0, 0, 0);
	/* draws the border */
	cx.beginPath(); 
	cx.rect(0, 0, w, h);
	cx.lineWidth = 1;
	cx.strokeStyle = "rgba(128,128,128,1)";
	cx.stroke(); 
	cx.beginPath(); 
	this._canvasActual = true;
	space.canvas.getContext("2d").drawImage(bcanvas, this.x1 + space.pox, this.y1 + space.poy);
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
	this.bcanvas = document.createElement("canvas");
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

/* returns transfix code
 */
Relation.prototype.transfix = function(txe, space, x, y, z, shift, ctrl) {
	return 0;
}

/* todo remove */
Object.defineProperty(Relation.prototype, "width", {
	get: function() { throw new Error("Cannot get width of relation");  },
	set: function() { throw new Error("Cannot set width of relation, set fontsize instead."); }
});

Object.defineProperty(Relation.prototype, "height", {
	get: function() { throw new Error("Cannot get height of relation"); },
	set: function() { throw new Error("Cannot set height of relation, set fontsize instead."); }
});

/* drops the cached canvas */
Relation.prototype.listen = function() {
	this._canvasActual = false;
	/* end of chain */
}
	
Relation.prototype.resize = function(width, height) {
	var dtree = this.dtree;
	var fs = Math.max(dtree.fontsize * height / this.height, 8);
	if (dtree._fontsize == fs) return false;
	dtree.fontsize = fs;
	this._canvasActual = false;
	return true;
}

/* draws the items handles */
/* todo what is rhs? */
Relation.prototype.drawHandles = function(space) {
	this._drawHandles(space, 170);
}

Relation.prototype.checkItemCompass = function(x, y, rhs) { 
	return this._checkItemCompass(x, y, 170);
}

/* Draws one relationship arrow
 * (space, item1_id, item2_id, null, middle) - or - 
 * (space, item1_id,        x,    y, middle)  
 *
 * mcanvas:  if not null draw this in the middle of the arrow.
 * light:    if true highlights item2   
 */
function Relation_drawLabeledArrow(space, item1, item2_x, null_y, mcanvas, light) {
	var scanvas = space.canvas;
	var cx = scanvas.getContext("2d");
	var x1, y1, x2, y2;
	if (!item1) {
		throw new Error("todo");
	}
	var i1x1 = item1.x1 + space.pox + 0.5;
	var i1y1 = item1.y1 + space.poy + 0.5;
	var i1x2 = item1.x2 + space.pox + 0.5;
	var i1y2 = item1.y2 + space.poy + 0.5;;

	if (null_y) {
		x2 = item2_x + space.pox + 0.5;
		y2 = null_y  + space.poy + 0.5;
		/* find quadrant */
		var im = 0;
		if (x2 < i1x1) { x1 = i1x1; }
		else if (x2 < i1x2) { x1 = x2; im++; }
		else { x1 = i1x2; }

		if (y2 < i1y1) { y1 = i1y1; }
		else if (y2 < i1y2) { y1 = y2; im++; } 
		else { y1 = i1y2; }

		if (im == 2) {
			/* in middle */
			x1 = (i1x1 + i1x2) / 2;
			y1 = (i1y1 + i1y2) / 2;
		}
		System.setCursor("not-allowed");
	} else {
		var it2 = item2_x;
		if (!item2_x) {
			throw new Error("item2 missing");
		}
		var i2x1 = it2.x1 + space.pox + 0.5;
		var i2y1 = it2.y1 + space.poy + 0.5;
		var i2x2 = it2.x2 + space.pox + 0.5;
		var i2y2 = it2.y2 + space.poy + 0.5;

		if (i2x1 > i1x2) { 
			/* 2 is clearly to the right */
			x1 = i1x2;
			x2 = i2x1;
		} else if (i2x2 < i1x1) {
			/* 2 is clearly to the left */
			x1 = i1x1;
			x2 = i2x2;
		} else {
			/* an intersection */
			x1 = x2 = ((i1x1 > i2x1 ? i1x1 : i2x1) + (i1x2 < i2x2 ? i1x2 : i2x2)) / 2;
		}
		if (i2y1 > i1y2) { 
			/* 2 is clearly to the right */
			y1 = i1y2;
			y2 = i2y1;
		} else if (i2y2 < i1y1) {
			/* 2 is clearly to the left */
			y1 = i1y1;
			y2 = i2y2;
		} else {
			/* an intersection */
			y1 = y2 = ((i1y1 > i2y1 ? i1y1 : i2y1) + (i1y2 < i2y2 ? i1y2 : i2y2)) / 2;
		}

		//y1 = (iy  + iyh)  / 2;
		//y2 = (i2y + i2yh) / 2;	

		if (light) {
			/* todo let the item highlight itself */
			cx.beginPath();
			cx.moveTo(i2x1, i2y1);
			cx.lineTo(i2x2, i2y1);
			cx.lineTo(i2x2, i2y2);
			cx.lineTo(i2x1, i2y2);
			cx.closePath();
			cx.lineWidth = 3;
			cx.strokeStyle = "rgba(255, 183, 15, 0.5)";
			cx.stroke();
		}
		System.setCursor("default");
	}
	var as = 12;  // arrow size
	var d = Math.atan2(y2 - y1, x2 - x1);
	var ad = Math.PI/12;
	var ms = 2 / Math.sqrt(3) * as;
	cx.beginPath();
	cx.save();
	if (mcanvas) {

		var mx = (x1 + x2) / 2;
		var my = (y1 + y2) / 2;
		var tx = R(mx - mcanvas.width / 2)  - 2;
		var ty = R(my - mcanvas.height / 2) - 2;
		var bx = R(mx + mcanvas.width / 2)  + 2;
		var by = R(my + mcanvas.height / 2) + 2;
		cx.drawImage(mcanvas, tx, ty);
		
		cx.rect(tx - 0.5, ty - 0.5, mcanvas.width + 4, mcanvas.height + 4);
		cx.lineWidth = 1;
		cx.strokeStyle = "rgba(255, 127, 0, 0.4)";
		cx.stroke();
		cx.beginPath();
		
		var is1x, is1y; 
		var is2x, is2y;
	
		var kx = R((x2 - x1) / (y2 - y1) * mcanvas.height / 2);
		if (y1 > y2) {
			is1x = mx + kx;
			is2x = mx - kx; 
			is1y = by;
			is2y = ty;
		} else {
			is1x = mx - kx;
			is2x = mx + kx; 
			is1y = ty;
			is2y = by;
		}
		if (is1x < tx || is1x > bx) {
			var ky = R((y2 - y1) / (x2 - x1) * mcanvas.width  / 2);
			if (x1 > x2) {
				is1x = bx;
				is2x = tx; 
				is1y = my + ky;
				is2y = my - ky;
			} else {
				is1x = tx;
				is2x = bx; 
				is1y = my - ky;
				is2y = my + ky;
			}
		}

		cx.moveTo(x1, y1);
		cx.lineTo(is1x, is1y);
		cx.moveTo(is2x, is2y);
	} else {
		cx.moveTo(x1, y1);
	}
	cx.lineTo(x2 - ms * Math.cos(d),      y2 - ms * Math.sin(d));
	cx.lineTo(x2 - as * Math.cos(d - ad), y2 - as * Math.sin(d - ad));
	cx.lineTo(x2,                         y2);
	cx.lineTo(x2 - as * Math.cos(d + ad), y2 - as * Math.sin(d + ad));
	cx.lineTo(x2 - ms * Math.cos(d),      y2 - ms * Math.sin(d));
	cx.lineWidth = 3;
	cx.strokeStyle = "rgba(255, 225, 80, 0.5)";
	cx.stroke();
	cx.lineWidth = 1;
	cx.strokeStyle = "rgba(200, 100, 0, 0.8)";
	cx.stroke();
	cx.fillStyle = "rgba(255, 225, 40, 0.5)";
	cx.fill();
	cx.restore();
}

/* draws the item       * 
 * space, to draw upon  */
Relation.prototype.draw = function(space) {
	var bcanvas = this.bcanvas;
	var dtree = this.dtree;
	var it1 = space.repository.items[this.i1id];
	var it2 = space.repository.items[this.i2id];
	if (this._canvasActual) {
		/* buffer hit */
		Relation_drawLabeledArrow(space, it1, it2, null, bcanvas, false);
		return;
	}
	var cx = bcanvas.getContext("2d");
	/* draws text */	
	bcanvas.height = dtree.height;
	bcanvas.width  = dtree.width;
	dtree.drawCanvas(bcanvas, space.selection, 0, 0, 0);
	this._canvasActual = true;
	Relation_drawLabeledArrow(space, it1, it2, null, bcanvas, false);
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
}

Repository.prototype.reset = function() {
	/* all items */
	this.items = {};
	/* z information of the items, 0 is topmost */
	this.zidx = [];
	this._lock = false;
	
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
	
	var zjs = window.localStorage.getItem("zidx");	
	if (!zjs) {
		console.log("no repository found. (no zidx)");
		return;
	}
	var zidx = JSON.parse(zjs);
	this._lock = true;
	for (var i = zidx.length - 1; i >= 0; i--) {
		var id = zidx[i];
		var itstr = window.localStorage.getItem(id);
		var itjs;
		try {
			itjs = JSON.parse(itstr);
		} catch (err) {
			this._lock = false;
			throw err;
		} 		
		this._loadItem(id, itjs);
	}
	this._lock = false;
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
Repository.prototype.transfix = function(txe, space,  x, y, shift, ctrl) {
	var zidx  = this.zidx;
	var items = this.items;
	var fx = 0;
	for(var z = 0, zlen = zidx.length; z < zlen; z++) {
		var it = items[zidx[z]];
		fx |= it.transfix(txe, space, x, y, z, shift, ctrl);
		if (fx & TXR.HIT) break;
	}
	return fx;	
}

/* saves this repository into a JSON-String that is returned */
Repository.prototype.saveToJString = function() {
	var js = {}
	js.formatversion = 0;
	js.idf = this._idFactory;
	var items = this.items;
	var jitems = js.items = {};
	for (var id in items) {
		jitems[id] = items[id].jsonfy();
	}
	js.z = this.zidx;
	js.pox = System.space.pox;
	js.poy = System.space.poy;
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
	if (!this._lock && (!its[onlooker] || !its[onlooked])) {
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
	var or = this.onlookers[onlooker];
	/* todo is there a removeItem in array? */
	var odi = od.indexOf(onlooker);
	var ori = or.indexOf(onlooked);
	if (odi >= 0) od.splice(odi, 1);
	if (ori >= 0) or.splice(ori, 1);
}

/* loads the repository from a JSON string */
Repository.prototype.loadFromJString = function(str) {
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
	
	for (var i = zidx.length - 1; i >= 0; i--) {
		var id = zidx[i];
		if (typeof zidx[i] != "number") id = parseInt(id);
		this._loadItem(id, js.items[id]);
	}
	this._saveZIDX();
	System.space.setFoci(null);
	System.space.pox = js.pox || 0;
	System.space.poy = js.poy || 0;
}

Repository.prototype._newItemID = function() {
	var idf = this._idFactory;
	idf.nid++;
	window.localStorage.setItem("idf", JSON.stringify(idf));
	return idf.nid;
}

Repository.prototype._loadItem = function(id, itjs) {
	if (!itjs || !itjs.t) {
		throw new Error("JSON error: attributes missing from " + id + ":");
	}

	switch(itjs.t) {
	case "note"  : return new Note(itjs, id);
	case "label" : return new Label(itjs, id);
	case "rel"   : return new Relation(itjs, id);
	default :
		throw new Error("unknown item type");
	}
}

/* todo rename to zidx */
Repository.prototype._saveZIDX = function() {
	window.localStorage.setItem("zidx", JSON.stringify(this.zidx));
}

/* adds an item to the space */
Repository.prototype.addItem = function(item, top) {
	if (!item.id) item.id  = this._newItemID(item.type);
	this.items[item.id] = item;
	if (top) {
		this.zidx.unshift(item.id);
	} else {
		this.zidx.push(item.id);
	}
	
	if (!this._lock) {
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
	
	{	
		this.onlookeds.locked = true;
		var od = this.onlookeds[id];
		if (od) {
			var odc = [];
			// todo, is there array copy?
			for (var i = 0; i < od.length; i++) {
				odc[i] = od[i];
			}
			for (var i = 0; i < odc.length; i++) {
				var it = this.items[odc[i]];
				if (it) it.onlook(ONLOOK.REMOVE, item);
			}
		}
		this.onlookeds.locked = true;
	}
	
	if (!this._lock) {
		window.localStorage.setItem(item.id, "");
		this._saveZIDX();
	}
}

Repository.prototype._saveItem = function(item) {
	window.localStorage.setItem(item.id, JSON.stringify(item.jsonfy()));
}

Repository.prototype.updateItem = function(item) {
	if (this._lock) return;
	this._saveItem(item);
}

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ,.   ,   ,.       .
 `|  /|  / . ,-. ,-| ,-. . , ,
  | / | /  | | | | | | | |/|/
  `'  `'   ' ' ' `-^ `-' ' '
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
window.onload = function() {
	var request = document.location.search;
	if (request.indexOf("reset") >= 0) {
		console.log("Clearing localStorage");
		window.localStorage.clear();
	}
	System.init();
}

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
.-,--.               .-,--.                   .
' |   \ ,-. ,-,-. ,-. `|__/ ,-. ,-. ,-. ,-. . |- ,-. ,-. . .
, |   / |-' | | | | | )| \  |-' | | | | `-. | |  | | |   | |
`-^--'  `-' ' ' ' `-' `'  ` `-' |-' `-' `-' ' `' `-' '   `-|
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ | ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ /|~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~                                                          
                                '                        `-'
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
var demoRepository = (<r><![CDATA[
{
 "formatversion": 0,
 "idf": {
  "nid": 22
 },
 "items": {
  "6": {
   "t": "label",
   "x1": 977,
   "y1": 977,
   "y2": 987,
   "d": {
    "fs": 8,
    "d": [
     "This is a label"
    ]
   }
  },
  "10": {
   "t": "label",
   "x1": 82,
   "y1": 82,
   "y2": 225,
   "d": {
    "fs": 117.5,
    "d": [
     "is an"
    ]
   }
  },
  "2": {
   "t": "label",
   "x1": -64,
   "y1": -64,
   "y2": 60,
   "d": {
    "fs": 101.73604079684021,
    "d": [
     "Meshcraft"
    ]
   }
  },
  "8": {
   "t": "note",
   "x1": 173,
   "y1": 228,
   "x2": 328,
   "y2": 268,
   "d": {
    "fs": 13,
    "d": [
     "item network editor"
    ]
   }
  },
  "12": {
   "t": "note",
   "x1": 702,
   "y1": 44,
   "x2": 916,
   "y2": 94,
   "d": {
    "fs": 13,
    "d": [
     "Click an item to edit it."
    ]
   }
  },
  "20": {
   "t": "note",
   "x1": 702,
   "y1": 101,
   "x2": 915,
   "y2": 156,
   "d": {
    "fs": 13,
    "d": [
     "Click an items half-hexagon on its top/left to change it."
    ]
   }
  },
  "13": {
   "t": "note",
   "x1": 922,
   "y1": 43,
   "x2": 1139,
   "y2": 92,
   "d": {
    "fs": 13,
    "d": [
     "Drag an item to drag it."
    ]
   }
  },
  "21": {
   "t": "note",
   "x1": 925,
   "y1": 100,
   "x2": 1139,
   "y2": 154,
   "d": {
    "fs": 13,
    "d": [
     "Drag an items half-hexagon to create a relation."
    ]
   }
  },
  "11": {
   "t": "note",
   "x1": 702,
   "y1": -12,
   "x2": 915,
   "y2": 37,
   "d": {
    "fs": 13,
    "d": [
     "Click the background to create a new item."
    ]
   }
  },
  "9": {
   "t": "note",
   "x1": 921,
   "y1": -12,
   "x2": 1139,
   "y2": 38,
   "d": {
    "fs": 13,
    "d": [
     "Drag the background to pan."
    ]
   }
  },
  "3": {
   "t": "note",
   "x1": 976,
   "y1": 313,
   "x2": 1156,
   "y2": 501,
   "d": {
    "fs": 13,
    "d": [
     "This is a note.",
     "",
     "",
     "",
     "",
     "it can scroll",
     ". . . ",
     "",
     "",
     "",
     "like this."
    ]
   }
  }
 },
 "z": [
  8,
  3,
  9,
  11,
  21,
  13,
  20,
  12,
  2,
  10,
  6
 ],
 "pox": 78,
 "poy": 67
}
]]></r>).toString();
