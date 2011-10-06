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
                                       '___)   '___)                      `~~'  `"   |_|      `'*/
/**
| Authors: Axel Kittenberger (axkibe@gmail.com)
| License: GNU Affero GPLv3
*/

'use strict';

/**
| +++ Shortcuts  +++
*/
var R   = Math.round;
var abs = Math.abs;
var max = Math.max;
var min = Math.min;

var cos30         = C2D.cos30;
var debug         = C2D.debug;
var half          = C2D.half;
var tan30         = C2D.tan30;
var subclass      = C2D.subclass;
var Hexagon       = C2D.Hexagon;
var HexagonFlower = C2D.HexagonFlower;
var HexagonSlice  = C2D.HexagonSlice;
var Line          = C2D.Line;
var Margin        = C2D.Margin;
var Measure       = C2D.Measure;
var Point         = C2D.Point;
var Rect          = C2D.Rect;
var RoundRect     = C2D.RoundRect;

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
	// standard font
	defaultFont : 'Verdana,Geneva,Kalimati,sans-serif',

	// milliseconds after mouse down, dragging starts
	dragtime : 400,

	// pixels after mouse down and move, dragging starts
	dragbox  : 10,

	// factor to add to the bottom of font height
	bottombox : 0.22,

	// standard note in space
	note : {
		minWidth  :  40,
		minHeight :  40,
		newWidth  : 300,
		newHeight : 150,

		// inner margin to text
		imargin  : { n: 10, e: 10, s: 10, w: 10 },

		style : {
			fill : {
				gradient : 'askew',
				steps : [
					[0, 'rgba(255, 255, 248, 0.955)'],
				    [1, 'rgba(255, 255, 160, 0.955)'],
				],
			},
			edge : [
				{ border: 2, width : 1, color : 'rgb(255, 188, 87)' },
				{ border: 1, width : 1, color : 'black' },
			],
			highlight : [
				{ border: 0, width: 3, color: 'rgba(255, 183, 15, 0.5)' },
			],
		},

		cornerRadius : 6,
	},

	label : {
		style : {
			edge : [
				{ border: 0, width: 0.2, color: 'rgba(200, 100, 0, 0.5)' },
			],
			highlight : [
				{ border: 0, width: 3, color: 'rgba(255, 183, 15, 0.5)' },
			],
		},

		// inner margin to text
		imargin  : { n: 1, e: 1, s: 1, w: 1 },
	},

	// menu at the bottom of cockpit
	edgemenu : {
		style : {
			fill : {
				gradient : 'horizontal',
				steps : [
					[ 0, 'rgba(255, 255, 200, 0.90)' ],
					[ 1, 'rgba(255, 255, 160, 0.90)' ],
				],
			},
			edge : [
				{ border: 1, width :   2, color : 'rgb(255, 200, 105)' },
				{ border: 0, width : 0.5, color : 'black' },
			],
			select : {
				gradient : 'horizontal',
				steps : [
					[0, 'rgb(255, 237, 210)' ],
					[1, 'rgb(255, 185, 81)'  ],
				],
			},
		},
	},


	// float menu
	floatmenu : {
		outerRadius : 75,
		innerRadius : 30,
		style : {
			edge : [
				{ border: 1, width :   2, color : 'rgb(255, 200, 105)' },
				{ border: 0, width : 0.5, color : 'black' },
			],
			fill : {
				gradient : 'radial',
				steps : [
					[ 0, 'rgba(255, 255, 168, 0.955)' ],
					[ 1, 'rgba(255, 255, 243, 0.955)' ],
				],
			},
			select : {
				gradient : 'radial',
				steps : [
					[0, 'rgb(255, 185, 81)'  ],
					[1, 'rgb(255, 237, 210)' ],
				],
			},
		},
	},

	// item menu
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

	// selection
	selection : {
		style : {
			fill   : 'rgba(243, 203, 255, 0.9)',
			edge : [
				//{ border : 0, width : 1, color: 'rgb(254,183,253)' },
				{ border : 0, width : 1, color: 'black' },
			],
		}
	},

	// scrollbar
	scrollbar : {
		style : {
			fill : 'rgb(255, 188, 87)',
			edge : [
				{ border : 0, width : 1, color: 'rgb(221, 154, 52)' },
			],
		},
		radius      : 4,
		marginX     : 7,
		marginY     : 5,
	},

	// size of resize handles
	handle : {
		size      : 10,
		distance  : 0,

		style : {
			edge : [
				{ border: 0, width: 3, color: 'rgb(125,120,32)' },
				{ border: 0, width: 1, color: 'rgb(255,180,90)' },
			],
		},
	},

	relation : {
		style : {
			fill : 'rgba(255, 225, 40, 0.5)',
			edge : [
				{ border: 0, width : 3, color : 'rgba(255, 225, 80, 0.5)' },
				{ border: 0, width : 1, color : 'rgba(200, 100, 0, 0.8)' },
			],
			labeledge : [
				{ border: 0, width : 0.2, color : 'rgba(200, 100, 0, 0.5)' },
			],
			highlight : [
				{ border: 0, width: 3, color: 'rgba(255, 183, 15, 0.5)' },
			],
		},

		// inner margin to text
		imargin  : { n: 1, e: 1, s: 1, w: 1 },

		// scale down relation text
		demagnify : 1.2,
	},

	// Blink speed of the caret.
	caretBlinkSpeed : 530,
};

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
.-,--.
 `\__  ,-. . . ,-,-. ,-.
  /    | | | | | | | `-.
 '`--' ' ' `-^ ' ' ' `-'
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
/**
| Mouse state
*/
var MST = {
	NONE   : 0, // button is up
	ATWEEN : 1, // mouse just came down, unsure if click or drag
	DRAG   : 2  // mouse is dragging
};
Object.freeze(MST);

/**
| Interface action active.
*/
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

/**
| Bitfield return code of transfix()
*/
var TXR = {
	HIT    : 0x1,
	REDRAW : 0x2
};
Object.freeze(TXR);


/**
| onlook() events
*/
var ONLOOK = {
	NONE   : 0,
	UPDATE : 1,
	REMOVE : 2,
}
Object.freeze(ONLOOK);

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

Object.defineProperty(Marker.prototype, 'item', {
	get: function() { return this._item; },
	set: function(it) { throw new Error('use set()'); }
});

Object.defineProperty(Marker.prototype, 'element', {
	get: function() { return this._element; },
	set: function(e) { throw new Error('use set()'); }
});

Object.defineProperty(Marker.prototype, 'offset', {
	get: function() { return this._offset; },
	set: function(o) { this._offset = o; }
});

/**
| set(marker)                -or-
| set(element, offset)       -or-
| set(item, element, offset) -or-
*/
Marker.prototype.set = function(a1, a2, a3) {
	// todo, use typeof
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
		throw new Error('wrong # of arguments');
		break;
	}
}

/**
| Returns chunk at x/y
*/
Marker.prototype._getPinfoAtP = function(flowbox, p) {
	var pinfo = flowbox.pinfo;
	var plen = pinfo.length;
	var li;
	for (li = 0; li < plen; li++) {
		if (p.y <= pinfo[li].y) {
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
		if (p.x <= c.x + c.w) {
			this._pci = ci;
			return pinfo;
		}
	}
	/* set to last chunk if overflow */
	this._pci = llen - 1;
	return pinfo;
}

/**
| Gets the markers position, relative to dtree
*/
Marker.prototype.getPoint = function() {
	/* todo cache position */
	var dtree = this._item.dtree;
	Measure.font = dtree.font;
	var e = this._element;
	var t = e.text;
	var p = e.anchestor(Paragraph);
	var pinfo = this.getPinfo();
	var l = pinfo[this._pli];
	var c = l[this._pci];
	return p.p.add(
		(c ? c.x + Measure.width(t.substring(c.offset, this._offset)) : l.x),
		l.y - dtree.fontsize);
}

/**
| Sets the marker to position closest to x, y from flowbox(para).
*/
Marker.prototype.setFromPoint = function(flowbox, p) {
	if (!flowbox instanceof Paragraph) { throw new Error('invalid flowbox.'); }
	var pinfo = this._getPinfoAtP(flowbox, p);
	var l = pinfo[this._pli];
	var c = l[this._pci]; // x,y is in this chunk

	if (!c) {
		// todo?
		this._element = flowbox.first;
		this._offset = 0;
		return;
	}
	var dx   = p.x - c.x;
	Measure.font = flowbox.anchestor(DTree).font;
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

/**
| Sets this.pline and this.pchunk according to the chunk
| the marker is in
*/
Marker.prototype.getPinfo = function() {
	var te = this._element;
	var to = this._offset;
	var para  = te.anchestor(Paragraph);
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

/**
| Moves the marker a line up (dir == true) or down
| returns true if moved
*/
Marker.prototype.moveUpDown = function(dir) {
	var e  = this._element;
	var o  = this._offset;
	Measure.font = e.anchestor(DTree).font;
	var p  = e.anchestor(Paragraph);
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

/**
| Moves the marker a character left (dir == true) or right
| returns true if moved.
*/
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

 The Caret.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
/**
| Constructor.
*/
function Caret() {
	Marker.call(this);
	// true if visible
	this.shown = false;
	// true when just blinked away
	this.blink = false;
}
subclass(Caret, Marker);


/**
| Shows the caret or resets the blink timer if already shown
*/
Caret.prototype.show = function() {
	this.shown = true;
	this.blink = false;
	System.startBlinker();
}

/**
| Hides the caret.
*/
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

 Text Selection.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
/**
| Constructor.
*/
function Selection() {
	this.active = false;
	this.mark1 = new Marker();
	this.mark2 = new Marker();
	this.begin = null;
	this.end   = null;
}

/**
| Sets begin/end so begin is before end.
*/
Selection.prototype.normalize = function() {
	var e1 = this.mark1.element;
	var e2 = this.mark2.element;

	if (e1 === e2) {
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

/**
| The text the selection selects.
*/
Selection.prototype.innerText = function() {
	if (!this.active) return '';
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
		// ^ todo make multi child compatible
		if (!n) { throw new Error('selection akward');}
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

 todo, what exactly belongs to this?

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
/**
| Constructor.
*/
function Editor() {
	this.caret     = new Caret();
	this.selection = new Selection();
	this.item      = null;
}

/**
| Draws or erases the caret.
*/
Editor.prototype.updateCaret = function() {
	var c2d = System.c2d;
	var caret = this.caret;
	if (caret.save) {
		/* erase the old caret */
		c2d.putImageData(caret.save, caret.sp.x - 1, caret.sp.y - 1);
		caret.save = null;
	}
	if (caret.shown && !caret.blink) {
		var cp = caret.getPoint();
		var it = caret.item;
		var sy = max(it.scrolly, 0) || 0;
		var tzone = it.handlezone; // todo, do not reuse handlezone
		var th = R(it.dtree.fontsize * (1 + settings.bottombox));
		var cyn = cp.y - sy;
		var cys = cyn + th;
		cyn = min(max(cyn, 0), tzone.height);
		cys = min(max(cys, 0), tzone.height);
		if (cyn === cys) {
			caret.save = null;
			return;
		}
		var sp = caret.sp = System.space.pan.add(
			tzone.pnw.x + cp.x,
			tzone.pnw.y + cyn);
		caret.save = c2d.getImageData(sp.x - 1, sp.y - 1, 3, cys - cyn + 1);
		c2d.fillRect('black', sp.x, sp.y, 1, cys - cyn);
	}
}

/**
| Inserts a new line
*/
Editor.prototype.newline = function() {
	var caret  = this.caret;
	var ce    = caret.element;
	var co    = caret.offset;
	var ct    = ce.text;
	// todo multi node ability
	var opara = ce.anchestor(Paragraph);

	ce.text = ct.substring(0, co);
	var npara = new Paragraph(ct.substring(co, ct.length));
	opara.parent.insertBefore(npara, opara.next);
	caret.set(npara.first, 0);
}

/**
| Handles a special(control) key
| returns true if the element needs to be redrawn.
*/
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
			var para = ce.anchestor(Paragraph);
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
			var para = ce.anchestor(Paragraph);
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
			// clears item cache
			item.listen();  // todo rename.
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

/**
| Switches caret visibility state.
*/
Editor.prototype.blink = function() {
	if (this.caret.shown) {
		this.caret.blink = !this.caret.blink;
		this.updateCaret();
	}
}

/**
| Deletes the selection including its contents.
*/
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
			// ^ todo make multi child compatible
			pn.parent.remove(pn);
		}
		pn.parent.remove(pn);
	}
	be.listen();
	this.caret.set(b);
	select.active = false;
	// setInput('') is done by System
}

/**
| Removes the selection.
*/
Editor.prototype.deselect = function() {
	if (!this.selection.active) return;
	var item = this.selection.mark1.item;
	this.selection.active = false;
	System.setInput('');
	/* clear item cache */
	item.listen();
}

/**
| Received a input from user
| returns true if redraw is needed
*/
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
       `-'
  Base system for Meshcraft.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
var System = {

/**
| Catches all errors a function throws if enabledCatcher is set.
*/
makeCatcher : function(that, fun) {
	return function() {
		'use strict';
		if (enableCatcher) {
			try {
				fun.apply(that, arguments);
			} catch(err) {
				alert('Internal failure, '+err.name+': '+err.message+'\n\n' +
				      'file: '+err.fileName+'\n'+
					  'line: '+err.lineNumber+'\n'+
					  'stack: '+err.stack);
			}
		} else {
			fun.apply(that, arguments);
		}
	};
},

/**
| Startup.
*/
init : function() {
	System.makeCatcher(System, System._init)();
},

/**
| Startup with possibly enabled error catching.
*/
_init : function() {
	if (this != System) throw new Error('System has wrong this pointer');
	var canvas = this.canvas = document.getElementById('canvas');
	canvas.width  = window.innerWidth - 1;
	canvas.height = window.innerHeight - 1;
	this.c2d = new C2D(canvas);
	Measure.init();

	// the space that currently is displayed
	this.space = null;

	// if true browser supports the setCapture() call
	// if false needs work around
	var useCapture = canvas.setCapture != null;

	// mouse state  todox
	var mst = MST.NONE;
	// position the mouse went down to atween state
	var msp = null;
	// latest mouse position seen in atween state
	var mmp = null;
	// latest shift/ctrl key status in atween state
	var mms = null;
	var mmc = null;
	// timer for atween state
	var atweenTimer = null;

	var editor = this.editor = new Editor();

	// hidden input that forwards all events
	var hiddenInput = document.getElementById('input');

	// remembers last SpecialKey pressed, to hinder double events.
	// Opera is behaving stupid here.
	var lastSpecialKey = -1;

	/**
	| A special key was pressed.
	*/
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

	/**
	| Captures all mouseevents event beyond the canvas (for dragging).
	*/
	function captureEvents() {
		if (useCapture) {
			canvas.setCapture(canvas);
		} else {
			document.onmouseup   = canvas.onmouseup;
			document.onmousemove = canvas.onmousemove;
		}
	}

	/**
	| Stops capturing all mouseevents
	*/
	function releaseEvents() {
		if (useCapture) {
			canvas.releaseCapture(canvas);
		} else {
			document.onmouseup = null;
			document.onmousemove = null;
		}
	}

	// the value that is expected to be in input.
	// either nothing or the text selection.
	// if it changes the user did something.

	var inputval = '';

	//---------------------------------
	//-- Functions the browser calls --
	//---------------------------------

	// tests if the hidden input field got data
	function testinput() {
		var text = hiddenInput.value;
		if (text == inputval) {
			return;
		}
		hiddenInput.value = inputval = '';
		System.space.input(text);
	}

	/**
	| does a blink.
	*/
	function blink() {
		// hackish, also look into the hidden input field,
		// maybe the user pasted something using the browser menu.
		testinput();
		editor.blink();
	}

	/**
	| Key down in hidden input field.
	*/
	function onkeydown(event) {
		if (!specialKey.call(this,
			lastSpecialKey = event.keyCode, event.shiftKey, event.ctrlKey || event.metaKey
		)) event.preventDefault();
	}

	/**
	| Hidden input key press.
	*/
	function onkeypress(event) {
		var ew = event.which;
		var ek = event.keyCode;
		if (((ek > 0 && ek < 32) || ew == 0) && lastSpecialKey != ek) {
			lastSpecialKey = -1;
			return specialKey.call(this, ek, event.shiftKey, event.ctrlKey || event.metaKey);
		}
		lastSpecialKey = -1;
		testinput();
		setTimeout('System.ontestinput();', 0);
		return true;
	}

	/**
	| Hidden input key up.
	*/
	function onkeyup(event) {
		testinput();
		return true;
	}

	/**
	| Hidden input lost focus.
	*/
	function onblur(event) {
		this.space.systemBlur();
	}

	/**
	| Hidden input got focus.
	*/
	function onfocus(event) {
		this.space.systemFocus();
	}

	/**
	| View window resized.
	*/
	function onresize(event) {
		canvas.width  = window.innerWidth - 1;
		canvas.height = window.innerHeight - 1;
		this.space && this.space.redraw();
	}

	/**
	| Mouse move event.
	*/
	function onmousemove(event) {
		var p = new Point(event.pageX - canvas.offsetLeft, event.pageY - canvas.offsetTop);

		switch(mst) {
		case MST.NONE :
			this.space.mousehover(p);
			return true;
		case MST.ATWEEN :
			var dragbox = settings.dragbox;
			if ((abs(p.x - msp.x) > dragbox) || (abs(p.y - msp.y) > dragbox)) {
				// moved out of dragbox -> start dragging
				clearTimeout(atweenTimer);
				atweenTimer = null;
				mst = MST.DRAG;
				this.space.dragstart(msp, event.shiftKey, event.ctrlKey || event.metaKey);
				if (!p.eq(msp)) {
					this.space.dragmove(p, event.shiftKey, event.ctrlKey || event.metaKey);
				}
				captureEvents();
			} else {
				// saves position for possible atween timeout
				mmp = p;
				mms = event.shiftKey;
				mmc = event.ctrlKey || event.metaKey;
			}
			return true;
		case MST.DRAG :
			this.space.dragmove(p, event.shiftKey, event.ctrlKey || event.metaKey);
			return true;
		default :
			throw new Error('invalid mst');
		}
	}

	/**
	| Mouse down event.
	*/
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
			atweenTimer = setTimeout('System.onatweentime();', settings.dragtime);
			break;
		case MST.DRAG :
			captureEvents();
			break;
		}
		return false;
	}

	/**
	| Mouse up event.
	*/
	function onmouseup(event) {
		event.preventDefault();
		releaseEvents();
		var p = new Point(event.pageX - canvas.offsetLeft, event.pageY - canvas.offsetTop);

		switch (mst) {
		case MST.NONE :
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

	/**
	| Mouse down event.
	*/
	function onmousewheel(event) {
		var wheel = event.wheelDelta || event.detail;
		wheel = wheel > 0 ? 1 : -1;
		this.space.mousewheel(wheel);
	}

	/**
	| Timeout after mouse down so dragging starts.
	*/
	function onatweentime() {
		if (mst != MST.ATWEEN) {
			console.log('dragTime() in wrong action mode');
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

	/**
	| Sets the mouse cursor
	*/
	this.setCursor = function(cursor) {
		canvas.style.cursor = cursor;
	}

	//-------------------------------------
	//-- Interface for the System object --
	//-------------------------------------

	/**
	| Sets the input (text selection).
	*/
	this.setInput = function(text) {
		hiddenInput.value = inputval = text;
		if (text != '') {
			hiddenInput.selectionStart = 0;
			hiddenInput.selectionEnd = text.length;
		}
	}

	// the blink (and check input) timer
	var blinkTimer = null;

	/**
	| (re)starts the blink timer
	*/
	this.startBlinker = function() {
		if (blinkTimer) {
			clearInterval(blinkTimer);
		}
		testinput();
		blinkTimer = setInterval('System.onblink()', settings.caretBlinkSpeed);
	}

	/**
	| Stops the blink timer.
	*/
	this.stopBlinker = function() {
		if (blinkTimer) {
			clearInterval(blinkTimer);
		}
	}

	this.repository = new Repository();
	this.space = new Space();
	this.startBlinker();
	// hinders init to be called another time
	delete this.init;
	delete this._init;

	if (!this.repository.loadLocalStorage()) {
		this.repository.importFromJString(demoRepository);
	}
	this.space.redraw();
}};

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  ,-_/,.
 ' |_|/ ,-. . , ,-,-. ,-. ,-. . .
  /| |  |-'  X  | | | |-' | | | |
  `' `' `-' ' ` ' ' ' `-' ' ' `-^
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

 outerRadius |------>|
 innerRadius |->|    '
         .------'.   '      -1
		/ \  n  / \	 '
	   /nw .---.'ne\ '
	  /___/  .  \___\'
	  \   \ pc  /   /
	   \sw `---´ se/
 	    \ /  s  \ /
         `-------´

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
/**
| Constructor.
*/
function Hexmenu(pc, style, labels) {
	this.p = p;
	this.style = style;
	this.hflower = new HexagonFlower(pc, style.innerRadius, style.outerRadius, labels);
	this.labels = labels;
	this.mousepos = null;
}

/**
| Draws the hexmenu.
*/
Hexmenu.prototype.draw = function() {
	var c2d = System.c2d; // todo?

	c2d.fill(settings.floatmenu.style.fill, this.hflower, 'path', 'outerHex');
	if (this.mousepos && this.mousepos !== 'center') {
		c2d.fill(settings.floatmenu.style.select, this.hflower, 'path', this.mousepos);
	}
	c2d.edge(settings.floatmenu.style.edge, this.hflower, 'path', 'structure');

	c2d.fontStyle('12px ' + settings.defaultFont, 'black', 'center', 'middle');
	var labels = this.labels;

	var rd = this.style.outerRadius * (1 - 1 / 3.5);

	if (labels.n)  c2d.fillText(labels.n, this.p.x, this.p.y - rd);
	if (labels.ne) c2d.fillRotateText(labels.ne, this.p, Math.PI / 3 * 1, rd);
	if (labels.se) c2d.fillRotateText(labels.se, this.p, Math.PI / 3 * 2, rd);
	if (labels.s)  c2d.fillText(labels.n, this.p.x, this.p.y + rd);
	if (labels.sw) c2d.fillRotateText(labels.sw, this.p, Math.PI / 3 * 4, rd);
	if (labels.nw) c2d.fillRotateText(labels.nw, this.p, Math.PI / 3 * 5, rd);
	if (labels.c)  c2d.fillText(labels.c, this.p);
}

/**
| Sets this.mousepos and returns it according to p.
*/
Hexmenu.prototype.getMousepos = function(p) {
	return this.mousepos = this.hflower.within(p);
}

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
.-,--.   .
 `\__  ,-| ,-. ,-. ,-,-. ,-. ,-. . .
  /    | | | | |-' | | | |-' | | | |
 '`--' `-^ `-| `-' ' ' ' `-' ' ' `-^
~ ~ ~ ~ ~ ~ ,|~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
            `'
  The menu at the screen edge.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

/**
| Constructor.
*/
function Edgemenu() {
	// section mouse hovers over/clicks
	this.mousepos = -1;

	// widths of buttons (meassured on bottom)
	this.buttonWidths = [100, 150, 100];

	// label texts
	this.labels = ['Export', 'Meshcraft Demospace', 'Import'];

	// total width
	var width = 0;
	for(var b in this.buttonWidths) {
		width += this.buttonWidths[b];
	}
	this.width = width;

	// total height
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
	// width half
	var w2 = half(this.width);
	// x in the middle
	var xm = half(this.pnw.x + this.pse.x);
	// edge width (diagonal extra)
	var ew  = R((this.pse.y - this.pnw.y) * C2D.tan30);

	c2d.beginPath();
	if (section === -2) {
		// structure frame
		c2d.moveTo(this.pnw.x + b,      this.pse.y);
		c2d.lineTo(this.pnw.x + ew + b, this.pnw.y + b);
		c2d.lineTo(this.pse.x - ew - b, this.pnw.y + b);
		c2d.lineTo(this.pse.x - b,      this.pse.y);

		// x-position of button
		var bx = this.pnw.x;
		for(var b = 0; b < this.buttonWidths.length - 1; b++) {
			bx += this.buttonWidths[b];
			c2d.moveTo(bx, this.pse.y);
			if (b % 2 === 0) {
				c2d.lineTo(bx - ew, this.pnw.y);
			} else {
				c2d.lineTo(bx + ew, this.pnw.y);
			}
		}
	} else if (section === -1) {
		// outer frame
		c2d.moveTo(this.pnw.x + b,      this.pse.y);
		c2d.lineTo(this.pnw.x + ew + b, this.pnw.y + b);
		c2d.lineTo(this.pse.x - ew - b, this.pnw.y + b);
		c2d.lineTo(this.pse.x - b,      this.pse.y);
	} else {
		if (section < 0) throw new Error('invalid section');
		var bx = this.pnw.x;
		for(var b = 0; b < section; b++) {
			bx += this.buttonWidths[b];
		}
		c2d.moveTo(bx, this.pse.y);
		if (section % 2 === 0) {
			c2d.lineTo(bx + ew, this.pnw.y);
			bx += this.buttonWidths[section];
			c2d.lineTo(bx - ew, this.pnw.y);
			c2d.lineTo(bx,      this.pse.y);
		} else {
			c2d.lineTo(bx - ew, this.pnw.y);
			bx += this.buttonWidths[section];
			c2d.lineTo(bx + ew, this.pnw.y);
			c2d.lineTo(bx,      this.pse.y);
		}
	}
}

/**
| Draws the edgemenu.
*/
Edgemenu.prototype.draw = function() {
	var c2d = System.c2d;
	var xm  = half(c2d.width);
	var w2  = half(this.width);

	this.pnw = Point.renew(xm - w2, c2d.height - this.height, this.pnw, this.pse);
	this.pse = Point.renew(xm + w2, c2d.height, this.pnw, this.pse);

	c2d.fill(settings.edgemenu.style.fill, this, 'path', -1); // todo combine path-1
	if (this.mousepos >= 0) {
		c2d.fill(settings.edgemenu.style.select, this, 'path', this.mousepos);
	}
	c2d.edge(settings.edgemenu.style.edge, this, 'path', -2);

	c2d.fontStyle('12px ' + settings.defaultFont, 'black', 'center', 'middle');
	var bx = this.pnw.x;
	var my = half(this.pnw.y + this.pse.y);
	for(var i = 0; i < this.labels.length; i++) {
		c2d.fillText(this.labels[i], bx + half(this.buttonWidths[i]), my);
		bx += this.buttonWidths[i];
	}
}

/**
| Returns which section the position is at.
| todo rename
*/
Edgemenu.prototype.getMousepos = function(p) {
	var c2d = System.c2d;
	if (!this.pnw || !this.pse) return this.mousepos = -1;
	if (p.y < this.pnw.y) return this.mousepos = -1;
	var mx = half(c2d.width);  // todo give it pc
	var ew = R((this.pse.y - this.pnw.y) * C2D.tan30); // todo simplify
	// shortcut name = letters for formula
	var pymcht6 = (p.y - c2d.height) * C2D.tan30;

	if (p.x - this.pnw.x < -pymcht6) return this.mousepos = -1;
	if (p.x - this.pse.x >  pymcht6) return this.mousepos = -1;
	var bx = this.pnw.x;
	for(var mp = 0; mp < this.buttonWidths.length; mp++) {
		bx += this.buttonWidths[mp];
		if (mp % 2 === 0) {
			if (p.x - bx < pymcht6) return this.mousepos = mp;
		} else {
			if (p.x - bx < -pymcht6) return this.mousepos = mp;
		}
	}
	throw new Error('this code should not be reached');
	return this.mousepos = -1;
}


/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  ,--.         .         .
 | `-' ,-. ,-. | , ,-. . |-
 |   . | | |   |<  | | | |
 `--'  `-' `-' ' ` |-' ' `'
~ ~ ~ ~ ~ ~ ~ ~ ~ ~|~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
                   '
 The unmoving interface.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
function Cockpit() {
// todo, use this!

}

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 .---.
 \___  ,-. ,-. ,-. ,-.
     \ | | ,-| |   |-'
 `---' |-' `-^ `-' `-'
~ ~ ~ ~|~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
       '
 The place where all the items are.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

/**
| Constructor
*/
function Space() {
	this._floatMenuLabels = {c: 'new', n: 'Note', ne: 'Label'};
	this.edgemenu = new Edgemenu();

	//todo evil
	this.iaction = {
		act : ACT.NONE,
	};

	// panning offset
	this.c2d = new C2D(System.canvas);
	this.pan = new Point(0, 0);
	this.c2d.pan = this.pan;

	this.zoom = 1;
}

/**
| Redraws the complete space.
*/
Space.prototype.redraw = function() {
	var items = System.repository.items;
	var zidx  = System.repository.zidx;
	var editor = System.editor;
	var canvas = System.canvas;
	var c2d = this.c2d;
	editor.caret.save = null;
	this.selection = editor.selection;
	this.canvas = System.canvas;
	c2d.attune();

	for(var i = zidx.length - 1; i >= 0; i--) {
		var it = items[zidx[i]]; // todo shorten
		it.draw(c2d, this.selection);
	}
	if (this.focus) this.focus.drawHandles(c2d);

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
			ia.item.handlezone, 'normal',
			(ia.item2 && ia.item2.handlezone) || ia.smp , 'arrow');
		// todo use something like bindzone
		if (ia.item2) ia.item2.highlight(c2d);
		arrow.draw(c2d);
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
	System.editor.updateCaret();
}

/* sets the focussed item or loses it if null*/
Space.prototype.setFocus = function(item) {
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
	var redraw = this.edgemenu.mousepos !== this.edgemenu.getMousepos(p);
	if (this.edgemenu.mousepos >= 0) {
		/* mouse floated on edge menu, no need to look further */
		System.setCursor('default');
		if (redraw) this.redraw();
		return;
	}

	switch(this.iaction.act) {
	case ACT.FMENU :
		redraw = (this._floatmenu.mousepos !== this._floatmenu.getMousepos(p)) || redraw;
		if (this._floatmenu.mousepos >= 0) {
			/* mouse floated on float menu, no need to look further */
			System.setCursor('default');
			if (redraw) this.redraw();
			return;
		}
		break;
	case ACT.IMENU :
		redraw = (this._itemmenu.mousepos !== this._itemmenu.getMousepos(p)) || redraw;
		if (this._itemmenu.mousepos >= 0) {
			/* mouse floated on item menu, no need to look further */
			System.setCursor('default');
			if (redraw) this.redraw();
			return;
		}
		break;
	}

	if (this.focus) {
		// todo move into items
		if (this.focus.withinItemMenu(pp)) {
			System.setCursor('pointer');
			if (redraw) this.redraw();
			return;
		}

		if ((com = this.focus.checkItemCompass(pp))) {
			System.setCursor(com+'-resize');
			if (redraw) this.redraw();
			return;
		}
	}

	// todo remove nulls by shiftKey, ctrlKey
	var tx = System.repository.transfix(TXE.HOVER, this, pp, null, null);
	redraw = redraw || (tx & TXR.REDRAW);
	if (!(tx & TXR.HIT)) { System.setCursor('crosshair');}
	if (redraw) this.redraw();
}

/* starts creating a new relation */
Space.prototype.actionSpawnRelation = function(item, p) {
	var ia = this.iaction;
	ia.act = ACT.RBIND;
	ia.item = item;
	ia.sp = ia.smp = p;
	System.setCursor('not-allowed');
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
	System.setCursor('move');
}


Space.prototype.actionRBindTo = function(toItem) {
	if (toItem.id === this.iaction.item.id) {
		console.log('not binding to itself');
		System.setCursor('default');
		return;
	}
	var rel = Relation.create(this.iaction.item, toItem);
	System.repository.updateItem(rel);
}

Space.prototype.actionRBindHover = function(toItem) {
	if (toItem.id === this.iaction.item.id) {
		System.setCursor('not-allowed');
		return;
	}
	System.setCursor('default');
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
		System.setCursor('crosshair');
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
		this._floatmenu = new Hexmenu(p, settings.floatmenu, this._floatMenuLabels);

		System.setCursor('default');
		this.setFocus(null);
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
		iaction.item.moveto(pp.sub(iaction.sp));
		System.repository.updateItem(iaction.item);
		iaction.item = null;
		System.setCursor('default');
		redraw = true;
		break;
	case ACT.PAN :
		break;
	case ACT.IRESIZE :
		// todo rename everything, make iaction a prototype.
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
		throw new Error('Invalid action in "Space.dragstop"');
	}
	iaction.act = ACT.NONE;
	iaction.sp  = null;
	if (redraw) this.redraw();
	return;
}

/**
| Moving during an operation with the mouse held down.
*/
Space.prototype.dragmove = function(p, shift, ctrl) {
	var pp = p.sub(this.pan);
	var iaction = this.iaction;
	var redraw = false;

	switch(iaction.act) {
	case ACT.PAN :
		this.pan = this.c2d.pan = p.sub(iaction.sp);
		System.repository.savePan(this.pan);
		this.redraw();
		return;
	case ACT.IDRAG :
		iaction.item.moveto(pp.sub(iaction.sp));
		System.repository.updateItem(iaction.item);
		this.redraw();
		return;
	case ACT.IRESIZE :
		var ipnw = iaction.siz.pnw;
		var ipse = iaction.siz.pse;
		var it = iaction.item;
		var dx = p.x - iaction.sp.x;
		var dy = p.y - iaction.sp.y;
		var pnw, pse;
		switch (iaction.com) {
		case 'n'  :
			pnw = Point.renew(ipnw.x, min(ipnw.y + dy, ipse.y), ipnw, ipse);
			pse = ipse;
			break;
		case 'ne' :
			pnw = Point.renew(ipnw.x, min(ipnw.y + dy, ipse.y), ipnw, ipse);
			pse = Point.renew(max(ipse.x + dx, ipnw.x), ipse.y, ipnw, ipse);
			break;
		case 'e'  :
			pnw = ipnw;
			pse = Point.renew(max(ipse.x + dx, ipnw.x), ipse.y, ipnw, ipse);
			break;
		case 'se' :
			pnw = ipnw;
			pse = Point.renew(max(ipse.x + dx, ipnw.x), max(ipse.y + dy, ipnw.y), ipnw, ipse);
			break;
		case 's' :
			pnw = ipnw;
			pse = Point.renew(ipse.x, max(ipse.y + dy, ipnw.y), ipnw, ipse);
			break;
		case 'sw'  :
			pnw = Point.renew(min(ipnw.x + dx, ipse.x), ipnw.y, ipnw, ipse),
			pse = Point.renew(ipse.x, max(ipse.y + dy, ipnw.y), ipnw, ipse);
			break;
		case 'w'   :
			pnw = Point.renew(min(ipnw.x + dx, ipse.x), ipnw.y, ipnw, ipse),
			pse = ipse;
			break;
		case 'nw' :
			pnw = Point.renew(min(ipnw.x + dx, ipse.x), min(ipnw.y + dy, ipse.y), ipnw, ipse);
			pse = ipse;
			break;
		case 'c' :
		default  :
			throw new Error('unknown align');
		}

		redraw = it.setZone(new Rect(pnw, pse), C2D.opposite(iaction.com));

		if (redraw) this.redraw();
		System.repository.updateItem(iaction.item);
		return;
	case ACT.SCROLLY:
		var dy = pp.y - iaction.sy;
		var it = iaction.item;
		var h = it.zone.height;
		var scrollRange = h - settings.scrollbar.marginY * 2;
		var dtreeHeight = it.dtree.height;
		var innerHeight = h - it.imargin.y;
		var scrollSize  = scrollRange * innerHeight / dtreeHeight;
		var srad = settings.scrollbar.radius;
		if (scrollSize < srad * 2) {
			/* minimum size of scrollbar */
			scrollSize = srad * 2;
		}
		var sy = iaction.ssy +
			dy * (dtreeHeight - innerHeight) / (scrollRange - scrollSize);
		var smaxy = dtreeHeight - innerHeight;
		sy = min(max(sy, 0), smaxy);
		it.scrolly = sy;
		this.redraw();
		return true;
	case ACT.RBIND :
		iaction.item2 = null;
		System.repository.transfix(TXE.RBINDHOVER, this, pp, shift, ctrl);
		iaction.smp = pp;
		this.redraw();
		return true;
	default :
		throw new Error('unknown action code in Space.dragging: '+iaction.act);
	}
}

/* shows the export dialog */
Space.prototype._exportDialog = function() {
	var div = document.createElement('div');
	div.style.position = 'absolute';
	div.style.width    = '100%';
	div.style.height   = '100%';
	div.style.top      = 0;
	div.style.left     = 0;
	div.style.zIndex   = 10;
	div.style.background = 'rgba(248, 237, 105, 0.9)';
	div.style.overflow   = 'auto';
	document.body.appendChild(div);
	var label = document.createElement('div');
	label.style.width = '100%';
	label.style.textAlign = 'center';
	label.style.marginTop = '20px';
	label.style.fontWeight = 'bold';
	label.appendChild(document.createTextNode(
		'Copy/paste this to a text file (e.g.notepad) and save it there.'
	));
	div.appendChild(label);
	var label2 = document.createElement('div');
	label2.style.width = '100%';
	label2.style.textAlign = 'center';
	label2.appendChild(document.createTextNode(
		'Sorry for this, current browsers do not yet allow file creation for offline repositories.')
	);
	div.appendChild(label2);
	var ta = document.createElement('textarea');
	ta.style.width       = '90%';
	ta.style.height      = (div.offsetHeight - label.offsetHeight - 150) + 'px';
	ta.style.display     = 'block';
	ta.style.marginLeft  = 'auto';
	ta.style.marginRight = 'auto';
	ta.style.marginTop   = '20px';
	ta.value = System.repository.exportToJString();
	ta.readOnly = true;

	div.appendChild(ta);
	div.appendChild(document.createElement('br'));
	var button = document.createElement('button');
	button.appendChild(document.createTextNode('Dismiss'));
	button.style.width       = '100px';
	button.style.height      = '30px';
	button.style.display     = 'block';
	button.style.marginLeft  = 'auto';
	button.style.marginRight = 'auto';
	button.onclick = function() {
		document.body.removeChild(div);
	}
	div.appendChild(button);
}

/* shows the export dialog */
Space.prototype._importDialog = function() {
	var div = document.createElement('div');
	div.style.position = 'absolute';
	div.style.width    = '100%';
	div.style.height   = '100%';
	div.style.top      = 0;
	div.style.left     = 0;
	div.style.zIndex   = 10;
	div.style.background = 'rgba(248, 237, 105, 0.9)';
	div.style.overflow   = 'auto';
	document.body.appendChild(div);
	var label = document.createElement('div');
	label.style.width      = '100%';
	label.style.textAlign  = 'center';
	label.style.marginTop  = '20px';
	label.style.fontWeight = 'bold';
	label.appendChild(document.createTextNode('Warning. Current Repository will be erased!'));
	var label2 = document.createElement('div');
	label2.style.width     = '100%';
	label2.style.textAlign = 'center';
	label2.appendChild(document.createTextNode(
		'Paste the repository save in the textbox and press "Import".'
	));
	div.appendChild(label);
	div.appendChild(label2);
	var ta = document.createElement('textarea');
	ta.style.width       =  '90%';
	ta.style.height      = (div.offsetHeight - label.offsetHeight - 150)+'px';
	ta.style.display     = 'block';
	ta.style.marginLeft  = 'auto';
	ta.style.marginRight = 'auto';
	ta.style.marginTop   = '20px';
	div.appendChild(ta);
	div.appendChild(document.createElement('br'));

	var bd = document.createElement('div');
	bd.style.display = 'block';
	bd.style.width   = '100%';
	div.appendChild(bd);
	var bdl = document.createElement('div');
	bdl.style.width    = '50%';
	bdl.style.cssFloat = 'left';
	bd.appendChild(bdl);
	var bdr = document.createElement('div');
	bdr.style.width    = '50%';
	bdr.style.cssFloat = 'left';
	bd.appendChild(bdr);

	var okb = document.createElement('button');
	okb.appendChild(document.createTextNode('Import'));
	okb.style.width       = '100px';
	okb.style.height      = '30px';
	okb.style.marginRight = '20px';
	okb.style.cssFloat    = 'right';
	var space = this;
	okb.onclick = function() {
		System.repository.importFromJString(ta.value);
		document.body.removeChild(div);
		space.redraw();
	}
	bdl.appendChild(okb);

	var okc = document.createElement('button');
	okc.appendChild(document.createTextNode('Cancel'));
	okc.style.width      = '100px';
	okc.style.height     = '30px';
	okc.style.marginLeft = '20px';
	okc.style.cssFloat   = 'left';
	okc.onclick = function() {
		document.body.removeChild(div);
	}
	bdr.appendChild(okc);
}

/* shows the export dialog */
Space.prototype._revertDialog = function() {
	var div = document.createElement('div');
	div.style.position   = 'absolute';
	div.style.width      = '100%';
	div.style.height     = '100%';
	div.style.top        = 0;
	div.style.left       = 0;
	div.style.zIndex     = 10;
	div.style.background = 'rgba(248, 237, 105, 0.9)';
	div.style.overflow   = 'auto';
	document.body.appendChild(div);
	var label = document.createElement('div');
	label.style.width      = '100%';
	label.style.textAlign  = 'center';
	label.style.marginTop  = '20px';
	label.style.fontWeight = 'bold';
	label.appendChild(document.createTextNode('Warning. Current Repository will be erased!'));
	var label2 = document.createElement('div');
	label2.style.width     = '100%';
	label2.style.textAlign = 'center';
	label2.appendChild(document.createTextNode('Revert to default demo state?'));
	div.appendChild(label);
	div.appendChild(label2);
	div.appendChild(document.createElement('br'));
	div.appendChild(document.createElement('br'));
	div.appendChild(document.createElement('br'));
	div.appendChild(document.createElement('br'));
	var bd = document.createElement('div');
	bd.style.display = 'block';
	bd.style.width   = '100%';
	div.appendChild(bd);
	var bdl = document.createElement('div');
	bdl.style.width    = '50%';
	bdl.style.cssFloat = 'left';
	bd.appendChild(bdl);
	var bdr = document.createElement('div');
	bdr.style.width    = '50%';
	bdr.style.cssFloat = 'left';
	bd.appendChild(bdr);

	var okb = document.createElement('button');
	okb.appendChild(document.createTextNode('Revert'));
	okb.style.width       = '100px';
	okb.style.height      = '30px';
	okb.style.marginRight = '20px';
	okb.style.cssFloat    = 'right';
	var space = this;
	okb.onclick = function() {
		System.repository.importFromJString(demoRepository);
		document.body.removeChild(div);
		space.redraw();
	}
	bdl.appendChild(okb);

	var okc = document.createElement('button');
	okc.appendChild(document.createTextNode('Cancel'));
	okc.style.width      = '100px';
	okc.style.height     = '30px';
	okc.style.marginLeft = '20px';
	okc.style.cssFloat   = 'left';
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

	var md = this.edgemenu.getMousepos(p);
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
		var md = this._floatmenu.getMousepos(p);
		iaction.act = ACT.NONE;
		var fm = this._floatmenu;
		if (md < 0) {
			break;
		}
		switch(md) {
		case 'n' : // note
			var nw = settings.note.newWidth;
			var nh = settings.note.newHeight;
			// todo, beautify point logic.
			var pnw = fm.p.sub(half(nw) + this.pan.x, half(nh) + this.pan.y);
			var pse = pnw.add(nw, nh);
			var note = new Note(null, new Rect(pnw, pse), new DTree());
			this.setFocus(note);
			break;
		case 'ne' : // label
			var pnw = fm.p.sub(this.pan);
			var pse = pnw.add(100, 50);
			var dtree = new DTree(20);
			dtree.append(new Paragraph('Label'));
			var label = new Label(null, new Rect(pnw, pse), dtree);
			label.moveto(pnw.sub(half(label.zone.width), half(label.zone.height)));
			this.setFocus(label);
			break;
		}
		this.redraw();
		return MST.NONE;
	case ACT.IMENU :
		var md = this._itemmenu.getMousepos(p);
		iaction.act = ACT.NONE;
		redraw = true;
		if (md) {
			switch(md) {
			case 'n':
				System.repository.removeItem(this.focus);
				this.setFocus(null);
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
			iaction.siz  = this.focus.handlezone;
			System.setCursor(com+'-resize');
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
function Treenode() {
	// nada
}

/* appends tnode to list of children */
Treenode.prototype.append = function(tnode) {
	if (tnode.parent) {
		throw new Error('append() on a node already part of a tree');
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
		throw new Error('Treenode.append() on a node already part of a tree');
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
Treenode.prototype.anchestor = function(construct) {
	var n;
	for(n = this; n && n.constructor !== construct; n = n.parent);
	if (!n) throw new Error('anchestor not there:'+construct);
	return n;
}

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ,--,--'      .            .
 `- | ,-. . , |- ,-. ,-. ,-| ,-.
  , | |-'  X  |  | | | | | | |-'
  `-' `-' ' ` `' ' ' `-' `-^ `-'
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
function Textnode(text)
{
	Treenode.call(this);
	this._text = text ? text : '';
}
subclass(Textnode, Treenode);

Object.defineProperty(Textnode.prototype, 'text', {
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
 A paragraph.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

function Paragraph(text)
{
	Treenode.call(this);
	this._pc2d = new C2D(0 ,0);
	this._canvasActual = false; // todo rename
	this.append(new Textnode(text));
	this._flowWidth = null;
	this.p = null;
}
subclass(Paragraph, Treenode);

/**
| (re)flows the Paragraph, positioning all chunks.
*/
Paragraph.prototype._flow = function() {
	if (this._flowActual) return;

	// builds position informations.
	this._flowActual = true;
	var pinfo = this._pinfo = [];
	var fw = this._flowWidth;
	var width = 0;
	var dtree = this.anchestor(DTree);
	var fontsize = dtree.fontsize;
	var x = 0;
	var y = fontsize;
	Measure.font = dtree.font;
	var space = Measure.width(' ');
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
		// also match only spaces, todo check if more performance if hand coding
		var reg = !dtree.pre ? (/(\s*\S+|\s+$)\s?(\s*)/g) : (/(.+)()$/g);
		var stol = true; // at start of line
		for(var ca = reg.exec(t); ca != null; ca = reg.exec(t)) {
			// text is a word plus hard spaces
			var text = ca[1] + ca[2];
			var w = Measure.width(text);
			if (fw > 0 && x + w + space > fw) {
				if (!stol) {
					// soft break
					if (x > width) {
						// stores maximum width used
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
					// horizontal overflow
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
			// stores maximum width used.
			width = x;
		}
	}
	// stores metrics
	// logical height (excluding letters bottombox)
	this._softHeight = y;
	this._width = width;
}

/**
| Returns the logical height.
| (without addition of box below last line base line for 'gpq' etc.)
| todo huh?
*/
Object.defineProperty(Paragraph.prototype, 'softHeight', {
	get: function() {
		this._flow();
		return this._softHeight;
	},
});

Object.defineProperty(Paragraph.prototype, 'width', {
	get: function() {
		this._flow();
		return this._width;
	},
});

/**
| Returns the computed height of the paragraph.
*/
Object.defineProperty(Paragraph.prototype, 'height', {
	get: function() {
		this._flow();
		var dtree = this.anchestor(DTree);
		return this._softHeight + R(dtree.fontsize * settings.bottombox);
	},
});

/**
| Returns the position information arrays for all chunks.
*/
Object.defineProperty(Paragraph.prototype, 'pinfo', {
	get: function() {
		this._flow();
		return this._pinfo;
	},
});

/**
| todo huh?
*/
Object.defineProperty(Paragraph.prototype, 'flowWidth', {
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

/**
| Draws the paragraph in its cache and returns it.
*/
Paragraph.prototype.getC2D = function() {
	var c2d = this._pc2d;
	if (this._canvasActual) {
		return c2d;
	}
	this._flow();
	this._canvasActual = true;

	// todo: work out exact height for text below baseline
	// set the canvas height
	var dtree = this.anchestor(DTree);
	c2d.attune(this);
	c2d.fontStyle(dtree.font, 'black', 'start', 'alphabetic');

	// draws text into the canvas
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

// drops the canvas cache (cause something has changed
Paragraph.prototype.listen = function() {
	this._flowActual   = false;
	this._canvasActual = false;
	if (this.parent) this.parent.listen();
}

/**
| Joins a child node to its next sibling,
| or joins this paragraph to its next sibling
|
| todo, this doesnt belong here .
*/
Paragraph.prototype.joinToNext = function(node, caret) {
	var next = node.next;
	if (next) {
		alert('joinToNext, not yet implemented');
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

/**
| Joins a child node to its previous sibling,
| or joins this paragraph to its previos sibling.
|
| todo, doesnt belong here.
*/
Paragraph.prototype.joinToPrevious = function(node, caret) {
	var prev = node.prev;
	if (prev) {
		alert('joinToPrevious, not yet implemented');
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

/**
| Constructor.
*/
function DTree(fontsize) {
	Treenode.call(this);
	this._fontsize = fontsize || 13;
}
subclass(DTree, Treenode);

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

/**
| Returns the default font of the dtree.
*/
Object.defineProperty(DTree.prototype, 'font', {
	get: function() { return this._fontsize + 'px ' + settings.defaultFont; },
});

/**
| Turns the document tree into a json representation.
*/
DTree.prototype.jsonfy = function() {
	var js = {fs : this._fontsize, d: []};
	var d = js.d;
	for (var n = this.first; n; n = n.next) {
		d.push(n.first.text);
	}
	return js;
}

/**
| Returns the paragraph at point
*/
DTree.prototype.paraAtP = function(p) {
	var para = this.first;
	while (para && p.y > para.p.y + para.softHeight) {
		para = para.next;
	}
	return para;
}

/**
| Draws the selection
|
| c2d     : Canvas2D to draw upon
| isEdge  : true if this is an edge
| border  : extra border for edge, must be 0
| imargin : inner margin of item
| scrolly : scroll position of item
*/
DTree.prototype.pathSelection = function(c2d, border, isEdge, select, imargin, scrolly) {
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
	var ex = ep.x;
	var ey = ep.y - psy;
	var rx = this.width + half(imargin.e);
	var lx = half(imargin.w);
	if ((abs(by - ey) < 2)) {
		// ***
		c2d.moveTo(bx, by);
		c2d.lineTo(bx, by + lh);
		c2d.lineTo(ex, ey + lh);
		c2d.lineTo(ex, ey);
		c2d.lineTo(bx, by);
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
	} else {
		//    *****
		// *****
		c2d.moveTo(rx, ey);
		c2d.lineTo(ex, ey);
		c2d.lineTo(ex, ey + lh);
		c2d.lineTo(lx, ey + lh);

		if (isEdge) c2d.moveTo(lx, by + lh); else c2d.lineTo(lx, by + lh);
		c2d.lineTo(bx, by + lh);
		c2d.lineTo(bx, by);
		c2d.lineTo(rx, by);
		if (isEdge) c2d.lineTo(rx, ey);
	}
}

/**
| draws the content in a Canvas2D
| c2d: Canvas2D to draw within.
| select: selection object (for highlighting the selection)
| imargin: distance of text to edge
| scrolly: scroll position (todo make a point)
*/
DTree.prototype.draw = function(c2d, select, imargin, scrolly) {
	var y = imargin.n;
	var pi = 0;
	var h = 0;
	var parasep = this.pre ? 0 : this._fontsize;

	/* draws the selection */
	if (select.active && select.mark1.item === this.parent) {
		c2d.fill(
			settings.selection.style.fill, this, 'pathSelection',
			false, select, imargin, scrolly);
		c2d.edge(
			settings.selection.style.edge, this, 'pathSelection',
			true,  select, imargin, scrolly);
	}

	// draws tha paragraphs
	for(var para = this.first; para; para = para.next) {
		var pc2d = para.getC2D();
		para.p = new Point(imargin.w, y);
		if (pc2d.width > 0 && pc2d.height > 0) {
			c2d.drawImage(pc2d, imargin.w, y - scrolly);
		}
		y += para.softHeight + parasep;
	}
}

/**
| Overloads Treenodes.append() to set the new paragraphs width.
| todo, change this to ask for the parents width on the flow?
*/
DTree.prototype.append = function(tnode) {
	if (this._flowWidth) {
		tnode.flowWidth = this._flowWidth;
	}
	return Treenode.prototype.append.call(this, tnode);
}


/**
| Overloads Treenodes insertBefore to set the paragraphs width.
*/
DTree.prototype.insertBefore = function(tnode, bnode) {
	if (this._flowWidth && bnode) {
		/* if not bnode append will be called */
		tnode.flowWidth = this._flowWidth;
	}
	return Treenode.prototype.insertBefore.call(this, tnode, bnode);
}


/**
* Gets/Sets the font size.
*/
Object.defineProperty(DTree.prototype, 'fontsize', {
	get: function() { return this._fontsize; },
	set: function(fs) {
		if (this._fonsize == fs) return;
		this._fontsize = fs;
		for(var para = this.first; para; para = para.next) {
			para.listen();
		}
	}
});

/**
* Gets/Sets the flowWidth.
*/
Object.defineProperty(DTree.prototype, 'flowWidth', {
	get: function() { return this._flowWidth; },
	set: function(fw) {
		if (this._flowWidth == fw) return;
		this._flowWidth = fw;
		for(var para = this.first; para; para = para.next) {
			para.flowWidth = fw;
		}
	}
});

/**
| Something changed.
*/
DTree.prototype.listen = function() {
	this._cacheWidth  = null;
	this._cacheHeight = null;
	if (this.parent) this.parent.listen();
}

/**
| Returns the width of the document tree.
*/
Object.defineProperty(DTree.prototype, 'width', {
	get: function() {
		if (this._cacheWidth) return this._cacheWidth;
		var w = 0;
		for(var para = this.first; para; para = para.next) {
			if (para.width > w) w = para.width;
		}
		return this._cacheWidth = w;
	},
});

/**
| Returns the height of the document tree.
*/
Object.defineProperty(DTree.prototype, 'height', {
	get: function() {
		if (this._cacheHeight) return this._cacheHeight;
		var h = 0;
		var parasep = this.pre ? 0 : this._fontsize;
		var first = true;
		for(var para = this.first; para; para = para.next) {
			if (!first) h += parasep; else first = false;
			h += para.softHeight;
		}
		return this._cacheHeight = h;
	},
});

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ,-_/ .
 '  | |- ,-. ,-,-.
 .^ | |  |-' | | |
 `--' `' `-' ' ' '
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

 Something on a canvas.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
function Item(id) {
	this.id = id;
	this._h6slice = null;
}

/**
| Return the hexgon slice that is the handle
*/
Object.defineProperty(Item.prototype, 'h6slice', {
	get: function() {
		var hzone = this.handlezone;
		if (this._h6slice && this._h6slice.psw.eq(hzone.pnw)) return this._h6slice;
		return this._h6slice = new HexagonSlice(
			hzone.pnw, settings.itemmenu.innerRadius, settings.itemmenu.slice.height);
	},
});

/**
| Creates a new Hexmenu for this item.
*/
Item.prototype.newItemMenu = function(pan) {
	var labels = this._itemMenuLabels = {n : 'Remove'};
	return new Hexmenu(this.h6slice.pm.add(pan), settings.itemmenu,  labels);
}

/**
| Returns if point is within the item menu
*/
Item.prototype.withinItemMenu = function(p) {
	return this.h6slice.within(p);
}

/**
| Returns the compass direction of the handle if p is on a resizer handle.
| todo rename
*/
Item.prototype.checkItemCompass = function(p) {
	var ha = this.handles;
	var hzone = this.handlezone;
	if (!ha) return null;
	var d  = settings.handle.size;        // inner distance
	var d2 = 0.75 * settings.handle.size; // outer distance

	var n = p.y >= hzone.pnw.y - d2 && p.y <= hzone.pnw.y + d;
	var e = p.x >= hzone.pse.x - d  && p.x <= hzone.pse.x + d2;
	var s = p.y >= hzone.pse.y - d  && p.y <= hzone.pse.y + d2;
	var w = p.x >= hzone.pnw.x - d2 && p.x <= hzone.pnw.x + d;

	if (n) {
		if (w && ha.nw) return 'nw';
		if (e && ha.ne) return 'ne';
		if (ha.n && abs(p.x - hzone.pc.x) <= d) return 'n';
		return null;
	}
	if (s) {
		if (w && ha.sw) return 'sw';
		if (e && ha.se) return 'se';
		if (ha.s && abs(p.x - hzone.pc.x) <= d) return 's';
		return null;
	}
	if (w && ha.w && abs(p.y - hzone.pc.y) <= d) return 'w';
	if (e && ha.e && abs(p.y - hzone.pc.y) <= d) return 'e';
	return null;
}

/**
| Paths the resize handles.
*/
Item.prototype.pathResizeHandles = function(c2d, border) {
	if (border !== 0) throw new Error('borders unsupported for handles');
	var ha = this.handles;
	var zone = this.handlezone;
	var ds = settings.handle.distance;
	var hs = settings.handle.size;
	var hs2 = half(hs);

	var x1 = zone.pnw.x - ds;
	var y1 = zone.pnw.y - ds;
	var x2 = zone.pse.x + ds;
	var y2 = zone.pse.y + ds;
	var xm = half(x1 + x2);
	var ym = half(y1 + y2);

	c2d.beginPath();
	if (ha.n ) { c2d.moveTo(xm - hs2, y1); c2d.lineTo(xm + hs2, y1);                    }
	if (ha.ne) { c2d.moveTo(x2 - hs,  y1); c2d.lineTo(x2, y1); c2d.lineTo(x2, y1 + hs); }
	if (ha.e ) { c2d.moveTo(x2, ym - hs2); c2d.lineTo(x2, ym + hs2);                    }
	if (ha.se) { c2d.moveTo(x2, y2 - hs);  c2d.lineTo(x2, y2); c2d.lineTo(x2 - hs, y2); }
	if (ha.s ) { c2d.moveTo(xm - hs2, y2); c2d.lineTo(xm + hs2, y2);                    }
	if (ha.sw) { c2d.moveTo(x1 + hs, y2);  c2d.lineTo(x1, y2); c2d.lineTo(x1, y2 - hs); }
	if (ha.w ) { c2d.moveTo(x1, ym - hs2); c2d.lineTo(x1, ym + hs2);                    }
	if (ha.nw) { c2d.moveTo(x1, y1 + hs);  c2d.lineTo(x1, y1); c2d.lineTo(x1 + hs, y1); }
}

/**
| Draws the handles of an item (resize, itemmenu)
*/
Item.prototype.drawHandles = function(c2d) {
	// draws the resize handles
	c2d.edge(settings.handle.style.edge, this, 'pathResizeHandles');
	// draws item menu handler
	var sstyle = settings.itemmenu.slice.style;
	c2d.paint(sstyle.fill, sstyle.edge, this.h6slice, 'path');
}

/**
| Called when item is removed
*/
Item.prototype.removed = function() {
	// nothing
}


/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ,-,-.       .
 ` | |   ,-. |- ,-.
   | |-. | | |  |-'
  ,' `-' `-' `' `-'
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

 An item with text and a scrollbar.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

/**
| Constructor.
|
| id:    item id
| zone:  position and size of note.
| dtree: document tree.
*/
function Note(id, zone, dtree) {
	Item.call(this, id);
	this.zone  = zone;
	this.dtree = dtree;
	this.handles = Note.handles;
	dtree.parent = this;
	this.silhoutte = new RoundRect(
		Point.zero, new Point(zone.width, zone.height), settings.note.cornerRadius);
	this._bc2d = new C2D();
	this.imargin = Note.imargin;
	this._canvasActual = false;
	this._scrollx = -8833;
	this._scrolly = -8833;
	if (!this.dtree.first) {
		this.dtree.append(new Paragraph(''));
	}
	/* todo, don't add here */
	System.repository.addItem(this, true);
}
subclass(Note, Item);

/**
| Default margin for all notes.
*/
Note.imargin = Margin.jnew(settings.note.imargin);

/**
| Resize handles to show on notes.
*/
Note.handles = {
	n  : true,
	ne : true,
	e  : true,
	se : true,
	s  : true,
	sw : true,
	w  : true,
	nw : true,
}
Object.freeze(Note.handles);

/**
| Creates a new note from json representation.
*/
Note.jnew = function(js, id) {
	return new Note(id, Rect.jnew(js.z), DTree.jnew(js.d));
}

/**
| Called when item is removed
*/
Note.prototype.removed = function() {
	/* nothing */
}

/**
| Highlights the  note
*/
Note.prototype.highlight = function(c2d) {
	// todo round rects
	c2d.edge(settings.note.style.highlight, this.zone, 'path');
}

/**
| Turns the note into a string
*/
Note.prototype.jsonfy = function() {
	var js = {
	     t : 'note',
		 z : this.zone.jsonfy(),
		 d : this.dtree.jsonfy(),
	}
	return js;
}

/**
| Returns the para at y
*/
Note.prototype.paraAtP = function(p) {
	if (p.y < this.imargin.n) return null;
	return this.dtree.paraAtP(p);
}

/**
| Drops the cached canvas
*/
Note.prototype.listen = function() {
	this._canvasActual = false;
	/* end of chain */
}

/**
| Checks if this items reacts on an event.
| Returns transfix code.
*/
Note.prototype.transfix = function(txe, space, p, z, shift, ctrl) {
	if (!this.zone.within(p)) return 0;
	switch (txe) {
	case TXE.HOVER :
		System.setCursor('default');
		return TXR.HIT;
	case TXE.DRAGSTART :
		var txr = TXR.HIT;
		if (ctrl) {
			space.actionSpawnRelation(this, p);
			return txr | TXR.REDRAW;
		}
		if (z > 0) {
			System.repository.moveToTop(z);
			txr |= TXR.REDRAW; // todo full redraw
		}
		if (space.focus != this) {
			space.setFocus(this);
			txr |= TXR.REDRAW;
		}

		var srad = settings.scrollbar.radius;
		var sbmx = settings.scrollbar.marginX;
		if (this.scrolly >= 0 && abs(p.x - this.zone.pse.x + srad + sbmx) <= srad + 1)  {
			space.actionScrollY(this, p.y, this.scrolly);
		} else {
			space.actionIDrag(this, p.sub(this.zone.pnw));
		}
		return txr;
	case TXE.CLICK :
		var txr = TXR.HIT;
		if (z > 0) {
			System.repository.moveToTop(z);
			txr |= TXR.REDRAW; // todo full redraw
		}
		if (space.focus != this) {
			space.setFocus(this);
			txr |= TXR.REDRAW;
		}

		var op = new Point(
			p.x - this.zone.pnw.x,
			p.y - this.zone.pnw.y + (this.scrolly > 0 ? this.scrolly : 0));
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
		throw new Error('Unknown transfix code:'+txe);
	}
}

/**
| Sets the notes position and size.
| The note does not have to accept the full zone.
| For example it will refuse to go below minimum size.
| Returns true if something changed.
*/
Note.prototype.setZone = function(zone, align) {
	// ensures minimum size
	if (zone.width < settings.note.minWidth || zone.height < settings.note.minHeight) {
		zone = zone.resize(
			max(zone.width, settings.note.minWidth),
			max(zone.height, settings.note.minHeight), align);
	}
	if (this.zone.eq(zone)) return false;
	this.zone      = zone;
	this.silhoutte = new RoundRect(
		Point.zero, new Point(zone.width, zone.height), this.silhoutte.crad);
	this._canvasActual = false;
	// adapts scrollbar position
	var smaxy = this.dtree.height - (this.zone.height - this.imargin.y);
	if (smaxy > 0 && this.scrolly > smaxy) { this.scrolly = smaxy; }
	return true;
}

/**
| The zone the handles appear on.
*/
Object.defineProperty(Note.prototype, 'handlezone', {
	get : function() { return this.zone; }
});

/**
| Sets new position retaining size
*/
Note.prototype.moveto = function(p) {
	if (this.zone.pnw.eq(p)) return false;
	this.zone = this.zone.moveto(p);
	return this;
}

/**
| Gets or Sets the vertical scroll position
*/
Object.defineProperty(Note.prototype, 'scrolly', {
	get: function() { return this._scrolly; },
	set: function(sy) {
		if (sy < 0 && sy != -8833) {
			throw new Error('Invalid scrolly position');
		}
		if (this._scrolly != sy) {
			this._scrolly = sy;
			this._canvasActual = false;
		}
	}
});

/**
| Draws the scrollbar.
*/
Note.prototype.pathScrollbar = function(c2d, border, sy, dtreeHeight, innerHeight) {
	if (border !== 0) throw new Error('pathScrollbar does not support borders');
	/* draws the vertical scroll bar */
	var srad   = settings.scrollbar.radius;
	var srad05 = half(settings.scrollbar.radius);
	var spx  = this.zone.width - settings.scrollbar.marginX - srad;
	var scrollRange = this.zone.height - settings.scrollbar.marginY * 2;
	var scrollSize  = scrollRange * innerHeight / dtreeHeight;
	if (scrollSize < srad * 2) {
		/* minimum size of scrollbar */
		scrollSize = srad * 2;
	}

	var spy = R(settings.scrollbar.marginY +
		sy / (dtreeHeight - innerHeight) * (scrollRange - scrollSize));

	c2d.beginPath();
	c2d.moveTo(spx - srad,   R(spy + C2D.cos30 * srad));
	c2d.lineTo(spx - srad05, spy);
	c2d.lineTo(spx + srad05, spy);
	c2d.lineTo(spx + srad,   R(spy + C2D.cos30 * srad));
	c2d.lineTo(spx + srad,   R(spy + scrollSize - C2D.cos30 * srad));
	c2d.lineTo(spx + srad05, R(spy + scrollSize));
	c2d.lineTo(spx - srad05, R(spy + scrollSize));
	c2d.lineTo(spx - srad,   R(spy + scrollSize - C2D.cos30 * srad));
	c2d.closePath();
}

/**
| Draws the note.
|
| c2d: canvas-2d to draw upon.
| selection: current selection to highlight.
*/
Note.prototype.draw = function(c2d, selection) {
	var bc2d  = this._bc2d;
	var dtree = this.dtree;
	if (this._canvasActual) {
		/* buffer hit */
		c2d.drawImage(bc2d, this.zone.pnw);
		return;
	}

	bc2d.attune(this.zone);
	bc2d.fill(settings.note.style.fill, this.silhoutte, 'path');

	// calculates if a scrollbar is needed
	var sy = this._scrolly;
	var innerHeight = this.zone.height - this.imargin.y; // todo rename iheight // todo make a getter
	dtree.flowWidth =
		this.zone.width - this.imargin.x -
		(sy >= 0 ? settings.scrollbar.radius * 2 : 0); // todo make a var
	var dtreeHeight = dtree.height;
	if (sy < 0) {
		if (dtreeHeight > innerHeight) {
			// does not use a scrollbar but should
			sy = this._scrolly = 0;
			dtree.flowWidth =
				this.zone.width - this.imargin.x -
				(sy >= 0 ? settings.scrollbar.radius * 2 : 0);
			dtreeHeight = dtree.height;
			if (dtreeHeight <= innerHeight) {
				throw new Error('note doesnt fit with and without scrollbar.');
			}
		}
	} else if (dtreeHeight <= innerHeight) {
		/* uses a scrollbar but should */
		sy = this._scrolly = -8833;
		dtree.flowWidth = this.zone.width -
			2 * this.textBorder -
			(sy >= 0 ? settings.scrollbar.radius * 2 : 0);
		dtreeHeight = dtree.height;
		if (dtreeHeight > innerHeight) {
			throw new Error('note doesnt fit with and without scrollbar.');
		}
	}

	/* draws selection and text */
	dtree.draw(bc2d, selection, this.imargin, sy < 0 ? 0 : R(sy));

	if (sy >= 0) {
		bc2d.paint(settings.scrollbar.style.fill, settings.scrollbar.style.edge, this, 'pathScrollbar',
			sy, dtreeHeight, innerHeight);
	}

	/* draws the border */
	bc2d.edge(settings.note.style.edge, this.silhoutte, 'path');

	this._canvasActual = true;
	c2d.drawImage(bc2d, this.zone.pnw);
}

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  ,       .       .
  )   ,-. |-. ,-. |
 /    ,-| | | |-' |
 `--' `-^ ^-' `-' `'
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

 An sizeable item with sizing text.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

/**
| Constructor.
*/
function Label(id, zone, dtree) {
	Item.call(this, id);
	this.dtree = dtree;
	dtree.parent = this;
	dtree.pre = true;
	this.handles = Label.handles;
	this.imargin = Label.imargin;
	this.setZone(zone, 'c');
	/* buffer canvas 2D */
	this._bc2d = new C2D();
	this._canvasActual = false;  // todo rename
	if (typeof(this.zone.pse.x) === 'undefined') throw new Error('Invalid label'); // todo remove
	System.repository.addItem(this, true);
}
subclass(Label, Item);

/**
| Default margin for all labels.
*/
Label.imargin = Margin.jnew(settings.label.imargin);

/**
| The resize handles the item presents.
*/
Label.handles = {
	ne : true,
	se : true,
	sw : true,
	nw : true,
}
Object.freeze(Label.handles);

/**
| Creates a new Label from json representation.
*/
Label.jnew = function(js, id) {
	return new Label(id, Rect.jnew(js.z), DTree.jnew(js.d));
}

/**
| An event happened at p.
| returns transfix code.
*/
Label.prototype.transfix = function(txe, space, p, z, shift, ctrl) {
	if (!this.zone.within(p)) return 0;
	switch(txe) {
	case TXE.HOVER :
		System.setCursor('default');
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
			space.setFocus(this);
			txr |= TXR.REDRAW;
		}

		space.actionIDrag(this, p.sub(this.zone.pnw));
		return txr;
	case TXR.CLICK:
		var txr = TXR.HIT;
		if (z > 0) {
			System.repository.moveToTop(z);
			txr |= TXR.REDRAW; /* todo full redraw */
		}
		if (space.focus != this) {
			space.setFocus(this);
			txr |= TXR.REDRAW;
		}
		var op = p.sub(this.zone.pnw);
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
		throw new Error('Unknown transfix code:'+txe);
	}
}

/**
| Highlights the label.
*/
Label.prototype.highlight = function(c2d) {
	c2d.edge(settings.label.style.highlight, this.zone, 'path');
}

/**
| Turns the label into its json represntation.
*/
Label.prototype.jsonfy = function() {
	return {
	    t: 'label',
		z: this.zone.jsonfy(),
		d: this.dtree.jsonfy(),
	}
}

/**
| Sets the zone of the label.
| Also determines its fontsize.
| Returns true if something changed.
|
| zone: a rectangle
| align: compass direction
*/
Label.prototype.setZone = function(zone, align) {
	if (this.zone && this.zone.eq(zone)) return false;
	var dtree = this.dtree;
	var zh = zone.height;
	var th = R(this.dtree.height * (1 + settings.bottombox));
	var dfs = dtree.fontsize;
	var fs = max(dfs * zh / th, 8);
	if (this.zone && dfs === fs) return false;
	this._lock = true;
	dtree.fontsize = fs;
	dtree.flowWidth = -1;
	if (!this.zone) this.zone = zone;
	this.zone = this.zone.resize(this._dWidth(), this._dHeight(), align);
	this._lock = false;
	this._canvasActual = false;
	return true;
}

/**
| todo
*/
Label.prototype._dHeight = function() {
	return R(this.dtree.height * (1 + settings.bottombox));
}

/**
| todo
*/
Label.prototype._dWidth = function() {
	return max(this.dtree.width, R(0.4 * this.dtree.fontsize));
}

/**
| The zone the handles appear on.
*/
Object.defineProperty(Label.prototype, 'handlezone', {
	get : function() { return this.zone; }
});

/**
| Sets a new position.
*/
Label.prototype.moveto = function(pnw) {
	if (this.zone.pnw.eq(pnw)) return false;
	this.zone = this.zone.moveto(pnw);
	return this;
}

/* returns the para at y */
Label.prototype.paraAtP = function(p) {
	return this.dtree.paraAtP(p);
}

/* drops the cached canvas */
Label.prototype.listen = function() {
	if (this._lock) return;
	this._canvasActual = false;
	if (this.zone) {
		this.zone = this.zone.resize(this._dWidth(), this._dHeight(), 'c');
	}
	/* end of listen-chain */
}

/**
| Draws the Label.
|
| c2d:  Canvas2D to draw upon.
| selection: Selection to highlight.
*/
Label.prototype.draw = function(c2d, selection) {
	var bc2d = this._bc2d;
	var dtree = this.dtree;
	if (this._canvasActual) {
		/* buffer hit */
		c2d.drawImage(bc2d, this.zone.pnw);
		return;
	}
	bc2d.attune(this.zone);
	// draws text
	dtree.draw(bc2d, selection, this.imargin, 0);
	// draws the border
	bc2d.edge(settings.label.style.edge, bc2d, 'path');
	this._canvasActual = true;
	c2d.drawImage(bc2d, this.zone.pnw);
}

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 .-,--.     .      .
  `|__/ ,-. |  ,-. |- . ,-. ,-.
  )| \  |-' |  ,-| |  | | | | |
  `'  ` `-' `' `-^ `' ' `-' ' '
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

 Relates two items (or other relations)

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

/**
| Constructor.
|
| Do not call directly, but Relation.jnew() or Relation.create()
| Relation(id, i1id, i2id, textZone, [dtree])
*/
function Relation(id, i1id, i2id, textZone, dtree) {
	Item.call(this, id);
	this.handles    = Relation.handles;
	this.i1id       = i1id;
	this.i2id       = i2id;
	this.dtree      = dtree;
	dtree.parent    = this;
	dtree.flowWidth = -1;
	dtree.pre       = true;
	this.imargin    = Relation.imargin;
	this.setTextZone(textZone);
	this._bc2d = new C2D();
	this._canvasActual = false;

	System.repository.addItem(this, true);
	System.repository.addOnlook(this.id, this.i1id);
	System.repository.addOnlook(this.id, this.i2id);
}
subclass(Relation, Item);

/**
| Default margin for all relations.
*/
Relation.imargin = Margin.jnew(settings.relation.imargin);

/**
| The resize handles a relation presents.
*/
Relation.handles = {
	ne : true,
	se : true,
	sw : true,
	nw : true,
}
Object.freeze(Label.handles);

/**
| Creates a relation from json representation.
*/
Relation.jnew = function(js, id) {
	var tz;
	if (js.tz) {
		tz = Rect.jnew(js.tz);
	} else {
		// todo remove
		tz = new Rect(new Point(0, 0), new Point(100, 100));
	}
	var dtree = DTree.jnew(js.d);
	var o = new Relation(id, js.i1, js.i2, tz, dtree);
}

/**
| Creates a new Relation.
*/
Relation.create = function(item1, item2) {
	var dtree = new DTree(20);
	dtree.append(new Paragraph('relates to'));
	dtree.flowWidth = -1;
	var cline = Line.connect(item1.handlezone, null, item2.handlezone, null); // todo bindzone
	var mx = (cline.p1.x + cline.p2.x) / 2; // todo teach line pc
	var my = (cline.p1.y + cline.p2.y) / 2;
	var textZone = new Rect(
		new Point(R(mx - dtree.width / 2), R(my - dtree.height / 2)),
		new Point(R(mx + dtree.width / 2), R(my + dtree.height / 2)));
	return new Relation(null, item1.id, item2.id, textZone, dtree);
}

/**
| The zone the handles appear on.
*/
Object.defineProperty(Relation.prototype, 'handlezone', {
	get : function() { return this.textZone; }
});

/**
| Called when an item is removed.
*/
Relation.prototype.removed = function() {
	System.repository.removeOnlook(this.id, this.i1id);
	System.repository.removeOnlook(this.id, this.i2id);
}

/**
| Highlights the label.
*/
Relation.prototype.highlight = function(c2d) {
	c2d.edge(settings.relation.style.highlight, this.textZone, 'path');
}

/**
| Returns json representation.
*/
Relation.prototype.jsonfy = function() {
	return {
	    t  : 'rel',
		i1 : this.i1id,
		i2 : this.i2id,
		d  : this.dtree.jsonfy(),
		tz : this.textZone.jsonfy(),
	}
}

/**
| Sets the text zone of the relation.
| Also determines its fontsize.
| Returns true if something changed.
|
| zone: a rectangle
| align: compass direction
*/
Relation.prototype.setTextZone = function(zone, align) {
	if (this.textZone && this.textZone.eq(textZone)) return false;
	var dtree = this.dtree;
	var zh = zone.height;
	var th = R(this.dtree.height * (1 + settings.bottombox)) * settings.relation.demagnify;
	var dfs = dtree.fontsize;
	var fs = max(dfs * zh / th, 8);
	if (this.zone && dfs === fs) return false;
	dtree.fontsize = fs;
	dtree.flowWidth = -1;
	th = R(this.dtree.height * (1 + settings.bottombox));
	// todo use rect resize?
	switch(align) {
	case 'sw' :
	case 'w'  :
	case 'nw' : // align right
		this.textZone = new Rect(zone.pse.add(-this.dtree.width, -zh), zone.pse);
		break;
	case 'c': // center
	default : // align left
		this.textZone = new Rect(zone.pnw, zone.pnw.add(this.dtree.width, zh));
		break;
	}
	this._canvasActual = false;
	return true;
}

/**
| Sets the textZone of the relation.
| Also determines its fontsize.
| Returns true if something changed.
|
| zone: a rectangle
| align: compass direction
*/
Relation.prototype.setZone = function(zone, align) {
	if (this.textZone && this.textZone.eq(zone)) return false;
	var dtree = this.dtree;
	var zh = zone.height;
	var th = R(this.dtree.height * (1 + settings.bottombox));
	var dfs = dtree.fontsize;
	var fs = max(dfs * zh / th, 8);
	if (this.textZone && dfs === fs) return false;
	this._lock = true;
	dtree.fontsize = fs;
	dtree.flowWidth = -1;
	if (!this.textZone) this.textZone = zone;
	this.textZone = this.textZone.resize(this._dWidth(), this._dHeight(), align);
	this._lock = false;
	this._canvasActual = false;
	return true;
}

/**
| todo
*/
Relation.prototype._dHeight = function() {
	return R(this.dtree.height * (1 + settings.bottombox));
}

/**
| todo
*/
Relation.prototype._dWidth = function() {
	return max(this.dtree.width, R(0.4 * this.dtree.fontsize));
}


/**
| An action happend.
| Returns transfix code.
*/
Relation.prototype.transfix = function(txe, space, p, z, shift, ctrl) {
	if (!this.textZone.within(p)) return 0;
	switch(txe) {
	case TXE.HOVER :
		System.setCursor('default');
		return TXR.HIT;
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
			space.setFocus(this);
			txr |= TXR.REDRAW;
		}

		space.actionIDrag(this, p.sub(this.handlezone.pnw));
		return txr;
	case TXR.CLICK:
		var txr = TXR.HIT;
		if (z > 0) {
			System.repository.moveToTop(z);
			txr |= TXR.REDRAW;
		}
		if (space.focus != this) {
			space.setFocus(this);
			txr |= TXR.REDRAW;
		}
		var op = p.sub(this.textZone.pnw);
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
		throw new Error('Unknown transfix code:'+txe);
	}
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
		if (C2D.isNearLine(p, dis, arrow.p1, arrow.p1)) {
			System.setCursor('move');
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
			space.setFocus(this);
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
			space.setFocus(this);
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
		throw new Error('Unknown transfix code:'+txe);
	}*/
}

/**
| Sets a new position of the textlabel.
*/
Relation.prototype.moveto = function(pnw) {
	if (this.textZone.pnw.eq(pnw)) return false;
	this.textZone = this.textZone.moveto(pnw);
	return this;
}

/* returns the para at y */
Relation.prototype.paraAtP = function(p) {
	return this.dtree.paraAtP(p);
}


/**
| Something has changed.
*/
Relation.prototype.listen = function() {
	if (this._lock) return;
	this._canvasActual = false;
	if (this.textZone) {
		this.textZone = this.textZone.resize(this._dWidth(), this._dHeight(), 'c');
	}
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

/**
| Draws the item.
*/
Relation.prototype.draw = function(c2d, selection) {
	var bc2d = this._bc2d;
	var dtree = this.dtree;
	var it1 = System.repository.items[this.i1id]; // todo funcall
	var it2 = System.repository.items[this.i2id];
	if (!this._canvasActual) {
		bc2d.attune(this.textZone);
		bc2d.edge(settings.relation.style.labeledge, bc2d, 'path');
		dtree.draw(bc2d, selection, this.imargin, 0);
		this._canvasActual = true;
	}
	var l1 = Line.connect(it1.handlezone, 'normal', this.textZone, 'normal'); // todo bindzone
	var l2 = Line.connect(this.textZone,  'normal', it2.handlezone, 'arrow'); // todo bindzone
	// todo combine into one call;
	c2d.paint(settings.relation.style.fill, settings.relation.style.edge, l1, 'path');
	c2d.paint(settings.relation.style.fill, settings.relation.style.edge, l2, 'path');
	// draws text
	c2d.drawImage(bc2d, this.textZone.pnw);
}

/**
| Something happend on an item onlooked.
*/
Relation.prototype.onlook = function(event, item) {
	switch(event) {
	case ONLOOK.REMOVE :
		if (item.id != this.i1id && item.id != this.i2id) {
			throw new Error('Got onlook for not my item?');
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
		throw new Error('unknown unlook event');
	}
}

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
,.   ,.       .          ,---.              .
`|  / ,-. ,-. |- ,-. ,-. |  -'  ,-. ,-. ,-. |-.
 | /  |-' |   |  | | |   |  ,-' |   ,-| | | | |
 `'   `-' `-' `' `-' '   `---|  '   `-^ |-' ' '
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ,-.|~ ~ ~ ~ ~ | ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
                          `-+'          '
 Something that draws vectors.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
/*function VectorGraph(width, height, doc)
{
	this.bcanvas = document.createElement('canvas');
	this.width  = bcanvas.width  =  width;
	this.height = bcanvas.height = height;
	this.doc = doc;
}

// gets the canvas buffer for this item
// if caret != null draws the caret into the canvas
VectorGraph.prototype.getCanvas = function() {
	var cx = this.bcanvas.getContext('2d');
	cx.beginPath();
	cx.clearRect(0, 0, bcanvas.width, bcanvas.height);
	draw = '';
	for(var para = doc.getFirstPara(); para; para = para.next) {
		var cmd = para.first.text;
		draw += cmd + '\n';
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
			if (typeof(a1) != 'number' || 
			    typeof(a2) != 'number' ||
			    typeof(a3) != 'number' ||
			    typeof(a4) != 'number' ||
			    typeof(a5) != 'number' ||
			    typeof(a6) != 'number'
			) {
				//msg('Arguments not numbers: '+cmd);
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
			if (typeof(a1) != 'number' ||
			    typeof(a2) != 'number' ||
			    typeof(a3) != 'number' ||
			    typeof(a4) != 'number' ||
			    typeof(a5) != 'number' ||
			    typeof(a6) != 'number'
			) {
				//msg('Arguments not numbers: '+cmd);
				break;
			}
			cx.bezierCurveTo(a1, a2, a3, a4, a5, a6);
			break;
		case 'Q' :
			var a1 = parseFloat(cc[1]);
			var a2 = parseFloat(cc[2]);
			var a3 = parseFloat(cc[3]);
			var a4 = parseFloat(cc[4]);
			if (typeof(a1) != 'number' ||
			    typeof(a2) != 'number' ||
			    typeof(a3) != 'number' ||
			    typeof(a4) != 'number'
			) {
				//msg('Arguments not numbers: '+cmd);
				break;
			}
			cx.quadraticCurveTo(a1, a2, a3, a4, a5, a6);
			break;
		case 'M' :
			var a1 = parseFloat(cc[1]);
			var a2 = parseFloat(cc[2]);
			if (typeof(a1) != 'number' ||
			    typeof(a2) != 'number'
			) {
				//msg('Arguments not numbers: '+cmd);
				break;
			}
			cx.moveTo(a1, a2);
			break;
		case 'L' :
			var a1 = parseFloat(cc[1]);
			var a2 = parseFloat(cc[2]);
			if (typeof(a1) != 'number' ||
			    typeof(a2) != 'number'
			) {
				//msg('Arguments not numbers: '+cmd);
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
			if (typeof(a1) != 'number' ||
			    typeof(a2) != 'number' ||
			    typeof(a3) != 'number'
			) {
				//msg('Arguments not numbers: '+cmd);
				break;
			}
			cx.strokeStyle = 'rgb('+a1+','+a2+','+a3+')';
			break;
		case 'C' :
			var a1 = parseFloat(cc[1]);
			var a2 = parseFloat(cc[2]);
			var a3 = parseFloat(cc[3]);
			if (typeof(a1) != 'number' ||
			    typeof(a2) != 'number' ||
			    typeof(a3) != 'number'
			) {
				//msg('Arguments not numbers: '+cmd);
				break;
			}
			cx.fillStyle = 'rgb('+a1+','+a2+','+a3+')';
			break;
		case 'W' :
			var a1 = parseFloat(cc[1]);
			if (typeof(a1) != 'number') {
				//msg('Arguments not numbers: '+cmd);
				break;
			}
			cx.lineWidth = a1;
		case '' :
			break;
		default :
			//msg('Unknown command: '+cmd);
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

/**
| Loads the repository from HTML5 localStorage.
*/
Repository.prototype.loadLocalStorage = function() {
	this.reset();
	var idfjs = window.localStorage.getItem('idf');
	if (idfjs) {
		try {
			this._idFactory = JSON.parse(idfjs);
		} catch(err) {
			this._idFactory = null;
			console.log('JSON error reading idfactory', err.name, err.message);
		}
	}
	if (!this._idFactory) {
		console.log('no repository found. (no idf)');
		this._idFactory = {nid: 1};
		return false;
	}

	System.space.pan = System.space.c2d.pan = this._getPan(); // todo space setFunction
	var zjs = window.localStorage.getItem('zidx');
	if (!zjs) {
		console.log('no repository found. (no zidx)');
		return false;
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
	return true;
}

/**
| Erases the local repository.
*/
Repository.prototype.eraseLocalStorage = function() {
	var items = this.items;
	window.localStorage.setItem('idf', '');
	window.localStorage.setItem('zidx', '');
	for(var id in items) {
		window.localStorage.setItem(id, '');
	}
}

/**
| Asks every item that intersects with a point if it feels reponsible for an event.
*/
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

/**
| Saves this repository into a JSON-String that is returned
*/
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

/**
| Moves an item top
*/
Repository.prototype.moveToTop = function(z) {
	var zidx = this.zidx;
	var id = zidx[z];
	zidx.splice(z, 1);
	zidx.unshift(id);
	this._saveZIDX();
	return 0;
}

/**
| One item wants to watch another item.
*/
Repository.prototype.addOnlook = function(onlooker, onlooked) {
	var its = this.items;
	if (!this._noonlooks && (!its[onlooker] || !its[onlooked])) {
		throw new Error('adding Onlook to invalid item ids:');
	}
	var od = this.onlookeds[onlooked];
	var or = this.onlookers[onlooker];
	if (!od) this.onlookeds[onlooked] = od = [];
	if (!or) this.onlookers[onlooker] = or = [];
	if (od.indexOf(onlooker) < 0) od.push(onlooker);
	if (or.indexOf(onlooked) < 0) or.push(onlooked);
}

/**
| One item stops to watch another item.
*/
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
		window.alert('Repository save not valid JSON.');
		return;
	}
	if (js.formatversion != 0 || !js.idf || !js.items || !js.z) {
		window.alert('Repository not recognized.');
		return;
	}
	this.reset();
	this.eraseLocalStorage();
	/* erase current local repository */
	var items = this.items;
	var zidx  = js.z;
	this._idFactory = js.idf;
	window.localStorage.setItem('idf', JSON.stringify(this._idFactory));
	this._noonlooks = true;
	for (var i = zidx.length - 1; i >= 0; i--) {
		var id = zidx[i];
		if (typeof zidx[i] !== 'number') id = parseInt(id);
		this._loadItem(id, js.items[id]);
	}
	this._saveZIDX();
	this._noonlooks = false;

	System.space.setFocus(null);
	System.space.pan = System.space.c2d.pan = js.pan ? Point.jnew(js.pan) : new Point(0, 0); // todo
	this.savePan(System.space.pan);
}

/**
| Creates a new ID.
*/
Repository.prototype._newItemID = function() {
	var idf = this._idFactory;
	idf.nid++;
	window.localStorage.setItem('idf', JSON.stringify(idf));
	return idf.nid;
}

/**
| Loads an Item from JSON.
*/
Repository.prototype._loadItem = function(id, js) {
	if (!js || !js.t) throw new Error('JSON error: attributes missing from ('+id+'): '+js);
	switch(js.t) {
	case 'note'  : return Note.jnew(js, id);
	case 'label' : return Label.jnew(js, id);
	case 'rel'   : return Relation.jnew(js, id);
	default      : throw new Error('unknown item type');
	}
}

Repository.prototype._saveZIDX = function() {
	window.localStorage.setItem('zidx', JSON.stringify(this.zidx));
}

/* adds an item to the space */
Repository.prototype.addItem = function(item, top) {
	if (!item.id) item.id  = this._newItemID();
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

/**
| Removes an item from the repository.
*/
Repository.prototype.removeItem = function(item) {
	var zidx = this.zidx;
	var id = item.id;
	zidx.splice(zidx.indexOf(id), 1);
	delete this.items[id];
	item.removed();

	// notifies onlookers
	if (!this._noonlooks) {
		var od = this.onlookeds[id];
		if (od) {
			// copies the array so it can be changed during traversal
			var odc = od.slice();
			for (var i = 0; i < odc.length; i++) {
				var it = this.items[odc[i]];
				if (it) it.onlook(ONLOOK.REMOVE, item);
			}
		}
	}

	if (!this._nosave) {
		window.localStorage.setItem(item.id, '');
		this._saveZIDX();
	}
}

/**
| Stores an item into local storage.
*/
Repository.prototype._saveItem = function(item) {
	window.localStorage.setItem(item.id, JSON.stringify(item.jsonfy()));
}

/**
| Changes an item in local storage.
*/
Repository.prototype.updateItem = function(item) {
	if (!this._nosave) this._saveItem(item);

	// notifies onlookers
	if (this._noonlooks) return;
	var od = this.onlookeds[item.id];
	if (!od) return;
	for (var i = 0; i < od.length; i++) {
		var it = this.items[od[i]];
		if (it) it.onlook(ONLOOK.UPDATE, item);
	}
}


/**
| Loads panning offset.
*/
Repository.prototype._getPan = function() {
	var jstr = window.localStorage.getItem('pan');
	var js   = JSON.parse(jstr);
	return js ? Point.jnew(js) : new Point(0, 0);
}

/**
| Saves the panning offset.
*/
Repository.prototype.savePan = function(pan) {
	if (!this._nosave) window.localStorage.setItem('pan', JSON.stringify(pan.jsonfy()));
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
	if (request.indexOf('reset') >= 0) {
		console.log('Clearing localStorage');
		window.localStorage.clear();
	}
	// loads the demoRepository JSON String
	var demotag = 'DEMOREPOSITORY';
	for(var node = document.body.lastChild; node; node = node.previousSibling) {
		if (node.nodeName != '#comment') continue;
		var data = node.data;
		if (data.substring(0, demotag.length) != demotag) continue;
		demoRepository = data.substring(demotag.length);
		break;
	}
	System.init();
}
